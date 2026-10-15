---
id: http-rest
title: HTTP & les API REST
icon: globe
summary: Méthodes, codes de statut et principes REST en clair.
track: back
order: 3
keywords:
  - http
  - rest
  - api
  - get
  - post
  - requête
  - endpoint
tools:
  - httpstatus
quiz:
  - q: Quelle méthode HTTP sert à lire une ressource sans la modifier ?
    options:
      - GET
      - POST
      - DELETE
    answer: 0
    explain: GET lit une ressource ; il est sans effet de bord.
  - q: Que signale un code de statut commençant par 4 (4xx) ?
    options:
      - Une erreur du client
      - Un succès
      - Une erreur du serveur
    answer: 0
    explain: 4xx = erreur côté client (404 introuvable, 401 non authentifié…). 5xx = serveur.
  - q: Quelle URL est la plus « REST » pour supprimer l’article 42 ?
    options:
      - DELETE /articles/42
      - GET /deleteArticle?id=42
      - POST /supprimer/42
    answer: 0
    explain: Le verbe est porté par la méthode (DELETE) ; l’URL ne nomme qu’une ressource.
---

## HTTP : le protocole du web

À chaque fois que ton navigateur charge une page ou appelle une API, il envoie une **requête HTTP** à un serveur, qui renvoie une **réponse**. Une requête, c’est essentiellement : une **méthode**, une **URL**, des **en-têtes** et parfois un **corps**.

## Les méthodes (les verbes)

- `GET` : **lire** une ressource (ne modifie rien).
- `POST` : **créer** une ressource.
- `PUT` / `PATCH` : **modifier** (tout / partiellement).
- `DELETE` : **supprimer** une ressource.

> [!info]
> On dit que `GET` est **idempotent** et sans effet de bord : l’appeler 10 fois donne le même résultat sans rien changer côté serveur.

## Les codes de statut

- **2xx** : succès — `200 OK`, `201 Created`.
- **3xx** : redirection — `301 Moved`, `304 Not Modified`.
- **4xx** : erreur du client — `400`, `401`, `403`, `404`.
- **5xx** : erreur du serveur — `500`, `503`.

> [!info]
> 👉 Garde l’outil **Codes HTTP** sous la main pour retrouver un code en un instant.

## REST : ranger son API par ressources

Une API **REST** organise les URLs autour de **ressources** (des noms, pas des verbes) et utilise les méthodes HTTP pour agir dessus.

```text
GET    /articles        → liste les articles
POST   /articles        → crée un article
GET    /articles/42     → lit l'article 42
PATCH  /articles/42     → modifie l'article 42
DELETE /articles/42     → supprime l'article 42
```

> [!warn]
> Évite les URLs comme `/getArticle` ou `/deleteArticle42` : le **verbe** est déjà porté par la méthode HTTP.
