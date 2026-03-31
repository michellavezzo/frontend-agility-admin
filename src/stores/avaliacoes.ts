import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Avaliacao } from '@/types'
import { avaliacoesApi } from '@/api/avaliacoes'

export const useAvaliacoesStore = defineStore('avaliacoes', () => {
    const items = ref<Avaliacao[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await avaliacoesApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<Avaliacao, 'id_avaliacao' | 'criado_em' | 'atualizado_em'>) {
        const created = await avaliacoesApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<Avaliacao>) {
        const updated = await avaliacoesApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id_avaliacao === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await avaliacoesApi.remove(id)
        items.value = items.value.filter((i) => i.id_avaliacao !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
