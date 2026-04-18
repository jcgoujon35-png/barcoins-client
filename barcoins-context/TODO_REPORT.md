# BarCoins — TODO Report

Date : 2026-04-18

## TODO_VALIDER_JC (décision JC requise)
- `config/business-rules.ts:295` — `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — seuil minimum de mise pour le blind test (bloque la logique de paris)
- `config/business-rules.ts:296` — `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — seuil maximum de mise pour le blind test (bloque la logique de paris)
- `config/business-rules.ts:334` — `ANNUEL: 'TODO_VALIDER_JC'` — prix du plan annuel non défini
- `config/business-rules.ts:480` — `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta` (seuils healthScore ou autre métrique)
- `config/business-rules.ts:491` — `// Toute valeur non listée dans ce fichier = TODO_VALIDER_JC` (rappel convention)

## TODO techniques
- `app/dashboard/page.tsx:55` — Programme fixe soirée à câbler sur l'API bar quand le gérant peut le saisir
- `app/dashboard/page.tsx:63` — Produits vedette fixes à venir de la carte saisie par le gérant
- `app/dashboard/page.tsx:148` — Calculer l'écart avec le 1er du classement quand le classement est chargé

## FIXME
_(aucun FIXME détecté dans le code source actuel)_

## Observations complémentaires
- `lib/otp.ts:21` — Guard `sid !== 'TODO'` : placeholder de config Twilio — à remplacer par validation env var propre avant prod
- `lib/otp.ts:26` — Guard `url !== 'TODO'` : idem pour l'URL Twilio

## Total
- TODO_VALIDER_JC : 5
- TODO : 3
- FIXME : 0
