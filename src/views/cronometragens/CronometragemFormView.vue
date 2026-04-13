<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCronometragensStore } from '@/stores/cronometragens'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useNotificationStore } from '@/stores/notification'
import { cronometragensApi } from '@/api/cronometragens'
import PageHeader from '@/components/ui/PageHeader.vue'
import FormCard from '@/components/ui/FormCard.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsTextField from '@/components/ui/DsTextField.vue'
import DsSelect from '@/components/ui/DsSelect.vue'

const route = useRoute()
const router = useRouter()
const store = useCronometragensStore()
const inscricoes = useInscricoesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const formData = ref({
  id_inscricao: null as number | null,
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
  saving.value = true
  try {
    const payload = { ...formData.value, id_inscricao: formData.value.id_inscricao! }
    if (isEdit.value) {
      await store.update(Number(route.params.id), payload)
      notification.notify('Cronometragem atualizada com sucesso')
    } else {
      await store.create(payload)
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
    <PageHeader :title="`${isEdit ? 'Editar' : 'Nova'} Cronometragem`">
      <DsBtn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</DsBtn>
    </PageHeader>

    <FormCard :saving="saving" @submit="save" @cancel="router.back()">
        <v-row>
          <v-col cols="12" md="6">
            <DsSelect
              v-model="formData.id_inscricao"
              :items="inscricaoOptions"
              label="Inscrição"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.tipo" label="Tipo" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.status" label="Status" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="4">
            <DsTextField v-model="formData.tempo_inicial" label="Tempo Inicial" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="4">
            <DsTextField v-model="formData.tempo_final" label="Tempo Final" />
          </v-col>
          <v-col cols="12" md="4">
            <DsTextField v-model="formData.tempo_oficial" label="Tempo Oficial (s)" type="number" step="0.001" />
          </v-col>
        </v-row>

    </FormCard>
  </div>
</template>
