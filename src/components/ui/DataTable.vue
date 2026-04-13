<script setup lang="ts">
import { ref } from 'vue'
import DsTextField from '@/components/ui/DsTextField.vue'

defineProps<{
  headers: Array<{ title: string; key: string; sortable?: boolean; width?: string }>
  items: unknown[]
  loading?: boolean
  noDataText?: string
}>()

const search = ref('')
</script>

<template>
  <v-card class="table-card" flat>
    <v-toolbar flat color="transparent" class="px-4 pt-2">
      <DsTextField
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
      <slot name="toolbar" />
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      :search="search"
      hover
    >
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
      <template #no-data>
        <div class="text-center pa-6" style="color: var(--ds-gray);">
          {{ noDataText ?? 'Nenhum registro cadastrado' }}
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
