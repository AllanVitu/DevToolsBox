---
id: projet-complet
title: Créer une app de A à Z (Vue 3 + PHP + PostgreSQL)
icon: rocket
summary: 'Le guide complet : du front au back, jusqu''à la base de données.'
track: back
order: 7
keywords:
  - projet
  - fullstack
  - vue
  - php
  - postgresql
  - api
  - crud
  - complet
  - capstone
tools:
  - sqlschema
  - erd
quiz:
  - q: Avec quoi PHP se connecte-t-il à PostgreSQL ?
    options:
      - PDO
      - jQuery
      - le CSS
    answer: 0
    explain: PDO + le pilote pgsql, avec des requêtes préparées.
  - q: Comment se protéger de l'injection SQL ?
    options:
      - Des requêtes préparées (:param)
      - Mettre la variable directement
      - Désactiver la base
    answer: 0
    explain: Les paramètres (:titre) sont échappés automatiquement.
  - q: Comment stocker un mot de passe en PHP ?
    options:
      - password_hash()
      - en clair dans la base
      - dans un commentaire
    answer: 0
    explain: On enregistre le hash, et on vérifie avec password_verify().
  - q: Que produit `npm run build` côté Vue ?
    options:
      - Un dossier dist/ de fichiers statiques
      - Une base de données
      - Un serveur PHP
    answer: 0
    explain: Ce dossier dist/ s'héberge sur n'importe quel serveur web.
---

## Vue d'ensemble : 3 briques qui se parlent

Une application web complète repose sur trois briques. Tout l'art consiste à les faire communiquer proprement.

- **Le front (Vue 3)** : ce que voit l'utilisateur, dans le navigateur.
- **Le back (PHP)** : le serveur qui reçoit les requêtes et applique la logique.
- **La base (PostgreSQL)** : là où les données sont stockées durablement.

## Le schéma complet

```schéma
[ Navigateur ]            [ Serveur PHP ]            [ PostgreSQL ]
   Vue 3                     API REST                  base de données
     |   fetch (JSON)           |      requête SQL          |
     | ----------------------> | -----------------------> |
     |                         | <----------------------- |
     |  <--------------------  |     lignes de données    |
     |   affiche le résultat   |     renvoie du JSON       |
```

## 1. Les prérequis

- **Node.js** (avec npm) pour le front Vue.
- **PHP 8+** pour le serveur.
- **PostgreSQL**, avec l'extension `pdo_pgsql` activée dans PHP.

> [!info]
> Vérifie tes installations : `node -v`, `php -v`, `psql --version`.

## 2. La base de données PostgreSQL

On crée une base et une table. Dans le terminal `psql` :

```sql
-- Créer la base
CREATE DATABASE blog;

-- (se connecter à la base) puis créer une table
CREATE TABLE articles (
  id       SERIAL PRIMARY KEY,
  titre    TEXT NOT NULL,
  contenu  TEXT,
  cree_le  TIMESTAMP DEFAULT now()
);

-- Insérer une première ligne
INSERT INTO articles (titre, contenu)
VALUES ('Premier article', 'Bonjour le monde');
```

- `SERIAL PRIMARY KEY` : un identifiant unique qui s'incrémente seul.
- `NOT NULL` : le champ est obligatoire.
- `DEFAULT now()` : la date est remplie automatiquement.

## 3. Le back : se connecter à la base (PDO)

PHP parle à PostgreSQL via **PDO**. On isole la connexion dans un fichier réutilisable.

```php
<?php
// db.php — connexion partagée à PostgreSQL
function getDb() {
    $hote = 'localhost';
    $base = 'blog';
    $user = 'postgres';
    $mdp  = 'motdepasse';

    $pdo = new PDO("pgsql:host=$hote;dbname=$base", $user, $mdp);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}
```

## 4. Le back : une API qui lit et écrit

Un point d'entrée qui **liste** les articles (GET) et en **crée** un (POST), en renvoyant du JSON.

```php
<?php
require 'db.php';

// Autoriser le front à appeler cette API (CORS)
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$pdo = getDb();
$methode = $_SERVER['REQUEST_METHOD'];

if ($methode === 'GET') {
    $articles = $pdo->query('SELECT * FROM articles ORDER BY id DESC')
                    ->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($articles);
}

if ($methode === 'POST') {
    // Lire le JSON envoyé par le front
    $data = json_decode(file_get_contents('php://input'), true);

    // Requête PRÉPARÉE : protège contre l'injection SQL
    $req = $pdo->prepare(
        'INSERT INTO articles (titre, contenu) VALUES (:titre, :contenu)'
    );
    $req->execute([
        ':titre'   => $data['titre'],
        ':contenu' => $data['contenu'],
    ]);
    echo json_encode(['ok' => true]);
}
```

> [!warn]
> **Jamais** une variable directement dans une requête SQL ! On utilise toujours des **requêtes préparées** (`:titre`) pour éviter l'**injection SQL**.

## 5. Lancer le serveur PHP

```bash
# Depuis le dossier du back
php -S localhost:8000
```

L'API répond maintenant sur `http://localhost:8000/articles.php`.

## 6. Le front : créer le projet Vue 3

```bash
npm create vue@latest mon-app
cd mon-app
npm install
npm run dev
```

Vue génère la structure (`src/`, `components/`, `App.vue`…). On va afficher la liste, puis ajouter un formulaire.

## 7. Afficher les données (GET)

```vue
<script setup>
import { ref, onMounted } from 'vue'

const articles = ref([])
const API = 'http://localhost:8000/articles.php'

async function charger() {
  const res = await fetch(API)
  articles.value = await res.json()
}

// onMounted : s'exécute quand le composant apparaît à l'écran
onMounted(charger)
</script>

<template>
  <ul>
    <li v-for="a in articles" :key="a.id">
      <strong>{{ a.titre }}</strong> — {{ a.contenu }}
    </li>
  </ul>
</template>
```

## 8. Envoyer des données (POST)

```vue
<script setup>
import { ref } from 'vue'

const titre = ref('')
const contenu = ref('')
const API = 'http://localhost:8000/articles.php'

async function envoyer() {
  await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titre: titre.value, contenu: contenu.value }),
  })
  titre.value = ''
  contenu.value = ''
  // ... puis recharger la liste
}
</script>

<template>
  <form @submit.prevent="envoyer">
    <input v-model="titre" placeholder="Titre" />
    <textarea v-model="contenu" placeholder="Contenu"></textarea>
    <button>Ajouter</button>
  </form>
</template>
```

> [!info]
> `@submit.prevent` empêche le rechargement de page par défaut du formulaire.

## 9. La sécurité, le minimum vital

- **Injection SQL** : toujours des requêtes préparées (vu plus haut).
- **Mots de passe** : jamais en clair. `password_hash()` pour enregistrer, `password_verify()` pour vérifier.
- **Validation** : vérifie côté serveur que les données reçues sont correctes.
- **CORS** : en production, remplace `*` par l'adresse exacte de ton front.

```php
<?php
// Enregistrer un mot de passe en sécurité
$hash = password_hash($mdpEnClair, PASSWORD_DEFAULT);

// Plus tard, à la connexion
if (password_verify($saisie, $hash)) {
    // mot de passe correct
}
```

## 10. Mettre en ligne

- **Front** : `npm run build` produit un dossier `dist/` de fichiers statiques, à héberger (Netlify, Vercel, un serveur web…).
- **Back + base** : un hébergeur compatible PHP + PostgreSQL (VPS ou services managés).
- **Secrets** : mets les identifiants de la base dans des **variables d'environnement**, jamais en dur dans le code.

> [!warn]
> Ne committe jamais tes mots de passe ou clés dans Git. Utilise un fichier `.env` (ignoré par Git) lu côté serveur.

## Récapitulatif

- **PostgreSQL** stocke les données dans des tables.
- **PHP** lit/écrit avec PDO et expose une **API JSON**.
- **Vue 3** appelle l'API avec `fetch` et affiche le résultat.
- **Sécurité** : requêtes préparées, mots de passe hashés, validation, secrets en variables d'environnement.
- Tu as maintenant la carte complète d'une app web moderne. 🚀
