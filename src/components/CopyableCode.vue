<script setup>
import Icon from './Icon.vue';
import { useClipboard } from '@/composables/useClipboard';

const props = defineProps({
  value: { type: [String, Number], required: true },
  label: { type: [String, Number], default: '' },
});
const { copied, copy } = useClipboard(1000);
</script>

<template>
  <button
    type="button"
    class="copyable"
    :class="{ copied }"
    :title="`Copier : ${props.value}`"
    :aria-label="`Copier ${props.value}`"
    @click="copy(String(props.value))"
  >
    <code>{{ props.label === '' ? props.value : props.label }}</code>
    <Icon :name="copied ? 'check' : 'copy'" />
  </button>
</template>

<style scoped>
.copyable {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  padding: 6px 10px;
  border-radius: 10px;
  background: var(--tile-2);
  border: 1px solid var(--line);
  text-align: left;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.copyable code {
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
}

.copyable .icon {
  width: 14px;
  height: 14px;
  color: var(--subtle);
  flex: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.copyable:hover,
.copyable:focus-visible {
  border-color: color-mix(in srgb, var(--accent-fill) 50%, transparent);
}

.copyable:hover .icon,
.copyable:focus-visible .icon,
.copyable.copied .icon {
  opacity: 1;
}

.copyable.copied .icon {
  color: var(--ok);
}
</style>
