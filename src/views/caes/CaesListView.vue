<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCaesStore } from '@/stores/caes'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import type { Cao } from '@/types'

const store = useCaesStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'Microchip', key: 'microchip' },
  { title: 'Nome', key: 'nome' },
  { title: 'Raça', key: 'raca' },
  { title: 'Cernelha', key: 'cernelha' },
  { title: 'Cat. Salto', key: 'categoria_salto' },
  { title: 'Cão Branco', key: 'is_cao_branco', width: '110px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

onMounted(() => store.fetchAll())

async function handleDelete(item: Cao) {
  const ok = await confirmDialog.value?.open('Excluir Cão', `Deseja excluir "${item.nome}" (${item.microchip})?`)
  if (!ok) return
  try {
    await store.remove(item.microchip)
    notification.notify('Cão excluído com sucesso')
  } catch {
    notification.notify('Erro ao excluir cão', 'error')
  }
}
</script>

<template>
  <div>
    <PageHeader title="Cães">
      <DsBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'caes-create' }">Novo</DsBtn>
    </PageHeader>

    <DataTable :headers="headers" :items="store.items" :loading="store.loading" no-data-text="Nenhum cão cadastrado">
      <template #item.is_cao_branco="{ item }">
        <v-icon :icon="item.is_cao_branco ? 'mdi-check-circle' : 'mdi-minus-circle'" :color="item.is_cao_branco ? 'success' : 'grey'" size="small" />
      </template>
      <template #item.actions="{ item }">
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'caes-edit', params: { microchip: item.microchip } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
