---
id: css-unites
title: 'Les unités CSS : px, rem, em'
icon: ruler
summary: Choisir la bonne unité pour des interfaces nettes et accessibles.
track: front
order: 4
keywords:
  - css
  - px
  - rem
  - em
  - unité
  - responsive
  - accessibilité
tools:
  - pxrem
quiz:
  - q: Avec une base de 16 px, combien valent 1.5rem ?
    options:
      - 24 px
      - 15 px
      - 1,6 px
    answer: 0
    explain: 1.5 × 16 = 24 px.
  - q: Quel est l’avantage de rem sur px ?
    options:
      - Il s’adapte à la taille de police choisie par l’utilisateur
      - Il s’affiche plus vite
      - Il est plus court à écrire
    answer: 0
    explain: 'rem dépend de la racine : meilleur pour l’accessibilité.'
  - q: L’unité em est relative à quoi ?
    options:
      - La taille de police de l’élément courant
      - La racine uniquement
      - La largeur de l’écran
    answer: 0
    explain: D’où le risque de cumul quand on imbrique des éléments en em.
---

## px : le pixel

Le `px` est une unité **fixe** : `16px` font toujours 16 pixels. Simple, mais le texte **ne s'adapte pas** si l'utilisateur agrandit la police par défaut de son navigateur.

## rem : relatif à la racine

`1rem` vaut la **taille de police de la racine** (`<html>`), soit **16px** par défaut. Donc `1.5rem = 24px`. Énorme avantage : si l'utilisateur change sa taille de police, **toute l'interface s'adapte** — c'est meilleur pour l'**accessibilité**.

```css
:root { font-size: 16px; }   /* 1 rem = 16 px */

h1   { font-size: 2rem; }    /* = 32 px */
p    { font-size: 1rem; }    /* = 16 px */
.box { padding: 1.5rem; }    /* = 24 px */
```

## em : relatif au parent

`em` est relatif à la taille de police de **l'élément courant**. Pratique pour des espacements proportionnels au texte, mais attention : les `em` **se cumulent** quand on les imbrique.

> [!info]
> 👉 Utilise l'outil **px ⇄ rem** pour convertir en un clic et garder une table de référence sous la main.

## La règle à retenir

Pour convertir : **px ÷ 16 = rem**. Et dans l'autre sens : **rem × 16 = px** (si la base vaut 16).

> [!warn]
> Conseil : utilise `rem` pour les tailles de texte et les espacements, et réserve `px` aux bordures fines (`1px`).
