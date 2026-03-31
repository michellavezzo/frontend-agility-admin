import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Competicao } from '@/types'
import { competicoesApi } from '@/api/competicoes'

export const useCompeticoesStore = defineStore('competicoes', () => {
    const items = ref<Competicao[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await competicoesApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<Competicao, 'id_competicao'>) {
        const created = await competicoesApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<Competicao>) {
        const updated = await competicoesApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id_competicao === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await competicoesApi.remove(id)
        items.value = items.value.filter((i) => i.id_competicao !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
