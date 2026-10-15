<script setup>
import Icon from './Icon.vue';
import { useClipboard } from '@/composables/useClipboard';

const props = defineProps({
  value: { type: [String, Number], default: '' },
  label: { type: String, default: 'Copier' },
  small: { type: Boolean, default: true },
  iconOnly: { type: Boolean, default: false },
});

const { copied, copy } = useClipboard();
</script>

<template>
  <button
    class="btn"
    type="button"
    :class="{ 'btn--sm': small, 'btn--icon': iconOnly, 'is-on': copied }"
    :disabled="props.value === '' || props.value == null"
    :aria-label="iconOnly ? (copied ? 'Copié' : label || 'Copier') : undefined"
    :title="iconOnly ? label || 'Copier' : undefined"
    @click="copy(props.value)"
  >
    <Icon :name="copied ? 'check' : 'copy'" />
    <span v-if="!iconOnly">{{ copied ? 'Copié' : label }}</span>
  </button>
</template>
