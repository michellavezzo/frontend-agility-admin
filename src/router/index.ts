import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/DashboardView.vue'),
        },

        // ── Prova Ativa (Operação) ──
        {
            path: '/prova-ativa',
            name: 'prova-ativa',
            component: () => import('@/views/prova-ativa/ProvaAtivaView.vue'),
        },

        // ── Users ──
        {
            path: '/users',
            name: 'users',
            component: () => import('@/views/users/UsersListView.vue'),
        },
        {
            path: '/users/novo',
            name: 'users-create',
            component: () => import('@/views/users/UserFormView.vue'),
        },
        {
            path: '/users/:id',
            name: 'users-edit',
            component: () => import('@/views/users/UserFormView.vue'),
        },

        // ── Competições ──
        {
            path: '/competicoes',
            name: 'competicoes',
            component: () => import('@/views/competicoes/CompeticoesListView.vue'),
        },
        {
            path: '/competicoes/nova',
            name: 'competicoes-create',
            component: () => import('@/views/competicoes/CompeticaoFormView.vue'),
        },
        {
            path: '/competicoes/:id',
            name: 'competicoes-edit',
            component: () => import('@/views/competicoes/CompeticaoFormView.vue'),
        },

        // ── Provas ──
        {
            path: '/provas',
            name: 'provas',
            component: () => import('@/views/provas/ProvasListView.vue'),
        },
        {
            path: '/provas/nova',
            name: 'provas-create',
            component: () => import('@/views/provas/ProvaFormView.vue'),
        },
        {
            path: '/provas/:id',
            name: 'provas-edit',
            component: () => import('@/views/provas/ProvaFormView.vue'),
        },

        // ── Competidores ──
        {
            path: '/competidores',
            name: 'competidores',
            component: () => import('@/views/competidores/CompetidoresListView.vue'),
        },
        {
            path: '/competidores/novo',
            name: 'competidores-create',
            component: () => import('@/views/competidores/CompetidorFormView.vue'),
        },
        {
            path: '/competidores/:id',
            name: 'competidores-edit',
            component: () => import('@/views/competidores/CompetidorFormView.vue'),
        },

        // ── Cães ──
        {
            path: '/caes',
            name: 'caes',
            component: () => import('@/views/caes/CaesListView.vue'),
        },
        {
            path: '/caes/novo',
            name: 'caes-create',
            component: () => import('@/views/caes/CaoFormView.vue'),
        },
        {
            path: '/caes/:microchip',
            name: 'caes-edit',
            component: () => import('@/views/caes/CaoFormView.vue'),
        },

        // ── Juízes ──
        {
            path: '/juizes',
            name: 'juizes',
            component: () => import('@/views/juizes/JuizesListView.vue'),
        },
        {
            path: '/juizes/novo',
            name: 'juizes-create',
            component: () => import('@/views/juizes/JuizFormView.vue'),
        },
        {
            path: '/juizes/:id',
            name: 'juizes-edit',
            component: () => import('@/views/juizes/JuizFormView.vue'),
        },

        // ── Inscrições ──
        {
            path: '/inscricoes',
            name: 'inscricoes',
            component: () => import('@/views/inscricoes/InscricoesListView.vue'),
        },
        {
            path: '/inscricoes/nova',
            name: 'inscricoes-create',
            component: () => import('@/views/inscricoes/InscricaoFormView.vue'),
        },
        {
            path: '/inscricoes/:id',
            name: 'inscricoes-edit',
            component: () => import('@/views/inscricoes/InscricaoFormView.vue'),
        },

        // ── Resultados ──
        {
            path: '/resultados',
            name: 'resultados',
            component: () => import('@/views/resultados/ResultadosListView.vue'),
        },
        {
            path: '/resultados/novo',
            name: 'resultados-create',
            component: () => import('@/views/resultados/ResultadoFormView.vue'),
        },
        {
            path: '/resultados/:id',
            name: 'resultados-edit',
            component: () => import('@/views/resultados/ResultadoFormView.vue'),
        },

        // ── Avaliações ──
        {
            path: '/avaliacoes',
            name: 'avaliacoes',
            component: () => import('@/views/avaliacoes/AvaliacoesListView.vue'),
        },
        {
            path: '/avaliacoes/nova',
            name: 'avaliacoes-create',
            component: () => import('@/views/avaliacoes/AvaliacaoFormView.vue'),
        },
        {
            path: '/avaliacoes/:id',
            name: 'avaliacoes-edit',
            component: () => import('@/views/avaliacoes/AvaliacaoFormView.vue'),
        },

        // ── Cronometragens ──
        {
            path: '/cronometragens',
            name: 'cronometragens',
            component: () => import('@/views/cronometragens/CronometragensListView.vue'),
        },
        {
            path: '/cronometragens/nova',
            name: 'cronometragens-create',
            component: () => import('@/views/cronometragens/CronometragemFormView.vue'),
        },
        {
            path: '/cronometragens/:id',
            name: 'cronometragens-edit',
            component: () => import('@/views/cronometragens/CronometragemFormView.vue'),
        },
    ],
})

export default router
