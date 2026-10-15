<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Icon from './Icon.vue';
import ThemeToggle from './ThemeToggle.vue';

defineEmits(['open-palette', 'open-settings']);

const NAV = [
  { to: '/dashboard', label: 'Tableau de bord', icon: 'layout-dashboard', section: 'dashboard' },
  { to: '/outils', label: 'Outils', icon: 'wrench', section: 'tools' },
  { to: '/apprendre', label: 'Apprendre', icon: 'graduation-cap', section: 'learn' },
  { to: '/aide-memoire', label: 'Aide-mémoire', icon: 'notebook-text', section: 'cheats' },
  { to: '/snippets', label: 'Snippets', icon: 'bookmark', section: 'snippets' },
  { to: '/ai', label: 'Assistant IA', icon: 'sparkles', section: 'ai' },
];

const route = useRoute();
const menuOpen = ref(false);
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
);
</script>

<template>
  <header class="app-header">
    <div class="bar">
      <RouterLink to="/" class="brand" aria-label="DevToolbox — accueil">
        <span class="brand-mark" aria-hidden="true"><Icon name="code-xml" /></span>
        <span class="brand-name">DevToolbox</span>
      </RouterLink>

      <nav class="nav" aria-label="Navigation principale">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: route.meta.section === item.section }"
          :aria-current="route.meta.section === item.section ? 'page' : undefined"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="tools">
        <button class="search" type="button" @click="$emit('open-palette')">
          <Icon name="search" />
          <span class="search-text">Rechercher…</span>
          <span class="search-keys" aria-hidden="true"><kbd>{{ isMac ? '⌘' : 'Ctrl' }}</kbd><kbd>K</kbd></span>
          <span class="sr-only">Ouvrir la recherche</span>
        </button>
        <ThemeToggle />
        <button class="btn btn--icon btn--ghost" type="button" aria-label="Réglages et données" title="Réglages & données" @click="$emit('open-settings')">
          <Icon name="settings" />
        </button>
        <button
          class="btn btn--icon btn--ghost menu-btn"
          type="button"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'x' : 'menu'" />
        </button>
      </div>
    </div>

    <Transition name="drop">
      <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Navigation principale">
        <RouterLink
          v-for="item in NAV"
          :key="item.to"
          :to="item.to"
          class="mobile-link"
          :class="{ active: route.meta.section === item.section }"
        >
          <span class="icon-chip"><Icon :name="item.icon" /></span>
          <span>{{ item.label }}</span>
          <Icon name="chevron-right" class="chev" />
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 60;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  backdrop-filter: blur(16px) saturate(150%);
}

.bar {
  max-width: var(--page-max);
  height: var(--header-h);
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 18px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 17px;
  letter-spacing: -0.03em;
  flex: none;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: var(--accent-fill);
  color: var(--on-accent);
  transition: transform 0.4s var(--ease);
}

.brand:hover .brand-mark {
  transform: rotate(-8deg) scale(1.05);
}

.brand-mark .icon {
  width: 19px;
  height: 19px;
}

.nav {
  display: flex;
  gap: 2px;
  margin-right: auto;
}

.nav-link {
  font-size: 14px;
  font-weight: 600;
  padding: 8px 13px;
  border-radius: var(--r-full);
  color: var(--muted);
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s;
}

.nav-link:hover {
  background: var(--soft);
  color: var(--ink);
}

.nav-link.active {
  background: var(--tile);
  color: var(--ink);
  box-shadow: 0 0 0 1px var(--line);
}

.tools {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: none;
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 8px 0 14px;
  border-radius: var(--r-full);
  background: var(--soft);
  color: var(--muted);
  font-size: 14px;
  font-weight: 550;
  transition:
    background 0.2s,
    color 0.2s;
}

.search:hover {
  background: var(--soft-2);
  color: var(--ink);
}

.search .icon {
  width: 16px;
  height: 16px;
}

.search-text {
  min-width: 90px;
  text-align: left;
}

.search-keys {
  display: flex;
  gap: 3px;
}

.menu-btn {
  display: none;
}

.mobile-nav {
  display: grid;
  gap: 6px;
  max-width: var(--page-max);
  margin: 0 auto;
  padding: 4px 16px 16px;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--r-lg);
  background: var(--tile);
  border: 1px solid var(--line);
  font-weight: 650;
}

.mobile-link.active {
  border-color: color-mix(in srgb, var(--accent-fill) 50%, transparent);
}

.mobile-link .chev {
  margin-left: auto;
  color: var(--subtle);
}

.drop-enter-active,
.drop-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s var(--ease);
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1240px) {
  .search-text,
  .search-keys {
    display: none;
  }

  .search {
    width: 40px;
    padding: 0;
    justify-content: center;
  }
}

@media (max-width: 1060px) {
  .nav {
    display: none;
  }

  .tools {
    margin-left: auto;
  }

  .menu-btn {
    display: inline-flex;
  }
}

@media (max-width: 520px) {
  .bar {
    padding: 0 12px;
    gap: 10px;
  }

  .brand-name {
    font-size: 16px;
  }
}
</style>
