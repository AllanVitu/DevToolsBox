---
id: flexbox
title: Le CSS Flexbox
icon: columns-3
summary: Aligner et répartir des éléments facilement.
track: front
order: 2
keywords:
  - css
  - flexbox
  - flex
  - alignement
  - layout
  - centrer
tools: []
quiz:
  - q: Quelle propriété active Flexbox sur un conteneur ?
    options:
      - 'display: flex'
      - 'position: flex'
      - 'float: flex'
    answer: 0
    explain: 'display: flex rend les enfants directs flexibles.'
  - q: Quelle propriété aligne sur l'axe principal ?
    options:
      - justify-content
      - align-items
      - text-align
    answer: 0
    explain: justify-content (axe principal), align-items (axe secondaire).
  - q: Comment centrer parfaitement un élément ?
    options:
      - justify-content et align-items à center
      - 'margin: 0'
      - 'text-align: center'
    answer: 0
    explain: Les deux à center centrent horizontalement ET verticalement.
---

## À quoi sert Flexbox ?

Flexbox aligne des éléments **en ligne ou en colonne** et répartit l'espace entre eux. C'est l'outil de base pour centrer, espacer et organiser une interface.

## Activer flex

On met `display: flex` sur le **conteneur**. Ses enfants directs deviennent des éléments flexibles.

```css
.conteneur {
  display: flex;
  gap: 1rem; /* espace entre les enfants */
}
```

## Les deux axes

- `justify-content` : aligne sur l'axe **principal** (horizontal par défaut).
- `align-items` : aligne sur l'axe **secondaire** (vertical par défaut).
- `flex-direction: column` : passe en disposition verticale.
- `flex-wrap: wrap` : autorise le passage à la ligne.

## Centrer parfaitement

```css
.centre {
  display: flex;
  justify-content: center; /* centre horizontalement */
  align-items: center;     /* centre verticalement */
  height: 200px;
}
```

> [!info]
> Valeurs utiles de `justify-content` : `flex-start`, `center`, `space-between`, `space-around`.
