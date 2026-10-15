<script setup>
import Icon from './Icon.vue';
import { useTheme } from '@/composables/useTheme';

const { theme, toggle } = useTheme();
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="theme === 'dark' ? 'Passer en thème clair' : 'Passer en thème sombre'"
    :title="theme === 'dark' ? 'Thème clair' : 'Thème sombre'"
    @click="toggle"
  >
    <Icon name="sun" class="sun" />
    <Icon name="moon" class="moon" />
  </button>
</template>

<style scoped>
.theme-toggle {
  position: relative;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--soft);
  color: var(--ink);
  flex: none;
  transition:
    transform 0.3s var(--ease),
    background 0.2s;
}

.theme-toggle:hover {
  transform: rotate(-20deg);
  background: var(--soft-2);
}

.theme-toggle .icon {
  position: absolute;
  width: 17px;
  height: 17px;
  transition:
    opacity 0.3s,
    transform 0.4s var(--ease);
}

.moon {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}

:global(html[data-theme='dark']) .sun {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}

:global(html[data-theme='dark']) .moon {
  opacity: 1;
  transform: none;
}
</style>
