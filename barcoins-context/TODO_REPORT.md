# BarCoins — TODO Report

Date : 2026-05-06

## TODO_VALIDER_JC (décision JC requise)
- `config/business-rules.ts:295` — `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — seuil min de mise à définir
- `config/business-rules.ts:296` — `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — seuil max de mise à définir
- `config/business-rules.ts:334` — `ANNUEL: 'TODO_VALIDER_JC'` — tarif abonnement annuel à valider
- `config/business-rules.ts:482` — seuils à affiner selon usage réel post-beta
- `config/business-rules.ts:493` — rappel : toute valeur non listée = TODO_VALIDER_JC
- `games-catalog/catalog.index.json:122` — PRIORITIES_VALIDER_JC intégrés dans les fichiers MD du catalogue

## TODO techniques
- `app/dashboard/page.tsx:55` — Programme fixe soirée (TODO : venir de l'API bar quand le gérant peut le saisir)
- `app/dashboard/page.tsx:63` — Produits vedette fixes (TODO : venir de la carte saisie par le gérant)
- `app/dashboard/page.tsx:148` — Calculer l'écart avec le 1er quand le classement est chargé

## FIXME
_(aucun FIXME actif détecté)_

## Notes (checks internes, non bloquants)
- `lib/otp.ts:21` — guard `sid !== 'TODO'` (vérification présence config Twilio)
- `lib/otp.ts:26` — guard `url !== 'TODO'` (vérification présence URL app)

## Total
- TODO_VALIDER_JC : 6
- TODO techniques : 3
- FIXME : 0
