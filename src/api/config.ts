import { api } from './client'
import type { IrConfigStatus } from '@/types'

const BASE = '/config/ir'

export const configApi = {
    getIrStatus: () => api.get<IrConfigStatus>(`${BASE}/status`),

    calibrarIr: () => api.post<IrConfigStatus>(`${BASE}/calibracao`, {}),
}
