<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useJuizesStore } from '@/stores/juizes'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import type { Juiz } from '@/types'

const store = useJuizesStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_juiz', width: '80px' },
  { title: 'Nome', key: 'nome' },
  { title: 'Email', key: 'email' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

onMounted(() => store.fetchAll())

async function handleDelete(item: Juiz) {
  const ok = await confirmDialog.value?.open('Excluir Juiz', `Deseja excluir "${item.nome}"?`)
  if (!ok) return
  try {
    await store.remove(item.id_juiz!)
    notification.notify('Juiz excluído com sucesso')
  } catch {
    notification.notify('Erro ao excluir juiz', 'error')
  }
}
</script>

<template>
  <div>
    <PageHeader title="Juízes">
      <DsBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'juizes-create' }">Novo</DsBtn>
    </PageHeader>

    <DataTable :headers="headers" :items="store.items" :loading="store.loading" no-data-text="Nenhum juiz cadastrado">
      <template #item.actions="{ item }">
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'juizes-edit', params: { id: item.id_juiz } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
