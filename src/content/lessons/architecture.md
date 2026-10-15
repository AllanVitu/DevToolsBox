---
id: architecture
title: L'architecture d'un projet
icon: layers
summary: Comment ranger son code pour qu'il reste compréhensible.
track: bases
order: 1
keywords:
  - architecture
  - organisation
  - structure
  - dossier
  - fichier
tools: []
quiz:
  - q: Quel principe veut que chaque fichier ne fasse qu'une seule chose ?
    options:
      - La séparation des responsabilités
      - Le recyclage
      - La duplication
    answer: 0
    explain: 'Un fichier = une responsabilité claire : plus facile à lire et à corriger.'
  - q: Où range-t-on les briques réutilisables dans un projet Vue ?
    options:
      - components/
      - pages/
      - styles/
    answer: 0
    explain: components/ contient les morceaux réutilisés à plusieurs endroits.
  - q: Comment une donnée passe-t-elle d'un composant parent à son enfant ?
    options:
      - Via les props
      - Via le CSS
      - Au hasard
    answer: 0
    explain: Les données descendent par les props ; les enfants remontent via les événements.
---

## Pourquoi parler d'architecture ?

L'architecture, c'est la façon dont on **range** le code. Comme dans une maison, chaque chose a sa pièce : on ne met pas le lit dans la cuisine. Un code bien rangé est plus facile à **lire**, à **corriger** et à **faire évoluer**.

## Le principe clé : une responsabilité = un fichier

Chaque fichier devrait faire **une seule chose**, et bien. Un composant affiche un bouton ? Il ne s'occupe pas aussi de parler à la base de données. C'est la **séparation des responsabilités**.

## L'arborescence typique d'un projet Vue 3

```arborescence
src/
├── main.js          ← point d'entrée : démarre l'application
├── App.vue          ← composant racine (la coquille de l'app)
├── router.js        ← associe chaque URL à une page
├── pages/           ← une vue = une page (Accueil, Profil...)
├── components/      ← briques réutilisables (Bouton, Carte...)
├── composables/     ← logique réutilisable (useTheme, useFetch...)
└── styles/          ← le CSS global
```

- **pages/** : ce que voit l'utilisateur, une page par écran.
- **components/** : des morceaux que tu réutilises à plusieurs endroits.
- **composables/** : des fonctions qui contiennent de la logique partagée.
- **router.js** : le plan qui relie une adresse (`/profil`) à une page.

> [!info]
> Cette app DevToolbox suit exactement cette organisation : ouvre le dossier `src/` pour la voir en vrai.

## Comment circulent les données

Les données **descendent** du parent vers l'enfant via les **props**, et les enfants préviennent le parent via des **événements** (emit). Ce sens unique rend le comportement prévisible : on sait toujours d'où vient une donnée.
