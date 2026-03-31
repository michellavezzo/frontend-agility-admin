import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', () => {
    const message = ref('')
    const color = ref<'success' | 'error' | 'warning' | 'info'>('success')
    const show = ref(false)

    function notify(msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') {
        message.value = msg
        color.value = type
        show.value = true
    }

    return { message, color, show, notify }
})
