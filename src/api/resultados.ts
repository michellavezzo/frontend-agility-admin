import { api } from './client'
import type { Resultado } from '@/types'

const BASE = '/resultados'

export const resultadosApi = {
    getAll: () => api.get<Resultado[]>(`${BASE}/`),
    getById: (id: number) => api.get<Resultado>(`${BASE}/${id}`),
    create: (data: Omit<Resultado, 'id_resultado'>) => api.post<Resultado>(`${BASE}/`, data),
    update: (id: number, data: Partial<Resultado>) => api.put<Resultado>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
