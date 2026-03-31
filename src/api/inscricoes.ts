import { api } from './client'
import type { Inscricao } from '@/types'

const BASE = '/inscricoes'

export const inscricoesApi = {
    getAll: (status?: string) => {
        const query = status ? `?status=${encodeURIComponent(status)}` : ''
        return api.get<Inscricao[]>(`${BASE}/${query}`)
    },
    getById: (id: number) => api.get<Inscricao>(`${BASE}/${id}`),
    create: (data: Omit<Inscricao, 'id_inscricao'>) => api.post<Inscricao>(`${BASE}/`, data),
    update: (id: number, data: Partial<Inscricao>) => api.put<Inscricao>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
