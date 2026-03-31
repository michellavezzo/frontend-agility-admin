<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCronometragensStore } from '@/stores/cronometragens'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useNotificationStore } from '@/stores/notification'
import { cronometragensApi } from '@/api/cronometragens'

const route = useRoute()
const router = useRouter()
const store = useCronometragensStore()
const inscricoes = useInscricoesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref()

const formData = ref({
  id_inscricao: 0,
  tempo_inicial: '',
  tempo_final: undefined as string | undefined,
  status: '',
  tipo: '',
  tempo_oficial: undefined as number | undefined,
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
      const item = await cronometragensApi.getById(Number(route.params.id))
      formData.value = {
        id_inscricao: item.id_inscricao,
        tempo_inicial: item.tempo_inicial,
        tempo_final: item.tempo_final ?? undefined,
        status: item.status,
        tipo: item.tipo,
        tempo_oficial: item.tempo_oficial ?? undefined,
      }
    } catch {
      notification.notify('Erro ao carregar cronometragem', 'error')
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
      notification.notify('Cronometragem atualizada com sucesso')
    } else {
      await store.create(formData.value)
      notification.notify('Cronometragem criada com sucesso')
    }
    router.push({ name: 'cronometragens' })
  } catch {
    notification.notify('Erro ao salvar cronometragem', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar' : 'Nova' }} Cronometragem</h1>
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
          <v-col cols="12" md="3">
            <v-text-field v-model="formData.tipo" label="Tipo" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="formData.status" label="Status" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="formData.tempo_inicial" label="Tempo Inicial" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="formData.tempo_final" label="Tempo Final" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model.number="formData.tempo_oficial" label="Tempo Oficial (s)" type="number" step="0.001" />
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
