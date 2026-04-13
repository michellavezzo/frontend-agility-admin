<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useUsersStore } from '@/stores/users'
import { useNotificationStore } from '@/stores/notification'
import { competicoesApi } from '@/api/competicoes'
import PageHeader from '@/components/ui/PageHeader.vue'
import FormCard from '@/components/ui/FormCard.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsTextField from '@/components/ui/DsTextField.vue'
import DsSelect from '@/components/ui/DsSelect.vue'

const route = useRoute()
const router = useRouter()
const store = useCompeticoesStore()
const users = useUsersStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const formData = ref({
  nome: '',
  data: '',
  localizacao: '',
  responsavel_id: null as number | null,
  nomes_arbitros_convidados: '',
  nome_diretor_evento: '',
  nome_responsavel_secretaria: '',
  nome_veterinario: '',
})

const userOptions = computed(() =>
  users.items.map((u) => ({ title: u.name, value: u.id })),
)

const rules = {
  required: (v: unknown) => !!v || v === 0 || 'Campo obrigatório',
}

onMounted(async () => {
  await users.fetchAll()
  if (isEdit.value) {
    try {
      const item = await competicoesApi.getById(Number(route.params.id))
      formData.value = {
        nome: item.nome,
        data: item.data,
        localizacao: item.localizacao,
        responsavel_id: item.responsavel_id,
        nomes_arbitros_convidados: item.nomes_arbitros_convidados || '',
        nome_diretor_evento: item.nome_diretor_evento || '',
        nome_responsavel_secretaria: item.nome_responsavel_secretaria || '',
        nome_veterinario: item.nome_veterinario || '',
      }
    } catch {
      notification.notify('Erro ao carregar competição', 'error')
      router.back()
    }
  }
})

async function save() {
  saving.value = true
  try {
    const payload = {
      ...formData.value,
      responsavel_id: formData.value.responsavel_id!,
      nomes_arbitros_convidados: formData.value.nomes_arbitros_convidados || null,
      nome_diretor_evento: formData.value.nome_diretor_evento || null,
      nome_responsavel_secretaria: formData.value.nome_responsavel_secretaria || null,
      nome_veterinario: formData.value.nome_veterinario || null,
    }
    if (isEdit.value) {
      await store.update(Number(route.params.id), payload)
      notification.notify('Competição atualizada com sucesso')
    } else {
      await store.create(payload)
      notification.notify('Competição criada com sucesso')
    }
    router.push({ name: 'competicoes' })
  } catch {
    notification.notify('Erro ao salvar competição', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader :title="`${isEdit ? 'Editar' : 'Nova'} Competição`">
      <DsBtn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</DsBtn>
    </PageHeader>

    <FormCard :saving="saving" @submit="save" @cancel="router.back()">
        <v-row>
          <v-col cols="12" md="6">
            <DsTextField v-model="formData.nome" label="Nome" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <DsTextField v-model="formData.data" label="Data" type="date" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="3">
            <DsSelect
              v-model="formData.responsavel_id"
              :items="userOptions"
              label="Responsável"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <DsTextField v-model="formData.localizacao" label="Localização" :rules="[rules.required]" />
          </v-col>
          <v-col cols="12" md="6">
            <DsTextField v-model="formData.nomes_arbitros_convidados" label="Árbitros Convidados" />
          </v-col>
          <v-col cols="12" md="4">
            <DsTextField v-model="formData.nome_diretor_evento" label="Diretor do Evento" />
          </v-col>
          <v-col cols="12" md="4">
            <DsTextField v-model="formData.nome_responsavel_secretaria" label="Responsável Secretaria" />
          </v-col>
          <v-col cols="12" md="4">
            <DsTextField v-model="formData.nome_veterinario" label="Veterinário" />
          </v-col>
        </v-row>

    </FormCard>
  </div>
</template>
