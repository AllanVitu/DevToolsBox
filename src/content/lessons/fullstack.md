---
id: fullstack
title: 'Vue + PHP : comment ils se parlent'
icon: arrow-left-right
summary: Le front demande, le back répond — avec du JSON.
track: back
order: 2
keywords:
  - fullstack
  - fetch
  - api
  - front
  - back
  - communication
  - json
tools:
  - json
quiz:
  - q: Quel format sert de langage commun entre Vue et PHP ?
    options:
      - JSON
      - PDF
      - MP3
    answer: 0
    explain: Le JSON est léger et lisible par les deux côtés.
  - q: Quelle fonction JavaScript appelle le serveur ?
    options:
      - fetch()
      - grab()
      - call()
    answer: 0
    explain: fetch() envoie la requête et attend la réponse.
  - q: Que fait res.json() ?
    options:
      - Transforme la réponse JSON en objet JS
      - Crée un fichier
      - Ferme la page
    answer: 0
    explain: On récupère un objet JavaScript exploitable dans le front.
---

## Deux programmes, une conversation

Vue (dans le navigateur) et PHP (sur le serveur) sont **deux programmes séparés**. Pour échanger, le front **demande** (une requête) et le back **répond** (une réponse). Le langage commun de cette conversation, c'est le **JSON**.

## Le schéma

```schéma
[ Navigateur ]                            [ Serveur ]
   Vue 3                                     PHP
     |  1. fetch('/api/bonjour.php')           |
     | -------------------------------------> |
     |                                        |  2. PHP travaille
     |  3. réponse JSON { "message": "..." }  |
     | <------------------------------------- |
     |  4. Vue affiche le résultat            |
```

## Côté front : fetch()

```vue
<script setup>
import { ref } from 'vue'

const prenom = ref('Allan')
const reponse = ref(null)

async function envoyer() {
  // fetch() appelle le serveur et ATTEND sa réponse
  const res = await fetch('/api/bonjour.php?prenom=' + prenom.value)
  reponse.value = await res.json() // on transforme le JSON en objet JS
}
</script>

<template>
  <input v-model="prenom" />
  <button @click="envoyer">Envoyer</button>
  <p v-if="reponse">{{ reponse.message }} — {{ reponse.heure }}</p>
</template>
```

- `async` / `await` : on **attend** la réponse du serveur sans bloquer la page.
- `res.json()` : on convertit le texte JSON reçu en **objet JavaScript** utilisable.

## Côté back : la réponse

On réutilise le `bonjour.php` de la leçon précédente : il reçoit le `prenom`, fabrique un tableau et le renvoie en JSON avec `json_encode`. La boucle est bouclée.

> [!warn]
> Pendant le développement, le front et le back tournent souvent sur des **ports différents**. Il faut alors autoriser les requêtes (**CORS**) côté PHP, ou passer par un proxy.
