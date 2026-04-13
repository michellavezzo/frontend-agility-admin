<script setup lang="ts">
defineProps<{
  modelValue?: string | number | null
  items?: unknown[]
  label?: string
  rules?: readonly ((v: any) => any)[]
  loading?: boolean
  noDataText?: string
  prependInnerIcon?: string
  disabled?: boolean
  clearable?: boolean
  hideDetails?: boolean | 'auto'
  density?: 'default' | 'comfortable' | 'compact'
}>()

defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()
</script>

<template>
  <v-autocomplete
    class="ds-autocomplete"
    variant="outlined"
    :model-value="modelValue"
    :items="items"
    :label="label"
    :rules="rules"
    :loading="loading"
    :no-data-text="noDataText"
    :prepend-inner-icon="prependInnerIcon"
    :disabled="disabled"
    :clearable="clearable"
    :hide-details="hideDetails"
    :density="density"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
