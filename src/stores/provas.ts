import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Prova } from '@/types'
import { provasApi } from '@/api/provas'

export const useProvasStore = defineStore('provas', () => {
    const items = ref<Prova[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await provasApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<Prova, 'id_prova' | 'criado_em' | 'atualizado_em'>) {
        const created = await provasApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<Prova>) {
        const updated = await provasApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id_prova === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await provasApi.remove(id)
        items.value = items.value.filter((i) => i.id_prova !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
