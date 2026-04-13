<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  icon: string
  to?: string
}>()
</script>

<template>
  <v-card :to="to" class="stat-card text-center" flat>
    <v-icon :icon="icon" size="36" color="primary" class="mb-2" />
    <div class="stat-value">{{ value }}</div>
    <div class="stat-label">{{ title }}</div>
  </v-card>
</template>

<style scoped>
.stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.25rem;
    color: var(--ds-black);
}

.stat-label {
    font-size: 0.8rem;
    color: var(--ds-gray);
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

@media (max-width: 600px) {
    .stat-value {
        font-size: 1.35rem;
    }
    .stat-label {
        font-size: 0.7rem;
    }
}
</style>
