import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Competidor } from '@/types'
import { competidoresApi } from '@/api/competidores'

export const useCompetidoresStore = defineStore('competidores', () => {
    const items = ref<Competidor[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await competidoresApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<Competidor, 'id_competidor'>) {
        const created = await competidoresApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<Competidor>) {
        const updated = await competidoresApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id_competidor === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await competidoresApi.remove(id)
        items.value = items.value.filter((i) => i.id_competidor !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
