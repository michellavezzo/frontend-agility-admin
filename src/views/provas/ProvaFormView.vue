<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProvasStore } from '@/stores/provas'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useNotificationStore } from '@/stores/notification'
import { provasApi } from '@/api/provas'
import PageHeader from '@/components/ui/PageHeader.vue'
import FormCard from '@/components/ui/FormCard.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsTextField from '@/components/ui/DsTextField.vue'
import DsSelect from '@/components/ui/DsSelect.vue'
import DsTextarea from '@/components/ui/DsTextarea.vue'

const route = useRoute()
const router = useRouter()
const store = useProvasStore()
const competicoes = useCompeticoesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const formData = ref({
  id_competicao: null as number | null,
  categoria: '',
  classe: '',
  num_obstaculos: 0,
  tsp: 0,
  tmp: 0,
  vel_media_necessaria: 0,
  comprimento_pista: 0,
  descricao: '',
})

const competicaoOptions = computed(() =>
  competicoes.items.map((c) => ({ title: c.nome, value: c.id_competicao! })),
)

const rules = {
  required: (v: unknown) => !!v || v === 0 || 'Campo obrigatório',
}

onMounted(async () => {
  await competicoes.fetchAll()
  if (isEdit.value) {
    try {
      const item = await provasApi.getById(Number(route.params.id))
      formData.value = {
        id_competicao: item.id_competicao,
        categoria: item.categoria,
        classe: item.classe,
        num_obstaculos: item.num_obstaculos,
        tsp: item.tsp,
        tmp: item.tmp,
        vel_media_necessaria: item.vel_media_necessaria,
        comprimento_pista: item.comprimento_pista,
        descricao: item.descricao || '',
      }
    } catch {
      notification.notify('Erro ao carregar prova', 'error')
      router.back()
    }
  }
})

async function save() {
  saving.value = true
  try {
    const payload = {
      ...formData.value,
      id_competicao: formData.value.id_competicao!,
      descricao: formData.value.descricao || null,
    }
    if (isEdit.value) {
      await store.update(Number(route.params.id), payload)
      notification.notify('Prova atualizada com sucesso')
    } else {
      await store.create(payload)
      notification.notify('Prova criada com sucesso')
    }
    router.push({ name: 'provas' })
  } catch {
    notification.notify('Erro ao salvar prova', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader :title="`${isEdit ? 'Editar' : 'Nova'} Prova`">
      <DsBtn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</DsBtn>
    </PageHeader>

    <FormCard :saving="saving" @submit="save" @cancel="router.back()">
        <v-row>
          <v-col cols="12" md="6">
            <DsSelect
              v-model="formData.id_competicao"
              :items="competicaoOptions"
              label="Competição"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.categoria" label="Categoria" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.classe" label="Classe" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.num_obstaculos" label="Nº Obstáculos" type="number" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.comprimento_pista" label="Comprim. Pista (m)" type="number" step="0.01" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.tsp" label="TSP (s)" type="number" step="0.01" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.tmp" label="TMP (s)" type="number" step="0.01" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="6">
            <DsTextField v-model="formData.vel_media_necessaria" label="Vel. Média Necessária (m/s)" type="number" step="0.01" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12">
            <DsTextarea v-model="formData.descricao" label="Descrição" rows="3" />
          </v-col>
        </v-row>

    </FormCard>
  </div>
</template>
