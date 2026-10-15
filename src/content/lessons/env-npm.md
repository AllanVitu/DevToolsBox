---
id: env-npm
title: npm & les variables d’environnement
icon: package
summary: Gérer ses dépendances et ses secrets proprement.
track: devops
order: 4
keywords:
  - npm
  - package.json
  - env
  - dépendances
  - scripts
  - node
  - dotenv
tools:
  - dotenv
quiz:
  - q: Où sont déclarées les dépendances d’un projet Node ?
    options:
      - package.json
      - index.html
      - node.exe
    answer: 0
    explain: package.json liste dependencies et devDependencies, plus les scripts.
  - q: À quoi sert un fichier .env ?
    options:
      - Stocker des valeurs sensibles hors du code
      - Lancer le serveur
      - Styliser la page
    answer: 0
    explain: Clés d’API, URL de base… On l’ajoute au .gitignore pour ne pas le committer.
  - q: Que fait l’option -D dans npm install -D vitest ?
    options:
      - L’installe comme dépendance de développement
      - Le désinstalle
      - Le télécharge deux fois
    answer: 0
    explain: '-D (devDependencies) : utile pour développer, pas en production.'
---

## npm : le gestionnaire de paquets

**npm** installe les **bibliothèques** (paquets) dont ton projet a besoin et les range dans `node_modules/`. Tout est décrit dans un fichier central : `package.json`.

```bash
npm install vue          # ajoute une dépendance
npm install -D vitest    # dépendance de DÉVELOPPEMENT (-D)
npm install              # installe tout ce que liste package.json
npm run dev              # lance un script défini dans package.json
```

## Le package.json

```json
{
  "name": "mon-app",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": { "vue": "^3.5.0" },
  "devDependencies": { "vite": "^6.0.0" }
}
```

- **dependencies** : nécessaires en production (ex. Vue).
- **devDependencies** : utiles seulement pour développer (ex. Vite, Vitest).
- Le `^` autorise les mises à jour **mineures** compatibles.

> [!info]
> Le fichier `package-lock.json` fige les versions **exactes** installées : commite-le pour que toute l’équipe ait les mêmes.

## Les variables d’environnement

Une **variable d’environnement** sort les valeurs sensibles ou variables (clés d’API, URL de base de données) **hors du code**. On les place dans un fichier `.env`.

```bash
# .env (NE JAMAIS committer ce fichier)
DATABASE_URL=postgres://localhost/blog
API_KEY=sk_live_123456
```

> [!warn]
> Ajoute `.env` à ton `.gitignore` ! Committe seulement un `.env.example` sans valeurs réelles, pour documenter les variables attendues.

> [!info]
> Avec Vite, seules les variables préfixées par `VITE_` sont exposées au front (`import.meta.env.VITE_…`). Les autres restent côté serveur.
