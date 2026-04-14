# BarCoins — Daily Status

Date : 2026-04-14
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)

| Hash | Message |
|---|---|
| `4819dcb` | chore: daily context update [2026-04-13] |
| `2d021cf` | chore: daily context update [2026-04-12] |
| `f67e2b2` | chore: daily context update [2026-04-11] |
| `198a553` | chore: daily context update [2026-04-10] |
| `fc4299d` | chore: daily context update [2026-04-09] |
| `74261b7` | chore: daily context update [2026-04-08] |
| `40f89e1` | chore: daily context update [2026-04-07] |
| `11ad3f5` | feat: parseGameDefinition — adaptateur GDF vers moteur natif |
| `ef72089` | fix: rendre /games/quiz-cinema public (demo sans auth) |
| `1867648` | fix: remove mult ref in dashboard + PlanKey unused import in gerant |
| `42f8ec6` | fix: build errors — remove boostActive ref + unused import |
| `8b3c839` | feat: quiz cinema V1 — moteur de jeu complet + UI 5 écrans |
| `605a16d` | fix: middleware public routes exact match + staff redirect to /gerant |
| `a579bf5` | fix: add staff login form + OTP dev mode without Twilio/Redis |
| `40c8578` | fix: add prisma generate to vercel build command |

## Avancement beta

| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 75% | 🟡 |
| #2 | Blind test Spotify/Deezer | 10% | 🔴 |
| #3 | Quiz 500 questions | 20% | 🔴 |
| #4 | Coins Play + classement live | 55% | 🟡 |
| #5 | Dashboard gérant 1 clic | 70% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 QR code + validation gérant (75%)**
- ✅ Route API `/api/bars/[barId]/qr` — génération, calcul coins + multiplicateur, token PENDING
- ✅ Page `/claim/[token]` — tous les états gérés (success, expired, already_claimed, error, auth_required)
- ✅ Dashboard gérant — formulaire montant, génération QR, countdown expiration
- ✅ QR rendu via `api.qrserver.com` (service externe — point d'attention prod)
- ⚠️ Dépendance externe `api.qrserver.com` — pas de fallback si indisponible
- ❌ Test end-to-end joueur → scan → claim non documenté comme validé

**#2 Blind test Spotify/Deezer (10%)**
- ✅ UI mockup présente (`/games/blindtest/page.tsx`) avec système de mise
- ❌ Données hardcodées (3 tracks statiques : Daft Punk, Stromae, The Weeknd)
- ❌ Aucune intégration API Spotify ni Deezer dans le codebase
- ❌ Aucune route API `/api/spotify` ou `/api/deezer`
- 🔴 BLOQUÉ — priorité critique pour la beta

**#3 Quiz 500 questions (20%)**
- ✅ Moteur de jeu complet : reducer, state machine, session, scoring (`/lib/game-engine/`)
- ✅ Adaptateur `parseGameDefinition` pour format GDF
- ✅ Quiz cinema V1 fonctionnel avec 5 écrans UI (Lobby, Question, Result, Leaderboard, Final)
- ✅ Route `/games/quiz-cinema` publique (demo sans auth)
- ❌ Pool de questions : 20 questions cinema uniquement (20/500 = 4%)
- ❌ Aucun autre thème de quiz (sport, musique, culture générale, etc.)
- 🔴 BLOQUÉ sur le contenu — infrastructure prête, données manquantes

**#4 Coins Play + classement live (55%)**
- ✅ Classement live avec SSE (`/api/bars/[barId]/leaderboard/stream`)
- ✅ Leaderboard page avec refresh auto 30s + temps réel SSE
- ✅ Coins Play affichés sur profil (`/app/profile`) et dashboard joueur
- ✅ Attribution automatique via QR claim (route transactions/claim)
- ❌ Attribution manuelle de Coins Play par gérant — non implémentée
- ❌ Pas de route API pour crédit manuel (gérant → joueur)

**#5 Dashboard gérant 1 clic (70%)**
- ✅ Lancer soirée / Terminer soirée en 1 clic
- ✅ Stats live (joueurs, transactions, coins distribués)
- ✅ Générateur QR intégré avec formulaire montant
- ✅ Health Score bar affichée
- ✅ Auth staff avec OTP (mode dev sans Twilio/Redis)
- ❌ Attribution manuelle Coins Play depuis le dashboard gérant
- ❌ Gestion/lancement de jeux (quiz, blind test) depuis le dashboard gérant
- ❌ Programme soirée dynamique (hardcodé côté dashboard joueur — TODO actif)

**#6 wheelEnabled=false (✅)**
- `FEATURE_FLAGS.WHEEL_ENABLED: false` dans `config/business-rules.ts:472`
- `WHEEL_CONFIG.ENABLED_DEFAULT: false`
- Label UI : "Disponible prochainement" — aucune activation possible sans action manuelle JC

## Fichiers les plus actifs (derniers 5 commits)

> Note : les 5 derniers commits sont des mises à jour d'agent quotidien. Les fichiers de code actifs proviennent des commits précédents (8c3839 → 11ad3f5).

- `barcoins-context/DAILY_STATUS.md` — mises à jour agent
- `barcoins-context/TODO_REPORT.md` — mises à jour agent
- `lib/game-engine/parseGameDefinition.ts` — commit `11ad3f5`
- `app/games/quiz-cinema/page.tsx` — commits `ef72089`, `8b3c839`
- `app/gerant/page.tsx` — commit `1867648`
- `app/dashboard/page.tsx` — commit `1867648`

## Points d'attention

1. **[CRITIQUE] Blind test sans API** — `/games/blindtest/page.tsx` est un prototype statique. Zéro code Spotify/Deezer. Besoin de clés API + intégration preview 30s (limite légale Spotify). Bloquer du temps avant juillet.

2. **[CRITIQUE] Quiz : 20 questions pour un objectif de 500** — Le moteur est prêt mais le contenu est quasi inexistant. Envisager : import CSV/JSON en masse, génération IA supervisée, ou recrutement contributeur contenu.

3. **[MOYEN] QR dépendance externe** — `api.qrserver.com` est un service tiers. En prod, risque de timeout ou indisponibilité. Prévoir `qrcode` npm local (côté serveur) ou composant React côté client.

4. **[MOYEN] Attribution manuelle Coins Play** — Absente du dashboard gérant. Nécessaire pour les soirées où le gérant veut récompenser manuellement un joueur (animations, challenges). Route API manquante.

5. **[FAIBLE] Dashboard joueur — programme et produits hardcodés** — `app/dashboard/page.tsx:55` et `:63` : programme soirée et produits vedette sont des données statiques. TODO actif — dépend d'une interface de saisie gérant non encore développée.

6. **[FAIBLE] Classement — écart avec le 1er** — `app/dashboard/page.tsx:148` : TODO actif, le delta de coins avec le leader n'est pas calculé.

7. **[INFO] OTP en mode dev sans Twilio** — `lib/otp.ts` gère le mode dev (OTP fictif). Avant beta prod, brancher Twilio + Redis obligatoire.

## Règles métier rappel

- Coins : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta — activation uniquement par JC après validation ANJ
- JAMAIS afficher "ANJ" ou "Post-ANJ" dans l'UI
- JAMAIS utiliser le mot "token" publiquement (risque MiCA/crypto)
