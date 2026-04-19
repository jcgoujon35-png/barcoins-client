# BarCoins — TODO Report

Date : 2026-04-19

## TODO_VALIDER_JC (décision JC requise)

| Fichier | Ligne | Contenu |
|---|---|---|
| `config/business-rules.ts` | 295 | `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — seuil minimum mise blind test/jeux à définir |
| `config/business-rules.ts` | 296 | `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — seuil maximum mise à définir |
| `config/business-rules.ts` | 334 | `ANNUEL: 'TODO_VALIDER_JC'` — tarif plan annuel à valider |
| `config/business-rules.ts` | 480 | Commentaire : "seuils à affiner selon usage réel post-beta" |
| `config/business-rules.ts` | 491 | Commentaire : "Toute valeur non listée = TODO_VALIDER_JC" (règle générale) |

## TODO techniques

| Fichier | Ligne | Contenu |
|---|---|---|
| `app/dashboard/page.tsx` | 55 | Programme fixe soirée — venir de l'API bar quand gérant peut le saisir |
| `app/dashboard/page.tsx` | 63 | Produits vedette fixes — venir de la carte saisie par le gérant |
| `app/dashboard/page.tsx` | 148 | Calculer l'écart avec le 1er quand le classement est chargé |

## FIXME

Aucun `FIXME` détecté dans le code source.

## Faux positifs (hors scope)

| Fichier | Ligne | Note |
|---|---|---|
| `lib/otp.ts` | 21 | `sid !== 'TODO'` — vérification de config runtime, pas un TODO code |
| `lib/otp.ts` | 26 | `url !== 'TODO'` — idem, vérification de config runtime |

## Total
- **TODO_VALIDER_JC** : 5 (dont 4 dans `config/business-rules.ts`)
- **TODO techniques** : 3 (tous dans `app/dashboard/page.tsx`)
- **FIXME** : 0
- **HACK / XXX** : 0
