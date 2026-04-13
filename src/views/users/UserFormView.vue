<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { useNotificationStore } from '@/stores/notification'
import { usersApi } from '@/api/users'
import PageHeader from '@/components/ui/PageHeader.vue'
import FormCard from '@/components/ui/FormCard.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsTextField from '@/components/ui/DsTextField.vue'

const route = useRoute()
const router = useRouter()
const store = useUsersStore()
const notification = useNotificationStore()

const isEdit = computed(() => !!route.params.id)
const saving = ref(false)

const formData = ref({
  name: '',
  email: '',
})

const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
}

onMounted(async () => {
  if (isEdit.value) {
    try {
      const user = await usersApi.getById(Number(route.params.id))
      formData.value = { name: user.name, email: user.email }
    } catch {
      notification.notify('Erro ao carregar usuário', 'error')
      router.back()
    }
  }
})

async function save() {
  saving.value = true
  try {
    if (isEdit.value) {
      await store.update(Number(route.params.id), formData.value)
      notification.notify('Usuário atualizado com sucesso')
    } else {
      await store.create(formData.value)
      notification.notify('Usuário criado com sucesso')
    }
    router.push({ name: 'users' })
  } catch {
    notification.notify('Erro ao salvar usuário', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <PageHeader :title="`${isEdit ? 'Editar' : 'Novo'} Usuário`">
      <DsBtn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">Voltar</DsBtn>
    </PageHeader>

    <FormCard :saving="saving" @submit="save" @cancel="router.back()">
      <v-row>
        <v-col cols="12" md="6">
          <DsTextField v-model="formData.name" label="Nome" :rules="[rules.required]" />
        </v-col>
        <v-col cols="12" md="6">
          <DsTextField v-model="formData.email" label="Email" type="email" :rules="[rules.required, rules.email]" />
        </v-col>
      </v-row>
    </FormCard>
  </div>
</template>
