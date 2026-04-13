<script setup lang="ts">
defineProps<{
  modelValue?: string | null
  label?: string
  rules?: readonly ((v: any) => any)[]
  rows?: string | number
  disabled?: boolean
  hideDetails?: boolean | 'auto'
}>()

defineEmits<{
  'update:modelValue': [value: string | null]
}>()
</script>

<template>
  <v-textarea
    class="ds-textarea"
    variant="outlined"
    :model-value="modelValue"
    :label="label"
    :rules="rules"
    :rows="rows"
    :disabled="disabled"
    :hide-details="hideDetails"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
