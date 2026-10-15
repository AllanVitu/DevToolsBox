---
id: permissions
title: Les permissions de fichiers (chmod)
icon: lock
summary: Comprendre qui peut lire, écrire et exécuter un fichier sous Unix.
track: devops
order: 2
keywords:
  - permissions
  - chmod
  - unix
  - linux
  - octal
  - rwx
  - droits
tools:
  - chmod
quiz:
  - q: Quel chiffre octal correspond à « rwx » ?
    options:
      - '7'
      - '5'
      - '3'
    answer: 0
    explain: r=4, w=2, x=1 → 4+2+1 = 7.
  - q: Que signifie la permission 644 ?
    options:
      - rw- pour le propriétaire, r-- pour le groupe et les autres
      - Tous les droits pour tout le monde
      - Aucun droit
    answer: 0
    explain: '6 = rw-, 4 = r-- : un fichier classique en lecture/écriture pour son propriétaire.'
  - q: Dans rwxr-xr-x, quel est l’ordre des trois groupes ?
    options:
      - propriétaire, groupe, autres
      - autres, groupe, propriétaire
      - au hasard
    answer: 0
    explain: 'Toujours : propriétaire (u), puis groupe (g), puis autres (o).'
---

## À quoi servent les permissions ?

Sous Linux et macOS, chaque fichier indique **qui a le droit de faire quoi**. Il y a 3 actions possibles : **lire** (r), **écrire** (w) et **exécuter** (x) ; et 3 catégories de personnes : le **propriétaire**, le **groupe** et les **autres**.

## Lire la sortie de `ls -l`

```bash
-rwxr-xr--  1 allan  staff  2048  script.sh
 │ └┬┘└┬┘└┬┘
 │  │  │  └── autres        : r--  (lecture seule)
 │  │  └───── groupe        : r-x  (lecture + exécution)
 │  └──────── propriétaire  : rwx  (tous les droits)
 └─────────── type (- = fichier, d = dossier)
```

## La notation octale

Chaque groupe de droits se résume à **un chiffre de 0 à 7** : on additionne `r = 4`, `w = 2` et `x = 1`.

```text
rwx = 4+2+1 = 7
rw- = 4+2+0 = 6
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4
```

- `755` = `rwxr-xr-x` : un programme ou un dossier.
- `644` = `rw-r--r--` : un fichier classique (texte, image…).
- `600` = `rw-------` : privé, lisible par le seul propriétaire.
- `777` = `rwxrwxrwx` : tous les droits à tout le monde — à éviter.

> [!info]
> 👉 Mets-le en pratique avec l'outil **Permissions chmod** : coche les cases et lis l'octal correspondant.

## La commande chmod

```bash
chmod 644 fichier.txt     # définit rw-r--r--
chmod 755 script.sh       # définit rwxr-xr-x
chmod u+x script.sh       # ajoute juste +x au propriétaire
```

> [!warn]
> **777 est dangereux** : tout le monde peut modifier le fichier. N'accorde que les droits réellement nécessaires.
