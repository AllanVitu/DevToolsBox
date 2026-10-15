<script setup>
import CopyButton from './CopyButton.vue';

// Résultat d'un outil : libellé, bouton copier et zone en lecture seule.
defineProps({
  label: { type: String, default: 'Résultat' },
  value: { type: String, default: '' },
  rows: { type: [Number, String], default: 10 },
});
</script>

<template>
  <div class="out">
    <div class="out-head">
      <span class="label">{{ label }}</span>
      <div class="row">
        <slot name="actions" />
        <CopyButton :value="value" />
      </div>
    </div>
    <textarea :value="value" :rows="rows" readonly spellcheck="false" :aria-label="label" />
  </div>
</template>
