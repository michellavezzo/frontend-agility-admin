<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useProvasStore } from '@/stores/provas'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { Prova } from '@/types'

const store = useProvasStore()
const competicoes = useCompeticoesStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_prova', width: '80px' },
  { title: 'Competição', key: 'id_competicao' },
  { title: 'Categoria', key: 'categoria' },
  { title: 'Classe', key: 'classe' },
  { title: 'Obstáculos', key: 'num_obstaculos', width: '110px' },
  { title: 'Comprim. Pista', key: 'comprimento_pista', width: '130px' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

const competicaoMap = computed(() => {
  const map = new Map<number, string>()
  for (const c of competicoes.items) {
    if (c.id_competicao != null) map.set(c.id_competicao, c.nome)
  }
  return map
})

const search = ref('')

onMounted(() => {
  store.fetchAll()
  competicoes.fetchAll()
})

async function handleDelete(item: Prova) {
  const ok = await confirmDialog.value?.open('Excluir Prova', `Deseja excluir a prova #${item.id_prova}?`)
  if (!ok) return
  try {
    await store.remove(item.id_prova!)
    notification.notify('Prova excluída com sucesso')
  } catch {
    notification.notify('Erro ao excluir prova', 'error')
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Provas</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'provas-create' }">Nova</v-btn>
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
        <template #item.id_competicao="{ item }">
          {{ competicaoMap.get(item.id_competicao) || item.id_competicao }}
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'provas-edit', params: { id: item.id_prova } }" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
        </template>
        <template #no-data>
          <div class="text-center pa-6 text-medium-emphasis">Nenhuma prova cadastrada</div>
        </template>
      </v-data-table>
    </v-card>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
