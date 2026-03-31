<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useNotificationStore } from '@/stores/notification'

const notification = useNotificationStore()
</script>

<template>
  <AdminLayout class="p-4"/>

  <v-snackbar
    v-model="notification.show"
    :color="notification.color"
    :timeout="3000"
    location="top right"
  >
    {{ notification.message }}
    <template #actions>
      <v-btn variant="text" @click="notification.show = false">Fechar</v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped></style>
