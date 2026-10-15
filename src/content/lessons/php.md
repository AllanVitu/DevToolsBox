---
id: php
title: Les bases de PHP
icon: server
summary: Le langage du serveur, expliqué simplement.
track: back
order: 1
keywords:
  - php
  - serveur
  - backend
  - api
  - json
tools: []
quiz:
  - q: Où s'exécute le code PHP ?
    options:
      - Sur le serveur
      - Dans le navigateur
      - Sur l'imprimante
    answer: 0
    explain: PHP tourne côté serveur ; le navigateur n'en voit que le résultat.
  - q: Par quel symbole commence une variable PHP ?
    options:
      - $
      - '#'
      - '@'
    answer: 0
    explain: 'Exemple : $prenom = ''Allan'';'
  - q: Quelle fonction renvoie des données au format JSON ?
    options:
      - json_encode()
      - echo_json()
      - print_r()
    answer: 0
    explain: json_encode() transforme un tableau PHP en texte JSON.
---

## PHP, c'est quoi ?

PHP s'exécute **sur le serveur**, pas dans le navigateur. Le **front** (Vue) gère l'affichage côté utilisateur ; le **back** (PHP) gère ce qui se passe côté serveur : lire une base de données, vérifier un mot de passe, envoyer un e-mail...

## La syntaxe de base

```php
<?php
// Une variable commence toujours par un dollar
$prenom = 'Allan';
$age = 33;

// Une fonction : un bloc réutilisable qui renvoie un résultat
function saluer($nom) {
    return 'Bonjour ' . $nom;
}

echo saluer($prenom); // affiche : Bonjour Allan
```

- Le code PHP vit après la balise `<?php`.
- Les variables commencent par `$`.
- On colle deux textes avec un point `.` (la **concaténation**).
- `echo` écrit la réponse renvoyée au navigateur.

## Un mini point d'entrée (API)

En pratique, PHP renvoie surtout des **données** (au format JSON) que le front se charge d'afficher.

```php
<?php
// api/bonjour.php — renvoie du JSON
header('Content-Type: application/json');

// $_GET lit les paramètres de l'URL : ?prenom=Allan
$prenom = $_GET['prenom'] ?? 'inconnu';

$reponse = [
    'message' => 'Bonjour ' . $prenom,
    'heure'   => date('H:i:s'),
];

echo json_encode($reponse);
```

> [!info]
> `$_GET` lit les paramètres de l'URL. `?? 'inconnu'` signifie : « si ce paramètre est absent, utilise *inconnu* à la place ».
