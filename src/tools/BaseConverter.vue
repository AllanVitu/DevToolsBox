<script setup>
import { computed } from 'vue';
import ToolShell from '@/components/ToolShell.vue';
import Icon from '@/components/Icon.vue';
import CopyButton from '@/components/CopyButton.vue';
import { usePersistentRef } from '@/composables/usePersistentRef';
import { group, parseBigInt, toBase } from '@/lib/numberBase';

const value = usePersistentRef('base:value', '255');
const inputBase = usePersistentRef('base:in', 10);
const customBase = usePersistentRef('base:custom', 36);
const grouped = usePersistentRef('base:group', true);

const parsed = computed(() => parseBigInt(value.value, Number(inputBase.value)));
const rows = computed(() => {
  if (!parsed.value) return [];
  const custom = Math.min(Math.max(Number(customBase.value) || 2, 2), 36);
  return [
    { label: 'Binaire (2)', base: 2 },
    { label: 'Octal (8)', base: 8 },
    { label: 'Décimal (10)', base: 10 },
    { label: 'Hexadécimal (16)', base: 16 },
    { label: `Base ${custom}`, base: custom, custom: true },
  ].map((r) => {
    const raw = toBase(parsed.value.value, r.base);
    return { ...r, raw, shown: grouped.value ? group(raw, r.base) : raw };
  });
});
const bits = computed(() => (parsed.value ? toBase(parsed.value.value < 0n ? -parsed.value.value : parsed.value.value, 2).length : 0));
</script>

<template>
  <ToolShell>
    <div class="toolbar row--end">
      <div class="field grow">
        <label class="label" for="base-in">Valeur</label>
        <input id="base-in" v-model="value" type="text" spellcheck="false" placeholder="255, 0xff, 0b1111_1111…" />
      </div>
      <div class="field">
        <label class="label" for="base-from">Base d’entrée</label>
        <select id="base-from" v-model.number="inputBase">
          <option :value="2">Binaire (2)</option>
          <option :value="8">Octal (8)</option>
          <option :value="10">Décimal (10)</option>
          <option :value="16">Hexadécimal (16)</option>
        </select>
      </div>
      <label class="check"><input v-model="grouped" type="checkbox" /> Grouper les chiffres</label>
    </div>

    <p v-if="!parsed && value.trim()" class="alert alert--error"><Icon name="circle-x" /> <span>« {{ value }} » n’est pas un nombre valide en base {{ inputBase }}.</span></p>
    <div v-else class="kv">
      <div v-for="r in rows" :key="r.label" class="kv-row">
        <span>
          <template v-if="!r.custom">{{ r.label }}</template>
          <label v-else class="custom">Base <input v-model.number="customBase" type="number" min="2" max="36" aria-label="Base personnalisée" /></label>
        </span>
        <code>{{ r.shown }}</code>
        <CopyButton :value="r.raw" label="" icon-only />
      </div>
    </div>
    <p v-if="parsed" class="hint mt">
      Valeur sur {{ bits }} bit{{ bits > 1 ? 's' : '' }} — BigInt : aucune limite de taille, pas d’arrondi comme avec les nombres JavaScript
      au-delà de 2⁵³.
    </p>
  </ToolShell>
</template>

<style scoped>
.grow {
  flex: 1;
  min-width: 220px;
}

.kv-row code {
  font-size: 15px;
}

.custom {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.custom input {
  width: 72px;
  padding: 4px 8px;
}
</style>
