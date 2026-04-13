<script setup lang="ts">
import { ref } from 'vue'
import DsBtn from '@/components/ui/DsBtn.vue'

const dialog = ref(false)
const title = ref('')
const message = ref('')

let resolveFn: ((value: boolean) => void) | null = null

function open(t: string, m: string): Promise<boolean> {
  title.value = t
  message.value = m
  dialog.value = true
  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

function confirm() {
  dialog.value = false
  resolveFn?.(true)
}

function cancel() {
  dialog.value = false
  resolveFn?.(false)
}

defineExpose({ open })
</script>

<template>
  <v-dialog v-model="dialog" max-width="440" persistent>
    <v-card class="confirm-dialog">
      <v-card-title class="confirm-dialog__title">{{ title }}</v-card-title>
      <v-card-text class="confirm-dialog__text">{{ message }}</v-card-text>
      <v-card-actions class="confirm-dialog__actions">
        <v-spacer />
        <DsBtn variant="text" @click="cancel">Cancelar</DsBtn>
        <DsBtn color="error" variant="flat" @click="confirm">Confirmar</DsBtn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.confirm-dialog {
    border: 1px solid var(--ds-border);
}

.confirm-dialog__title {
    font-weight: 300 !important;
    font-size: 1.25rem !important;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    padding: 1.25rem 1.5rem 0.5rem !important;
}

.confirm-dialog__text {
    color: var(--ds-gray) !important;
    line-height: var(--ds-line-height-tight) !important;
}

.confirm-dialog__actions {
    padding: 0.75rem 1.5rem 1.25rem !important;
}
</style>
