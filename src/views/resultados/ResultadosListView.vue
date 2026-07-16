<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useResultadosStore } from '@/stores/resultados'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useCompetidoresStore } from '@/stores/competidores'
import { useCaesStore } from '@/stores/caes'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import type { Resultado } from '@/types'

const store = useResultadosStore()
const inscricoes = useInscricoesStore()
const competidores = useCompetidoresStore()
const caes = useCaesStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_resultado', width: '80px' },
  { title: 'Inscrição', key: 'id_inscricao' },
  { title: 'Posição', key: 'posicao', width: '100px' },
  { title: 'Total Pontos T', key: 'total_pontos_t' },
  { title: 'Total Pontos TP', key: 'total_pontos_tp' },
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

onMounted(() => {
  store.fetchAll()
  inscricoes.fetchAll()
  competidores.fetchAll()
  caes.fetchAll()
})

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
    <PageHeader title="Resultados">
      <DsBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'resultados-create' }">Novo</DsBtn>
    </PageHeader>

    <DataTable :headers="headers" :items="store.items" :loading="store.loading" no-data-text="Nenhum resultado cadastrado">
      <template #item.id_inscricao="{ item }">
        {{ inscricaoMap.get(item.id_inscricao) || `#${item.id_inscricao}` }}
      </template>
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
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'resultados-edit', params: { id: item.id_resultado } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
