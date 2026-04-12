# BarCoins — TODO Report

Date : 2026-04-12

## TODO_VALIDER_JC (décision JC requise)

| Fichier | Ligne | Contenu |
|---|---|---|
| `config/business-rules.ts` | 295 | `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — mise minimale coins jeux à définir |
| `config/business-rules.ts` | 296 | `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — mise maximale coins jeux à définir |
| `config/business-rules.ts` | 334 | `ANNUEL: 'TODO_VALIDER_JC'` — tarif abonnement annuel bar à définir |
| `config/business-rules.ts` | 480 | Seuils statuts joueur (REGULAR/VIP/LEGEND) à affiner selon usage réel post-beta |
| `config/business-rules.ts` | 491 | Rappel règle absolue : toute valeur non listée dans ce fichier = TODO_VALIDER_JC |

## TODO techniques

| Fichier | Ligne | Contenu |
|---|---|---|
| `app/dashboard/page.tsx` | 55 | Programme fixe soirée — doit venir de l'API bar quand le gérant peut le saisir |
| `app/dashboard/page.tsx` | 63 | Produits vedette fixes — doit venir de la carte saisie par le gérant |
| `app/dashboard/page.tsx` | 148 | Calculer l'écart avec le 1er quand le classement est chargé |

## FIXME

| Fichier | Ligne | Contenu |
|---|---|---|
| `lib/otp.ts` | 21 | `sid !== 'TODO'` — Twilio SID de prod non configuré, OTP SMS non fonctionnel |
| `lib/otp.ts` | 26 | `url !== 'TODO'` — Twilio URL de prod non configurée, OTP SMS non fonctionnel |

## Total

- **TODO_VALIDER_JC** : 5
- **TODO** : 3
- **FIXME** : 2 (Twilio OTP — bloquant pour go-live Founding Partners)
