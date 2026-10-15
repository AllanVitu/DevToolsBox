<script setup>
import Icon from './Icon.vue';
import { useClipboard } from '@/composables/useClipboard';

const props = defineProps({ build: { type: Function, required: true } });
const { copied, copy } = useClipboard(1800);
</script>

<template>
  <button
    class="btn"
    type="button"
    :class="{ 'is-on': copied }"
    title="Copier un lien qui rouvre cet outil avec ta saisie"
    @click="copy(props.build())"
  >
    <Icon :name="copied ? 'check' : 'share-2'" />
    <span>{{ copied ? 'Lien copié' : 'Partager' }}</span>
  </button>
</template>
