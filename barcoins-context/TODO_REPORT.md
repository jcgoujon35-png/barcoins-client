# BarCoins — TODO Report

Date : 2026-05-02

## TODO_VALIDER_JC (décision JC requise)

| # | Fichier | Ligne | Description |
|---|---------|-------|-------------|
| 1 | `config/business-rules.ts` | 295 | `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — seuil minimum de mise pour les jeux à paris |
| 2 | `config/business-rules.ts` | 296 | `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — seuil maximum de mise pour les jeux à paris |
| 3 | `config/business-rules.ts` | 334 | `ANNUEL: 'TODO_VALIDER_JC'` — tarif abonnement annuel plan non défini |
| 4 | `config/business-rules.ts` | 480 | `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta` |
| 5 | `config/business-rules.ts` | 491 | `// Toute valeur non listée dans ce fichier = TODO_VALIDER_JC` |

## TODO techniques

| # | Fichier | Ligne | Description |
|---|---------|-------|-------------|
| 1 | `app/dashboard/page.tsx` | 55 | Programme fixe soirée — à venir de l'API bar quand le gérant peut le saisir |
| 2 | `app/dashboard/page.tsx` | 63 | Produits vedette fixes — à venir de la carte saisie par le gérant |
| 3 | `app/dashboard/page.tsx` | 148 | Calculer l'écart avec le 1er quand le classement est chargé |

## FIXME

Aucun FIXME détecté dans le code source.

## Faux-positifs notés
- `lib/otp.ts:21` — `sid !== 'TODO'` : garde-fou de détection config, pas un TODO actif
- `lib/otp.ts:26` — `url !== 'TODO'` : idem

## Total
- **TODO_VALIDER_JC** : 5
- **TODO techniques** : 3
- **FIXME** : 0

## Contexte décisions en suspens (TODO_VALIDER_JC)

### Mises paris (lignes 295-296)
Les valeurs `MISE_MIN_COINS` et `MISE_MAX_COINS` dans `config/business-rules.ts` sont des placeholders.
Impact direct sur le Blind Test (#2) et tout jeu à paris. **Décision requise avant d'ouvrir les paris aux joueurs beta.**

### Tarif annuel (ligne 334)
Le plan `ANNUEL` n'a pas de valeur définie. Impact sur la page pricing et les Founding Partners.
**Décision commerciale à prendre avant le lancement octobre 2026.**
