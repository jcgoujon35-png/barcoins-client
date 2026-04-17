# BarCoins — TODO Report

Date : 2026-04-17

## TODO_VALIDER_JC (décision JC requise)
- `config/business-rules.ts:295` — `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — seuil minimum de mise coins pour les jeux de paris
- `config/business-rules.ts:296` — `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — seuil maximum de mise coins pour les jeux de paris
- `config/business-rules.ts:334` — `ANNUEL: 'TODO_VALIDER_JC'` — tarif plan annuel non défini
- `config/business-rules.ts:480` — `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta` — seuils de segmentation engagement joueur
- `config/business-rules.ts:491` — rappel : toute valeur non listée dans ce fichier = TODO_VALIDER_JC

## TODO techniques
- `app/dashboard/page.tsx:55` — `// Programme fixe soirée (TODO : venir de l'API bar quand le gérant peut le saisir)` — programme affiché en dur, doit venir de la config bar
- `app/dashboard/page.tsx:63` — `// Produits vedette fixes (TODO : venir de la carte saisie par le gérant)` — produits vedette hardcodés
- `app/dashboard/page.tsx:148` — `// TODO: calculer l'écart avec le 1er quand le classement est chargé` — écart vs leader non calculé dans le classement joueur

## FIXME
_(aucun FIXME détecté dans le code source)_

## Note
- `lib/otp.ts:21` et `:26` — comparaisons avec la chaîne littérale `'TODO'` utilisées comme garde-fou de configuration (non actionnable, comportement voulu)

## Total
- TODO_VALIDER_JC : 5
- TODO : 3
- FIXME : 0
