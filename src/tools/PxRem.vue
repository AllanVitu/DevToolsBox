<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import CopyButton from '@/components/CopyButton.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';

const base = usePersistentRef('pxrem:base', 16);
const px = usePersistentRef('pxrem:px', 24);
const rem = usePersistentRef('pxrem:rem', 1.5);

const fmt = (n) => (Number.isFinite(n) ? String(Number(n.toFixed(4))) : '—');
const root = computed(() => Number(base.value) || 16);
const pxToRem = computed(() => fmt(Number(px.value) / root.value));
const remToPx = computed(() => fmt(Number(rem.value) * root.value));
const table = computed(() => [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64].map((p) => ({ px: p, rem: fmt(p / root.value) })));
</script>

<template>
  <ToolShell>
    <div class="field base">
      <label class="label" for="rem-base">Taille de police racine (1 rem =)</label>
      <div class="row nowrap">
        <input id="rem-base" v-model.number="base" type="number" min="1" />
        <span class="unit">px</span>
      </div>
    </div>

    <div class="io mt">
      <section class="panel conv">
        <label class="field">
          <span class="label">Pixels</span>
          <span class="row nowrap"><input v-model.number="px" type="number" step="any" /> <span class="unit">px</span></span>
        </label>
        <div class="result">
          <code>{{ pxToRem }}rem</code>
          <CopyButton :value="`${pxToRem}rem`" label="" icon-only />
        </div>
      </section>
      <section class="panel conv">
        <label class="field">
          <span class="label">rem</span>
          <span class="row nowrap"><input v-model.number="rem" type="number" step="0.125" /> <span class="unit">rem</span></span>
        </label>
        <div class="result">
          <code>{{ remToPx }}px</code>
          <CopyButton :value="`${remToPx}px`" label="" icon-only />
        </div>
      </section>
    </div>

    <h2 class="label mt">Table de référence (base {{ root }} px)</h2>
    <div class="ref">
      <div v-for="r in table" :key="r.px" class="cell">
        <span>{{ r.px }} px</span>
        <code>{{ r.rem }} rem</code>
      </div>
    </div>
  </ToolShell>
</template>

<style scoped>
.base {
  max-width: 280px;
}

.nowrap {
  flex-wrap: nowrap;
}

.unit {
  font: 500 14px var(--font-mono);
  color: var(--muted);
}

.conv {
  display: grid;
  gap: 14px;
}

.result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--r-md);
  background: var(--tile);
  border: 1px solid var(--line);
}

.result code {
  font-size: 22px;
  font-weight: 700;
}

.ref {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.cell {
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: var(--tile-2);
  border: 1px solid var(--line);
  font-size: 13px;
  color: var(--muted);
}

.cell code {
  color: var(--ink);
  font-weight: 600;
}
</style>
