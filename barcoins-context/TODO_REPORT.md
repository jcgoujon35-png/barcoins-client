# BarCoins — TODO Report

Date : 2026-04-09

## TODO_VALIDER_JC (décision JC requise)

- `config/business-rules.ts:295` — `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — seuil min mise PvP en Coins Play à définir
- `config/business-rules.ts:296` — `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — seuil max mise PvP en Coins Play à définir
- `config/business-rules.ts:334` — `ANNUEL: 'TODO_VALIDER_JC'` — montant récompense classement annuel à définir
- `config/business-rules.ts:480` — `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta` — seuils engagement/alertes

> Note : `config/business-rules.ts:491` rappelle que toute valeur absente de ce fichier = TODO_VALIDER_JC par convention.

## TODO techniques

- `app/dashboard/page.tsx:55` — Programme soirée hardcodé (`TODO : venir de l'API bar quand le gérant peut le saisir`)
- `app/dashboard/page.tsx:63` — Produits vedette hardcodés (`TODO : venir de la carte saisie par le gérant`)
- `app/dashboard/page.tsx:148` — `// TODO: calculer l'écart avec le 1er quand le classement est chargé`

## FIXME

_(aucun FIXME actif dans le codebase)_

## Signalements supplémentaires (placeholder 'TODO' en runtime)

- `lib/otp.ts:21` — `sid !== 'TODO'` — garde runtime : Twilio Account SID à vérifier en prod/staging
- `lib/otp.ts:26` — `url !== 'TODO'` — garde runtime : Twilio URL à vérifier en prod/staging

Ces deux lignes sont des guards runtime (pas des marqueurs de dette), mais signalent que les variables d'environnement Twilio pourraient être encore à leur valeur placeholder.

## Total

- TODO_VALIDER_JC : **4**
- TODO techniques : **3**
- FIXME : **0**
- Placeholders runtime à surveiller : **2**
