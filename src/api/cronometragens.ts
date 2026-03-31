import { api } from './client'
import type { Cronometragem } from '@/types'

const BASE = '/cronometros'

export const cronometragensApi = {
    getAll: () => api.get<Cronometragem[]>(`${BASE}/`),
    getById: (id: number) => api.get<Cronometragem>(`${BASE}/${id}`),
    create: (data: Omit<Cronometragem, 'id_cronometro' | 'criado_em' | 'atualizado_em'>) => api.post<Cronometragem>(`${BASE}/`, data),
    update: (id: number, data: Partial<Cronometragem>) => api.put<Cronometragem>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
