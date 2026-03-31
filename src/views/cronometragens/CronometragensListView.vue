<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCronometragensStore } from '@/stores/cronometragens'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
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

const search = ref('')

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
    <div class="page-header">
      <h1>Cronometragens</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'cronometragens-create' }">Nova</v-btn>
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
          <v-chip size="small">{{ item.status }}</v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'cronometragens-edit', params: { id: item.id_cronometro } }" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
        </template>
        <template #no-data>
          <div class="text-center pa-6 text-medium-emphasis">Nenhuma cronometragem cadastrada</div>
        </template>
      </v-data-table>
    </v-card>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
