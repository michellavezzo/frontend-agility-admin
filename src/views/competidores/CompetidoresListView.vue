<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCompetidoresStore } from '@/stores/competidores'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import type { Competidor } from '@/types'

const store = useCompetidoresStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_competidor', width: '80px' },
  { title: 'Nome', key: 'nome' },
  { title: 'Escola', key: 'escola' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

onMounted(() => store.fetchAll())

async function handleDelete(item: Competidor) {
  const ok = await confirmDialog.value?.open('Excluir Competidor', `Deseja excluir "${item.nome}"?`)
  if (!ok) return
  try {
    await store.remove(item.id_competidor!)
    notification.notify('Competidor excluído com sucesso')
  } catch {
    notification.notify('Erro ao excluir competidor', 'error')
  }
}
</script>

<template>
  <div>
    <PageHeader title="Competidores">
      <DsBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'competidores-create' }">Novo</DsBtn>
    </PageHeader>

    <DataTable :headers="headers" :items="store.items" :loading="store.loading" no-data-text="Nenhum competidor cadastrado">
      <template #item.actions="{ item }">
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'competidores-edit', params: { id: item.id_competidor } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
