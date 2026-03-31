import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Cao } from '@/types'
import { caesApi } from '@/api/caes'

export const useCaesStore = defineStore('caes', () => {
    const items = ref<Cao[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await caesApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Cao) {
        const created = await caesApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(microchip: string, data: Partial<Cao>) {
        const updated = await caesApi.update(microchip, data)
        const idx = items.value.findIndex((i) => i.microchip === microchip)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(microchip: string) {
        await caesApi.remove(microchip)
        items.value = items.value.filter((i) => i.microchip !== microchip)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
