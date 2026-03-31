import { api } from './client'
import type { Competidor } from '@/types'

const BASE = '/competidor'

export const competidoresApi = {
    getAll: () => api.get<Competidor[]>(`${BASE}/`),
    getById: (id: number) => api.get<Competidor>(`${BASE}/${id}`),
    create: (data: Omit<Competidor, 'id_competidor'>) => api.post<Competidor>(`${BASE}/`, data),
    update: (id: number, data: Partial<Competidor>) => api.put<Competidor>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
