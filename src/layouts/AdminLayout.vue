<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()
const drawer = ref(mdAndUp.value)

const operacaoItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Preparar Competição', icon: 'mdi-clipboard-flow-outline', to: '/preparacao' },
  { title: 'Operar Prova', icon: 'mdi-play-circle-outline', to: '/prova-ativa' },
]

const cadastroItems = [
  { title: 'Competições', icon: 'mdi-trophy-outline', to: '/competicoes' },
  { title: 'Provas', icon: 'mdi-flag-checkered', to: '/provas' },
  { title: 'Competidores', icon: 'mdi-account-multiple-outline', to: '/competidores' },
  { title: 'Cães', icon: 'mdi-dog', to: '/caes' },
  { title: 'Juízes', icon: 'mdi-gavel', to: '/juizes' },
  { title: 'Inscrições', icon: 'mdi-clipboard-list-outline', to: '/inscricoes' },
]

const resultadoItems = [
  { title: 'Resultados', icon: 'mdi-chart-bar', to: '/resultados' },
  { title: 'Avaliações', icon: 'mdi-star-outline', to: '/avaliacoes' },
  { title: 'Cronometragens', icon: 'mdi-timer-outline', to: '/cronometragens' },
]

const sistemaItems = [
  { title: 'Usuários', icon: 'mdi-account-cog-outline', to: '/users' },
  { title: 'Configurações', icon: 'mdi-tune-variant', to: '/config' },
]
</script>

<template>
  <v-app>
    <v-app-bar flat density="comfortable" class="app-bar-bmw" elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title class="app-bar-title">
        AGILITY ADMIN
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :width="250" class="nav-drawer-bmw">
      <v-list nav density="compact" class="px-2 pt-3">
        <v-list-item
          v-for="item in operacaoItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="primary"
          class="mb-1 nav-item"
        />
      </v-list>

      <div class="sidebar-section-title">Cadastros</div>
      <v-list nav density="compact" class="px-2">
        <v-list-item
          v-for="item in cadastroItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="primary"
          class="mb-1 nav-item"
        />
      </v-list>

      <div class="sidebar-section-title">Resultados</div>
      <v-list nav density="compact" class="px-2">
        <v-list-item
          v-for="item in resultadoItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="primary"
          class="mb-1 nav-item"
        />
      </v-list>

      <div class="sidebar-section-title">Sistema</div>
      <v-list nav density="compact" class="px-2 pb-3">
        <v-list-item
          v-for="item in sistemaItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="primary"
          class="mb-1 nav-item"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="main-content">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-bar-bmw {
    background-color: var(--ds-black) !important;
    color: var(--ds-white) !important;
    border-bottom: 2px solid var(--ds-blue) !important;
}

.app-bar-title {
    font-weight: 900 !important;
    font-size: 1.125rem !important;
    letter-spacing: 0.08em !important;
    line-height: var(--ds-line-height-heading) !important;
}

.nav-drawer-bmw {
    border-right: 1px solid var(--ds-border) !important;
}

.nav-item {
    font-weight: 400;
    font-size: 0.875rem;
    line-height: var(--ds-line-height-tight);
}

.nav-item:deep(.v-list-item-title) {
    font-weight: 400 !important;
}

.nav-item.v-list-item--active:deep(.v-list-item-title) {
    font-weight: 700 !important;
}
</style>
