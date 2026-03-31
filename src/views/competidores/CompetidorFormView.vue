<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompetidoresStore } from '@/stores/competidores'
import { useNotificationStore } from '@/stores/notification'
import { competidoresApi } from '@/api/competidores'

const route = useRoute()
const router = useRouter()
const store = useCompetidoresStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref()

const formData = ref({
  nome: '',
  escola: '',
})

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const item = await competidoresApi.getById(Number(route.params.id))
      formData.value = { nome: item.nome, escola: item.escola }
    } catch {
      notification.notify('Erro ao carregar competidor', 'error')
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
      notification.notify('Competidor atualizado com sucesso')
    } else {
      await store.create(formData.value)
      notification.notify('Competidor criado com sucesso')
    }
    router.push({ name: 'competidores' })
  } catch {
    notification.notify('Erro ao salvar competidor', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar' : 'Novo' }} Competidor</h1>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</v-btn>
    </div>

    <v-card class="form-card" flat>
      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="formData.nome" label="Nome" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="formData.escola" label="Escola" :rules="[rules.required]" />
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
