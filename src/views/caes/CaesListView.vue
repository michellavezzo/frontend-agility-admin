<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCaesStore } from '@/stores/caes'
import { useNotificationStore } from '@/stores/notification'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
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

const search = ref('')

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
    <div class="page-header">
      <h1>Cães</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'caes-create' }">Novo</v-btn>
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
        <template #item.is_cao_branco="{ item }">
          <v-icon :icon="item.is_cao_branco ? 'mdi-check-circle' : 'mdi-minus-circle'" :color="item.is_cao_branco ? 'success' : 'grey'" size="small" />
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" size="small" variant="text" :to="{ name: 'caes-edit', params: { microchip: item.microchip } }" />
          <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="handleDelete(item)" />
        </template>
        <template #no-data>
          <div class="text-center pa-6 text-medium-emphasis">Nenhum cão cadastrado</div>
        </template>
      </v-data-table>
    </v-card>

    <ConfirmDialog ref="confirmDialog" />
  </div>
</template>
