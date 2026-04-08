<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useUsersStore } from '@/stores/users'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
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

const search = ref('')

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
    <div class="page-header">
      <h1>Competições</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'competicoes-create' }">Nova</v-btn>
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
        <template #item.data="{ item }">{{ formatDate(item.data) }}</template>
        <template #item.responsavel_id="{ item }">{{ userMap.get(item.responsavel_id) ?? item.responsavel_id }}</template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'competicoes-edit', params: { id: item.id_competicao } }" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
        </template>
        <template #no-data>
          <div class="text-center pa-6 text-medium-emphasis">Nenhuma competição cadastrada</div>
        </template>
      </v-data-table>
    </v-card>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
