<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { configApi } from '@/api/config'
import { useNotificationStore } from '@/stores/notification'
import type { IrConfigStatus } from '@/types'
import PageHeader from '@/components/ui/PageHeader.vue'
import DsBtn from '@/components/ui/DsBtn.vue'
import DsChip from '@/components/ui/DsChip.vue'

const notification = useNotificationStore()

const status = ref<IrConfigStatus | null>(null)
const loading = ref(false)
const calibrating = ref(false)

const hardware = computed(() => status.value?.hardware ?? null)
const calibration = computed(() => status.value?.calibration ?? null)
const lastResult = computed(
    () => calibration.value?.last_result ?? status.value?.saved_calibration ?? null,
)
const recommendation = computed(() => lastResult.value?.recommendation ?? null)
const calibrationBlocked = computed(
    () => status.value?.prova_estado === 'autorizado' || status.value?.prova_estado === 'rodando',
)
const canCalibrate = computed(
    () => !loading.value && !calibrating.value && !calibrationBlocked.value,
)
const sensitiveTop = computed(() =>
    [...(lastResult.value?.sensitive ?? [])]
        .sort((a, b) => b.signal_pct - a.signal_pct || b.delta - a.delta)
        .slice(0, 8),
)

function formatSeconds(value: number | null | undefined, digits = 3) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '-'
    return `${value.toFixed(digits)}s`
}

function formatHz(value: number | null | undefined) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '-'
    return `${value.toLocaleString('pt-BR')} Hz`
}

function formatPercent(value: number | null | undefined) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '-'
    return `${value.toFixed(1)}%`
}

function formatDate(value: string | null | undefined) {
    if (!value) return '-'
    return new Date(value).toLocaleString('pt-BR')
}

function cleanError(error: unknown) {
    return (error as Error).message.replace(/^HTTP \d+:\s*/, '')
}

async function loadStatus() {
    loading.value = true
    try {
        status.value = await configApi.getIrStatus()
    } catch (error) {
        notification.notify(cleanError(error), 'error')
    } finally {
        loading.value = false
    }
}

async function runCalibration() {
    calibrating.value = true
    try {
        status.value = await configApi.calibrarIr()
        if (recommendation.value) {
            notification.notify(
                `Calibração IR concluída: ${formatHz(recommendation.value.frequency_hz)}`,
                'success',
            )
        } else {
            notification.notify('Calibração concluída sem frequência recomendada', 'warning')
        }
    } catch (error) {
        notification.notify(cleanError(error), 'error')
        await loadStatus()
    } finally {
        calibrating.value = false
    }
}

onMounted(loadStatus)
</script>

<template>
    <div>
        <PageHeader title="Configuração">
            <DsBtn
                variant="outlined"
                color="primary"
                prepend-icon="mdi-refresh"
                :loading="loading"
                :disabled="calibrating"
                @click="loadStatus"
            >
                Atualizar
            </DsBtn>
        </PageHeader>

        <v-alert
            type="warning"
            variant="tonal"
            density="compact"
            class="mb-5"
            icon="mdi-alert"
            rounded="0"
        >
            {{ status?.electrical_warning ?? 'GPIO da Raspberry Pi aceita apenas 3.3V.' }}
        </v-alert>

        <v-alert
            v-if="calibrationBlocked"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-5"
            icon="mdi-timer-alert-outline"
            rounded="0"
        >
            Calibração IR bloqueada durante prova autorizada ou em andamento.
        </v-alert>

        <v-alert
            v-if="calibrating || calibration?.running"
            type="info"
            variant="tonal"
            density="compact"
            class="mb-5"
            icon="mdi-progress-clock"
            rounded="0"
        >
            Calibrando sensor IR
            <span v-if="calibration?.phase">- {{ calibration.phase }}</span>
            <span v-if="calibration?.frequency_hz"> - {{ formatHz(calibration.frequency_hz) }}</span>
        </v-alert>

        <v-row>
            <v-col cols="12" lg="7">
                <v-card flat class="section-card pa-5 mb-5">
                    <div class="section-title">Hardware IR</div>

                    <div class="status-strip mb-5">
                        <DsChip
                            :color="hardware?.gpio_pronto ? 'success' : 'error'"
                            variant="elevated"
                            size="small"
                            class="text-white"
                        >
                            GPIO {{ hardware?.gpio_pronto ? 'pronto' : 'erro' }}
                        </DsChip>
                        <DsChip
                            :color="hardware?.emissor_ativo ? 'success' : 'warning'"
                            variant="elevated"
                            size="small"
                            class="text-white"
                        >
                            Emissor {{ hardware?.emissor_ativo ? 'ativo' : 'inativo' }}
                        </DsChip>
                        <DsChip
                            :color="hardware?.pigpio_conectado ? 'success' : 'grey'"
                            variant="elevated"
                            size="small"
                            class="text-white"
                        >
                            pigpio {{ hardware?.pigpio_conectado ? 'conectado' : 'offline' }}
                        </DsChip>
                    </div>

                    <div class="metric-grid">
                        <div class="metric-item">
                            <span>Frequência</span>
                            <strong>{{ formatHz(hardware?.frequencia_hz) }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>Duty cycle</span>
                            <strong>{{ formatPercent(hardware?.duty_cycle) }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>PWM</span>
                            <strong>{{ hardware?.emissor_modo ?? hardware?.emissor_pwm_backend ?? '-' }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>Rajada</span>
                            <strong>
                                {{ formatSeconds(hardware?.emissor_rajada_on, 4) }} /
                                {{ formatSeconds(hardware?.emissor_rajada_off, 4) }}
                            </strong>
                        </div>
                        <div class="metric-item">
                            <span>Sensor</span>
                            <strong>GPIO{{ hardware?.sensor_gpio_bcm ?? '-' }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>Emissor</span>
                            <strong>GPIO{{ hardware?.emissor_gpio_bcm ?? '-' }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>Feixe</span>
                            <strong>{{ hardware?.sensor_estado_feixe ?? '-' }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>Nível ativo</span>
                            <strong>{{ hardware?.sensor_active_level ?? '-' }}</strong>
                        </div>
                    </div>

                    <v-alert
                        v-if="hardware?.emissor_erro || hardware?.gpio_erro"
                        type="error"
                        variant="tonal"
                        density="compact"
                        class="mt-5"
                        icon="mdi-alert-circle"
                        rounded="0"
                    >
                        {{ hardware?.emissor_erro || hardware?.gpio_erro }}
                    </v-alert>
                </v-card>
            </v-col>

            <v-col cols="12" lg="5">
                <v-card flat class="section-card pa-5 mb-5">
                    <div class="section-title">Calibração</div>

                    <DsBtn
                        color="primary"
                        size="large"
                        block
                        prepend-icon="mdi-tune-variant"
                        :loading="calibrating"
                        :disabled="!canCalibrate"
                        @click="runCalibration"
                    >
                        Testar e calibrar sensor IR
                    </DsBtn>

                    <div class="metric-grid compact mt-5">
                        <div class="metric-item">
                            <span>Estado</span>
                            <strong>{{ status?.prova_estado ?? '-' }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>Último teste</span>
                            <strong>{{ formatDate(lastResult?.finished_at) }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>Duração</span>
                            <strong>{{ formatSeconds(lastResult?.duration_s) }}</strong>
                        </div>
                        <div class="metric-item">
                            <span>Arquivo</span>
                            <strong>{{ calibration?.store_path ?? '-' }}</strong>
                        </div>
                    </div>

                    <v-alert
                        v-if="calibration?.error"
                        type="error"
                        variant="tonal"
                        density="compact"
                        class="mt-5"
                        icon="mdi-alert-circle"
                        rounded="0"
                    >
                        {{ calibration.error }}
                    </v-alert>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat class="section-card pa-5 mb-5">
            <div class="section-title">Recomendação Aplicada</div>

            <v-table v-if="recommendation" density="compact" class="config-table">
                <tbody>
                    <tr>
                        <th>Frequência</th>
                        <td>{{ formatHz(recommendation.frequency_hz) }}</td>
                        <th>Duty cycle</th>
                        <td>{{ formatPercent(recommendation.duty_cycle) }}</td>
                    </tr>
                    <tr>
                        <th>Rajada</th>
                        <td>
                            {{ formatSeconds(recommendation.burst_on, 4) }} /
                            {{ formatSeconds(recommendation.burst_off, 4) }}
                        </td>
                        <th>Timeout sinal</th>
                        <td>{{ formatSeconds(recommendation.sensor_signal_timeout) }}</td>
                    </tr>
                    <tr>
                        <th>Feixe alinhado</th>
                        <td>{{ recommendation.aligned_level_name }}</td>
                        <th>Feixe quebrado</th>
                        <td>{{ recommendation.break_level_name }}</td>
                    </tr>
                    <tr>
                        <th>Resposta</th>
                        <td>{{ formatPercent(recommendation.scan_signal_pct) }}</td>
                        <th>Delta</th>
                        <td>{{ formatPercent(recommendation.scan_delta) }}</td>
                    </tr>
                </tbody>
            </v-table>

            <v-alert
                v-else
                type="info"
                variant="tonal"
                density="compact"
                icon="mdi-information-outline"
                rounded="0"
            >
                Nenhuma calibração IR salva.
            </v-alert>
        </v-card>

        <v-card v-if="sensitiveTop.length" flat class="section-card pa-5">
            <div class="section-title">Frequências Sensíveis</div>

            <v-table density="compact" class="config-table">
                <thead>
                    <tr>
                        <th>Frequência</th>
                        <th>Nível</th>
                        <th>Sinal</th>
                        <th>Delta</th>
                        <th>Transições</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in sensitiveTop" :key="item.freq">
                        <td>{{ formatHz(item.freq) }}</td>
                        <td>{{ item.signal_level_name }}</td>
                        <td>{{ formatPercent(item.signal_pct) }}</td>
                        <td>{{ formatPercent(item.delta) }}</td>
                        <td>{{ item.stats.transitions ?? '-' }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-card>
    </div>
</template>

<style scoped>
.section-card {
    border: 1px solid var(--ds-border);
}

.section-title {
    color: var(--ds-gray);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 1.2;
    margin-bottom: 1rem;
    text-transform: uppercase;
}

.status-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.metric-grid {
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    background: var(--ds-border);
    border: 1px solid var(--ds-border);
}

.metric-grid.compact {
    grid-template-columns: 1fr;
}

.metric-item {
    min-width: 0;
    background: var(--ds-white);
    padding: 0.85rem;
}

.metric-item span {
    color: var(--ds-gray);
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 1.2;
    margin-bottom: 0.35rem;
    text-transform: uppercase;
}

.metric-item strong {
    display: block;
    font-size: 0.95rem;
    line-height: 1.25;
    overflow-wrap: anywhere;
}

.config-table {
    border: 1px solid var(--ds-border);
}

.config-table th {
    color: var(--ds-gray);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
}

.config-table td {
    font-weight: 600;
}

@media (max-width: 700px) {
    .metric-grid {
        grid-template-columns: 1fr;
    }

    .config-table {
        overflow-x: auto;
    }
}
</style>
