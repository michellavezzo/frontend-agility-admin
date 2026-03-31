import { api } from './client'
import type { User } from '@/types'

const BASE = '/users'

export const usersApi = {
    getAll: () => api.get<User[]>(`${BASE}/`),
    getById: (id: number) => api.get<User>(`${BASE}/${id}`),
    create: (data: Omit<User, 'id'>) => api.post<User>(`${BASE}/`, data),
    update: (id: number, data: Partial<User>) => api.put<User>(`${BASE}/${id}`, data),
    remove: (id: number) => api.delete(`${BASE}/${id}`),
}
