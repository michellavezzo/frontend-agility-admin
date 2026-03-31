import { api } from './client'
import type { ProvaAtivaEstado, FaltasRecusasResponse, ConfirmarResponse, Inscricao } from '@/types'

const BASE = '/prova-ativa'

export const provaAtivaApi = {
    getEstado: () => api.get<ProvaAtivaEstado>(`${BASE}/estado`),

    preparar: (id_inscricao: number) =>
        api.post<ProvaAtivaEstado>(`${BASE}/preparar`, { id_inscricao }),

    autorizar: () => api.post<ProvaAtivaEstado>(`${BASE}/autorizar`, {}),

    falta: () => api.post<FaltasRecusasResponse>(`${BASE}/falta`, {}),

    desfazerFalta: () => api.post<FaltasRecusasResponse>(`${BASE}/desfazer-falta`, {}),

    recusa: () => api.post<FaltasRecusasResponse>(`${BASE}/recusa`, {}),

    desfazerRecusa: () => api.post<FaltasRecusasResponse>(`${BASE}/desfazer-recusa`, {}),

    forcarFim: () => api.post<ProvaAtivaEstado>(`${BASE}/forcar-fim`, {}),

    confirmar: () => api.post<ConfirmarResponse>(`${BASE}/confirmar`, {}),

    reset: () => api.post<ProvaAtivaEstado>(`${BASE}/reset`, {}),

    simularSensor: () => api.post<ProvaAtivaEstado>(`${BASE}/simular-sensor`, {}),

    getInscricoesPendentes: () => api.get<Inscricao[]>('/inscricoes/?status=pendente'),
}
