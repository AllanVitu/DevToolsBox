---
id: javascript
title: Les bases de JavaScript
icon: braces
summary: 'Variables, fonctions, tableaux : le langage du web.'
track: bases
order: 3
keywords:
  - javascript
  - js
  - variable
  - fonction
  - tableau
  - boucle
tools:
  - regex
  - json
quiz:
  - q: Quel mot-clé déclare une valeur qui ne changera pas ?
    options:
      - const
      - let
      - var
    answer: 0
    explain: const pour une constante, let pour une variable modifiable.
  - q: Que renvoie [1, 2, 3].map(n => n * 2) ?
    options:
      - '[2, 4, 6]'
      - '[1, 2, 3]'
      - '6'
    answer: 0
    explain: map() transforme chaque élément et renvoie un nouveau tableau.
  - q: Comment afficher une valeur dans la console ?
    options:
      - console.log()
      - alert.print()
      - show()
    answer: 0
    explain: console.log() s'affiche dans la console du navigateur (F12).
---

## Les variables

Une variable est une boîte qui contient une valeur. En JavaScript moderne, on utilise `const` (valeur fixe) ou `let` (valeur qui peut changer). On évite l'ancien `var`.

```javascript
const nom = 'Allan'   // ne changera pas
let score = 0         // pourra changer
score = score + 10
```

## Les types de base

- **string** : du texte, entre guillemets — `'bonjour'`.
- **number** : un nombre — `42`, `3.14`.
- **boolean** : vrai ou faux — `true` / `false`.
- **array** : une liste — `[1, 2, 3]`.
- **object** : un ensemble de propriétés — `{ nom: 'Allan' }`.

## Les fonctions

Une fonction regroupe des instructions réutilisables. La forme moderne est la **fonction fléchée**.

```javascript
// Fonction classique
function carre(x) {
  return x * x
}

// Fonction fléchée (équivalente)
const carre2 = (x) => x * x

console.log(carre(5)) // 25
```

## Tableaux et boucles

On parcourt une liste avec `for...of`, ou avec des méthodes comme `map` (transformer) et `filter` (filtrer).

```javascript
const nombres = [1, 2, 3, 4]

for (const n of nombres) {
  console.log(n)
}

const doubles = nombres.map((n) => n * 2)      // [2, 4, 6, 8]
const pairs = nombres.filter((n) => n % 2 === 0) // [2, 4]
```

> [!info]
> `console.log(...)` affiche une valeur dans la console du navigateur (touche F12). C'est ton meilleur ami pour déboguer.
