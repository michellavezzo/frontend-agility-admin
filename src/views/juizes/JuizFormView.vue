<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJuizesStore } from '@/stores/juizes'
import { useNotificationStore } from '@/stores/notification'
import { juizesApi } from '@/api/juizes'
import PageHeader from '@/components/ui/PageHeader.vue'
import FormCard from '@/components/ui/FormCard.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsTextField from '@/components/ui/DsTextField.vue'

const route = useRoute()
const router = useRouter()
const store = useJuizesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const formData = ref({
  nome: '',
  email: '',
})

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const item = await juizesApi.getById(Number(route.params.id))
      formData.value = { nome: item.nome, email: item.email }
    } catch {
      notification.notify('Erro ao carregar juiz', 'error')
      router.back()
    }
  }
})

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await store.update(Number(route.params.id), formData.value)
      notification.notify('Juiz atualizado com sucesso')
    } else {
      await store.create(formData.value)
      notification.notify('Juiz criado com sucesso')
    }
    router.push({ name: 'juizes' })
  } catch {
    notification.notify('Erro ao salvar juiz', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader :title="`${isEdit ? 'Editar' : 'Novo'} Juiz`">
      <DsBtn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</DsBtn>
    </PageHeader>

    <FormCard :saving="saving" @submit="save" @cancel="router.back()">
      <v-row>
        <v-col cols="12" md="6">
          <DsTextField v-model="formData.nome" label="Nome" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12" md="6">
          <DsTextField v-model="formData.email" label="Email" type="email" :rules="[rules.required]" />
        </v-col>
      </v-row>
    </FormCard>
  </div>
</template>
