---
id: git
title: 'Git : les commandes essentielles'
icon: git-branch
summary: Versionner son code et travailler en équipe.
track: bases
order: 5
keywords:
  - git
  - commit
  - push
  - branche
  - version
  - github
tools:
  - diff
quiz:
  - q: Quelle commande enregistre un point dans l'historique ?
    options:
      - git commit
      - git delete
      - git stop
    answer: 0
    explain: git commit -m "message" fige les changements préparés.
  - q: Quelle commande envoie tes commits sur le serveur distant ?
    options:
      - git push
      - git send
      - git upload
    answer: 0
    explain: git push publie tes commits ; git pull récupère ceux des autres.
  - q: À quoi sert une branche ?
    options:
      - Travailler en parallèle sans casser la principale
      - Supprimer le dépôt
      - Compiler le code
    answer: 0
    explain: On développe sur une branche, puis on la fusionne (merge).
---

## Git, pour quoi faire ?

Git enregistre l'**historique** de ton code : chaque sauvegarde (un *commit*) est un point de restauration. Tu peux revenir en arrière, travailler à plusieurs et tester des idées sans rien casser.

## Le cycle de base

```bash
git init                 # démarrer un dépôt dans le dossier
git status               # voir les fichiers modifiés
git add .                # préparer tous les changements
git commit -m "Message"  # enregistrer un point dans l'historique
```

## Travailler avec un dépôt distant

```bash
git clone <url>   # copier un dépôt existant
git pull          # récupérer les changements des autres
git push          # envoyer tes commits sur le serveur
```

## Les branches

Une **branche** est une ligne de travail parallèle. On code une fonctionnalité sur sa branche, puis on la **fusionne** dans la principale.

```bash
git branch ma-fonctionnalite     # créer une branche
git checkout ma-fonctionnalite   # se placer dessus
git merge ma-fonctionnalite      # la fusionner (depuis main)
```

> [!info]
> Un bon message de commit explique *pourquoi*, pas seulement *quoi*. Court et au présent : « Corrige le calcul du total ».
