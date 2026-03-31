import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Resultado } from '@/types'
import { resultadosApi } from '@/api/resultados'

export const useResultadosStore = defineStore('resultados', () => {
    const items = ref<Resultado[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await resultadosApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<Resultado, 'id_resultado'>) {
        const created = await resultadosApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<Resultado>) {
        const updated = await resultadosApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id_resultado === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await resultadosApi.remove(id)
        items.value = items.value.filter((i) => i.id_resultado !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
