---
id: sql
title: Les bases du SQL
icon: database
summary: Interroger et modifier une base de données.
track: back
order: 4
keywords:
  - sql
  - base de données
  - select
  - requête
  - table
  - join
tools:
  - sqlformat
  - querybuilder
quiz:
  - q: Quelle commande lit des données ?
    options:
      - SELECT
      - READ
      - GET
    answer: 0
    explain: SELECT colonnes FROM table récupère des lignes.
  - q: Que risque-t-on avec un DELETE sans WHERE ?
    options:
      - Supprimer toutes les lignes
      - Rien du tout
      - Créer des lignes
    answer: 0
    explain: Sans WHERE, la commande s'applique à toute la table !
  - q: Que fait un JOIN ?
    options:
      - Combine deux tables liées
      - Supprime une table
      - Trie les lignes
    answer: 0
    explain: JOIN rassemble les lignes correspondantes de deux tables.
---

## Une base, des tables

Une base de données range les informations dans des **tables** (comme des feuilles de tableur) : des colonnes (les champs) et des lignes (les enregistrements). Le **SQL** est le langage pour les interroger.

## Lire des données : SELECT

```sql
-- Toutes les colonnes de la table utilisateurs
SELECT * FROM utilisateurs;

-- Certaines colonnes, avec un filtre
SELECT nom, ville FROM utilisateurs
WHERE ville = 'Paris';
```

## Modifier des données

```sql
-- Ajouter une ligne
INSERT INTO utilisateurs (nom, ville) VALUES ('Allan', 'Paris');

-- Modifier des lignes existantes
UPDATE utilisateurs SET ville = 'Lyon' WHERE nom = 'Allan';

-- Supprimer des lignes
DELETE FROM utilisateurs WHERE nom = 'Allan';
```

> [!warn]
> Toujours mettre un `WHERE` sur un `UPDATE` ou un `DELETE` ! Sans lui, la commande s'applique à **toutes** les lignes de la table.

## Relier deux tables : JOIN

Un `JOIN` combine les lignes de deux tables liées (par exemple les commandes et leurs clients).

```sql
SELECT commandes.id, utilisateurs.nom
FROM commandes
JOIN utilisateurs ON commandes.client_id = utilisateurs.id;
```
