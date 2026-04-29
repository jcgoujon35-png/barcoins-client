# BarCoins — TODO Report

Date : 2026-04-29

## TODO_VALIDER_JC (décision JC requise)

| # | Fichier | Ligne | Description |
|---|---|---|---|
| 1 | `config/business-rules.ts` | 295 | `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — mise minimale en coins à définir |
| 2 | `config/business-rules.ts` | 296 | `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — mise maximale en coins à définir |
| 3 | `config/business-rules.ts` | 334 | `ANNUEL: 'TODO_VALIDER_JC'` — tarif abonnement annuel non fixé |
| 4 | `config/business-rules.ts` | 480 | `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta` |
| 5 | `config/business-rules.ts` | 491 | `// Toute valeur non listée dans ce fichier = TODO_VALIDER_JC` (règle globale) |

## TODO techniques

| # | Fichier | Ligne | Description |
|---|---|---|---|
| 1 | `app/dashboard/page.tsx` | 55 | `// Programme fixe soirée (TODO : venir de l'API bar quand le gérant peut le saisir)` |
| 2 | `app/dashboard/page.tsx` | 63 | `// Produits vedette fixes (TODO : venir de la carte saisie par le gérant)` |
| 3 | `app/dashboard/page.tsx` | 148 | `// TODO: calculer l'écart avec le 1er quand le classement est chargé` |

## FIXME

Aucun FIXME détecté dans les fichiers source actuels.

## Mentions `'TODO'` comme valeur de chaîne (non-commentaires)

| # | Fichier | Ligne | Nature |
|---|---|---|---|
| 1 | `lib/otp.ts` | 21 | `sid !== 'TODO'` — garde dev-mode pour Twilio non configuré |
| 2 | `lib/otp.ts` | 26 | `url !== 'TODO'` — garde dev-mode pour Twilio non configuré |

> Ces deux occurrences ne sont pas des TODOs de code mais des gardes pour le mode dev OTP.
> Elles deviendront inutiles dès que Twilio/Redis sera configuré.

## Total
- **TODO_VALIDER_JC** : 5
- **TODO techniques** : 3
- **FIXME** : 0
- **Chaînes `'TODO'` (dev guards)** : 2

## Priorité de résolution suggérée
1. `config/business-rules.ts:334` — tarif annuel (bloque la page pricing)
2. `config/business-rules.ts:295-296` — mises min/max (bloque la validation des jeux en production)
3. `app/dashboard/page.tsx:55,63` — contenu soirée dynamique (bloque le dashboard gérant complet)
4. `lib/otp.ts:21,26` — configurer Twilio/Redis avant beta Founding Partners
