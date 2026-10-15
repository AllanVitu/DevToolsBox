<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import CopyButton from '@/components/CopyButton.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { hexToRgb } from '@/lib/color';

const x = usePersistentRef('boxshadow:x', 0);
const y = usePersistentRef('boxshadow:y', 22);
const blur = usePersistentRef('boxshadow:blur', 50);
const spread = usePersistentRef('boxshadow:spread', 0);
const color = usePersistentRef('boxshadow:color', '#111228');
const opacity = usePersistentRef('boxshadow:opacity', 12);
const inset = usePersistentRef('boxshadow:inset', false);

const shadow = computed(() => {
  const rgb = hexToRgb(color.value) || { r: 0, g: 0, b: 0 };
  return `${inset.value ? 'inset ' : ''}${x.value}px ${y.value}px ${blur.value}px ${spread.value}px rgb(${rgb.r} ${rgb.g} ${rgb.b} / ${opacity.value}%)`;
});
const css = computed(() => `box-shadow: ${shadow.value};`);

const SLIDERS = [
  { model: x, label: 'Décalage X', min: -60, max: 60 },
  { model: y, label: 'Décalage Y', min: -60, max: 60 },
  { model: blur, label: 'Flou', min: 0, max: 120 },
  { model: spread, label: 'Étalement', min: -40, max: 40 },
];
</script>

<template>
  <ToolShell>
    <div class="stage">
      <div class="demo" :style="{ boxShadow: shadow }">Aperçu</div>
    </div>
    <div class="controls mt">
      <label v-for="s in SLIDERS" :key="s.label" class="ctrl">
        <span class="label">{{ s.label }} : {{ s.model.value }} px</span>
        <input v-model.number="s.model.value" type="range" :min="s.min" :max="s.max" />
      </label>
      <label class="ctrl">
        <span class="label">Opacité : {{ opacity }} %</span>
        <input v-model.number="opacity" type="range" min="0" max="100" />
      </label>
      <div class="ctrl">
        <span class="label">Couleur</span>
        <div class="row">
          <input v-model="color" type="color" aria-label="Couleur de l’ombre" />
          <label class="check"><input v-model="inset" type="checkbox" /> Intérieure (inset)</label>
        </div>
      </div>
    </div>
    <div class="out mt">
      <div class="out-head">
        <span class="label">CSS</span>
        <CopyButton :value="css" />
      </div>
      <code class="code-out">{{ css }}</code>
    </div>
    <p class="hint mt">Une ombre douce et très diffuse (grand flou, faible opacité) donne l’effet « tuile qui flotte » des interfaces modernes.</p>
  </ToolShell>
</template>

<style scoped>
.stage {
  display: grid;
  place-items: center;
  min-height: 240px;
  border-radius: var(--r-lg);
  background: var(--bg);
  border: 1px solid var(--line);
}

.demo {
  display: grid;
  place-items: center;
  width: 200px;
  height: 130px;
  border-radius: 24px;
  background: var(--tile);
  font-weight: 700;
  color: var(--muted);
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.ctrl {
  display: grid;
  gap: 8px;
}
</style>
