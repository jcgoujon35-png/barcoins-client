# BarCoins — Daily Status

Date : 2026-04-15
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)

| # | Hash | Message |
|---|------|---------|
| 1 | e7a2592 | chore: daily context update [2026-04-14] |
| 2 | 4819dcb | chore: daily context update [2026-04-13] |
| 3 | 2d021cf | chore: daily context update [2026-04-12] |
| 4 | f67e2b2 | chore: daily context update [2026-04-11] |
| 5 | 198a553 | chore: daily context update [2026-04-10] |
| 6 | fc4299d | chore: daily context update [2026-04-09] |
| 7 | 74261b7 | chore: daily context update [2026-04-08] |
| 8 | 40f89e1 | chore: daily context update [2026-04-07] |
| 9 | 11ad3f5 | feat: parseGameDefinition — adaptateur GDF vers moteur natif |
| 10 | ef72089 | fix: rendre /games/quiz-cinema public (demo sans auth) |
| 11 | 1867648 | fix: remove mult ref in dashboard + PlanKey unused import in gerant |
| 12 | 42f8ec6 | fix: build errors — remove boostActive ref + unused import |
| 13 | 8b3c839 | feat: quiz cinema V1 — moteur de jeu complet + UI 5 écrans |
| 14 | 605a16d | fix: middleware public routes exact match + staff redirect to /gerant |
| 15 | a579bf5 | fix: add staff login form + OTP dev mode without Twilio/Redis |

> Note : commits 1–8 sont des mises à jour de contexte daily agent. Le vrai travail code est sur les commits 9–15 (semaine du 07-14 avril).

## Avancement beta

| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 70% | 🟡 |
| #2 | Blind test Spotify/Deezer | 10% | 🔴 |
| #3 | Quiz 500 questions | 20% | 🔴 |
| #4 | Coins Play + classement live | 60% | 🟡 |
| #5 | Dashboard gérant 1 clic | 65% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 — QR code + validation gérant (70%)**
- API `/api/bars/[barId]/qr` opérationnelle (67 lignes) ✅
- Route claim `/api/bars/[barId]/transactions/claim` (121 lignes) ✅
- Page `/claim/[token]` avec flux auth + callbackUrl ✅
- Dashboard gérant avec génération QR + countdown ✅
- Manque : affichage QR en image (actuellement URL seulement ?) + test E2E sur bar physique

**#2 — Blind test Spotify/Deezer (10%)**
- UI `/games/blindtest/page.tsx` existe (142 lignes) ✅
- MAIS : uniquement 3 pistes hardcodées (Daft Punk, Stromae, The Weeknd)
- ZÉRO intégration API Spotify ou Deezer — aucune route, aucun SDK, aucune clé
- Audio simulé visuellement (pas de vrai extrait sonore)
- C'est une démo UI, pas une feature fonctionnelle

**#3 — Quiz 500 questions (20%)**
- Moteur de jeu complet : parseGameDefinition, reducer, scoring, state, session, questions ✅
- Quiz cinema V1 UI (5 écrans) ✅
- `cinema_quiz_classique.json` : **20 questions** (besoin : 500+)
- `cinema_quiz_classique_session_v1.json` : structure manches présente, mais 0 questions injectées
- Seule catégorie : cinéma. Besoin : culture générale, musique, sport, etc.

**#4 — Coins Play + classement live (60%)**
- Leaderboard API (90 lignes) avec types SOIREE / HEBDO / MENSUEL ✅
- SSE stream `/leaderboard/stream` opérationnel (lib/sse.ts + SSE_CHANNELS) ✅
- lib/coins.ts (285 lignes) pour la logique coins ✅
- Page `/leaderboard` et `/games/challenge` existent ✅
- Manque : flux manuel gérant pour attribuer des Coins Play sans QR (ex. champion soirée), test live SSE

**#5 — Dashboard gérant 1 clic (65%)**
- `/gerant/page.tsx` (300 lignes) avec start/stop session, génération QR, stats soirée ✅
- Refresh automatique toutes les 30s ✅
- TODO en dashboard joueur : programme soirée et produits vedette encore hardcodés (`app/dashboard/page.tsx:55,63`)
- Manque : lancer un jeu depuis le dashboard gérant, health score affiché, gestion boost

**#6 — wheelEnabled=false (✅)**
- `WHEEL_CONFIG.ENABLED_DEFAULT = false` dans business-rules.ts (ligne 344) ✅
- Commentaire serveur explicite ✅

## Fichiers les plus actifs (commits 9–15, hors daily)

| Fichier | Activité |
|---|---|
| `lib/game-engine/parseGameDefinition.ts` | Nouveau — 151 lignes, adaptateur GDF |
| `app/games/quiz-cinema/page.tsx` | Quiz cinema V1 (70 lignes) |
| `middleware.ts` | Fix routes publiques |
| `app/gerant/page.tsx` | Dashboard gérant (300 lignes) |
| `app/login/page.tsx` | Staff login + OTP dev mode |
| `lib/game-engine/reducer.ts` | Moteur jeu (248 lignes) |
| `lib/game-engine/state.ts` | État jeu (130 lignes) |

## Points d'attention

1. **Blind test bloqué** — L'UI est là mais aucune intégration audio/API. Il faut choisir une stratégie : Spotify Embed (simple, gratuit) ou Deezer API (preview 30s). Sans cela, la feature #2 reste à 10%.

2. **Quiz : volume de questions critique** — 20 questions pour un quiz en soirée est insuffisant. Les Founding Partners vont saturer en 1 soirée. Objectif 500 questions = 25× le stock actuel. À prioriser avant le 1er test beta.

3. **cinema_quiz_classique_session_v1.json mal formé** — La structure "manches" existe mais les questions ne sont pas injectées (count = 0). Le parseGameDefinition pourrait échouer silencieusement.

4. **HEAD détaché** — `git status` indique `HEAD detached from refs/heads/master`. Le checkout remote est en mode détaché. Les commits du daily agent (chore) ne remonteront pas sur master sans une opération de push/merge explicite.

5. **PVP MISE_MIN/MAX et LEADERBOARD ANNUEL** — Encore en `TODO_VALIDER_JC` dans business-rules.ts. À valider avant d'activer le mode PvP.

6. **Dashboard joueur** — Programme soirée et produits vedette toujours hardcodés (`app/dashboard/page.tsx:55,63`). Impact UX pour les Founding Partners.

## Règles métier rappel

- **Coins** : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta — vérification côté serveur obligatoire
