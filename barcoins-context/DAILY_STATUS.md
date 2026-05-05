# BarCoins — Daily Status

Date : 2026-05-05
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)

```
f207a5c feat(marketing): page standalone HTML + redirect /marketing → /marketing/index.html
9965756 fix(ERR-04): label Bcoins ce soir
77d9959 fix(ERR-03): multiplicateur depuis business-rules.ts
a1c8605 fix(ERR-03): multiplicateur depuis business-rules.ts
0307c06 fix(ERR-03): multiplicateur depuis business-rules.ts
0e8fa42 fix(ERR-04): label Bcoins ce soir
aecfba7 fix(ERR-04): label Bcoins ce soir
c6750b1 fix(ERR-03): multiplicateur depuis business-rules.ts
243cc17 chore: daily context update [2026-05-04]
826b0da chore: daily context update [2026-05-03]
7353eeb chore: daily context update [2026-05-02]
d840a4d chore: daily context update [2026-04-30]
8a15083 chore: daily context update [2026-04-29]
86c9f4b chore: daily context update [2026-04-28]
c43bfe2 chore: daily context update [2026-04-27]
```

> ✅ Reprise de dev constatée : 8 commits réels depuis hier (ERR-03, ERR-04, marketing). Après 27 jours sans commit de dev, l'activité reprend.

## Avancement beta

| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 75% | 🟢 |
| #2 | Blind test Spotify/Deezer | 30% | 🟡 |
| #3 | Quiz 500 questions | 10% | 🔴 |
| #4 | Coins Play + classement live | 65% | 🟡 |
| #5 | Dashboard gérant 1 clic | 60% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 QR code + validation gérant (75%)**
- ✅ API POST `/api/bars/[barId]/qr` — génère token, calcule coins, expiry 90s
- ✅ API POST `/api/bars/[barId]/transactions/claim` — valide token, crédite coins, SSE broadcast
- ✅ Page `/claim/[token]` — gère tous les états (loading, success, expired, already_claimed, error)
- ✅ Dashboard gérant `/gerant` avec QR display + timer dégressif + stats soirée
- ⚠️ OTP Twilio non configuré — `lib/otp.ts` en mode dev (guards `sid !== 'TODO'`)
- ⚠️ Tests end-to-end in situ non encore réalisés

**#2 Blind test Spotify/Deezer (30%)**
- ✅ `lib/blindtest/providers.ts` — intégration API Spotify + Deezer (preview 30s) complète et propre
- ❌ `app/games/blindtest/page.tsx` — toujours en mock (3 tracks hardcodés Daft Punk / Stromae / The Weeknd)
- ❌ Aucun appel API réel, aucune balise `<audio>`, timer 30s factice
- ❌ Aucune route serveur pour résoudre les previews
- ❌ Aucun catalogue de tracks lié au provider

**#3 Quiz 500 questions (10%)**
- ❌ `app/games/quiz/page.tsx` — 5 questions hardcodées, UI mock déconnectée du moteur
- ✅ Moteur de jeu `lib/game-engine/` — architecture correcte (reducer, state, session, questions, scoring)
- ✅ Demo fonctionnelle `/game-demo` avec cinema quiz (données JSON locales)
- ❌ Aucune base de questions backend (500 minimum requis pour beta)
- ❌ Aucune API route pour servir les questions en conditions réelles

**#4 Coins Play + classement live (65%)**
- ✅ Page `/leaderboard` avec SSE temps réel + polling 30s fallback
- ✅ API GET `/api/bars/[barId]/leaderboard` — fenêtres SOIREE / HEBDO / ALL_TIME
- ✅ Route SSE `/api/bars/[barId]/leaderboard/stream`
- ✅ `lib/coins.ts` — `calculateQRPlayCoins()` conforme business-rules.ts
- ⚠️ Attribution coins depuis fin de partie non câblée (game engine → creditCoins manquant)
- ⚠️ Attribution manuelle coins par gérant non implémentée

**#5 Dashboard gérant 1 clic (60%)**
- ✅ `/gerant/page.tsx` — stats soirée, génération QR, statut bar, live API
- ✅ API `/api/bars/[barId]/session` — stats en temps réel
- ❌ Programme soirée hardcodé — non saisissable par le gérant (`app/dashboard/page.tsx:55`)
- ❌ Produits vedette hardcodés — non saisissables par le gérant (`app/dashboard/page.tsx:63`)
- ❌ Calcul écart avec le 1er du classement non implémenté (`app/dashboard/page.tsx:148`)
- ❌ Lancement de jeu depuis le dashboard gérant non implémenté

**#6 wheelEnabled=false (100%)**
- ✅ `prisma/seed.ts:42` — `wheelEnabled: false // JAMAIS true en beta`
- ✅ `config/business-rules.ts` — `WHEEL_CONFIG.ENABLED_DEFAULT: false`
- ✅ Commentaire de garde : "Activation uniquement par JC après validation ANJ"

## Fichiers les plus actifs (derniers 5 commits)

```
public/marketing/index.html            +3971 lignes — page standalone marketing complète
public/marketing/barcoins-marketing.css +2165 lignes — CSS marketing
public/marketing/barcoins-init.js      +645 lignes  — JS animations marketing
public/marketing/*.png                  5 images (logos + steps vidéo)
app/gerant/page.tsx                     fix ERR-04 — label "Bcoins ce soir"
config/business-rules.ts               fix ERR-03 — multiplicateur depuis business-rules.ts
middleware.ts                           redirect /marketing → /marketing/index.html
next.config.ts                          config build output marketing
```

## Points d'attention

### 🟢 Bonne nouvelle — Reprise de dev
Après 27 jours de stagnation, 8 commits réels apparaissent (ERR-03 / ERR-04 / marketing). Les bugs multiplicateur et label "Bcoins ce soir" sont correctement corrigés.

### 🔴 Bloquant — Quiz 500 questions
La page `/games/quiz` est en prototype (5 questions hardcodées). Le moteur est prêt mais aucune source de données réelle n'existe. Risque élevé pour le jalon juillet 2026 — c'est la priorité la plus en retard.

### 🟡 Attention — Blind test UI non connectée à l'API
`lib/blindtest/providers.ts` est propre et prêt, mais `app/games/blindtest/page.tsx` n'en fait aucun usage. Le gap entre le code d'intégration API et l'UI est total.

### 🟡 Attention — Coins Play fin de partie non câblée
Le game engine (reducer + scoring) existe mais `creditCoins()` n'est pas appelé en fin de partie. Les coins affichés en démo restent dans le state React local, non persistés.

### 🟡 À surveiller — Marketing prioritaire sur features beta
Les 5 derniers commits (non daily) portent essentiellement sur la page marketing standalone (6796 lignes ajoutées). C'est utile pour les Founding Partners, mais les priorités beta #2 et #3 restent à 10-30%.

### ℹ️ HEAD détaché
`git status` signale `HEAD detached from refs/heads/master`. Normal dans l'environnement agent CI, à vérifier si développement local.

## Règles métier rappel

- **Coins** : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `config/business-rules.ts`
- `wheelEnabled = false` en beta — activation uniquement post-ANJ par JC
- QR expiry : 90 secondes (`QR_RULES.EXPIRY_SECONDS`)
- Coins Play ≠ Coins Fidélité — deux soldes séparés
