<script setup lang="ts">
defineProps<{
  color?: string
  variant?: 'flat' | 'text' | 'outlined' | 'elevated' | 'tonal' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  label?: string
}>()
</script>

<template>
  <v-chip
    class="ds-chip"
    :color="color"
    :variant="variant ?? 'tonal'"
    :size="size ?? 'small'"
    :label="true"
  >
    <slot>{{ label }}</slot>
  </v-chip>
</template>
