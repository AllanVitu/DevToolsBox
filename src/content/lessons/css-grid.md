---
id: css-grid
title: Le CSS Grid
icon: layout-grid
summary: Construire des mises en page en deux dimensions.
track: front
order: 3
keywords:
  - css
  - grid
  - grille
  - layout
  - colonnes
  - lignes
  - responsive
tools: []
quiz:
  - q: Quelle est la différence clé entre Grid et Flexbox ?
    options:
      - Grid gère 2 dimensions, Flexbox une seule
      - Grid est plus ancien
      - Il n’y a aucune différence
    answer: 0
    explain: Grid dispose en colonnes ET lignes ; Flexbox sur un seul axe.
  - q: Que représente l’unité fr dans grid-template-columns ?
    options:
      - Une fraction de l’espace disponible
      - Des pixels fixes
      - Une police de caractères
    answer: 0
    explain: 1fr 1fr = deux colonnes qui se partagent l’espace à parts égales.
  - q: Que fait repeat(auto-fill, minmax(220px, 1fr)) ?
    options:
      - Des colonnes responsives sans media query
      - Une seule colonne fixe
      - Cache la grille
    answer: 0
    explain: Les colonnes font au moins 220px et se réorganisent selon la largeur.
---

## Grid vs Flexbox

Flexbox gère **une** direction (une ligne **ou** une colonne). **Grid** gère **deux** dimensions à la fois : des **colonnes** et des **lignes**. Idéal pour les mises en page d’ensemble (galeries, tableaux de bord).

## Définir une grille

```css
.grille {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 colonnes égales */
  gap: 1rem;                          /* espace entre cellules */
}
```

L’unité `fr` représente une **fraction** de l’espace disponible : `1fr 1fr 1fr` = trois colonnes de largeur égale.

## Des colonnes responsives sans media query

```css
.cartes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}
```

> [!info]
> `auto-fill` + `minmax` : les cartes font **au moins 220px** et se réorganisent toutes seules selon la largeur. C’est exactement la technique utilisée par la grille d’outils de cette app.

## Placer un élément sur plusieurs cases

```css
.vedette {
  grid-column: span 2; /* occupe 2 colonnes */
  grid-row: span 2;    /* et 2 lignes */
}
```

- `grid-template-columns` / `-rows` : structure de la grille.
- `gap` : espace entre les cellules.
- `span N` : faire occuper plusieurs colonnes ou lignes.
