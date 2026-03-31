<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAvaliacoesStore } from '@/stores/avaliacoes'
import { useProvasStore } from '@/stores/provas'
import { useJuizesStore } from '@/stores/juizes'
import { useNotificationStore } from '@/stores/notification'
import { avaliacoesApi } from '@/api/avaliacoes'

const route = useRoute()
const router = useRouter()
const store = useAvaliacoesStore()
const provas = useProvasStore()
const juizes = useJuizesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref()

const formData = ref({
  id_prova: 0,
  id_juiz: 0,
  diretor_prova: '',
  comentarios: '',
})

const provaOptions = computed(() =>
  provas.items.map((p) => ({ title: `${p.categoria} - ${p.classe} (#${p.id_prova})`, value: p.id_prova! })),
)

const juizOptions = computed(() =>
  juizes.items.map((j) => ({ title: j.nome, value: j.id_juiz! })),
)

const rules = {
  required: (v: unknown) => !!v || v === 0 || 'Campo obrigatório',
}

onMounted(async () => {
  await Promise.all([provas.fetchAll(), juizes.fetchAll()])
  if (isEdit.value) {
    try {
      const item = await avaliacoesApi.getById(Number(route.params.id))
      formData.value = {
        id_prova: item.id_prova,
        id_juiz: item.id_juiz,
        diretor_prova: item.diretor_prova,
        comentarios: item.comentarios || '',
      }
    } catch {
      notification.notify('Erro ao carregar avaliação', 'error')
      router.back()
    }
  }
})

async function save() {
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const payload = {
      ...formData.value,
      comentarios: formData.value.comentarios || null,
    }
    if (isEdit.value) {
      await store.update(Number(route.params.id), payload)
      notification.notify('Avaliação atualizada com sucesso')
    } else {
      await store.create(payload)
      notification.notify('Avaliação criada com sucesso')
    }
    router.push({ name: 'avaliacoes' })
  } catch {
    notification.notify('Erro ao salvar avaliação', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar' : 'Nova' }} Avaliação</h1>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</v-btn>
    </div>

    <v-card class="form-card" flat>
      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.id_prova"
              :items="provaOptions"
              label="Prova"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select v-model="formData.id_juiz" :items="juizOptions" label="Juiz" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="formData.diretor_prova" label="Diretor da Prova" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12">
            <v-textarea v-model="formData.comentarios" label="Comentários" rows="3" />
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
