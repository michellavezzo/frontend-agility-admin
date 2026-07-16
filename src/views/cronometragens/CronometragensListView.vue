<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCronometragensStore } from '@/stores/cronometragens'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useCompetidoresStore } from '@/stores/competidores'
import { useCaesStore } from '@/stores/caes'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsChip from '@/components/ui/DsChip.vue'
import type { Cronometragem } from '@/types'

const store = useCronometragensStore()
const inscricoes = useInscricoesStore()
const competidores = useCompetidoresStore()
const caes = useCaesStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_cronometro', width: '80px' },
  { title: 'Inscrição', key: 'id_inscricao' },
  { title: 'Tipo', key: 'tipo', width: '90px' },
  { title: 'Início', key: 'tempo_inicial' },
  { title: 'Fim', key: 'tempo_final' },
  { title: 'Tempo Oficial', key: 'tempo_oficial', width: '130px' },
  { title: 'Status', key: 'status' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

const inscricaoMap = computed(() => {
  const competidorMap = new Map<number, string>()
  for (const c of competidores.items) if (c.id_competidor != null) competidorMap.set(c.id_competidor, c.nome)
  const caoMap = new Map<string, string>()
  for (const c of caes.items) caoMap.set(c.microchip, c.nome)
  const map = new Map<number, string>()
  for (const i of inscricoes.items) {
    if (i.id_inscricao == null) continue
    const competidor = competidorMap.get(i.id_competidor) ?? `Competidor ${i.id_competidor}`
    const cao = caoMap.get(i.microchip_cao) ?? i.microchip_cao
    map.set(i.id_inscricao, `#${i.id_inscricao} · ${competidor} / ${cao}`)
  }
  return map
})

function formatDateTime(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  store.fetchAll()
  inscricoes.fetchAll()
  competidores.fetchAll()
  caes.fetchAll()
})

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
      <template #item.id_inscricao="{ item }">
        {{ inscricaoMap.get(item.id_inscricao) || `#${item.id_inscricao}` }}
      </template>
      <template #item.tipo="{ item }">
        <DsChip :color="item.tipo === 'prova' ? 'primary' : 'secondary'">
          {{ item.tipo === 'prova' ? 'TOP' : item.tipo === 'tia' ? 'TIA' : item.tipo }}
        </DsChip>
      </template>
      <template #item.tempo_inicial="{ item }">
        {{ formatDateTime(item.tempo_inicial) }}
      </template>
      <template #item.tempo_final="{ item }">
        {{ formatDateTime(item.tempo_final) }}
      </template>
      <template #item.tempo_oficial="{ item }">
        {{ item.tempo_oficial != null ? `${item.tempo_oficial.toFixed(3)}s` : '—' }}
      </template>
      <template #item.status="{ item }">
        <DsChip :color="item.status === 'finalizado' ? 'success' : 'secondary'">{{ item.status }}</DsChip>
      </template>
      <template #item.actions="{ item }">
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'cronometragens-edit', params: { id: item.id_cronometro } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
