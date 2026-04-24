# BarCoins — TODO Report

Date : 2026-04-24

## TODO_VALIDER_JC (décision JC requise)

| Fichier | Ligne | Description |
|---|---|---|
| `config/business-rules.ts` | 295 | `MISE_MIN_COINS` — mise minimum pour le challenge duel (valeur à définir) |
| `config/business-rules.ts` | 296 | `MISE_MAX_COINS` — mise maximum pour le challenge duel (valeur à définir) |
| `config/business-rules.ts` | 334 | `ANNUEL` — récompenses classement annuel (palier non défini) |
| `config/business-rules.ts` | 480 | Seuils statuts joueur (`VIP=1000`, `LEGEND=10000`) — à affiner selon usage réel post-beta |
| `config/business-rules.ts` | 491 | Règle méta : toute valeur absente de ce fichier = TODO_VALIDER_JC (rappel permanent) |

## TODO techniques

| Fichier | Ligne | Description |
|---|---|---|
| `app/dashboard/page.tsx` | 55 | Programme soirée hardcodé — doit venir de l'API bar quand le gérant peut le saisir |
| `app/dashboard/page.tsx` | 63 | Produits vedette hardcodés — doit venir de la carte saisie par le gérant |
| `app/dashboard/page.tsx` | 148 | Calcul de l'écart avec le 1er du classement non implémenté |

## FIXME

Aucun FIXME détecté dans le code source.

## Notes

- `lib/otp.ts:21,26` : la chaîne `'TODO'` est utilisée comme valeur sentinelle de validation (guard clause) — ce ne sont pas des TODO à traiter, c'est du code intentionnel.

## Total
- TODO_VALIDER_JC : 5 (dont 3 valeurs métier bloquantes)
- TODO techniques : 3
- FIXME : 0
