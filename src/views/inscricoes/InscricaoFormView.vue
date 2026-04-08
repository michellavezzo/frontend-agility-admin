<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useProvasStore } from '@/stores/provas'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useCompetidoresStore } from '@/stores/competidores'
import { useCaesStore } from '@/stores/caes'
import { useNotificationStore } from '@/stores/notification'
import { inscricoesApi } from '@/api/inscricoes'

const route = useRoute()
const router = useRouter()
const store = useInscricoesStore()
const provas = useProvasStore()
const competicoes = useCompeticoesStore()
const competidores = useCompetidoresStore()
const caes = useCaesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)
const loadingData = ref(true)
const form = ref()

const formData = ref({
  id_prova: null as number | null,
  id_competidor: null as number | null,
  microchip_cao: '',
  colete_competidor: '',
  status: 'pendente',
})

const statusOptions = [
  { title: 'Pendente', value: 'pendente' },
  { title: 'Finalizado', value: 'finalizado' },
  { title: 'Desclassificado', value: 'desclassificado' },
]

const competicaoMap = computed(() => {
  const map = new Map<number, string>()
  for (const c of competicoes.items) map.set(c.id_competicao, c.nome)
  return map
})

const provaOptions = computed(() =>
  provas.items.map((p) => {
    const compNome = competicaoMap.value.get(p.id_competicao) || `Comp. #${p.id_competicao}`
    return { title: `${compNome} — ${p.categoria} / ${p.classe}`, value: p.id_prova }
  }),
)

const competidorOptions = computed(() =>
  competidores.items.map((c) => ({ title: `${c.nome} (${c.escola})`, value: c.id_competidor })),
)

const caoOptions = computed(() =>
  caes.items.map((c) => ({ title: `${c.nome} — ${c.raca} (${c.microchip})`, value: c.microchip })),
)

const rules = {
  required: (v: unknown) => (v !== null && v !== undefined && v !== '' && v !== 0) || 'Campo obrigatório',
}

const temDependencias = computed(() =>
  provas.items.length > 0 && competidores.items.length > 0 && caes.items.length > 0
)

onMounted(async () => {
  loadingData.value = true
  await Promise.all([
    provas.fetchAll(),
    competicoes.fetchAll(),
    competidores.fetchAll(),
    caes.fetchAll(),
  ])
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
  loadingData.value = false
})

async function save() {
  const { valid } = await form.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const payload = {
      id_prova: formData.value.id_prova!,
      id_competidor: formData.value.id_competidor!,
      microchip_cao: formData.value.microchip_cao,
      colete_competidor: formData.value.colete_competidor,
      status: formData.value.status,
    }
    if (isEdit.value) {
      await store.update(Number(route.params.id), payload)
      notification.notify('Inscrição atualizada com sucesso')
    } else {
      await store.create(payload)
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

    <!-- Aviso de dependências -->
    <v-alert
      v-if="!loadingData && !temDependencias && !isEdit"
      type="warning"
      variant="tonal"
      density="compact"
      class="mb-5"
      icon="mdi-alert-circle"
      rounded="lg"
    >
      Para criar uma inscrição, é necessário ter pelo menos uma <strong>prova</strong>,
      um <strong>competidor</strong> e um <strong>cão</strong> cadastrados.
      <router-link to="/preparacao" class="text-primary font-weight-bold ml-1">
        Ir para Preparação
      </router-link>
    </v-alert>

    <v-card class="form-card" flat>
      <v-progress-linear v-if="loadingData" indeterminate color="primary" class="mb-4" />

      <v-form ref="form" @submit.prevent="save">
        <v-row>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="formData.id_prova"
              :items="provaOptions"
              label="Prova"
              :rules="[rules.required]"
              :loading="loadingData"
              no-data-text="Nenhuma prova cadastrada"
              prepend-inner-icon="mdi-flag-checkered"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
              v-model="formData.id_competidor"
              :items="competidorOptions"
              label="Competidor"
              :rules="[rules.required]"
              :loading="loadingData"
              no-data-text="Nenhum competidor cadastrado"
              prepend-inner-icon="mdi-account"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
              v-model="formData.microchip_cao"
              :items="caoOptions"
              label="Cão"
              :rules="[rules.required]"
              :loading="loadingData"
              no-data-text="Nenhum cão cadastrado"
              prepend-inner-icon="mdi-dog"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="formData.colete_competidor"
              label="Nº do Colete"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-tshirt-crew"
              hint="Número do colete do competidor na pista"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="formData.status"
              :items="statusOptions"
              label="Status"
              :rules="[rules.required]"
              prepend-inner-icon="mdi-list-status"
            />
          </v-col>
        </v-row>

        <div class="form-actions">
          <v-btn variant="text" @click="router.back()">Cancelar</v-btn>
          <v-btn color="primary" type="submit" :loading="saving" :disabled="!temDependencias && !isEdit">
            Salvar
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>
