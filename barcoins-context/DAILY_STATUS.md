# BarCoins — Daily Status

Date : 2026-05-04
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
```
826b0da chore: daily context update [2026-05-03]
7353eeb chore: daily context update [2026-05-02]
d840a4d chore: daily context update [2026-04-30]
8a15083 chore: daily context update [2026-04-29]
86c9f4b chore: daily context update [2026-04-28]
c43bfe2 chore: daily context update [2026-04-27]
8cb4a7d chore: daily context update [2026-04-26]
098e9c9 chore: daily context update [2026-04-25]
4e6996a chore: daily context update [2026-04-24]
82620c1 chore: daily context update [2026-04-23]
1fe5baf chore: daily context update [2026-04-22]
8f21e5e chore: daily context update [2026-04-21]
037af92 chore: daily context update [2026-04-20]
6d750c7 chore: daily context update [2026-04-19]
cda25bd chore: daily context update [2026-04-18]
```

> 🚨 **ALERTE VÉLOCITÉ — CRITIQUE** — Aucun commit de développement depuis le **2026-04-07** (**27 jours**).
> Tous les commits récents sont des mises à jour d'agent automatique.
> Dernier vrai commit de dev : `11ad3f5 feat: parseGameDefinition` (~07/04/2026).
> **Jalon juillet 2026 à ~58 jours. Priorités #2 et #3 à <15%. Risque beta Perpignan très élevé.**

## Avancement beta
| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 88% | 🟢 |
| #2 | Blind test Spotify/Deezer | 15% | 🔴 |
| #3 | Quiz 500 questions | 12% | 🔴 |
| #4 | Coins Play + classement live | 70% | 🟡 |
| #5 | Dashboard gérant 1 clic | 85% | 🟢 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 — QR code + validation gérant (88%)** 🟢
- ✅ API génération QR : `app/api/bars/[barId]/qr/route.ts`
- ✅ API claim joueur : `app/api/bars/[barId]/transactions/claim/route.ts`
- ✅ Page claim joueur : `app/claim/[token]/page.tsx`
- ✅ Dashboard gérant : form montant + génération QR + countdown expiry + aperçu coins → `app/gerant/page.tsx`
- ⚠️ QR rendu via service externe `api.qrserver.com` — dépendance réseau tiers, à remplacer par lib locale avant production
- ⚠️ OTP Twilio non configuré — `lib/otp.ts` en mode dev (sid/url valent `'TODO'`)

**#2 — Blind test Spotify/Deezer (15%)** 🔴
- ✅ UI prototype : `app/games/blindtest/page.tsx` (3 écrans : bet / listen / result)
- ❌ Aucune intégration API Spotify ou Deezer — 3 tracks hardcodées (Daft Punk, Stromae, The Weeknd)
- ❌ Pas de lecture audio réelle — timer 30s factice, aucune balise `<audio>`
- ❌ Pas de backend preview 30s ni gestion licences streaming
- 🚨 **Bloquant** : décision architecture (Spotify OAuth vs Deezer API) toujours non prise — 27 jours sans avancement

**#3 — Quiz 500 questions (12%)** 🔴
- ✅ Moteur de jeu complet : `lib/game-engine/` (reducer, state, session, scoring, questions, parseGameDefinition)
- ✅ Quiz Cinema V1 jouable : `app/games/quiz-cinema/page.tsx`
- ✅ Engine anti-répétition + shuffle Fisher-Yates implémentés
- ⚠️ Seed démo : seulement 5 questions (`prisma/seed.ts`)
- ❌ Objectif 500 questions non atteint — stock de contenu quasi vide
- 🚨 **Bloquant** : rédaction contenu quiz à faire entièrement (travail éditorial important)

**#4 — Coins Play manuel + classement live (70%)** 🟡
- ✅ SSE stream classement : `app/api/bars/[barId]/leaderboard/stream/route.ts`
- ✅ Page leaderboard joueur avec SSE temps réel : `app/leaderboard/page.tsx`
- ✅ 5 écrans moteur jeu : LobbyScreen / QuestionScreen / ResultScreen / LeaderboardScreen / FinalScreen
- ⚠️ `app/dashboard/page.tsx:148` — calcul écart avec le 1er non implémenté (TODO)
- ⚠️ Programme soirée et produits vedette hardcodés (`app/dashboard/page.tsx:55,63`) — non saisissables par gérant
- ⚠️ Coins Play "défi" (`app/games/challenge/page.tsx`) en prototype UI — non connecté au backend

**#5 — Dashboard gérant 1 clic (85%)** 🟢
- ✅ Page gérant complète `app/gerant/page.tsx` — stats soirée, QR 1-clic, countdown expiry
- ✅ API session bar : `app/api/bars/[barId]/session/route.ts`
- ⚠️ Programme soirée fixe non éditable par gérant (`app/dashboard/page.tsx:55`)
- ⚠️ Produits vedette fixes non éditables par gérant (`app/dashboard/page.tsx:63`)

**#6 — wheelEnabled=false (✅)** — bloqué en beta
- `config/business-rules.ts:472` : `WHEEL_ENABLED: false` — commentaire « JAMAIS true sans validation JC »

## Fichiers les plus actifs (derniers 5 commits)
> Aucun fichier source modifié — les 5 derniers commits sont exclusivement des mises à jour d'agent.
> Derniers fichiers réellement modifiés (commits dev ~07/04/2026) :
- `lib/game-engine/parseGameDefinition.ts`
- `app/games/quiz-cinema/page.tsx`
- `app/dashboard/page.tsx`
- `app/gerant/page.tsx`
- `config/business-rules.ts`

## Points d'attention
1. **VÉLOCITÉ NULLE depuis 27 jours** — aucun commit de dev depuis le 07/04/2026. Jalon beta juillet 2026 en danger critique.
2. **#2 Blind test totalement bloqué** — décision Spotify vs Deezer requise avant toute implémentation audio.
3. **#3 Quiz 500 questions** — ~488 questions manquantes. Sans contenu, le mode quiz ne peut pas être beta-testé.
4. **OTP Twilio** (`lib/otp.ts:21,26`) — mode dev actif, authentification SMS non fonctionnelle en production.
5. **QR externe** (`api.qrserver.com`) — dépendance tiers en dur, single point of failure réseau.
6. **MISE_MIN/MAX_COINS et tarif ANNUEL** non fixés dans `business-rules.ts` — valeur `'TODO_VALIDER_JC'`.
7. **Challenge page** (`app/games/challenge/page.tsx`) — UI prototype, joueurs et parties simulés, sans backend.

## Règles métier rappel
- Coins : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
