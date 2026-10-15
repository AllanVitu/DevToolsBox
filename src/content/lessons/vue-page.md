---
id: vue-page
title: Créer une page en Vue 3
icon: component
summary: Anatomie d'un composant et passage à une vraie page.
track: front
order: 1
keywords:
  - vue
  - page
  - composant
  - sfc
  - script setup
  - réactivité
tools: []
quiz:
  - q: Quelles sont les 3 parties d'un fichier .vue ?
    options:
      - script, template, style
      - html, php, sql
      - header, body, footer
    answer: 0
    explain: <script setup> (logique), <template> (affichage), <style scoped> (style).
  - q: Quelle fonction rend une donnée réactive ?
    options:
      - ref()
      - print()
      - var()
    answer: 0
    explain: Avec ref(), l'affichage se met à jour dès que la valeur change.
  - q: Qu'est-ce qui transforme un composant en page ?
    options:
      - Le routeur (une URL)
      - Le CSS
      - Un commentaire
    answer: 0
    explain: Une page = un composant associé à une URL via vue-router.
---

## Un fichier .vue, c'est 3 parties

Un composant Vue (appelé **SFC**, *Single File Component*) regroupe dans un seul fichier la logique, l'affichage et le style.

```vue
<script setup>
import { ref, computed } from 'vue'

// ref() crée une donnée RÉACTIVE : si elle change, l'affichage se met à jour.
const prenom = ref('Allan')

// computed() crée une valeur DÉRIVÉE, recalculée automatiquement.
const message = computed(() => 'Bonjour ' + prenom.value + ' !')
</script>

<template>
  <section>
    <h1>{{ message }}</h1>
    <input v-model="prenom" placeholder="Ton prénom" />
  </section>
</template>

<style scoped>
section {
  padding: 2rem;
}
</style>
```

- `<script setup>` : la **logique** (les données, les fonctions).
- `<template>` : l'**affichage** (le HTML, avec `{{ }}` pour insérer une valeur).
- `<style scoped>` : le **style**, isolé à ce seul composant.

## La réactivité : la magie de Vue

Avec `ref()`, une donnée devient **réactive** : dès qu'elle change, l'écran se met à jour tout seul. `v-model` relie l'`input` à `prenom` dans les deux sens — tape dans le champ, le titre change instantanément.

## Transformer un composant en page

Une « page » est simplement un composant associé à une **URL** grâce au routeur.

```javascript
// router.js
import { createRouter, createWebHistory } from 'vue-router'
import Accueil from './pages/Accueil.vue'

const routes = [
  { path: '/', component: Accueil },
  { path: '/profil', component: () => Promise.resolve('./pages/Profil.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
```

- `/` affiche la page **Accueil**.
- `/profil` affiche la page **Profil**, chargée seulement quand on en a besoin (*lazy loading*).

> [!info]
> Dans cette app, chaque outil est une page : compare avec `src/router.js` et `src/tools.js`.
