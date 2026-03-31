import { api } from './client'
import type { Avaliacao } from '@/types'

const BASE = '/avaliacoes'

export const avaliacoesApi = {
    getAll: () => api.get<Avaliacao[]>(`${BASE}/`),
    getById: (id: number) => api.get<Avaliacao>(`${BASE}/${id}`),
    create: (data: Omit<Avaliacao, 'id_avaliacao' | 'criado_em' | 'atualizado_em'>) => api.post<Avaliacao>(`${BASE}/`, data),
    update: (id: number, data: Partial<Avaliacao>) => api.put<Avaliacao>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
