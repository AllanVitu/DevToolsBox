<script setup>
import { computed } from 'vue';
import Icon from './Icon.vue';
import { getFamily } from '@/data/families';
import { useFavorites } from '@/composables/useFavorites';

const props = defineProps({ tool: { type: Object, required: true } });
const { isFavorite, toggleFavorite } = useFavorites();
const favorite = computed(() => isFavorite(props.tool.id));
const accent = computed(() => getFamily(props.tool.family)?.accent);

function star(event) {
  event.preventDefault();
  event.stopPropagation();
  toggleFavorite(props.tool.id);
}
</script>

<template>
  <RouterLink :to="`/${tool.id}`" class="tile tile--link tool-card" :data-accent="accent">
    <div class="top">
      <span class="icon-chip"><Icon :name="tool.icon" /></span>
      <span v-if="tool.added" class="chip chip--new">Nouveau</span>
      <button
        class="star"
        type="button"
        :class="{ on: favorite }"
        :aria-pressed="favorite"
        :aria-label="favorite ? `Retirer ${tool.name} des favoris` : `Ajouter ${tool.name} aux favoris`"
        @click="star"
      >
        <Icon name="star" />
      </button>
    </div>
    <h3>{{ tool.name }}</h3>
    <p class="muted">{{ tool.desc }}</p>
  </RouterLink>
</template>

<style scoped>
.tool-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  min-height: 168px;
}

.top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.star {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-left: auto;
  border-radius: 50%;
  color: var(--subtle);
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.2s var(--ease);
}

.star:hover {
  background: var(--soft);
  color: var(--ink);
  transform: scale(1.08);
}

.star .icon {
  width: 17px;
  height: 17px;
}

.star.on {
  color: var(--amber-fill);
}

.star.on .icon {
  fill: currentColor;
}

h3 {
  font-size: 17px;
  letter-spacing: -0.02em;
}

p {
  font-size: 14px;
  line-height: 1.5;
}
</style>
