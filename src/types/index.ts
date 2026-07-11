// ── Users ──
export interface User {
    id: number
    name: string
    email: string
}

// ── Competições ──
export interface Competicao {
    id_competicao: number
    nome: string
    data: string // ISO date
    localizacao: string
    responsavel_id: number
    nomes_arbitros_convidados?: string | null
    nome_diretor_evento?: string | null
    nome_responsavel_secretaria?: string | null
    nome_veterinario?: string | null
}

// ── Provas ──
export interface Prova {
    id_prova: number
    categoria: string
    classe: string
    num_obstaculos: number
    tsp: number
    tmp: number
    vel_media_necessaria: number
    comprimento_pista: number
    descricao?: string | null
    id_competicao: number
    criado_em?: string | null
    atualizado_em?: string | null
}

// ── Competidores ──
export interface Competidor {
    id_competidor: number
    nome: string
    escola: string
}

// ── Cães (PK = microchip, string) ──
export interface Cao {
    microchip: string
    nome: string
    raca: string
    cernelha: string
    categoria_salto: string
    is_cao_branco: boolean
}

// ── Juízes ──
export interface Juiz {
    id_juiz: number
    nome: string
    email: string
}

// ── Inscrições ──
export interface Inscricao {
    id_inscricao: number
    id_prova: number
    id_competidor: number
    microchip_cao: string
    colete_competidor: string
    tempo_prova?: number | null
    faltas_prova?: number | null
    recusas_prova?: number | null
    vel_media?: number | null
    pontuacao?: number | null
    hora_inicio?: string | null
    status: string
}

// ── Resultados ──
export interface Resultado {
    id_resultado: number
    id_inscricao: number
    posicao?: number | null
    total_pontos_t?: number | null
    total_pontos_tp?: number | null
}

// ── Avaliações ──
export interface Avaliacao {
    id_avaliacao: number
    id_prova: number
    id_juiz: number
    diretor_prova: string
    comentarios?: string | null
    criado_em?: string | null
    atualizado_em?: string | null
}

// ── Cronometragens ──
export interface Cronometragem {
    id_cronometro: number
    id_inscricao: number
    tempo_inicial: string
    tempo_final?: string | null
    status: string
    tipo: string
    tempo_oficial?: number | null
    criado_em?: string | null
    atualizado_em?: string | null
}

// ── Prova Ativa (Operação em tempo real) ──
export type EstadoProva = 'idle' | 'preparado' | 'autorizado' | 'rodando' | 'finalizado'

export interface ProvaAtivaEstado {
    estado: EstadoProva
    id_inscricao: number | null
    versao: number
    atualizado_em: string | null
    tia_decorrido: number
    tia_str: string
    top_decorrido: number
    top_str: string
    tempo_oficial: number | null
    faltas: number
    recusas: number
    competidor_nome: string | null
    cao_nome: string | null
    cao_raca: string | null
    colete_competidor: string | null
    categoria: string | null
    classe: string | null
    num_obstaculos: number | null
    comprimento_pista: number | null
    tsp: number | null
    tmp: number | null
}

export interface FaltasRecusasResponse {
    faltas: number
    recusas: number
}

export interface ConfirmarResponse {
    ok: boolean
    top: number
    tia: number
}

// ── Configuração IR ──
export interface IrCalibrationRecommendation {
    frequency_hz: number
    duty_cycle: number
    burst_enabled: boolean
    burst_on: number
    burst_off: number
    sensor_active_level: 'LOW' | 'HIGH'
    sensor_signal_timeout: number
    sensor_trigger_confirm: number
    sensor_ready_min_ratio: number
    aligned_level_name: string
    break_level_name: string
    scan_signal_pct: number
    scan_delta: number
    minimum_stable_duty?: number | null
    burst_max_signal_gap?: number | null
    break_release_s?: number | null
    reacquire_s?: number | null
    physical_break_validated?: boolean
    pwm_backend?: string
    exports?: string[]
}

export interface IrCalibrationRejectedFrequency {
    freq: number
    reasons: string[]
    signal_level_name?: string
    noise_signal_pct?: number
    delta?: number
}

export interface IrCalibrationOperationalResult {
    freq: number
    minimum_stable_duty?: number | null
    burst_max_signal_gap?: number | null
    max_signal_gap?: number | null
    break_release_s?: number | null
    reacquire_s?: number | null
    break_detected?: boolean
    signal_timeout?: number | null
    timeout?: number | null
}

export interface IrCalibrationResult {
    ok: boolean
    started_at: string
    finished_at: string
    duration_s: number
    emitter_backend: string
    baseline: Record<string, number | string | null>
    sensitive: Array<{
        freq: number
        signal_level_name: string
        signal_pct: number
        delta: number
        stats: Record<string, number | string | null>
    }>
    hold: Array<{
        scan: {
            freq: number
            signal_level_name: string
            signal_pct: number
            delta: number
        }
        hold: Record<string, number | boolean | string | null>
    }>
    recommendation: IrCalibrationRecommendation | null
    noise_scan?: Array<{
        window_index: number
        candidate_frequency_hz: number
        stats: Record<string, number | boolean | string | null>
    }>
    rejected?: IrCalibrationRejectedFrequency[]
    margin?: IrCalibrationOperationalResult[]
    burst?: IrCalibrationOperationalResult[]
    break_tests?: IrCalibrationOperationalResult[]
    diagnostics?: {
        noise_windows?: number
        active_scans?: number
        sensitive_candidates?: number
        finalists?: number
        valid_candidates?: number
        rejected_candidates?: number
        reason_counts?: Record<string, number>
        physical_break_validated?: boolean
        physical_validation_warning?: string
    }
}

export interface IrCalibrationState {
    running: boolean
    phase: string | null
    frequency_hz: number | null
    started_at: string | null
    finished_at: string | null
    trigger?: string
    error: string | null
    last_attempt?: IrCalibrationResult | null
    last_result: IrCalibrationResult | null
    store_path: string
}

export interface IrHardwareStatus {
    raspberry_pi: boolean
    raspberry_modelo: string
    gpio_disponivel: boolean
    gpio_pronto: boolean
    gpio_erro: string | null
    sensor_gpio_bcm: number
    sensor_estado_feixe: string
    sensor_nivel_atual: number | null
    sensor_active_level: 'LOW' | 'HIGH'
    sensor_signal_timeout: number
    pigpio_disponivel: boolean
    pigpio_conectado: boolean
    pigpio_import_erro: string | null
    emissor_gpio_bcm: number
    emissor_ativo: boolean
    emissor_modo: string | null
    emissor_erro: string | null
    emissor_pwm_backend: string
    emissor_rajada_habilitada: boolean
    emissor_rajada_on: number
    emissor_rajada_off: number
    frequencia_hz: number
    duty_cycle: number
}

export interface IrConfigStatus {
    prova_estado: EstadoProva
    hardware: IrHardwareStatus
    calibration: IrCalibrationState
    saved_calibration: IrCalibrationResult | null
    electrical_warning: string
}
