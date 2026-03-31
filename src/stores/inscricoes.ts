import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Inscricao } from '@/types'
import { inscricoesApi } from '@/api/inscricoes'

export const useInscricoesStore = defineStore('inscricoes', () => {
    const items = ref<Inscricao[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll(status?: string) {
        loading.value = true
        error.value = null
        try {
            items.value = await inscricoesApi.getAll(status)
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<Inscricao, 'id_inscricao'>) {
        const created = await inscricoesApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<Inscricao>) {
        const updated = await inscricoesApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id_inscricao === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await inscricoesApi.remove(id)
        items.value = items.value.filter((i) => i.id_inscricao !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
