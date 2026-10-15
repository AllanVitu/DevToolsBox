<script setup>
import { computed } from 'vue';

const props = defineProps({
  percent: { type: Number, default: 0 },
  size: { type: Number, default: 96 },
});
const R = 40;
const C = 2 * Math.PI * R;
const dash = computed(() => `${(Math.min(100, Math.max(0, props.percent)) / 100) * C} ${C}`);
</script>

<template>
  <div class="ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle class="bg" cx="50" cy="50" :r="R" />
      <circle class="fg" cx="50" cy="50" :r="R" :stroke-dasharray="dash" transform="rotate(-90 50 50)" />
    </svg>
    <span class="value">{{ percent }}<small>%</small></span>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  flex: none;
}

svg {
  width: 100%;
  height: 100%;
}

circle {
  fill: none;
  stroke-width: 10;
}

.bg {
  stroke: var(--soft-2);
}

.fg {
  stroke: var(--accent-fill);
  stroke-linecap: round;
  transition: stroke-dasharray 0.8s var(--ease);
}

.value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: -0.04em;
}

.value small {
  font-size: 12px;
  margin-left: 1px;
}
</style>
