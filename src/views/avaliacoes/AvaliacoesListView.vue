<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useAvaliacoesStore } from '@/stores/avaliacoes'
import { useProvasStore } from '@/stores/provas'
import { useJuizesStore } from '@/stores/juizes'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataTable from '@/components/ui/DataTable.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import type { Avaliacao } from '@/types'

const store = useAvaliacoesStore()
const provas = useProvasStore()
const juizes = useJuizesStore()
const notification = useNotificationStore()
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>()

const headers = [
  { title: 'ID', key: 'id_avaliacao', width: '80px' },
  { title: 'Prova', key: 'id_prova' },
  { title: 'Juiz', key: 'id_juiz' },
  { title: 'Diretor Prova', key: 'diretor_prova' },
  { title: 'Comentários', key: 'comentarios' },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' },
]

const provaMap = computed(() => {
  const map = new Map<number, string>()
  for (const p of provas.items) if (p.id_prova != null) map.set(p.id_prova, `${p.categoria} - ${p.classe}`)
  return map
})

const juizMap = computed(() => {
  const map = new Map<number, string>()
  for (const j of juizes.items) if (j.id_juiz != null) map.set(j.id_juiz, j.nome)
  return map
})

onMounted(() => {
  store.fetchAll()
  provas.fetchAll()
  juizes.fetchAll()
})

async function handleDelete(item: Avaliacao) {
  const ok = await confirmDialog.value?.open('Excluir Avaliação', `Deseja excluir a avaliação #${item.id_avaliacao}?`)
  if (!ok) return
  try {
    await store.remove(item.id_avaliacao!)
    notification.notify('Avaliação excluída com sucesso')
  } catch {
    notification.notify('Erro ao excluir avaliação', 'error')
  }
}
</script>

<template>
  <div>
    <PageHeader title="Avaliações">
      <DsBtn color="primary" prepend-icon="mdi-plus" :to="{ name: 'avaliacoes-create' }">Nova</DsBtn>
    </PageHeader>

    <DataTable :headers="headers" :items="store.items" :loading="store.loading" no-data-text="Nenhuma avaliação cadastrada">
      <template #item.id_prova="{ item }">
        {{ provaMap.get(item.id_prova) || item.id_prova }}
      </template>
      <template #item.id_juiz="{ item }">
        {{ juizMap.get(item.id_juiz) || item.id_juiz }}
      </template>
      <template #item.comentarios="{ item }">
        {{ item.comentarios || '—' }}
      </template>
      <template #item.actions="{ item }">
        <DsBtn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'avaliacoes-edit', params: { id: item.id_avaliacao } }" />
        <DsBtn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
      </template>
    </DataTable>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
