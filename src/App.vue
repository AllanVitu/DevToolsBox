<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import CommandPalette from '@/components/CommandPalette.vue';
import SettingsModal from '@/components/SettingsModal.vue';
import ErrorBoundary from '@/components/ErrorBoundary.vue';
import Icon from '@/components/Icon.vue';
import { useAnnounce } from '@/composables/useAnnounce';
import { usePwa } from '@/composables/usePwa';
import { OPEN_PALETTE } from '@/lib/events';

const route = useRoute();
const { message } = useAnnounce();
const { online, updateReady, applyUpdate } = usePwa();

const paletteOpen = ref(false);
const settingsOpen = ref(false);
const mainEl = ref(null);

function focusMain() {
  mainEl.value?.focus();
}

function isTyping(target) {
  return target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
}

function onKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    paletteOpen.value = !paletteOpen.value;
  } else if (event.key === '/' && !isTyping(event.target) && !paletteOpen.value && !settingsOpen.value) {
    event.preventDefault();
    paletteOpen.value = true;
  }
}

function openSettingsFromPalette() {
  paletteOpen.value = false;
  settingsOpen.value = true;
}

watch(
  () => route.fullPath,
  () => (paletteOpen.value = false),
);

const openPaletteFromPage = () => (paletteOpen.value = true);

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
  window.addEventListener(OPEN_PALETTE, openPaletteFromPage);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  window.removeEventListener(OPEN_PALETTE, openPaletteFromPage);
});
</script>

<template>
  <a class="skip-link" href="#main" @click.prevent="focusMain">Aller au contenu</a>
  <AppHeader @open-palette="paletteOpen = true" @open-settings="settingsOpen = true" />

  <main id="main" ref="mainEl" tabindex="-1" class="app-main">
    <ErrorBoundary>
      <RouterView v-slot="{ Component, route: current }">
        <Transition name="route" mode="out-in">
          <component :is="Component" :key="current.path" />
        </Transition>
      </RouterView>
    </ErrorBoundary>
  </main>

  <AppFooter />

  <CommandPalette :open="paletteOpen" @close="paletteOpen = false" @open-settings="openSettingsFromPalette" />
  <SettingsModal :open="settingsOpen" @close="settingsOpen = false" />

  <div class="sr-only" role="status" aria-live="polite">{{ message }}</div>

  <div class="toasts">
    <Transition name="toast">
      <div v-if="!online" class="toast" role="status">
        <Icon name="wifi-off" />
        <span>Hors-ligne — les outils, leçons et fiches restent disponibles.</span>
      </div>
    </Transition>
    <Transition name="toast">
      <div v-if="updateReady" class="toast" role="alert">
        <Icon name="sparkles" />
        <span>Une nouvelle version de DevToolbox est prête.</span>
        <button class="btn btn--accent btn--sm" type="button" @click="applyUpdate">Recharger</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.app-main {
  min-height: calc(100dvh - var(--header-h) - 80px);
  outline: none;
}

.toasts {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 120;
  display: grid;
  gap: 10px;
  justify-items: end;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: min(460px, calc(100vw - 36px));
  padding: 12px 14px 12px 18px;
  border-radius: var(--r-lg);
  background: var(--ink);
  color: var(--tile);
  box-shadow: var(--shadow-pop);
  font-size: 14px;
  font-weight: 550;
}

.toast .icon {
  width: 18px;
  height: 18px;
  flex: none;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
