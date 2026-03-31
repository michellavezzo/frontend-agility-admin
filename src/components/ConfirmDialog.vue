<script setup lang="ts">
import { ref } from 'vue'

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
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">Cancelar</v-btn>
        <v-btn color="error" variant="flat" @click="confirm">Confirmar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
