<script setup lang="ts">
defineProps<{
  modelValue?: string | number | null
  label?: string
  type?: string
  rules?: readonly ((v: any) => any)[]
  disabled?: boolean
  hint?: string
  persistentHint?: boolean
  prependInnerIcon?: string
  step?: string
  clearable?: boolean
  hideDetails?: boolean | 'auto'
  singleLine?: boolean
  density?: 'default' | 'comfortable' | 'compact'
  readonly?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string | number | null]
  'keyup': [e: KeyboardEvent]
  'click:clear': []
}>()
</script>

<template>
  <v-text-field
    class="ds-text-field"
    variant="outlined"
    :model-value="modelValue"
    :label="label"
    :type="type"
    :rules="rules"
    :disabled="disabled"
    :hint="hint"
    :persistent-hint="persistentHint"
    :prepend-inner-icon="prependInnerIcon"
    :step="step"
    :clearable="clearable"
    :hide-details="hideDetails"
    :single-line="singleLine"
    :density="density"
    :readonly="readonly"
    @update:model-value="$emit('update:modelValue', $event)"
    @keyup="$emit('keyup', $event)"
    @click:clear="$emit('click:clear')"
  />
</template>
