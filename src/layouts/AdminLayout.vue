<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(true)

const operacaoItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/' },
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
]
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable" elevation="0" border="b">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-dog" class="mr-1" /> Agility Admin
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :width="250" border="r">
      <v-list nav density="compact" class="px-2 pt-3">
        <v-list-item
          v-for="item in operacaoItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="primary"
          rounded="lg"
          class="mb-1"
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
          rounded="lg"
          class="mb-1"
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
          rounded="lg"
          class="mb-1"
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
          rounded="lg"
          class="mb-1"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6" style="max-width: 1400px;">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>
