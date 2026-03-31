import { api } from './client'
import type { Prova } from '@/types'

const BASE = '/provas'

export const provasApi = {
    getAll: () => api.get<Prova[]>(`${BASE}/`),
    getById: (id: number) => api.get<Prova>(`${BASE}/${id}`),
    create: (data: Omit<Prova, 'id_prova' | 'criado_em' | 'atualizado_em'>) => api.post<Prova>(`${BASE}/`, data),
    update: (id: number, data: Partial<Prova>) => api.put<Prova>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
