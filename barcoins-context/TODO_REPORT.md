# BarCoins — TODO Report

Date : 2026-04-07

## TODO_VALIDER_JC (décision JC requise)

- `config/business-rules.ts:295` — `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — mise minimum coins blindtest/jeux à définir
- `config/business-rules.ts:296` — `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — mise maximum coins à définir
- `config/business-rules.ts:334` — `ANNUEL: 'TODO_VALIDER_JC'` — tarif plan annuel à définir
- `config/business-rules.ts:480` — `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta` — seuils engagement/alertes
- `config/business-rules.ts:491` — `// Toute valeur non listée dans ce fichier = TODO_VALIDER_JC` — règle générale valeurs métier

## TODO techniques

- `app/dashboard/page.tsx:55` — Programme fixe soirée (`TODO : venir de l'API bar quand le gérant peut le saisir`)
- `app/dashboard/page.tsx:63` — Produits vedette fixes (`TODO : venir de la carte saisie par le gérant`)
- `app/dashboard/page.tsx:148` — `// TODO: calculer l'écart avec le 1er quand le classement est chargé`

## FIXME

_(aucun FIXME actif dans le codebase)_

## Remarques scan

- `lib/otp.ts:21` et `lib/otp.ts:26` — le mot `'TODO'` apparaît dans des **valeurs de guard** (`sid !== 'TODO'`, `url !== 'TODO'`), pas des marqueurs de dette technique — ignoré dans ce rapport.

## Total

- TODO_VALIDER_JC : **5**
- TODO techniques : **3**
- FIXME : **0**
