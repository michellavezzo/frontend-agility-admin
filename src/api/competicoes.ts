import { api } from './client'
import type { Competicao } from '@/types'

const BASE = '/competicoes'

export const competicoesApi = {
    getAll: () => api.get<Competicao[]>(`${BASE}/`),
    getById: (id: number) => api.get<Competicao>(`${BASE}/${id}`),
    create: (data: Omit<Competicao, 'id_competicao'>) => api.post<Competicao>(`${BASE}/`, data),
    update: (id: number, data: Partial<Competicao>) => api.put<Competicao>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
