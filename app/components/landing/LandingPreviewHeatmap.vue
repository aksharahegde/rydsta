<script setup lang="ts">
const levels = [0, 0, 1, 2, 3, 4, 1, 2, 0, 3, 2, 1, 0, 4, 2, 1, 3, 0, 2, 1, 4, 3, 2, 1, 0, 2, 3, 1, 4, 2, 0, 1, 3, 2, 4, 1, 0, 2, 3, 1, 2, 0] as const
</script>

<template>
  <div
    class="rw-landing-preview rw-landing-preview-heatmap"
    aria-hidden="true"
  >
    <div class="rw-landing-preview-heatmap__grid">
      <span
        v-for="(level, i) in levels"
        :key="i"
        class="rw-landing-preview-heatmap__cell"
        :data-level="level"
      />
    </div>
    <p class="rw-landing-preview-heatmap__label">Busiest: Friday nights</p>
  </div>
</template>

<style scoped>
.rw-landing-preview-heatmap {
  padding: var(--space-sm);
  gap: var(--space-xs);
}

.rw-landing-preview-heatmap__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  width: 100%;
}

.rw-landing-preview-heatmap__cell {
  aspect-ratio: 1;
  border-radius: 2px;
  background: var(--heatmap-0);
  border: 1px solid var(--heatmap-0-border);
}

.rw-landing-preview-heatmap__cell[data-level="1"] { background: var(--heatmap-1); border-color: transparent; }
.rw-landing-preview-heatmap__cell[data-level="2"] { background: var(--heatmap-2); border-color: transparent; }
.rw-landing-preview-heatmap__cell[data-level="3"] { background: var(--heatmap-3); border-color: transparent; }
.rw-landing-preview-heatmap__cell[data-level="4"] { background: var(--heatmap-4); border-color: transparent; }

.rw-landing-preview-heatmap__label {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}
</style>
