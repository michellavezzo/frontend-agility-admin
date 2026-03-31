<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useProvasStore } from '@/stores/provas'
import { useCompetidoresStore } from '@/stores/competidores'
import { useCaesStore } from '@/stores/caes'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import type { Inscricao } from '@/types'

const store = useInscricoesStore()
const provas = useProvasStore()
const competidores = useCompetidoresStore()
const caes = useCaesStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()
const search = ref('')
const statusFilter = ref('')

const headers = [
  { title: 'ID', key: 'id_inscricao', width: '80px' },
  { title: 'Prova', key: 'id_prova' },
  { title: 'Competidor', key: 'id_competidor' },
  { title: 'Cão', key: 'microchip_cao' },
  { title: 'Colete', key: 'colete_competidor', width: '100px' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

const provaMap = computed(() => {
  const map = new Map<number, string>()
  for (const p of provas.items) if (p.id_prova != null) map.set(p.id_prova, `${p.categoria} - ${p.classe}`)
  return map
})

const competidorMap = computed(() => {
  const map = new Map<number, string>()
  for (const c of competidores.items) if (c.id_competidor != null) map.set(c.id_competidor, c.nome)
  return map
})

const caoMap = computed(() => {
  const map = new Map<string, string>()
  for (const c of caes.items) map.set(c.microchip, c.nome)
  return map
})

onMounted(() => {
  store.fetchAll()
  provas.fetchAll()
  competidores.fetchAll()
  caes.fetchAll()
})

function applyFilter() {
  store.fetchAll(statusFilter.value || undefined)
}

async function handleDelete(item: Inscricao) {
  const ok = await confirmDialog.value?.open('Excluir Inscrição', `Deseja excluir a inscrição #${item.id_inscricao}?`)
  if (!ok) return
  try {
    await store.remove(item.id_inscricao!)
    notification.notify('Inscrição excluída com sucesso')
  } catch {
    notification.notify('Erro ao excluir inscrição', 'error')
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Inscrições</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'inscricoes-create' }">Nova</v-btn>
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
        <v-text-field
          v-model="statusFilter"
          label="Filtrar por status"
          clearable
          hide-details
          density="compact"
          style="max-width: 220px;"
          @keyup.enter="applyFilter"
          @click:clear="statusFilter = ''; applyFilter()"
        />
        <v-btn variant="text" class="ml-2" @click="applyFilter">Filtrar</v-btn>
      </v-toolbar>
      <v-data-table :headers="headers" :items="store.items" :loading="store.loading" :search="search" hover>
        <template #item.id_prova="{ item }">
          {{ provaMap.get(item.id_prova) || item.id_prova }}
        </template>
        <template #item.id_competidor="{ item }">
          {{ competidorMap.get(item.id_competidor) || item.id_competidor }}
        </template>
        <template #item.microchip_cao="{ item }">
          {{ caoMap.get(item.microchip_cao) || item.microchip_cao }}
        </template>
        <template #item.status="{ item }">
          <v-chip size="small">{{ item.status || '—' }}</v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'inscricoes-edit', params: { id: item.id_inscricao } }" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
        </template>
        <template #no-data>
          <div class="text-center pa-6 text-medium-emphasis">Nenhuma inscrição cadastrada</div>
        </template>
      </v-data-table>
    </v-card>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
