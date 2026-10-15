<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import CopyableCode from '@/components/CopyableCode.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { CATEGORIES, convertAll, formatNumber } from '@/lib/units';

const category = usePersistentRef('units:category', 'Longueur');
const value = usePersistentRef('units:value', 1);
const from = usePersistentRef('units:from', 'm');

if (!CATEGORIES[category.value]) category.value = 'Longueur';
const units = computed(() => Object.keys(CATEGORIES[category.value].units));
if (!units.value.includes(from.value)) from.value = units.value[0];

function pick(name) {
  category.value = name;
  from.value = Object.keys(CATEGORIES[name].units)[0];
}

const results = computed(() => convertAll(category.value, Number(value.value), from.value));
</script>

<template>
  <ToolShell>
    <div class="cats" role="group" aria-label="Catégorie">
      <button v-for="name in Object.keys(CATEGORIES)" :key="name" class="chip" :class="{ 'chip--accent': category === name }" type="button" :aria-pressed="category === name" @click="pick(name)">
        {{ name }}
      </button>
    </div>
    <div class="toolbar row--end mt">
      <div class="field grow">
        <label class="label" for="unit-val">Valeur</label>
        <input id="unit-val" v-model.number="value" type="number" step="any" />
      </div>
      <div class="field">
        <label class="label" for="unit-from">Unité</label>
        <select id="unit-from" v-model="from">
          <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
        </select>
      </div>
    </div>
    <div class="grid-res">
      <div v-for="r in results" :key="r.unit" class="res" :class="{ active: r.active }">
        <span class="label">{{ r.unit }}</span>
        <CopyableCode :value="formatNumber(r.value)" />
      </div>
    </div>
    <p v-if="category === 'Données'" class="hint mt">
      Ko, Mo, Go sont des puissances de 1000 (SI) ; Kio, Mio, Gio des puissances de 1024. Un disque « 256 Go » affiche environ 238 Gio dans
      Windows.
    </p>
  </ToolShell>
</template>

<style scoped>
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.grow {
  flex: 1;
  min-width: 200px;
}

.grid-res {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 8px;
}

.res {
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  border-radius: var(--r-md);
  background: var(--tile-2);
  border: 1px solid var(--line);
}

.res.active {
  border-color: var(--accent-fill);
  background: color-mix(in srgb, var(--accent-fill) 9%, var(--tile));
}
</style>
