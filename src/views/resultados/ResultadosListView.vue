<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useResultadosStore } from '@/stores/resultados'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { Resultado } from '@/types'

const store = useResultadosStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_resultado', width: '80px' },
  { title: 'Inscrição ID', key: 'id_inscricao' },
  { title: 'Total Pontos T', key: 'total_pontos_t' },
  { title: 'Total Pontos TP', key: 'total_pontos_tp' },
  { title: 'Posição', key: 'posicao' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

const search = ref('')

onMounted(() => store.fetchAll())

async function handleDelete(item: Resultado) {
  const ok = await confirmDialog.value?.open('Excluir Resultado', `Deseja excluir o resultado #${item.id_resultado}?`)
  if (!ok) return
  try {
    await store.remove(item.id_resultado!)
    notification.notify('Resultado excluído com sucesso')
  } catch {
    notification.notify('Erro ao excluir resultado', 'error')
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Resultados</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'resultados-create' }">Novo</v-btn>
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
        <template #item.total_pontos_t="{ item }">
          {{ item.total_pontos_t != null ? item.total_pontos_t : '—' }}
        </template>
        <template #item.total_pontos_tp="{ item }">
          {{ item.total_pontos_tp != null ? item.total_pontos_tp : '—' }}
        </template>
        <template #item.posicao="{ item }">
          {{ item.posicao != null ? item.posicao : '—' }}
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'resultados-edit', params: { id: item.id_resultado } }" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
        </template>
        <template #no-data>
          <div class="text-center pa-6 text-medium-emphasis">Nenhum resultado cadastrado</div>
        </template>
      </v-data-table>
    </v-card>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
