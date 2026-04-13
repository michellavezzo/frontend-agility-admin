<script setup lang="ts">
defineProps<{
  variant?: 'flat' | 'text' | 'outlined' | 'tonal' | 'plain'
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  icon?: string | boolean
  prependIcon?: string
  appendIcon?: string
  block?: boolean
  loading?: boolean
  disabled?: boolean
  to?: string | object
  type?: string
}>()

defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
  <v-btn
    class="ds-btn"
    :variant="variant"
    :color="color"
    :size="size"
    :icon="typeof icon === 'boolean' ? icon : !!icon"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :block="block"
    :loading="loading"
    :disabled="disabled"
    :to="to"
    :type="type"
    @click="$emit('click', $event)"
  >
    <v-icon v-if="typeof icon === 'string'" :icon="icon" />
    <slot v-else />
  </v-btn>
</template>
