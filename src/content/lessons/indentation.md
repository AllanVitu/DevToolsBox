---
id: indentation
title: Indentation & lisibilité
icon: indent-increase
summary: Décaler son code pour le rendre lisible d'un coup d'œil.
track: bases
order: 2
keywords:
  - indentation
  - espaces
  - lisibilité
  - format
  - prettier
tools: []
quiz:
  - q: À quoi sert principalement l'indentation ?
    options:
      - Montrer la structure du code
      - Accélérer le programme
      - Réduire la taille du fichier
    answer: 0
    explain: Elle révèle ce qui est imbriqué dans quoi — une aide visuelle.
  - q: Combien d'espaces par niveau, par convention, en JavaScript / Vue ?
    options:
      - '2'
      - '8'
      - '0'
    answer: 0
    explain: '2 espaces en JS/Vue, 4 en PHP/Python. L''essentiel : rester cohérent.'
  - q: Quel outil indente le code automatiquement à la sauvegarde ?
    options:
      - Prettier
      - Photoshop
      - Le Bloc-notes
    answer: 0
    explain: Prettier (JS) ou PHP-CS-Fixer (PHP) formatent pour toi.
---

## L'indentation, c'est quoi ?

Indenter, c'est **décaler le code vers la droite** pour montrer ce qui est « à l'intérieur » de quoi. Chaque niveau d'imbrication ajoute un décalage.

## Avant / après

```javascript
function total(panier){
let somme=0
for(const article of panier){
if(article.actif){
somme+=article.prix
}
}
return somme
}
```

Difficile de voir où commence et où finit chaque bloc. Maintenant, le même code indenté :

```javascript
function total(panier) {
  let somme = 0

  for (const article of panier) {
    if (article.actif) {
      somme += article.prix
    }
  }

  return somme
}
```

La structure saute aux yeux : on voit immédiatement ce qui dépend de quoi.

## Les conventions courantes

- **JavaScript / Vue** : 2 espaces par niveau.
- **PHP** : 4 espaces (norme PSR-12).
- **Python** : 4 espaces, et c'est même **obligatoire**.
- Le plus important : **rester cohérent** dans tout le projet.

> [!info]
> Un **formateur automatique** (Prettier pour JS, PHP-CS-Fixer pour PHP) indente le code pour toi à chaque sauvegarde. Tu n'as plus à y penser.
