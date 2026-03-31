import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Juiz } from '@/types'
import { juizesApi } from '@/api/juizes'

export const useJuizesStore = defineStore('juizes', () => {
    const items = ref<Juiz[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await juizesApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<Juiz, 'id_juiz'>) {
        const created = await juizesApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<Juiz>) {
        const updated = await juizesApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id_juiz === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await juizesApi.remove(id)
        items.value = items.value.filter((i) => i.id_juiz !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
