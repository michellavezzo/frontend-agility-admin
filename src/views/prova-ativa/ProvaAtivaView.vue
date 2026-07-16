<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useProvaAtivaStore } from '@/stores/prova-ativa'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsChip from '@/components/ui/DsChip.vue'
import DsSelect from '@/components/ui/DsSelect.vue'

const store = useProvaAtivaStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()
const inscricaoSelecionada = ref<number | null>(null)

// ── Cores do estado ──
const estadoCores: Record<string, string> = {
    idle: 'secondary',
    preparado: 'warning',
    autorizado: 'primary',
    rodando: 'error',
    finalizado: 'success',
}

const estadoLabels: Record<string, string> = {
    idle: 'Aguardando',
    preparado: 'Preparado',
    autorizado: 'Autorizado',
    rodando: 'Em Andamento',
    finalizado: 'Finalizado',
}

const estadoColor = computed(() => estadoCores[store.estadoAtual] ?? 'secondary')
const estadoLabel = computed(() => estadoLabels[store.estadoAtual] ?? store.estadoAtual)

// ── Inscricão options ──
const inscricaoOptions = computed(() =>
    store.inscricoesPendentes.map((i) => ({
        title: `#${i.id_inscricao} — Colete ${i.colete_competidor}`,
        value: i.id_inscricao,
    })),
)

// ── Aviso de recusas ──
const avisoRecusas = computed(() => store.estado.recusas >= 3)

// ── Lifecycle ──
onMounted(async () => {
    await store.fetchInscricoesPendentes()
    store.startRealtime()
})

onUnmounted(() => {
    store.stopRealtime()
})

// ── Actions ──
async function handlePreparar() {
    if (!inscricaoSelecionada.value) {
        notification.notify('Selecione uma inscrição', 'warning')
        return
    }
    await store.preparar(inscricaoSelecionada.value)
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}

async function handleAutorizar() {
    await store.autorizar()
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}

async function handleFalta() {
    await store.falta()
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}

async function handleDesfazerFalta() {
    await store.desfazerFalta()
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}

async function handleRecusa() {
    await store.recusa()
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}

async function handleDesfazerRecusa() {
    await store.desfazerRecusa()
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}

async function handleForcarFim() {
    const ok = await confirmDialog.value?.open(
        'Forçar Fim',
        'Deseja forçar o encerramento da prova em andamento?',
    )
    if (!ok) return
    await store.forcarFim()
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}

async function handleConfirmar() {
    const ok = await confirmDialog.value?.open(
        'Confirmar Resultado',
        'Confirmar e persistir o resultado desta prova? Esta ação reseta o cronômetro.',
    )
    if (!ok) return
    const result = await store.confirmar()
    if (result) {
        inscricaoSelecionada.value = null
        notification.notify(
            `Resultado confirmado — TOP: ${store.formatTime(result.top)} | TIA: ${store.formatTime(result.tia)}`,
        )
    } else if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}

async function handleReset() {
    const ok = await confirmDialog.value?.open(
        'Reset',
        'Deseja resetar o cronômetro? Todos os dados da prova atual serão descartados.',
    )
    if (!ok) return
    await store.reset()
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    } else {
        inscricaoSelecionada.value = null
        notification.notify('Cronômetro resetado', 'info')
    }
}

async function handleSimularSensor() {
    await store.simularSensor()
    if (store.lastError) {
        notification.notify(store.lastError, 'error')
    }
}
</script>

<template>
    <div>
        <PageHeader title="Operar Prova">
            <DsChip :color="estadoColor" variant="elevated" size="large" class="font-weight-bold text-white">
                {{ estadoLabel }}
            </DsChip>
        </PageHeader>

        <!-- Aviso de interface exclusiva -->
        <v-alert type="warning" variant="tonal" density="compact" class="mb-5" icon="mdi-alert-circle" rounded="0">
            Operação remota via Wi-Fi. Use <strong>apenas uma interface de operação por vez</strong>.
            O fallback local <code>/operador</code> está disponível na Raspberry Pi em caso de falha de
            rede.
        </v-alert>

        <!-- Indicador de conexão -->
        <v-alert
            v-if="!store.connected"
            type="error"
            variant="flat"
            density="compact"
            class="mb-5"
            icon="mdi-wifi-off"
            rounded="0"
        >
            Sem conexão em tempo real com o backend. O cronômetro continua rodando no servidor.
            Tentando reconectar o WebSocket...
        </v-alert>

        <!-- Timers -->
        <v-row class="mb-6" justify="center">
            <v-col cols="12" md="6">
                <v-card flat class="text-center pa-6 timer-card">
                    <div class="text-overline text-medium-emphasis mb-2">TOP — Tempo Oficial da Prova</div>
                    <div class="timer-display" :class="{ 'timer-running': store.estadoAtual === 'rodando' }">
                        {{ store.topDisplay }}
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" md="6">
                <v-card flat class="text-center pa-6 timer-card">
                    <div class="text-overline text-medium-emphasis mb-2">TIA — Tempo de Início Autorizado</div>
                    <div class="timer-display timer-secondary">
                        {{ store.tiaDisplay }}
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Faltas e Recusas -->
        <v-row class="mb-6" justify="center">
            <v-col cols="12" sm="6" md="4">
                <v-card flat class="text-center pa-5 counter-card">
                    <div class="text-overline text-medium-emphasis mb-3">Faltas</div>
                    <div class="text-h3 font-weight-bold mb-3">{{ store.estado.faltas }}</div>
                    <div class="d-flex justify-center ga-3">
                        <DsBtn
                            icon="mdi-minus"
                            size="small"
                            variant="tonal"
                            color="secondary"
                            :disabled="!store.podeDesfazerFalta || store.actionLoading"
                            @click="handleDesfazerFalta"
                        />
                        <DsBtn
                            icon="mdi-plus"
                            size="small"
                            variant="tonal"
                            color="warning"
                            :disabled="!store.podeFaltaRecusa || store.actionLoading"
                            @click="handleFalta"
                        />
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card
                    flat
                    class="text-center pa-5 counter-card"
                    :class="{ 'border-red': avisoRecusas }"
                >
                    <div class="text-overline text-medium-emphasis mb-3">Recusas</div>
                    <div class="text-h3 font-weight-bold mb-3" :class="{ 'text-red': avisoRecusas }">
                        {{ store.estado.recusas }}
                    </div>
                    <DsChip v-if="avisoRecusas" color="error" size="x-small" variant="elevated" class="mb-3">
                        ELIMINAÇÃO
                    </DsChip>
                    <div class="d-flex justify-center ga-3">
                        <DsBtn
                            icon="mdi-minus"
                            size="small"
                            variant="tonal"
                            color="secondary"
                            :disabled="!store.podeDesfazerRecusa || store.actionLoading"
                            @click="handleDesfazerRecusa"
                        />
                        <DsBtn
                            icon="mdi-plus"
                            size="small"
                            variant="tonal"
                            color="error"
                            :disabled="!store.podeFaltaRecusa || store.actionLoading"
                            @click="handleRecusa"
                        />
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Seletor de inscrição + Preparar -->
        <v-card flat class="pa-5 mb-5 section-card">
            <div class="text-overline text-medium-emphasis mb-3">Preparar Prova</div>
            <v-row align="center">
                <v-col cols="12" md="8">
                    <DsSelect
                        v-model="inscricaoSelecionada"
                        :items="inscricaoOptions"
                        label="Inscrição Pendente"
                        :loading="store.loading"
                        :disabled="!store.podePreparar"
                        clearable
                        no-data-text="Nenhuma inscrição pendente"
                    />
                </v-col>
                <v-col cols="12" md="4">
                    <DsBtn
                        color="warning"
                        block
                        size="large"
                        :disabled="!store.podePreparar || !inscricaoSelecionada || store.actionLoading"
                        :loading="store.actionLoading"
                        @click="handlePreparar"
                    >
                        <v-icon start>mdi-play-box</v-icon>
                        Preparar
                    </DsBtn>
                </v-col>
            </v-row>
        </v-card>

        <!-- Controles da prova -->
        <v-card flat class="pa-5 mb-5 section-card">
            <div class="text-overline text-medium-emphasis mb-4">Controles da Prova</div>
            <v-row>
                <v-col cols="6" md="3">
                    <DsBtn
                        color="primary"
                        block
                        size="large"
                        :disabled="!store.podeAutorizar || store.actionLoading"
                        :loading="store.actionLoading && store.podeAutorizar"
                        @click="handleAutorizar"
                    >
                        <v-icon start>mdi-flag</v-icon>
                        Autorizar
                    </DsBtn>
                </v-col>
                <v-col cols="6" md="3">
                    <DsBtn
                        color="error"
                        block
                        size="large"
                        :disabled="!store.podeForcarFim || store.actionLoading"
                        @click="handleForcarFim"
                    >
                        <v-icon start>mdi-stop</v-icon>
                        Forçar Fim
                    </DsBtn>
                </v-col>
                <v-col cols="6" md="3">
                    <DsBtn
                        color="success"
                        block
                        size="large"
                        :disabled="!store.podeConfirmar || store.actionLoading"
                        @click="handleConfirmar"
                    >
                        <v-icon start>mdi-check-bold</v-icon>
                        Confirmar
                    </DsBtn>
                </v-col>
                <v-col cols="6" md="3">
                    <DsBtn
                        color="secondary"
                        block
                        size="large"
                        :disabled="store.actionLoading"
                        @click="handleReset"
                    >
                        <v-icon start>mdi-refresh</v-icon>
                        Reset
                    </DsBtn>
                </v-col>
            </v-row>
        </v-card>

        <!-- Simulação (dev) -->
        <v-card flat class="pa-5 mb-5 section-card" style="background-color: var(--ds-bg-subtle);">
            <div class="d-flex align-center ga-2 mb-3">
                <v-icon size="small" color="secondary">mdi-bug</v-icon>
                <span class="text-overline text-medium-emphasis">Simulação / Desenvolvimento</span>
            </div>
            <DsBtn
                variant="outlined"
                color="secondary"
                :disabled="!store.podeSimularSensor || store.actionLoading"
                @click="handleSimularSensor"
            >
                <v-icon start>mdi-access-point</v-icon>
                Simular Sensor
            </DsBtn>
        </v-card>

        <!-- Dados da inscrição ativa -->
        <v-card
            v-if="store.estado.id_inscricao"
            flat
            class="pa-5 mb-5 section-card"
        >
            <div class="text-overline text-medium-emphasis mb-4">Dados da Inscrição Ativa</div>
            <v-row>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Competidor</div>
                    <div class="font-weight-medium">{{ store.estado.competidor_nome ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Cão</div>
                    <div class="font-weight-medium">{{ store.estado.cao_nome ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Raça</div>
                    <div class="font-weight-medium">{{ store.estado.cao_raca ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Colete</div>
                    <div class="font-weight-medium">{{ store.estado.colete_competidor ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Categoria</div>
                    <div class="font-weight-medium">{{ store.estado.categoria ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Classe</div>
                    <div class="font-weight-medium">{{ store.estado.classe ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Obstáculos</div>
                    <div class="font-weight-medium">{{ store.estado.num_obstaculos ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Pista (m)</div>
                    <div class="font-weight-medium">{{ store.estado.comprimento_pista ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">TSP</div>
                    <div class="font-weight-medium">{{ store.estado.tsp ?? '—' }}</div>
                </v-col>
                <v-col cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">TMP</div>
                    <div class="font-weight-medium">{{ store.estado.tmp ?? '—' }}</div>
                </v-col>
                <v-col v-if="store.estado.tempo_oficial !== null" cols="6" sm="4" md="3">
                    <div class="text-caption text-medium-emphasis">Tempo Oficial</div>
                    <div class="font-weight-bold text-success">{{ store.formatTime(store.estado.tempo_oficial) }}</div>
                </v-col>
            </v-row>
        </v-card>

        <ConfirmDialog ref="confirmDialog" />
    </div>
</template>

<style scoped>
.timer-card,
.counter-card,
.section-card {
    border: 1px solid var(--ds-border);
    border-radius: 0;
}

.timer-display {
    font-family: 'Roboto Mono', 'Courier New', monospace;
    font-variant-numeric: tabular-nums;
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 0.05em;
}

.timer-secondary {
    font-size: 2.5rem;
    opacity: 0.85;
}

.timer-running {
    color: rgb(var(--v-theme-error));
    animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.6;
    }
}

.border-red {
    border-color: rgb(var(--v-theme-error)) !important;
    border-width: 2px !important;
}
</style>
