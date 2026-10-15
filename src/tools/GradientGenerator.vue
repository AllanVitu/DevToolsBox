<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import CopyButton from '@/components/CopyButton.vue';
import Segmented from '@/components/Segmented.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { randomInt } from '@/lib/random';

const type = usePersistentRef('gradient:type', 'linear');
const angle = usePersistentRef('gradient:angle', 135);
const space = usePersistentRef('gradient:space', 'oklch');
const stops = usePersistentRef('gradient:stops', [
  { color: '#5b5bf0', pos: 0 },
  { color: '#10b981', pos: 100 },
]);

const value = computed(() => {
  const list = [...stops.value].sort((a, b) => a.pos - b.pos).map((s) => `${s.color} ${s.pos}%`).join(', ');
  const interp = space.value === 'srgb' ? '' : ` in ${space.value}`;
  if (type.value === 'radial') return `radial-gradient(circle${interp}, ${list})`;
  if (type.value === 'conic') return `conic-gradient(from ${angle.value}deg${interp}, ${list})`;
  return `linear-gradient(${angle.value}deg${interp}, ${list})`;
});
const css = computed(() => `background: ${value.value};`);

function add() {
  if (stops.value.length < 6) stops.value.push({ color: '#f5a524', pos: 50 });
}
function remove(i) {
  if (stops.value.length > 2) stops.value.splice(i, 1);
}
function shuffle() {
  const hex = () => '#' + Array.from({ length: 3 }, () => randomInt(256).toString(16).padStart(2, '0')).join('');
  stops.value = [
    { color: hex(), pos: 0 },
    { color: hex(), pos: 100 },
  ];
  angle.value = randomInt(360);
}
</script>

<template>
  <ToolShell>
    <div class="preview" :style="{ background: value }" />
    <div class="toolbar mt">
      <Segmented
        v-model="type"
        :options="[
          { value: 'linear', label: 'Linéaire' },
          { value: 'radial', label: 'Radial' },
          { value: 'conic', label: 'Conique' },
        ]"
        label="Type"
      />
      <label v-if="type !== 'radial'" class="inline-field angle">
        Angle {{ angle }}°
        <input v-model.number="angle" type="range" min="0" max="360" />
      </label>
      <label class="inline-field">
        Interpolation
        <select v-model="space">
          <option value="oklch">oklch (pas de gris au milieu)</option>
          <option value="oklab">oklab</option>
          <option value="srgb">sRGB (classique)</option>
        </select>
      </label>
      <button class="btn btn--sm" type="button" @click="shuffle"><Icon name="shuffle" /> Aléatoire</button>
    </div>
    <div class="stops">
      <div v-for="(s, i) in stops" :key="i" class="stop">
        <input v-model="s.color" type="color" :aria-label="`Couleur ${i + 1}`" />
        <input v-model="s.color" type="text" spellcheck="false" class="hex" :aria-label="`Couleur ${i + 1} (hex)`" />
        <input v-model.number="s.pos" type="range" min="0" max="100" :aria-label="`Position ${i + 1}`" />
        <span class="pos">{{ s.pos }} %</span>
        <button class="btn btn--sm btn--icon btn--ghost" type="button" :disabled="stops.length <= 2" :aria-label="`Retirer la couleur ${i + 1}`" @click="remove(i)"><Icon name="x" /></button>
      </div>
      <button class="btn btn--sm" type="button" :disabled="stops.length >= 6" @click="add"><Icon name="plus" /> Ajouter une couleur</button>
    </div>
    <div class="out mt">
      <div class="out-head">
        <span class="label">CSS</span>
        <CopyButton :value="css" />
      </div>
      <code class="code-out">{{ css }}</code>
    </div>
    <p class="hint mt">« in oklch » (CSS Color 4, supporté par tous les navigateurs récents) évite la zone grise et terne qu’on obtient en sRGB entre deux couleurs opposées.</p>
  </ToolShell>
</template>

<style scoped>
.preview {
  height: 200px;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
}

.angle input {
  width: 160px;
  padding: 0;
}

.stops {
  display: grid;
  gap: 8px;
}

.stop {
  display: grid;
  grid-template-columns: auto 120px minmax(0, 1fr) 54px auto;
  align-items: center;
  gap: 10px;
}

.hex {
  font-family: var(--font-mono);
  font-size: 13px;
  padding: 8px 10px;
}

.pos {
  font: 500 13px var(--font-mono);
  color: var(--muted);
}

@media (max-width: 560px) {
  .stop {
    grid-template-columns: auto minmax(0, 1fr) auto;
  }

  .stop input[type='range'],
  .stop .pos {
    grid-column: 1 / -1;
  }
}
</style>
