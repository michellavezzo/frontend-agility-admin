<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
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
    <PageHeader title="Usuários">
      <DsBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'users-create' }">Novo</DsBtn>
    </PageHeader>

    <DataTable :headers="headers" :items="store.items" :loading="store.loading" no-data-text="Nenhum usuário cadastrado">
      <template #item.actions="{ item }">
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'users-edit', params: { id: item.id } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
