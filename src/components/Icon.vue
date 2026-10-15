<script setup>
import ICONS, { FILLED } from '@/lib/icons';

defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: null },
  label: { type: String, default: '' },
});
</script>

<template>
  <svg
    class="icon"
    viewBox="0 0 24 24"
    :width="size || undefined"
    :height="size || undefined"
    :data-filled="FILLED.has(name) ? '' : undefined"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
    focusable="false"
    v-html="ICONS[name] || ''"
  />
</template>
