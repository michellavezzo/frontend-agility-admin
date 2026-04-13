<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="page-header">
    <h1>{{ title }}</h1>
    <div class="page-header__actions">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.page-header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
