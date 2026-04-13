<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useUsersStore } from '@/stores/users'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import type { Competicao } from '@/types'

const store = useCompeticoesStore()
const users = useUsersStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_competicao', width: '80px' },
  { title: 'Nome', key: 'nome' },
  { title: 'Data', key: 'data' },
  { title: 'Localização', key: 'localizacao' },
  { title: 'Responsável', key: 'responsavel_id' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

const userMap = computed(() => {
  const map = new Map<number, string>()
  for (const u of users.items) map.set(u.id, u.name)
  return map
})

onMounted(() => {
  store.fetchAll()
  users.fetchAll()
})

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR')
}

async function handleDelete(item: Competicao) {
  const ok = await confirmDialog.value?.open('Excluir Competição', `Deseja excluir "${item.nome}"?`)
  if (!ok) return
  try {
    await store.remove(item.id_competicao)
    notification.notify('Competição excluída com sucesso')
  } catch {
    notification.notify('Erro ao excluir competição', 'error')
  }
}
</script>

<template>
  <div>
    <PageHeader title="Competições">
      <DsBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'competicoes-create' }">Nova</DsBtn>
    </PageHeader>

    <DataTable :headers="headers" :items="store.items" :loading="store.loading" no-data-text="Nenhuma competição cadastrada">
      <template #item.data="{ item }">{{ formatDate(item.data) }}</template>
      <template #item.responsavel_id="{ item }">{{ userMap.get(item.responsavel_id) ?? item.responsavel_id }}</template>
      <template #item.actions="{ item }">
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'competicoes-edit', params: { id: item.id_competicao } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
