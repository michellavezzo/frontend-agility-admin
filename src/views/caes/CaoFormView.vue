<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCaesStore } from '@/stores/caes'
import { useNotificationStore } from '@/stores/notification'
import { caesApi } from '@/api/caes'
import PageHeader from '@/components/ui/PageHeader.vue'
import FormCard from '@/components/ui/FormCard.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsTextField from '@/components/ui/DsTextField.vue'

const route = useRoute()
const router = useRouter()
const store = useCaesStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.microchip)
const saving = ref(false)

const formData = ref({
  microchip: '',
  nome: '',
  raca: '',
  cernelha: '',
  categoria_salto: '',
  is_cao_branco: false,
})

const rules = {
  required: (v: unknown) => !!v || v === 0 || 'Campo obrigatório',
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const item = await caesApi.getByMicrochip(String(route.params.microchip))
      formData.value = {
        microchip: item.microchip,
        nome: item.nome,
        raca: item.raca,
        cernelha: item.cernelha,
        categoria_salto: item.categoria_salto,
        is_cao_branco: item.is_cao_branco,
      }
    } catch {
      notification.notify('Erro ao carregar cão', 'error')
      router.back()
    }
  }
})

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await store.update(String(route.params.microchip), formData.value)
      notification.notify('Cão atualizado com sucesso')
    } else {
      await store.create(formData.value)
      notification.notify('Cão criado com sucesso')
    }
    router.push({ name: 'caes' })
  } catch {
    notification.notify('Erro ao salvar cão', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader :title="`${isEdit ? 'Editar' : 'Novo'} Cão`">
      <DsBtn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</DsBtn>
    </PageHeader>

    <FormCard :saving="saving" @submit="save" @cancel="router.back()">
      <v-row>
        <v-col cols="12" md="6">
          <DsTextField
            v-model="formData.microchip"
            label="Microchip"
            :rules="[rules.required]"
            :disabled="isEdit"
            :hint="isEdit ? 'Microchip não pode ser alterado' : ''"
            persistent-hint
          />
        </v-col>
        <v-col cols="12" md="6">
          <DsTextField v-model="formData.nome" label="Nome" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12" md="4">
          <DsTextField v-model="formData.raca" label="Raça" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12" md="4">
          <DsTextField v-model="formData.cernelha" label="Cernelha (cm)" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12" md="4">
          <DsTextField v-model="formData.categoria_salto" label="Categoria de Salto" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12" md="4" class="flex items-center">
          <v-checkbox v-model="formData.is_cao_branco" label="Cão Branco" hide-details />
        </v-col>
      </v-row>
    </FormCard>
  </div>
</template>
