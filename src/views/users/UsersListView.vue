<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { User } from '@/types'

const store = useUsersStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Nome', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

const search = ref('')

onMounted(() => store.fetchAll())

async function handleDelete(item: User) {
  const ok = await confirmDialog.value?.open('Excluir Usuário', `Deseja excluir "${item.name}"?`)
  if (!ok) return
  try {
    await store.remove(item.id)
    notification.notify('Usuário excluído com sucesso')
  } catch {
    notification.notify('Erro ao excluir usuário', 'error')
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Usuários</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'users-create' }">Novo</v-btn>
    </div>

    <v-card class="table-card" flat>
      <v-toolbar flat color="transparent" class="px-4 pt-2">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
          clearable
          density="compact"
          class="mr-4"
          style="max-width: 320px;"
        />
      </v-toolbar>
      <v-data-table :headers="headers" :items="store.items" :loading="store.loading" :search="search" hover>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'users-edit', params: { id: item.id } }" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
        </template>
        <template #no-data>
          <div class="text-center pa-6 text-medium-emphasis">Nenhum usuário cadastrado</div>
        </template>
      </v-data-table>
    </v-card>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
