---
id: cli
title: La ligne de commande
icon: terminal
summary: Naviguer et agir depuis le terminal.
track: devops
order: 1
keywords:
  - terminal
  - cli
  - commande
  - shell
  - bash
  - console
tools: []
quiz:
  - q: Quelle commande liste les fichiers ?
    options:
      - ls
      - list
      - show-all
    answer: 0
    explain: ls liste le contenu du dossier courant.
  - q: Quelle commande change de dossier ?
    options:
      - cd
      - go
      - move
    answer: 0
    explain: cd mon-dossier entre dedans ; cd .. remonte.
  - q: Que fait la commande rm ?
    options:
      - Supprime un fichier (définitif)
      - Le renomme
      - Le répare
    answer: 0
    explain: 'rm supprime sans corbeille : aucun retour en arrière.'
---

## Le terminal, c'est quoi ?

Le terminal permet de **piloter l'ordinateur en tapant des commandes** plutôt qu'avec la souris. C'est rapide, précis et indispensable pour le développement.

## Se déplacer

```bash
pwd            # afficher le dossier courant
ls             # lister les fichiers
cd mon-dossier # entrer dans un dossier
cd ..          # remonter d'un niveau
```

## Manipuler des fichiers

```bash
mkdir projet      # créer un dossier
touch fichier.txt # créer un fichier vide
cp a.txt b.txt    # copier
mv a.txt dossier/ # déplacer (ou renommer)
rm fichier.txt    # supprimer (définitif !)
```

> [!warn]
> `rm` supprime sans corbeille : aucun retour en arrière. Vérifie toujours ce que tu effaces.

## Astuces qui font gagner du temps

- Flèche **↑** : rappelle la commande précédente.
- **Tab** : complète automatiquement un nom de fichier.
- `Ctrl + C` : interrompt la commande en cours.
