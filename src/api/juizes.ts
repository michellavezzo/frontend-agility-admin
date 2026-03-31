import { api } from './client'
import type { Juiz } from '@/types'

const BASE = '/juiz'

export const juizesApi = {
    getAll: () => api.get<Juiz[]>(`${BASE}/`),
    getById: (id: number) => api.get<Juiz>(`${BASE}/${id}`),
    create: (data: Omit<Juiz, 'id_juiz'>) => api.post<Juiz>(`${BASE}/`, data),
    update: (id: number, data: Partial<Juiz>) => api.put<Juiz>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
