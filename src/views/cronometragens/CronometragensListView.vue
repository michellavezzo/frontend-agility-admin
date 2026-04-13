<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCronometragensStore } from '@/stores/cronometragens'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsChip from '@/components/ui/DsChip.vue'
import type { Cronometragem } from '@/types'

const store = useCronometragensStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_cronometro', width: '80px' },
  { title: 'Inscrição ID', key: 'id_inscricao' },
  { title: 'Tipo', key: 'tipo' },
  { title: 'Tempo Inicial', key: 'tempo_inicial' },
  { title: 'Tempo Final', key: 'tempo_final' },
  { title: 'Tempo Oficial', key: 'tempo_oficial' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

onMounted(() => store.fetchAll())

async function handleDelete(item: Cronometragem) {
  const ok = await confirmDialog.value?.open('Excluir Cronometragem', `Deseja excluir a cronometragem #${item.id_cronometro}?`)
  if (!ok) return
  try {
    await store.remove(item.id_cronometro!)
    notification.notify('Cronometragem excluída com sucesso')
  } catch {
    notification.notify('Erro ao excluir cronometragem', 'error')
  }
}
</script>

<template>
  <div>
    <PageHeader title="Cronometragens">
      <DsBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'cronometragens-create' }">Nova</DsBtn>
    </PageHeader>

    <DataTable :headers="headers" :items="store.items" :loading="store.loading" no-data-text="Nenhuma cronometragem cadastrada">
      <template #item.tempo_inicial="{ item }">
        {{ item.tempo_inicial != null ? `${item.tempo_inicial}s` : '—' }}
      </template>
      <template #item.tempo_final="{ item }">
        {{ item.tempo_final != null ? `${item.tempo_final}s` : '—' }}
      </template>
      <template #item.tempo_oficial="{ item }">
        {{ item.tempo_oficial != null ? `${item.tempo_oficial}s` : '—' }}
      </template>
      <template #item.status="{ item }">
        <DsChip>{{ item.status }}</DsChip>
      </template>
      <template #item.actions="{ item }">
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'cronometragens-edit', params: { id: item.id_cronometro } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
