<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useCompeticoesStore } from '@/stores/competicoes'
import { useJuizesStore } from '@/stores/juizes'
import { useCompetidoresStore } from '@/stores/competidores'
import { useCaesStore } from '@/stores/caes'
import { useProvasStore } from '@/stores/provas'
import { useInscricoesStore } from '@/stores/inscricoes'
import PageHeader from '@/components/ui/PageHeader.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsChip from '@/components/ui/DsChip.vue'

const users = useUsersStore()
const competicoes = useCompeticoesStore()
const juizes = useJuizesStore()
const competidores = useCompetidoresStore()
const caes = useCaesStore()
const provas = useProvasStore()
const inscricoes = useInscricoesStore()

onMounted(async () => {
  await Promise.all([
    users.fetchAll(),
    competicoes.fetchAll(),
    juizes.fetchAll(),
    competidores.fetchAll(),
    caes.fetchAll(),
    provas.fetchAll(),
    inscricoes.fetchAll(),
  ])
})

const loading = computed(() =>
  users.loading || competicoes.loading || juizes.loading ||
  competidores.loading || caes.loading || provas.loading || inscricoes.loading
)

interface EtapaInfo {
  numero: number
  titulo: string
  descricao: string
  icon: string
  color: string
  count: number
  minimo: number
  rotaCadastro: string
  rotaLista: string
  labelBotao: string
  dica: string
}

const etapas = computed<EtapaInfo[]>(() => [
  {
    numero: 1,
    titulo: 'Responsável / Usuário',
    descricao: 'Cadastre o responsável pela organização do evento. A competição precisa de um responsável vinculado.',
    icon: 'mdi-account-tie',
    color: 'blue-grey',
    count: users.items.length,
    minimo: 1,
    rotaCadastro: '/users/novo',
    rotaLista: '/users',
    labelBotao: 'Cadastrar Usuário',
    dica: 'Cadastre pelo menos 1 responsável antes de criar a competição.',
  },
  {
    numero: 2,
    titulo: 'Competição',
    descricao: 'Crie o evento de Agility com nome, data, local e equipe organizadora. A competição é a entidade central do sistema.',
    icon: 'mdi-trophy',
    color: 'amber-darken-2',
    count: competicoes.items.length,
    minimo: 1,
    rotaCadastro: '/competicoes/nova',
    rotaLista: '/competicoes',
    labelBotao: 'Criar Competição',
    dica: 'Defina data, local, diretor do evento e veterinário responsável.',
  },
  {
    numero: 3,
    titulo: 'Juízes',
    descricao: 'Cadastre os juízes que avaliarão as provas. Eles serão vinculados às avaliações durante a competição.',
    icon: 'mdi-gavel',
    color: 'deep-purple',
    count: juizes.items.length,
    minimo: 1,
    rotaCadastro: '/juizes/novo',
    rotaLista: '/juizes',
    labelBotao: 'Cadastrar Juiz',
    dica: 'Tenha pelo menos 1 juiz cadastrado para a avaliação das provas.',
  },
  {
    numero: 4,
    titulo: 'Competidores',
    descricao: 'Cadastre os condutores (handlers) que participarão da competição com seus cães.',
    icon: 'mdi-account-multiple',
    color: 'teal',
    count: competidores.items.length,
    minimo: 1,
    rotaCadastro: '/competidores/novo',
    rotaLista: '/competidores',
    labelBotao: 'Cadastrar Competidor',
    dica: 'Informe nome e escola/clube de cada competidor.',
  },
  {
    numero: 5,
    titulo: 'Cães',
    descricao: 'Cadastre os cães com microchip, raça, cernelha e categoria de salto. Cada cão é identificado pelo microchip.',
    icon: 'mdi-dog',
    color: 'brown',
    count: caes.items.length,
    minimo: 1,
    rotaCadastro: '/caes/novo',
    rotaLista: '/caes',
    labelBotao: 'Cadastrar Cão',
    dica: 'O microchip é o identificador único do cão no sistema.',
  },
  {
    numero: 6,
    titulo: 'Provas',
    descricao: 'Crie as provas vinculadas à competição, definindo categoria, classe, obstáculos, pista e tempos padrão.',
    icon: 'mdi-flag-checkered',
    color: 'red',
    count: provas.items.length,
    minimo: 1,
    rotaCadastro: '/provas/nova',
    rotaLista: '/provas',
    labelBotao: 'Criar Prova',
    dica: 'Defina TSP, TMP, nº de obstáculos e comprimento da pista.',
  },
  {
    numero: 7,
    titulo: 'Inscrições',
    descricao: 'Vincule cada competidor e seu cão a uma prova, definindo o número do colete. Esta é a etapa final antes da operação.',
    icon: 'mdi-clipboard-check',
    color: 'green',
    count: inscricoes.items.length,
    minimo: 1,
    rotaCadastro: '/inscricoes/nova',
    rotaLista: '/inscricoes',
    labelBotao: 'Criar Inscrição',
    dica: 'A inscrição conecta prova + competidor + cão. Precisa das etapas anteriores prontas.',
  },
])

function etapaStatus(etapa: EtapaInfo): 'completa' | 'disponivel' | 'bloqueada' {
  if (etapa.count >= etapa.minimo) return 'completa'
  const idx = etapa.numero - 1
  if (idx === 0) return 'disponivel'
  // Etapa 2 (competição) precisa de etapa 1
  if (idx === 1) return users.items.length > 0 ? 'disponivel' : 'bloqueada'
  // Etapas 3, 4, 5 precisam de etapa 2
  if (idx >= 2 && idx <= 4) return competicoes.items.length > 0 ? 'disponivel' : 'bloqueada'
  // Etapa 6 (provas) precisa de competição
  if (idx === 5) return competicoes.items.length > 0 ? 'disponivel' : 'bloqueada'
  // Etapa 7 (inscrições) precisa de provas, competidores e cães
  if (idx === 6) {
    return provas.items.length > 0 && competidores.items.length > 0 && caes.items.length > 0
      ? 'disponivel'
      : 'bloqueada'
  }
  return 'disponivel'
}

const etapasCompletas = computed(() => etapas.value.filter(e => etapaStatus(e) === 'completa').length)
const prontoParaOperar = computed(() => etapasCompletas.value === etapas.value.length)

const inscricoesPendentes = computed(() =>
  inscricoes.items.filter(i => i.status === 'pendente').length
)
</script>

<template>
  <div>
    <PageHeader title="Preparação da Competição">
      <DsChip
        v-if="!loading"
        :color="prontoParaOperar ? 'success' : 'warning'"
        variant="elevated"
        size="large"
        class="font-weight-bold text-white"
      >
        {{ prontoParaOperar ? 'Pronto para operar' : `${etapasCompletas} de ${etapas.length} etapas` }}
      </DsChip>
    </PageHeader>

    <!-- Resumo rápido -->
    <v-alert
      v-if="prontoParaOperar"
      type="success"
      variant="tonal"
      density="compact"
      class="mb-5"
      icon="mdi-check-circle"
      rounded="0"
    >
      Todas as etapas de preparação foram concluídas.
      <strong>{{ inscricoesPendentes }}</strong> inscrição(ões) pendente(s) aguardando na
      <router-link to="/prova-ativa" class="text-primary font-weight-bold">Operação da Prova</router-link>.
    </v-alert>

    <v-alert
      v-else-if="!loading"
      type="info"
      variant="tonal"
      density="compact"
      class="mb-5"
      icon="mdi-information"
      rounded="0"
    >
      Siga as etapas abaixo para preparar a base de dados da competição.
      Cada etapa depende das anteriores — comece pelo responsável e avance até as inscrições.
    </v-alert>

    <!-- Progress bar -->
    <v-progress-linear
      v-if="!loading"
      :model-value="(etapasCompletas / etapas.length) * 100"
      :color="prontoParaOperar ? 'success' : 'primary'"
      height="8"
      class="mb-6"
    />

    <!-- Loading skeleton -->
    <v-row v-if="loading" class="mb-6">
      <v-col v-for="n in 7" :key="n" cols="12">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>

    <!-- Etapas -->
    <div v-else class="etapas-flow">
      <div v-for="etapa in etapas" :key="etapa.numero" class="etapa-item">
        <!-- Conector vertical -->
        <div v-if="etapa.numero > 1" class="etapa-conector">
          <div class="conector-line" :class="{ 'conector-completo': etapaStatus(etapa) === 'completa' }" />
        </div>

        <v-card
          flat
          class="etapa-card"
          :class="{
            'etapa-completa': etapaStatus(etapa) === 'completa',
            'etapa-bloqueada': etapaStatus(etapa) === 'bloqueada',
          }"
        >
          <div class="etapa-card-inner">
            <!-- Indicador de número/status -->
            <div class="etapa-indicador" :class="`bg-${etapa.color}`">
              <v-icon
                v-if="etapaStatus(etapa) === 'completa'"
                icon="mdi-check"
                size="24"
                color="white"
              />
              <span v-else class="etapa-numero">{{ etapa.numero }}</span>
            </div>

            <!-- Conteúdo -->
            <div class="etapa-conteudo">
              <div class="etapa-header">
                <div>
                  <h3 class="etapa-titulo">
                    <v-icon :icon="etapa.icon" size="20" class="mr-1" />
                    {{ etapa.titulo }}
                  </h3>
                  <p class="etapa-descricao">{{ etapa.descricao }}</p>
                </div>
                <div class="etapa-contagem">
                  <DsChip
                    :color="etapa.count > 0 ? 'success' : 'default'"
                  >
                    {{ etapa.count }} cadastrado(s)
                  </DsChip>
                </div>
              </div>

              <!-- Dica contextual -->
              <v-alert
                v-if="etapaStatus(etapa) === 'bloqueada'"
                type="warning"
                variant="tonal"
                density="compact"
                class="mt-3 mb-0"
                icon="mdi-lock"
                rounded="0"
              >
                Complete as etapas anteriores antes de prosseguir.
              </v-alert>

              <v-alert
                v-else-if="etapaStatus(etapa) === 'disponivel' && etapa.count === 0"
                type="info"
                variant="tonal"
                density="compact"
                class="mt-3 mb-0"
                icon="mdi-lightbulb-outline"
                rounded="0"
              >
                {{ etapa.dica }}
              </v-alert>

              <!-- Ações -->
              <div class="etapa-acoes">
                <DsBtn
                  :color="etapa.color"
                  variant="flat"
                  :prepend-icon="etapaStatus(etapa) === 'completa' ? 'mdi-plus' : 'mdi-plus-circle'"
                  :to="etapa.rotaCadastro"
                  :disabled="etapaStatus(etapa) === 'bloqueada'"
                  size="small"
                >
                  {{ etapa.labelBotao }}
                </DsBtn>
                <DsBtn
                  variant="text"
                  size="small"
                  :to="etapa.rotaLista"
                  :disabled="etapaStatus(etapa) === 'bloqueada'"
                  append-icon="mdi-arrow-right"
                >
                  Ver todos ({{ etapa.count }})
                </DsBtn>
              </div>
            </div>
          </div>
        </v-card>
      </div>
    </div>

    <!-- Ação final -->
    <v-card
      v-if="prontoParaOperar && !loading"
      flat
      class="mt-6 pa-6 text-center"
      style="border: 2px solid var(--v-theme-success); background: rgb(var(--v-theme-success), 0.04);"
    >
      <v-icon icon="mdi-play-circle" size="48" color="success" class="mb-3" />
      <h2 class="text-h6 font-weight-bold mb-2">Base pronta para operação</h2>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{ inscricoesPendentes }} inscrição(ões) com status "pendente" disponível(is) para a prova ativa.
      </p>
      <DsBtn
        color="success"
        size="large"
        prepend-icon="mdi-play-circle-outline"
        to="/prova-ativa"
      >
        Ir para Operação da Prova
      </DsBtn>
    </v-card>
  </div>
</template>

<style scoped>
.etapas-flow {
  display: flex;
  flex-direction: column;
}

.etapa-item {
  position: relative;
}

.etapa-conector {
  display: flex;
  justify-content: center;
  padding: 0;
  margin-left: 27px;
}

.conector-line {
  width: 3px;
  height: 24px;
  background: var(--ds-border);
  border-radius: 0;
}

.conector-completo {
  background: #4caf50;
}

.etapa-card {
  border: 1px solid var(--ds-border);
  box-shadow: none;
  transition: border-color 0.2s;
}

.etapa-card:hover {
  border-color: var(--ds-blue);
}

.etapa-completa {
  border-color: #4caf50;
  background: rgba(76, 175, 80, 0.03);
}

.etapa-bloqueada {
  opacity: 0.55;
  pointer-events: none;
}

.etapa-bloqueada .etapa-acoes .v-btn {
  pointer-events: auto;
}

.etapa-card-inner {
  display: flex;
  align-items: flex-start;
  padding: 1.25rem;
  gap: 1.25rem;
}

.etapa-indicador {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.etapa-numero {
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

.etapa-conteudo {
  flex: 1;
  min-width: 0;
}

.etapa-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.etapa-titulo {
  font-size: 1rem;
  font-weight: 700;
  color: var(--ds-black);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.etapa-descricao {
  font-size: 0.85rem;
  color: var(--ds-gray);
  margin: 0;
  line-height: var(--ds-line-height-heading);
}

.etapa-contagem {
  flex-shrink: 0;
}

.etapa-acoes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
</style>
