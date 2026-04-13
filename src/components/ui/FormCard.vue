<script setup lang="ts">
import { ref } from 'vue'
import DsBtn from '@/components/ui/DsBtn.vue'

defineProps<{
  saving?: boolean
  submitLabel?: string
  submitDisabled?: boolean
}>()

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const form = ref()

async function handleSubmit() {
  const { valid } = await form.value.validate()
  if (valid) emit('submit')
}

defineExpose({ form })
</script>

<template>
  <v-card class="form-card" flat>
    <slot name="prepend" />
    <v-form ref="form" @submit.prevent="handleSubmit">
      <slot />
      <div class="form-actions">
        <DsBtn variant="text" @click="emit('cancel')">Cancelar</DsBtn>
        <DsBtn color="primary" type="submit" :loading="saving" :disabled="submitDisabled">
          {{ submitLabel ?? 'Salvar' }}
        </DsBtn>
      </div>
    </v-form>
  </v-card>
</template>
