---
id: async
title: 'L''asynchrone : promesses & async/await'
icon: hourglass
summary: Attendre un résultat sans figer la page.
track: bases
order: 4
keywords:
  - async
  - await
  - promise
  - promesse
  - asynchrone
  - then
  - fetch
tools: []
quiz:
  - q: Que représente une Promise ?
    options:
      - Un résultat à venir
      - Une boucle infinie
      - Un type de variable fixe
    answer: 0
    explain: Une promesse finira résolue (succès) ou rejetée (erreur).
  - q: Où peut-on utiliser le mot-clé await ?
    options:
      - Dans une fonction async
      - N’importe où
      - Uniquement dans une boucle for
    answer: 0
    explain: await ne s’emploie qu’à l’intérieur d’une fonction async.
  - q: Comment gère-t-on une erreur avec async/await ?
    options:
      - try / catch
      - un if
      - on ne peut pas
    answer: 0
    explain: On entoure l’await d’un bloc try/catch pour capturer le rejet.
---

## Pourquoi « asynchrone » ?

Certaines opérations prennent du **temps** : appeler une API, lire un fichier… JavaScript ne **bloque pas** en attendant : il lance l’opération et continue. Quand le résultat arrive, il déclenche la suite. C’est l’**asynchrone**.

## Une promesse (Promise)

Une **Promise** représente un résultat **à venir** : elle finira soit **résolue** (succès), soit **rejetée** (erreur).

```javascript
fetch('/api/users')
  .then((res) => res.json()) // quand la réponse arrive
  .then((users) => console.log(users))
  .catch((err) => console.error('Échec :', err))
```

## async / await : la version lisible

`await` met en pause la fonction jusqu’à ce que la promesse soit résolue, **sans bloquer** le reste de la page. Le code se lit alors de haut en bas, comme du synchrone.

```javascript
async function chargerUsers() {
  try {
    const res = await fetch('/api/users')
    const users = await res.json()
    return users
  } catch (err) {
    console.error('Échec :', err)
  }
}
```

- `await` ne s’utilise qu’à l’intérieur d’une fonction `async`.
- On entoure d’un `try / catch` pour **gérer les erreurs**.
- Une fonction `async` renvoie **toujours** une promesse.

> [!info]
> Pour lancer plusieurs appels **en parallèle**, utilise `await Promise.all([...])` au lieu de les enchaîner un par un.
