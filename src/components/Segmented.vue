<script setup>
// Contrôle segmenté (choix exclusif) : v-model + liste d'options { value, label }.
const model = defineModel({ type: [String, Number, Boolean], required: true });
defineProps({
  options: { type: Array, required: true },
  label: { type: String, default: 'Mode' },
});
</script>

<template>
  <div class="seg" role="group" :aria-label="label">
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      :aria-pressed="model === opt.value"
      @click="model = opt.value"
    >
      {{ opt.label }}
    </button>
  </div>
</template>
