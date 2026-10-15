<script setup>
import Icon from './Icon.vue';

defineProps({
  disabled: { type: Boolean, default: false },
  running: { type: Boolean, default: false },
  label: { type: String, default: 'Analyser avec l’IA' },
});
defineEmits(['click']);
</script>

<template>
  <button class="btn" type="button" :disabled="disabled || running" :title="label" @click="$emit('click')">
    <Icon name="sparkles" />
    <span>{{ running ? 'Analyse…' : 'IA' }}</span>
  </button>
</template>
