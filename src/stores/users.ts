import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/types'
import { usersApi } from '@/api/users'

export const useUsersStore = defineStore('users', () => {
    const items = ref<User[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchAll() {
        loading.value = true
        error.value = null
        try {
            items.value = await usersApi.getAll()
        } catch (e) {
            error.value = (e as Error).message
        } finally {
            loading.value = false
        }
    }

    async function create(data: Omit<User, 'id'>) {
        const created = await usersApi.create(data)
        items.value.push(created)
        return created
    }

    async function update(id: number, data: Partial<User>) {
        const updated = await usersApi.update(id, data)
        const idx = items.value.findIndex((i) => i.id === id)
        if (idx !== -1) items.value[idx] = updated
        return updated
    }

    async function remove(id: number) {
        await usersApi.remove(id)
        items.value = items.value.filter((i) => i.id !== id)
    }

    return { items, loading, error, fetchAll, create, update, remove }
})
