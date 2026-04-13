<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useProvasStore } from '@/stores/provas'
import { useCompetidoresStore } from '@/stores/competidores'
import { useCaesStore } from '@/stores/caes'
import { useJuizesStore } from '@/stores/juizes'
import { useInscricoesStore } from '@/stores/inscricoes'
import PageHeader from '@/components/ui/PageHeader.vue'
import StatCard from '@/components/ui/StatCard.vue'

const users = useUsersStore()
const competicoes = useCompeticoesStore()
const provas = useProvasStore()
const competidores = useCompetidoresStore()
const caes = useCaesStore()
const juizes = useJuizesStore()
const inscricoes = useInscricoesStore()

const cards = [
  { title: 'Usuários', icon: 'mdi-account-group', store: users, to: '/users' },
  { title: 'Competições', icon: 'mdi-trophy', store: competicoes, to: '/competicoes' },
  { title: 'Provas', icon: 'mdi-flag-checkered', store: provas, to: '/provas' },
  { title: 'Competidores', icon: 'mdi-run', store: competidores, to: '/competidores' },
  { title: 'Cães', icon: 'mdi-dog', store: caes, to: '/caes' },
  { title: 'Juízes', icon: 'mdi-gavel', store: juizes, to: '/juizes' },
  { title: 'Inscrições', icon: 'mdi-clipboard-list', store: inscricoes, to: '/inscricoes' },
]

const inscricoesPendentes = computed(() =>
  inscricoes.items.filter(i => i.status === 'pendente').length
)

const baseCompleta = computed(() =>
  users.items.length > 0 &&
  competicoes.items.length > 0 &&
  provas.items.length > 0 &&
  competidores.items.length > 0 &&
  caes.items.length > 0 &&
  inscricoes.items.length > 0
)

onMounted(() => {
  users.fetchAll()
  competicoes.fetchAll()
  provas.fetchAll()
  competidores.fetchAll()
  caes.fetchAll()
  juizes.fetchAll()
  inscricoes.fetchAll()
})
</script>

<template>
  <div>
    <PageHeader title="Dashboard" />

    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-card to="/preparacao" class="pa-4 quick-action" flat>
          <div class="d-flex align-center ga-3">
            <v-avatar color="primary" size="48" style="border-radius: 0;">
              <v-icon icon="mdi-clipboard-flow" color="white" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Preparar Competição</div>
              <div class="text-body-2" style="color: var(--ds-gray);">
                {{ baseCompleta ? 'Base pronta — revisar cadastros' : 'Siga o fluxo de cadastro passo a passo' }}
              </div>
            </div>
            <v-spacer />
            <v-icon icon="mdi-chevron-right" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card to="/prova-ativa" class="pa-4 quick-action" flat>
          <div class="d-flex align-center ga-3">
            <v-avatar :color="inscricoesPendentes > 0 ? 'success' : 'grey'" size="48" style="border-radius: 0;">
              <v-icon icon="mdi-play-circle" color="white" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Operar Prova</div>
              <div class="text-body-2" style="color: var(--ds-gray);">
                {{ inscricoesPendentes > 0 ? `${inscricoesPendentes} inscrição(ões) pendente(s)` : 'Nenhuma inscrição pendente' }}
              </div>
            </div>
            <v-spacer />
            <v-icon icon="mdi-chevron-right" />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="card in cards" :key="card.title" cols="6" sm="4" md="4" lg="3">
        <StatCard
          :title="card.title"
          :value="card.store.items.length"
          :icon="card.icon"
          :to="card.to"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.quick-action {
    border: 1px solid var(--ds-border);
    cursor: pointer;
    transition: border-color 0.2s;
}

.quick-action:hover {
    border-color: var(--ds-blue);
}
</style>
