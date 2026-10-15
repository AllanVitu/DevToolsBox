<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Icon from './Icon.vue';
import { TOOLS } from '@/data/tools';
import { usePipeline } from '@/composables/usePipeline';

const props = defineProps({
  output: { type: String, default: '' },
  emitType: { type: String, default: '' },
});

// Types qu'on peut aussi confier à l'assistant IA.
const AI_TYPES = ['json', 'sql', 'text', 'ts', 'yaml', 'csv', 'xml'];

const route = useRoute();
const router = useRouter();
const { send } = usePipeline();
const open = ref(false);
const root = ref(null);

const targets = computed(() => {
  if (!props.emitType) return [];
  const list = TOOLS.filter((t) => t.accepts?.includes(props.emitType) && t.id !== route.meta.tool).map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    path: `/${t.id}`,
  }));
  if (AI_TYPES.includes(props.emitType)) list.push({ id: 'ai', name: 'Assistant IA', icon: 'sparkles', path: '/ai' });
  return list;
});

function go(target) {
  send(route.meta.tool, props.output, props.emitType);
  open.value = false;
  router.push(target.path);
}

function onDocClick(event) {
  if (root.value && !root.value.contains(event.target)) open.value = false;
}

onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<template>
  <div v-if="targets.length && output" ref="root" class="pipe">
    <button class="btn" type="button" :aria-expanded="open" aria-haspopup="menu" @click="open = !open">
      <Icon name="send" />
      <span>Envoyer vers</span>
      <Icon name="chevron-down" />
    </button>
    <Transition name="pop">
      <div v-if="open" class="menu" role="menu">
        <button v-for="t in targets" :key="t.id" class="menu-item" role="menuitem" type="button" @click="go(t)">
          <Icon :name="t.icon" />
          <span>{{ t.name }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.pipe {
  position: relative;
}

.menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  z-index: 30;
  min-width: 240px;
  padding: 6px;
  border-radius: var(--r-lg);
  background: var(--tile);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-pop);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}

.menu-item:hover,
.menu-item:focus-visible {
  background: color-mix(in srgb, var(--accent-fill) 12%, transparent);
}

.menu-item .icon {
  width: 16px;
  height: 16px;
  color: var(--accent);
}

.pop-enter-active,
.pop-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.2s var(--ease);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 860px) {
  .menu {
    right: auto;
    left: 0;
  }
}
</style>
