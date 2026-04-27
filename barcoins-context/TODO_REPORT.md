# BarCoins — TODO Report

Date : 2026-04-27

## TODO_VALIDER_JC (décision JC requise)

| Fichier | Ligne | Contenu |
|---|---|---|
| `config/business-rules.ts` | 295 | `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — seuil minimum de mise pour les jeux |
| `config/business-rules.ts` | 296 | `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — seuil maximum de mise pour les jeux |
| `config/business-rules.ts` | 334 | `ANNUEL: 'TODO_VALIDER_JC'` — tarif abonnement annuel non fixé |
| `config/business-rules.ts` | 480 | `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta` |
| `config/business-rules.ts` | 491 | `// Toute valeur non listée dans ce fichier = TODO_VALIDER_JC` |

## TODO techniques

| Fichier | Ligne | Contenu |
|---|---|---|
| `app/dashboard/page.tsx` | 55 | `// Programme fixe soirée (TODO : venir de l'API bar quand le gérant peut le saisir)` |
| `app/dashboard/page.tsx` | 63 | `// Produits vedette fixes (TODO : venir de la carte saisie par le gérant)` |
| `app/dashboard/page.tsx` | 148 | `// TODO: calculer l'écart avec le 1er quand le classement est chargé` |

## FIXME

Aucun FIXME détecté dans le code source.

## Placeholders détectés (non-TODO mais à surveiller)

| Fichier | Ligne | Contenu |
|---|---|---|
| `lib/otp.ts` | 21 | `sid !== 'TODO'` — Twilio Account SID non configuré (mode dev actif) |
| `lib/otp.ts` | 26 | `url !== 'TODO'` — Twilio URL non configurée (mode dev actif) |

## Total
- TODO_VALIDER_JC : **5** (dont 3 décisions métier critiques : mises min/max + tarif annuel)
- TODO techniques : **3**
- FIXME : **0**
- Placeholders Twilio : **2** (bloquants pour prod)
