<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import CopyButton from '@/components/CopyButton.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { contrastRatio, formats, parseColor, rgbToHex } from '@/lib/color';

const input = usePersistentRef('color:hex', '#5b5bf0');
const rgb = computed(() => parseColor(input.value));
const out = computed(() => (rgb.value ? formats(rgb.value) : null));
const swatch = computed(() => (rgb.value ? rgbToHex(rgb.value) : '#000000'));
const onWhite = computed(() => (rgb.value ? contrastRatio(rgb.value, { r: 255, g: 255, b: 255 }).toFixed(2) : '—'));
const onBlack = computed(() => (rgb.value ? contrastRatio(rgb.value, { r: 0, g: 0, b: 0 }).toFixed(2) : '—'));

const ROWS = [
  ['hex', 'HEX'],
  ['rgb', 'RGB'],
  ['hsl', 'HSL'],
  ['oklch', 'OKLCH'],
];
</script>

<template>
  <ToolShell>
    <div class="layout">
      <label class="preview" :style="{ background: rgb ? swatch : 'var(--soft)' }">
        <input type="color" :value="swatch.slice(0, 7)" aria-label="Choisir une couleur" @input="input = $event.target.value" />
        <span class="pick"><Icon name="pipette" /> Choisir</span>
      </label>
      <div class="fields">
        <div class="field">
          <label class="label" for="color-in">Couleur (HEX, rgb(), hsl() ou oklch())</label>
          <input id="color-in" v-model="input" type="text" spellcheck="false" placeholder="#5b5bf0 · rgb(91 91 240) · oklch(58% 0.21 277)" />
        </div>
        <p v-if="!rgb" class="alert alert--error"><Icon name="circle-x" /> <span>Format non reconnu. Exemples : #41b883, rgb(65 184 131), hsl(153 47% 49%), oklch(70% 0.14 160).</span></p>
        <div v-else class="kv">
          <div v-for="[key, label] in ROWS" :key="key" class="kv-row">
            <span>{{ label }}</span>
            <code>{{ out[key] }}</code>
            <CopyButton :value="out[key]" label="" icon-only />
          </div>
        </div>
        <div v-if="rgb" class="row">
          <span class="chip">Contraste sur blanc : {{ onWhite }}:1</span>
          <span class="chip">sur noir : {{ onBlack }}:1</span>
        </div>
      </div>
    </div>
    <p class="hint mt">
      OKLCH (luminosité, chroma, teinte) est perceptuellement régulier : en gardant L fixe et en tournant la teinte, toutes les couleurs
      paraissent aussi claires. C’est l’espace idéal pour des design tokens (thème clair / sombre, palettes d’accent).
    </p>
  </ToolShell>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.preview {
  position: relative;
  display: grid;
  place-items: end start;
  aspect-ratio: 1;
  padding: 14px;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
  cursor: pointer;
}

.preview input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.pick {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: var(--r-full);
  background: rgba(255, 255, 255, 0.9);
  color: #111;
  font-size: 13px;
  font-weight: 650;
}

.fields {
  display: grid;
  gap: 14px;
}

@media (max-width: 760px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .preview {
    aspect-ratio: 3;
  }
}
</style>
