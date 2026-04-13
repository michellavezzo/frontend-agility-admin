<script setup lang="ts">
defineProps<{
  modelValue?: string | number | null
  items?: unknown[]
  label?: string
  rules?: readonly ((v: any) => any)[]
  disabled?: boolean
  loading?: boolean
  clearable?: boolean
  noDataText?: string
  prependInnerIcon?: string
  hideDetails?: boolean | 'auto'
  density?: 'default' | 'comfortable' | 'compact'
}>()

defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()
</script>

<template>
  <v-select
    class="ds-select"
    variant="outlined"
    :model-value="modelValue"
    :items="items"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    :loading="loading"
    :clearable="clearable"
    :no-data-text="noDataText"
    :prepend-inner-icon="prependInnerIcon"
    :hide-details="hideDetails"
    :density="density"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
