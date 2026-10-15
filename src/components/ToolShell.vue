<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Icon from './Icon.vue';
import { getTool } from '@/data/tools';
import { getFamily } from '@/data/families';
import { lessonsForTool } from '@/data/lessons';
import { useFavorites } from '@/composables/useFavorites';

// En-tête commun à tous les outils (fil d'Ariane, titre, actions, leçons liées) et
// tuile de contenu. Les informations viennent du registre via la route courante.
const props = defineProps({
  wide: { type: Boolean, default: false },
  bare: { type: Boolean, default: false },
});

const route = useRoute();
const tool = computed(() => getTool(route.meta.tool));
const family = computed(() => (tool.value ? getFamily(tool.value.family) : null));
const lessons = computed(() => (tool.value ? lessonsForTool(tool.value.id) : []));
const { isFavorite, toggleFavorite } = useFavorites();
const favorite = computed(() => (tool.value ? isFavorite(tool.value.id) : false));
</script>

<template>
  <div class="page tool-page" :class="{ wide: props.wide }">
    <nav class="crumbs" aria-label="Fil d’Ariane">
      <RouterLink to="/outils">Outils</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink v-if="family" :to="`/outils/${family.id}`">{{ family.name }}</RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{{ tool?.name }}</span>
    </nav>

    <header class="tile tile--tint tool-head" :data-accent="family?.accent">
      <span class="icon-chip icon-chip--lg"><Icon :name="tool?.icon || 'wrench'" /></span>
      <div class="titles">
        <p class="eyebrow eyebrow--accent">
          Outil · {{ family?.name }}
          <span v-if="tool?.added" class="chip chip--new">Nouveau</span>
        </p>
        <h1>{{ tool?.name }}</h1>
        <p class="lead">{{ tool?.desc }}</p>
        <p v-if="lessons.length" class="learn">
          <Icon name="graduation-cap" />
          <span>Comprendre :</span>
          <RouterLink v-for="l in lessons" :key="l.id" :to="`/apprendre/${l.id}`" class="chip chip--accent">{{ l.title }}</RouterLink>
        </p>
      </div>
      <div class="actions">
        <slot name="actions" />
        <button
          class="btn btn--icon"
          type="button"
          :class="{ 'is-on': favorite }"
          :aria-pressed="favorite"
          :aria-label="favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          :title="favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          @click="tool && toggleFavorite(tool.id)"
        >
          <Icon name="star" :class="{ filled: favorite }" />
        </button>
      </div>
    </header>

    <section v-if="!bare" class="tile tile--flat tool-body">
      <slot />
    </section>
    <slot v-else />

    <slot name="below" />
  </div>
</template>

<style scoped>
.tool-page {
  display: grid;
  gap: var(--gap);
  align-content: start;
}

.crumbs {
  padding-bottom: 0;
}

.tool-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 18px 20px;
  align-items: start;
  padding: 26px 28px;
  /* Le menu « Envoyer vers » déborde de la tuile : pas de rognage, et au-dessus du contenu. */
  overflow: visible;
  z-index: 2;
}

.titles {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.titles .eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
}

.titles h1 {
  font-size: clamp(28px, 3.2vw, 44px);
  letter-spacing: -0.045em;
  line-height: 1.02;
}

.lead {
  color: var(--muted);
  font-size: 15.5px;
  max-width: 70ch;
}

.learn {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  margin-top: 6px;
  font-size: 13.5px;
  color: var(--muted);
}

.learn > .icon {
  width: 16px;
  height: 16px;
  color: var(--accent);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.actions :deep(.icon.filled) {
  fill: currentColor;
}

.tool-body {
  padding: 26px 28px;
}

@media (max-width: 860px) {
  .tool-head {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .tool-head,
  .tool-body {
    padding: 20px;
  }

  .tool-head .icon-chip {
    display: none;
  }

  .tool-head {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
