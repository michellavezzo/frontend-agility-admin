<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResultadosStore } from '@/stores/resultados'
import { useInscricoesStore } from '@/stores/inscricoes'
import { useNotificationStore } from '@/stores/notification'
import { resultadosApi } from '@/api/resultados'
import PageHeader from '@/components/ui/PageHeader.vue'
import FormCard from '@/components/ui/FormCard.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsTextField from '@/components/ui/DsTextField.vue'
import DsSelect from '@/components/ui/DsSelect.vue'

const route = useRoute()
const router = useRouter()
const store = useResultadosStore()
const inscricoes = useInscricoesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const formData = ref({
  id_inscricao: null as number | null,
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
  saving.value = true
  try {
    const payload = { ...formData.value, id_inscricao: formData.value.id_inscricao! }
    if (isEdit.value) {
      await store.update(Number(route.params.id), payload)
      notification.notify('Resultado atualizado com sucesso')
    } else {
      await store.create(payload)
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
    <PageHeader :title="`${isEdit ? 'Editar' : 'Novo'} Resultado`">
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
          <v-col cols="12" md="6">
            <DsTextField v-model="formData.posicao" label="Posição" type="number" />
          </v-col>
          <v-col cols="12" md="6">
            <DsTextField v-model="formData.total_pontos_t" label="Total Pontos T" type="number" step="0.01" />
          </v-col>
          <v-col cols="12" md="6">
            <DsTextField v-model="formData.total_pontos_tp" label="Total Pontos TP" type="number" step="0.01" />
          </v-col>
        </v-row>

    </FormCard>
  </div>
</template>
