<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResultadosStore } from '@/stores/resultados'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useNotificationStore } from '@/stores/notification'
import { resultadosApi } from '@/api/resultados'

const route = useRoute()
const router = useRouter()
const store = useResultadosStore()
const inscricoes = useInscricoesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref()

const formData = ref({
  id_inscricao: 0,
  total_pontos_t: undefined as number | undefined,
  total_pontos_tp: undefined as number | undefined,
  posicao: undefined as number | undefined,
})

const inscricaoOptions = computed(() =>
  inscricoes.items.map((i) => ({ title: `Inscrição #${i.id_inscricao}`, value: i.id_inscricao! })),
)

const rules = {
  required: (v: unknown) => !!v || v === 0 || 'Campo obrigatório',
}

onMounted(async () => {
  await inscricoes.fetchAll()
  if (isEdit.value) {
    try {
      const item = await resultadosApi.getById(Number(route.params.id))
      formData.value = {
        id_inscricao: item.id_inscricao,
        total_pontos_t: item.total_pontos_t ?? undefined,
        total_pontos_tp: item.total_pontos_tp ?? undefined,
        posicao: item.posicao ?? undefined,
      }
    } catch {
      notification.notify('Erro ao carregar resultado', 'error')
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
      notification.notify('Resultado atualizado com sucesso')
    } else {
      await store.create(formData.value)
      notification.notify('Resultado criado com sucesso')
    }
    router.push({ name: 'resultados' })
  } catch {
    notification.notify('Erro ao salvar resultado', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar' : 'Novo' }} Resultado</h1>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</v-btn>
    </div>

    <v-card class="form-card" flat>
      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.id_inscricao"
              :items="inscricaoOptions"
              label="Inscrição"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.number="formData.posicao" label="Posição" type="number" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.number="formData.total_pontos_t" label="Total Pontos T" type="number" step="0.01" />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model.number="formData.total_pontos_tp" label="Total Pontos TP" type="number" step="0.01" />
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
