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
