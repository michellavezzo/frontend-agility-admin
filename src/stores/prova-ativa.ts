import { ref, computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import type { ProvaAtivaEstado, EstadoProva, Inscricao } from '@/types'
import { provaAtivaApi } from '@/api/prova-ativa'
import { websocketUrl } from '@/api/client'

const ESTADO_INICIAL: ProvaAtivaEstado = {
    estado: 'idle',
    id_inscricao: null,
    versao: 0,
    atualizado_em: null,
    tia_decorrido: 0,
    tia_str: '00:00.000',
    top_decorrido: 0,
    top_str: '00:00.000',
    tempo_oficial: null,
    faltas: 0,
    recusas: 0,
    competidor_nome: null,
    cao_nome: null,
    cao_raca: null,
    colete_competidor: null,
    categoria: null,
    classe: null,
    num_obstaculos: null,
    comprimento_pista: null,
    tsp: null,
    tmp: null,
}

export const useProvaAtivaStore = defineStore('prova-ativa', () => {
    // ── Estado reativo ──
    const estado = ref<ProvaAtivaEstado>({ ...ESTADO_INICIAL })
    const inscricoesPendentes = ref<Inscricao[]>([])
    const loading = ref(false)
    const actionLoading = ref(false)
    const connected = ref(true)
    const lastError = ref<string | null>(null)

    // ── Interpolação do timer ──
    const snapshotTime = ref(0)
    const interpolatedTia = ref(0)
    const interpolatedTop = ref(0)
    let animFrameId: number | null = null

    // ── WebSocket ──
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let reconnectDelay = 500
    let shouldReconnect = false
    let currentSocketUrl = ''

    // ── Getters de habilitação de botões ──
    const estadoAtual = computed<EstadoProva>(() => estado.value.estado)

    const podePreparar = computed(
        () => estadoAtual.value === 'idle' || estadoAtual.value === 'finalizado',
    )
    const podeAutorizar = computed(() => estadoAtual.value === 'preparado')
    const podeSimularSensor = computed(
        () => estadoAtual.value === 'autorizado' || estadoAtual.value === 'rodando',
    )
    const podeForcarFim = computed(() => estadoAtual.value === 'rodando')
    const podeConfirmar = computed(() => estadoAtual.value === 'finalizado')
    const podeFaltaRecusa = computed(
        () => estadoAtual.value === 'rodando' || estadoAtual.value === 'finalizado',
    )
    const podeDesfazerFalta = computed(
        () => podeFaltaRecusa.value && estado.value.faltas > 0,
    )
    const podeDesfazerRecusa = computed(
        () => podeFaltaRecusa.value && estado.value.recusas > 0,
    )

    // ── Interpolação visual (requestAnimationFrame) ──
    function startInterpolation() {
        stopInterpolation()
        function tick() {
            const elapsed = (performance.now() - snapshotTime.value) / 1000
            const est = estado.value.estado
            if (est === 'autorizado') {
                interpolatedTia.value = estado.value.tia_decorrido + elapsed
                interpolatedTop.value = estado.value.top_decorrido
            } else if (est === 'rodando') {
                interpolatedTia.value = estado.value.tia_decorrido
                interpolatedTop.value = estado.value.top_decorrido + elapsed
            } else {
                interpolatedTia.value = estado.value.tia_decorrido
                interpolatedTop.value = estado.value.top_decorrido
            }
            animFrameId = requestAnimationFrame(tick)
        }
        animFrameId = requestAnimationFrame(tick)
    }

    function stopInterpolation() {
        if (animFrameId !== null) {
            cancelAnimationFrame(animFrameId)
            animFrameId = null
        }
    }

    // ── Formatação de tempo ──
    function formatTime(seconds: number): string {
        const totalMs = Math.max(0, Math.floor(seconds * 1000))
        const mins = Math.floor(totalMs / 60000)
        const secs = Math.floor((totalMs % 60000) / 1000)
        const ms = totalMs % 1000
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`
    }

    const tiaDisplay = computed(() => formatTime(interpolatedTia.value))
    const topDisplay = computed(() => formatTime(interpolatedTop.value))

    function applySnapshot(data: ProvaAtivaEstado) {
        if (
            estado.value.versao !== undefined &&
            data.versao !== undefined &&
            data.versao < estado.value.versao
        ) {
            return
        }
        estado.value = data
        snapshotTime.value = performance.now()
        interpolatedTia.value = data.tia_decorrido
        interpolatedTop.value = data.top_decorrido
        connected.value = true
        lastError.value = null
    }

    function connectWebSocket() {
        currentSocketUrl = websocketUrl('/ws/prova-ativa')
        const ws = new WebSocket(currentSocketUrl)
        socket = ws
        ws.onopen = () => {
            if (socket !== ws) return
            connected.value = true
            reconnectDelay = 500
            lastError.value = null
        }
        ws.onmessage = (event) => {
            if (socket !== ws) return
            const message = JSON.parse(event.data) as { tipo?: string; data?: ProvaAtivaEstado }
            if (message.tipo === 'estado' && message.data) {
                applySnapshot(message.data)
            }
        }
        ws.onclose = () => {
            if (socket !== ws) return
            socket = null
            if (!shouldReconnect) return
            connected.value = false
            lastError.value = `Canal WebSocket desconectado (${currentSocketUrl})`
            scheduleReconnect()
        }
        ws.onerror = () => {
            if (socket !== ws) return
            lastError.value = `Falha ao conectar no WebSocket (${currentSocketUrl})`
            ws.close()
        }
    }

    function scheduleReconnect() {
        if (!shouldReconnect) return
        if (reconnectTimer !== null) {
            clearTimeout(reconnectTimer)
        }
        reconnectTimer = setTimeout(() => {
            reconnectTimer = null
            connectWebSocket()
        }, reconnectDelay)
        reconnectDelay = Math.min(reconnectDelay * 2, 5000)
    }

    function startRealtime() {
        stopRealtime()
        shouldReconnect = true
        connectWebSocket()
        startInterpolation()
    }

    function stopRealtime() {
        shouldReconnect = false
        if (reconnectTimer !== null) {
            clearTimeout(reconnectTimer)
            reconnectTimer = null
        }
        if (socket !== null) {
            socket.close()
            socket = null
        }
        stopInterpolation()
    }

    // ── Inscrições pendentes ──
    async function fetchInscricoesPendentes() {
        loading.value = true
        try {
            inscricoesPendentes.value = await provaAtivaApi.getInscricoesPendentes()
        } catch (e) {
            lastError.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    // ── Actions (cada POST) ──
    async function preparar(idInscricao: number) {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.preparar(idInscricao)
            applySnapshot(data)
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    async function autorizar() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.autorizar()
            applySnapshot(data)
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    async function falta() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.falta()
            estado.value.faltas = data.faltas
            estado.value.recusas = data.recusas
            lastError.value = null
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    async function desfazerFalta() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.desfazerFalta()
            estado.value.faltas = data.faltas
            estado.value.recusas = data.recusas
            lastError.value = null
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    async function recusa() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.recusa()
            estado.value.faltas = data.faltas
            estado.value.recusas = data.recusas
            lastError.value = null
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    async function desfazerRecusa() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.desfazerRecusa()
            estado.value.faltas = data.faltas
            estado.value.recusas = data.recusas
            lastError.value = null
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    async function forcarFim() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.forcarFim()
            applySnapshot(data)
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    async function confirmar() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.confirmar()
            lastError.value = null
            // Recarregar inscrições pendentes (a confirmada saiu da lista)
            await fetchInscricoesPendentes()
            return data
        } catch (e) {
            handleActionError(e)
            return null
        } finally {
            actionLoading.value = false
        }
    }

    async function reset() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.reset()
            applySnapshot(data)
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    async function simularSensor() {
        actionLoading.value = true
        try {
            const data = await provaAtivaApi.simularSensor()
            applySnapshot(data)
        } catch (e) {
            handleActionError(e)
        } finally {
            actionLoading.value = false
        }
    }

    function handleActionError(e: unknown) {
        const msg = (e as Error).message
        if (msg.includes('409')) {
            lastError.value = 'Ação não permitida no estado atual'
        } else if (msg.includes('404')) {
            lastError.value = 'Inscrição não encontrada'
        } else {
            lastError.value = msg
        }
    }

    return {
        // State
        estado: readonly(estado),
        inscricoesPendentes: readonly(inscricoesPendentes),
        loading,
        actionLoading,
        connected,
        lastError,
        // Display
        tiaDisplay,
        topDisplay,
        interpolatedTia,
        interpolatedTop,
        // Getters
        estadoAtual,
        podePreparar,
        podeAutorizar,
        podeSimularSensor,
        podeForcarFim,
        podeConfirmar,
        podeFaltaRecusa,
        podeDesfazerFalta,
        podeDesfazerRecusa,
        // Actions
        startRealtime,
        stopRealtime,
        fetchInscricoesPendentes,
        preparar,
        autorizar,
        falta,
        desfazerFalta,
        recusa,
        desfazerRecusa,
        forcarFim,
        confirmar,
        reset,
        simularSensor,
        formatTime,
    }
})
