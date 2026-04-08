<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useProvasStore } from '@/stores/provas'
import { useCompetidoresStore } from '@/stores/competidores'
import { useCaesStore } from '@/stores/caes'
import { useJuizesStore } from '@/stores/juizes'
import { useInscricoesStore } from '@/stores/inscricoes'

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
    <div class="page-header">
      <h1>Dashboard</h1>
    </div>

    <!-- Ações rápidas -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-card to="/preparacao" class="pa-4" flat style="border: 1px solid #e8ecf1; cursor: pointer;">
          <div class="d-flex align-center ga-3">
            <v-avatar color="primary" size="48">
              <v-icon icon="mdi-clipboard-flow" color="white" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Preparar Competição</div>
              <div class="text-body-2 text-medium-emphasis">
                {{ baseCompleta ? 'Base pronta — revisar cadastros' : 'Siga o fluxo de cadastro passo a passo' }}
              </div>
            </div>
            <v-spacer />
            <v-icon icon="mdi-chevron-right" />
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card to="/prova-ativa" class="pa-4" flat style="border: 1px solid #e8ecf1; cursor: pointer;">
          <div class="d-flex align-center ga-3">
            <v-avatar :color="inscricoesPendentes > 0 ? 'success' : 'grey'" size="48">
              <v-icon icon="mdi-play-circle" color="white" />
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Operar Prova</div>
              <div class="text-body-2 text-medium-emphasis">
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
      <v-col v-for="card in cards" :key="card.title" cols="12" sm="6" md="4" lg="3">
        <v-card :to="card.to" class="stat-card pa-5 text-center" flat>
          <v-icon :icon="card.icon" size="40" color="primary" class="mb-3" />
          <div class="text-h4 font-weight-bold mb-1">{{ card.store.items.length }}</div>
          <div class="text-body-2 text-medium-emphasis">{{ card.title }}</div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
