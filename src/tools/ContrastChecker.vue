<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { contrastRatio, parseColor, rgbToHex } from '@/lib/color';

const fg = usePersistentRef('contrast:fg', '#111216');
const bg = usePersistentRef('contrast:bg', '#eeeef1');

const a = computed(() => parseColor(fg.value));
const b = computed(() => parseColor(bg.value));
const ratio = computed(() => (a.value && b.value ? contrastRatio(a.value, b.value) : null));

const checks = computed(() => {
  if (!ratio.value) return [];
  const r = ratio.value;
  return [
    { label: 'AA · texte normal', need: 4.5, pass: r >= 4.5 },
    { label: 'AA · grand texte (24 px, ou 18,7 px gras)', need: 3, pass: r >= 3 },
    { label: 'AA · composants & icônes (1.4.11)', need: 3, pass: r >= 3 },
    { label: 'AAA · texte normal', need: 7, pass: r >= 7 },
    { label: 'AAA · grand texte', need: 4.5, pass: r >= 4.5 },
  ];
});

function swap() {
  [fg.value, bg.value] = [bg.value, fg.value];
}
</script>

<template>
  <ToolShell>
    <div class="preview" :style="{ background: b ? rgbToHex(b) : '#fff', color: a ? rgbToHex(a) : '#000' }">
      <p class="big">Texte d’exemple Aa</p>
      <p class="small">Le petit texte doit rester lisible — 0123456789.</p>
      <span class="icon-demo"><Icon name="star" /> Icône</span>
    </div>

    <div class="pickers mt">
      <div class="field">
        <label class="label" for="c-fg">Texte (premier plan)</label>
        <div class="row nowrap">
          <input type="color" :value="a ? rgbToHex(a).slice(0, 7) : '#000000'" aria-label="Couleur du texte" @input="fg = $event.target.value" />
          <input id="c-fg" v-model="fg" type="text" spellcheck="false" />
        </div>
      </div>
      <button class="btn btn--icon swap" type="button" aria-label="Inverser les couleurs" @click="swap"><Icon name="arrow-left-right" /></button>
      <div class="field">
        <label class="label" for="c-bg">Fond</label>
        <div class="row nowrap">
          <input type="color" :value="b ? rgbToHex(b).slice(0, 7) : '#ffffff'" aria-label="Couleur du fond" @input="bg = $event.target.value" />
          <input id="c-bg" v-model="bg" type="text" spellcheck="false" />
        </div>
      </div>
    </div>

    <p v-if="!ratio" class="alert alert--error mt"><Icon name="circle-x" /> <span>Saisis deux couleurs valides (HEX, rgb(), hsl() ou oklch()).</span></p>
    <div v-else class="result mt">
      <p class="ratio"><strong>{{ ratio.toFixed(2) }}</strong> : 1</p>
      <ul class="checks">
        <li v-for="c in checks" :key="c.label" :class="{ pass: c.pass }">
          <Icon :name="c.pass ? 'circle-check' : 'circle-x'" />
          <span>{{ c.label }}</span>
          <span class="need">≥ {{ c.need }}</span>
        </li>
      </ul>
    </div>
    <p class="hint mt">Formule WCAG 2.2 (luminance relative). Les seuils s’appliquent au texte réellement affiché : vérifie aussi les états survol et désactivé.</p>
  </ToolShell>
</template>

<style scoped>
.preview {
  display: grid;
  gap: 6px;
  padding: 28px;
  border-radius: var(--r-lg);
  border: 1px solid var(--line);
}

.big {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.small {
  font-size: 14px;
}

.icon-demo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.pickers {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: end;
  gap: 12px;
}

.nowrap {
  flex-wrap: nowrap;
}

.result {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 24px;
  align-items: center;
}

.ratio {
  font-size: 22px;
  color: var(--muted);
}

.ratio strong {
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: var(--ink);
}

.checks {
  display: grid;
  gap: 6px;
}

.checks li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--r-md);
  background: color-mix(in srgb, var(--danger-fill) 9%, transparent);
  color: var(--danger);
  font-weight: 600;
  font-size: 14px;
}

.checks li.pass {
  background: color-mix(in srgb, var(--ok-fill) 11%, transparent);
  color: var(--ok);
}

.need {
  margin-left: auto;
  font: 500 12px var(--font-mono);
}

@media (max-width: 700px) {
  .pickers,
  .result {
    grid-template-columns: minmax(0, 1fr);
  }

  .swap {
    justify-self: center;
    transform: rotate(90deg);
  }
}
</style>
