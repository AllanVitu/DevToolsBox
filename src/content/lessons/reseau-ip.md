---
id: reseau-ip
title: Les adresses IP & le CIDR
icon: network
summary: Décoder une adresse IPv4, un masque et la notation /24.
track: devops
order: 3
keywords:
  - ip
  - ipv4
  - cidr
  - réseau
  - masque
  - sous-réseau
  - subnet
tools:
  - cidr
  - ports
quiz:
  - q: Combien de bits compte une adresse IPv4 ?
    options:
      - '32'
      - '64'
      - '128'
    answer: 0
    explain: 4 nombres de 0 à 255, soit 4 × 8 = 32 bits.
  - q: Que veut dire le /24 dans 192.168.1.0/24 ?
    options:
      - Les 24 premiers bits identifient le réseau
      - 24 machines au maximum
      - La version du protocole
    answer: 0
    explain: Il reste 8 bits pour les hôtes, soit 256 adresses (254 utilisables).
  - q: Quelle est l’adresse de diffusion de 192.168.1.0/24 ?
    options:
      - 192.168.1.255
      - 192.168.1.0
      - 192.168.1.1
    answer: 0
    explain: La dernière adresse du bloc sert au broadcast ; la première (.0) désigne le réseau.
---

## Une adresse IPv4

Une adresse IPv4, c'est **4 nombres de 0 à 255** séparés par des points, par exemple `192.168.1.10`. Derrière, ce sont **32 bits** (4 × 8). Elle identifie une machine sur un réseau.

## Réseau + hôte

Une adresse se coupe en deux : une partie **réseau** (commune à toutes les machines du même réseau) et une partie **hôte** (propre à la machine). Le **masque** indique où se situe la coupure.

## La notation CIDR (/24)

Le `/24` signifie que **les 24 premiers bits** désignent le réseau. Il reste donc 8 bits pour les hôtes, soit 256 adresses.

```text
192.168.1.0/24

Réseau     : 192.168.1.0
Masque     : 255.255.255.0
1er hôte   : 192.168.1.1
Dernier    : 192.168.1.254
Diffusion  : 192.168.1.255   (broadcast)
```

- `/8` → 16 777 216 adresses (un très grand réseau).
- `/16` → 65 536 adresses.
- `/24` → 256 adresses (254 hôtes utilisables).
- Plus le préfixe est grand, plus le réseau est petit.

> [!info]
> 👉 Teste l'outil **Sous-réseau CIDR** : tape `192.168.1.42/26` et observe la plage d'hôtes calculée.

## Adresses particulières

- La 1re adresse (`.0`) désigne le **réseau** lui-même.
- La dernière (`.255` en /24) est la **diffusion** (broadcast).
- Plages **privées** (réseaux locaux) : `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`.
