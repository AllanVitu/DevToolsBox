<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import OutputBox from '@/components/OutputBox.vue';
import ShareButton from '@/components/ShareButton.vue';
import CopyableCode from '@/components/CopyableCode.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { useShareLink } from '@/composables/useShareLink';
import { harmonies, luminance, oklchScale, parseColor, rgbToHex } from '@/lib/color';

const base = usePersistentRef('palette:base', '#5b5bf0');
const name = usePersistentRef('palette:name', 'accent');
const rgb = computed(() => parseColor(base.value));
const scale = computed(() => (rgb.value ? oklchScale(rgb.value) : []));
const harm = computed(() => (rgb.value ? harmonies(rgb.value) : {}));
const textOn = (hex) => (luminance(parseColor(hex)) > 0.36 ? '#111216' : '#ffffff');

const css = computed(() => [':root {', ...scale.value.map((s) => `  --${name.value || 'accent'}-${s.step}: ${s.hex};`), '}'].join('\n'));

const { buildUrl } = useShareLink(
  () => ({ base: base.value }),
  (s) => typeof s.base === 'string' && (base.value = s.base),
);
</script>

<template>
  <ToolShell>
    <template #actions>
      <ShareButton :build="buildUrl" />
    </template>
    <div class="toolbar">
      <input type="color" :value="rgb ? rgbToHex(rgb).slice(0, 7) : '#000000'" aria-label="Couleur de base" @input="base = $event.target.value" />
      <input v-model="base" type="text" spellcheck="false" class="w-hex" aria-label="Couleur de base (texte)" />
      <label class="inline-field">Nom des variables <input v-model="name" type="text" spellcheck="false" style="width: 140px" /></label>
    </div>
    <p v-if="!rgb" class="alert alert--error"><Icon name="circle-x" /> <span>Couleur invalide (HEX, rgb(), hsl() ou oklch()).</span></p>
    <template v-else>
      <h2 class="label">Échelle 50 → 950 (calculée en OKLCH)</h2>
      <div class="scale">
        <div v-for="s in scale" :key="s.step" class="sw" :style="{ background: s.hex, color: textOn(s.hex) }">
          <span class="step">{{ s.step }}</span>
          <CopyableCode :value="s.hex" />
        </div>
      </div>
      <h2 class="label mt">Harmonies</h2>
      <div class="harm">
        <div v-for="(colors, label) in harm" :key="label" class="h-row">
          <span class="h-label">{{ label }}</span>
          <div class="h-sw">
            <span class="mini" :style="{ background: rgbToHex(rgb) }" :title="rgbToHex(rgb)" />
            <template v-for="c in colors" :key="c">
              <span class="mini" :style="{ background: c }" :title="c" />
              <CopyableCode :value="c" />
            </template>
          </div>
        </div>
      </div>
      <OutputBox class="mt" label="Variables CSS" :value="css" :rows="8" />
    </template>
  </ToolShell>
</template>

<style scoped>
.w-hex {
  width: 160px;
}

.scale {
  display: grid;
  grid-template-columns: repeat(11, minmax(0, 1fr));
  gap: 6px;
  margin-top: 10px;
}

.sw {
  display: grid;
  gap: 18px;
  align-content: space-between;
  min-height: 112px;
  padding: 10px 8px;
  border-radius: var(--r-md);
  border: 1px solid var(--line);
}

.step {
  font: 700 13px var(--font-mono);
}

.sw :deep(.copyable) {
  background: rgba(255, 255, 255, 0.85);
  border-color: transparent;
  padding: 4px 6px;
}

.sw :deep(.copyable code) {
  font-size: 11px;
  color: #111;
}

.harm {
  display: grid;
  gap: 8px;
  margin-top: 10px;
}

.h-row {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--r-md);
  background: var(--tile-2);
  border: 1px solid var(--line);
}

.h-label {
  font-weight: 650;
  font-size: 14px;
}

.h-sw {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.mini {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid var(--line);
}

@media (max-width: 1000px) {
  .scale {
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  }

  .h-row {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
