# BarCoins — TODO Report

Date : 2026-04-15

## TODO_VALIDER_JC (décision JC requise)

| Fichier | Ligne | Contenu |
|---|---|---|
| `config/business-rules.ts` | 295 | `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — seuil min de mise PvP en Coins Play |
| `config/business-rules.ts` | 296 | `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — seuil max de mise PvP en Coins Play |
| `config/business-rules.ts` | 334 | `ANNUEL: 'TODO_VALIDER_JC'` — récompense classement annuel (financé commissions) |
| `config/business-rules.ts` | 480 | `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta` |
| `config/business-rules.ts` | 491 | `// Toute valeur non listée dans ce fichier = TODO_VALIDER_JC` |

## TODO techniques

| Fichier | Ligne | Contenu |
|---|---|---|
| `app/dashboard/page.tsx` | 55 | `// Programme fixe soirée (TODO : venir de l'API bar quand le gérant peut le saisir)` |
| `app/dashboard/page.tsx` | 63 | `// Produits vedette fixes (TODO : venir de la carte saisie par le gérant)` |
| `app/dashboard/page.tsx` | 148 | `// TODO: calculer l'écart avec le 1er quand le classement est chargé` |

## FIXME

_(aucun FIXME détecté dans le scan)_

## Total

- `TODO_VALIDER_JC` : **5**
- `TODO` techniques : **3**
- `FIXME` : **0**

---

## Contexte sur les TODO_VALIDER_JC prioritaires

### MISE_MIN_COINS / MISE_MAX_COINS (PVP_RULES)
Ces valeurs conditionnent l'activation du mode PvP. Tant qu'elles sont à `TODO_VALIDER_JC`, toute tentative de création de challenge PvP avec validation des mises échouera (ou devra être bypassée). À valider avant de tester le mode challenge.

### LEADERBOARD_REWARDS.ANNUEL
Le classement annuel est financé par les commissions PvP/tournois. Le montant exact dépend du business model confirmé. Pas bloquant en beta immédiate, mais à fixer avant communication aux Founding Partners.
