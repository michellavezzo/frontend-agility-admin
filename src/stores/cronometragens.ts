import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Cronometragem } from '@/types'
import { cronometragensApi } from '@/api/cronometragens'

export const useCronometragensStore = defineStore('cronometragens', () => {
    const items = ref<Cronometragem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await cronometragensApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<Cronometragem, 'id_cronometro' | 'criado_em' | 'atualizado_em'>) {
        const created = await cronometragensApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<Cronometragem>) {
        const updated = await cronometragensApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id_cronometro === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await cronometragensApi.remove(id)
        items.value = items.value.filter((i) => i.id_cronometro !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
