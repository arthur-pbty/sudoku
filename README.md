# Sudoku

Application Sudoku developpee avec Next.js (App Router), React et TypeScript.

Site en production: [sudoku.arthurp.fr](https://sudoku.arthurp.fr)

## Fonctionnalites

- Generation de grilles Sudoku.
- Interface web simple et rapide a charger.
- Build de production via Next.js.

## Stack technique

- Next.js 16
- React 19
- TypeScript
- ESLint

## Lancer en local

Prerequis:

- Node.js 20+
- npm

Installation et demarrage:

```bash
npm install
npm run dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Scripts utiles

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Lancer avec Docker Compose

```bash
docker compose up --build
```

Le service expose l'application sur le port `3005` de la machine locale.

## Deploiement

Workflow recommande avant push GitHub:

1. Verifier la qualite du code: `npm run lint`
2. Verifier le build de prod: `npm run build`
3. Verifier les fichiers a publier: `git status` puis `git add` cible

## Backlink

Ce depot supporte le site Sudoku publie ici: [https://sudoku.arthurp.fr](https://sudoku.arthurp.fr)
