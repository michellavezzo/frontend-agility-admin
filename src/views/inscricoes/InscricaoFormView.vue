<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useProvasStore } from '@/stores/provas'
import { useCompetidoresStore } from '@/stores/competidores'
import { useCaesStore } from '@/stores/caes'
import { useNotificationStore } from '@/stores/notification'
import { inscricoesApi } from '@/api/inscricoes'

const route = useRoute()
const router = useRouter()
const store = useInscricoesStore()
const provas = useProvasStore()
const competidores = useCompetidoresStore()
const caes = useCaesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const form = ref()

const formData = ref({
  id_prova: 0,
  id_competidor: 0,
  microchip_cao: '',
  colete_competidor: '',
  status: '',
})

const provaOptions = computed(() =>
  provas.items.map((p) => ({ title: `${p.categoria} - ${p.classe} (#${p.id_prova})`, value: p.id_prova! })),
)

const competidorOptions = computed(() =>
  competidores.items.map((c) => ({ title: c.nome, value: c.id_competidor! })),
)

const caoOptions = computed(() =>
  caes.items.map((c) => ({ title: `${c.nome} (${c.microchip})`, value: c.microchip })),
)

const rules = {
  required: (v: unknown) => !!v || v === 0 || 'Campo obrigatório',
}

onMounted(async () => {
  await Promise.all([provas.fetchAll(), competidores.fetchAll(), caes.fetchAll()])
  if (isEdit.value) {
    try {
      const item = await inscricoesApi.getById(Number(route.params.id))
      formData.value = {
        id_prova: item.id_prova,
        id_competidor: item.id_competidor,
        microchip_cao: item.microchip_cao,
        colete_competidor: item.colete_competidor,
        status: item.status,
      }
    } catch {
      notification.notify('Erro ao carregar inscrição', 'error')
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
      notification.notify('Inscrição atualizada com sucesso')
    } else {
      await store.create(formData.value)
      notification.notify('Inscrição criada com sucesso')
    }
    router.push({ name: 'inscricoes' })
  } catch {
    notification.notify('Erro ao salvar inscrição', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>{{ isEdit ? 'Editar' : 'Nova' }} Inscrição</h1>
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</v-btn>
    </div>

    <v-card class="form-card" flat>
      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" md="6">
            <v-select v-model="formData.id_prova" :items="provaOptions" label="Prova" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.id_competidor"
              :items="competidorOptions"
              label="Competidor"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="formData.microchip_cao"
              :items="caoOptions"
              label="Cão"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="formData.colete_competidor" label="Colete" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="formData.status" label="Status" :rules="[rules.required]" />
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
