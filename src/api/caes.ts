import { api } from './client'
import type { Cao } from '@/types'

const BASE = '/cao'

export const caesApi = {
    getAll: () => api.get<Cao[]>(`${BASE}/`),
    getByMicrochip: (microchip: string) => api.get<Cao>(`${BASE}/${microchip}`),
    create: (data: Cao) => api.post<Cao>(`${BASE}/`, data),
    update: (microchip: string, data: Partial<Omit<Cao, 'microchip'>>) => api.put<Cao>(`${BASE}/${microchip}`, data),
    remove: (microchip: string) => api.delete(`${BASE}/${microchip}`),
}
