# BarCoins — Daily Status

Date : 2026-04-21
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
```
037af92 chore: daily context update [2026-04-20]
6d750c7 chore: daily context update [2026-04-19]
cda25bd chore: daily context update [2026-04-18]
d1ff510 chore: daily context update [2026-04-17]
d8a414e chore: daily context update [2026-04-16]
75d3419 chore: daily context update [2026-04-15]
e7a2592 chore: daily context update [2026-04-14]
4819dcb chore: daily context update [2026-04-13]
2d021cf chore: daily context update [2026-04-12]
f67e2b2 chore: daily context update [2026-04-11]
198a553 chore: daily context update [2026-04-10]
fc4299d chore: daily context update [2026-04-09]
74261b7 chore: daily context update [2026-04-08]
40f89e1 chore: daily context update [2026-04-07]
11ad3f5 feat: parseGameDefinition — adaptateur GDF vers moteur natif
```

> ⚠️ Aucun commit de développement depuis le 2026-04-07 (**14 jours**). Les commits récents sont exclusivement des mises à jour d'agent. Dernier vrai commit : `parseGameDefinition` (adaptateur GDF vers moteur natif).

## Avancement beta
| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 88% | 🟢 |
| #2 | Blind test Spotify/Deezer | 20% | 🔴 |
| #3 | Quiz 500 questions | 10% | 🔴 |
| #4 | Coins Play + classement live | 70% | 🟡 |
| #5 | Dashboard gérant 1 clic | 88% | 🟢 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 — QR code + validation gérant (88%)** 🟢
- ✅ API génération QR : `app/api/bars/[barId]/qr/route.ts` (POST, calcul paliers, expiry 90s)
- ✅ API claim joueur : `app/api/bars/[barId]/transactions/claim/route.ts`
- ✅ Page claim joueur : `app/claim/[token]/page.tsx` (172 lignes, gestion tous états : loading/success/expired/already_claimed)
- ✅ Dashboard gérant : form montant + génération QR + countdown + aperçu coins : `app/gerant/page.tsx`
- ⚠️ QR affiché via service externe `api.qrserver.com` — dépendance réseau tiers, à remplacer par lib locale avant production

**#2 — Blind test Spotify/Deezer (20%)** 🔴
- ✅ UI prototype : `app/games/blindtest/page.tsx` (3 écrans : bet/listen/result, 142 lignes)
- ❌ AUCUNE intégration API Spotify ou Deezer — 3 tracks hardcodées (mock)
- ❌ Pas de lecture audio réelle — visualisation simulée seulement
- ❌ Pas de backend pour preview 30s ni gestion licences streaming
- 🚨 Bloquant : intégration API audio requise avant tout test avec Founding Partners

**#3 — Quiz 500 questions (10%)** 🔴
- ✅ Moteur de jeu complet : `lib/game-engine/` (reducer, state, session, scoring, questions, parseGameDefinition)
- ✅ Quiz Cinema V1 jouable en démo : `app/games/quiz-cinema/page.tsx`
- ✅ Quiz bar/cocktails générique : `app/games/quiz/page.tsx` (5 questions hardcodées)
- ❌ ~25 questions au total toutes catégories — cible 500+ non atteinte
- ❌ Une seule catégorie réelle (cinéma) — manque musique, sport, culture générale, histoire
- 🚨 Bloquant : volume questions insuffisant pour une soirée entière

**#4 — Coins Play + classement live (70%)** 🟡
- ✅ API leaderboard : `app/api/bars/[barId]/leaderboard/route.ts` (périodes SOIREE/HEBDO/MENSUEL/ANNUEL)
- ✅ SSE stream temps réel : `app/api/bars/[barId]/leaderboard/stream/route.ts`
- ✅ Page leaderboard : `app/leaderboard/page.tsx` (232 lignes, podium refonte, or gradient)
- ✅ Moteur de jeu avec scoring : `lib/game-engine/scoring.ts`
- ⚠️ TODO dans `app/dashboard/page.tsx:148` : calcul écart avec le 1er non implémenté
- ⚠️ Attribution manuelle de coins depuis le dashboard gérant non documentée

**#5 — Dashboard gérant 1 clic (88%)** 🟢
- ✅ Page gérant : `app/gerant/page.tsx` (300 lignes — stats session, QR, jeu actif)
- ✅ API session bar : `app/api/bars/[barId]/session/route.ts`
- ✅ Refresh automatique toutes les 30s
- ⚠️ Programme soirée et produits vedette dans `app/dashboard/page.tsx` encore hardcodés (lignes 55, 63)
- ⚠️ Le gérant ne peut pas encore saisir le programme ni la carte

**#6 — wheelEnabled = false (✅)** 🔒
- ✅ `config/business-rules.ts:186` : règle d'affichage commentée
- ✅ `config/business-rules.ts:340` : vérification serveur documentée
- Bloqué volontairement pour toute la durée de la beta

## Fichiers les plus actifs (derniers 5 commits)
Tous les commits récents sont des mises à jour d'agent :
- `barcoins-context/DAILY_STATUS.md` — mise à jour quotidienne
- `barcoins-context/TODO_REPORT.md` — mise à jour quotidienne

Derniers fichiers modifiés par du vrai code de développement (avant 2026-04-07) :
- `lib/game-engine/parseGameDefinition.ts` (commit `11ad3f5`)
- `app/games/quiz-cinema/page.tsx` (commit `ef72089`)
- `middleware.ts` (commit `605a16d`)
- `app/gerant/page.tsx` (commits `1867648`, `42f8ec6`)

## Points d'attention

1. **Inactivité code prolongée (14 jours)** — Dernier commit réel : 2026-04-07. Objectif beta juillet 2026 = 10 semaines restantes. Risque de retard si reprise tardive.

2. **Blind test bloqué** — Zéro intégration API audio. Spotify nécessite OAuth + preview URL (30s). Deezer a une API plus permissive. Décision architecture requise avant de coder.

3. **Quiz loin de l'objectif** — ~25 questions pour 500 demandées. Besoin urgent de rédaction ou import dataset questions/réponses. C'est la tâche la plus volumineuse en contenu.

4. **QR externe** — Dépendance `api.qrserver.com` en production est un risque (service tiers). Bibliothèque locale recommandée (`qrcode`, `qr-code-styling`).

5. **TODO_VALIDER_JC non résolus** — 5 occurrences dont 3 valeurs métier bloquantes : `MISE_MIN_COINS`, `MISE_MAX_COINS` (challenge duel), `ANNUEL` (récompenses classement annuel).

6. **Programme soirée & carte gérant** — `app/dashboard/page.tsx:55,63` hardcodés. Le gérant ne peut pas encore configurer le programme ou les produits vedette via l'interface.

## Règles métier rappel
- Coins : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
