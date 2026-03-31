<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJuizesStore } from '@/stores/juizes'
import { useNotificationStore } from '@/stores/notification'
import { juizesApi } from '@/api/juizes'

const route = useRoute()
const router = useRouter()
const store = useJuizesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref()

const formData = ref({
  nome: '',
  email: '',
})

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const item = await juizesApi.getById(Number(route.params.id))
      formData.value = { nome: item.nome, email: item.email }
    } catch {
      notification.notify('Erro ao carregar juiz', 'error')
      router.back()
    }
  }
})

async function save() {
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    if (isEdit.value) {
      await store.update(Number(route.params.id), formData.value)
      notification.notify('Juiz atualizado com sucesso')
    } else {
      await store.create(formData.value)
      notification.notify('Juiz criado com sucesso')
    }
    router.push({ name: 'juizes' })
  } catch {
    notification.notify('Erro ao salvar juiz', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar' : 'Novo' }} Juiz</h1>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</v-btn>
    </div>

    <v-card class="form-card" flat>
      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="formData.nome" label="Nome" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="formData.email" label="Email" type="email" :rules="[rules.required]" />
          </v-col>
        </v-row>

        <div class="form-actions">
          <v-btn variant="text" @click="router.back()">Cancelar</v-btn>
          <v-btn color="primary" type="submit" :loading="saving">Salvar</v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>
