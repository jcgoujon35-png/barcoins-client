# BarCoins — Daily Status

Date : 2026-04-07
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)

```
11ad3f5 feat: parseGameDefinition — adaptateur GDF vers moteur natif
ef72089 fix: rendre /games/quiz-cinema public (demo sans auth)
1867648 fix: remove mult ref in dashboard + PlanKey unused import in gerant
42f8ec6 fix: build errors — remove boostActive ref + unused import
8b3c839 feat: quiz cinema V1 — moteur de jeu complet + UI 5 écrans
605a16d fix: middleware public routes exact match + staff redirect to /gerant
a579bf5 fix: add staff login form + OTP dev mode without Twilio/Redis
40c8578 fix: add prisma generate to vercel build command
3aef0b7 fix: regenerate package-lock.json from clean install (all resolved URLs present)
4de15dd fix: vercel.json — npm ci for clean install (bypass cache)
67bacb4 feat: wire all pages to real data — full backend integration
5a24412 feat: BottomNav — fond navy rgba(13,27,46,0.95), active gold #C9922A, hauteur 72px
4ecffd9 feat: profile — navy migration, avatar amber, barres progression navy, coins 3xl
806d75d feat: games — navy migration, défi-privé gradient, badge ANJ roue, lueurs
118bb38 feat: leaderboard — podium refonte (couronne, gold gradient, rise), navy migration
```

## Avancement beta

| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 75% | 🟡 |
| #2 | Blind test Spotify/Deezer | 10% | 🔴 |
| #3 | Quiz 500 questions | 8% | 🔴 |
| #4 | Coins Play + classement live | 50% | 🟡 |
| #5 | Dashboard gérant 1 clic | 70% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

## Fichiers les plus actifs (derniers 5 commits)

- `config/business-rules.ts` — refonte majeure (+581 lignes), paliers coins, règles jeu
- `lib/game-engine/reducer.ts` — moteur de jeu complet (nouveau, +248 lignes)
- `lib/game-engine/parseGameDefinition.ts` — adaptateur GDF (nouveau, +151 lignes)
- `lib/game-engine/state.ts` — états jeu (nouveau, +130 lignes)
- `components/barcoins-game/QuestionScreen.tsx` — écran questions (nouveau, +100 lignes)
- `app/games/quiz-cinema/page.tsx` — quiz cinéma V1 (nouveau, +70 lignes)
- `lib/game-engine/scoring.ts` — calcul scores (nouveau, +98 lignes)
- `app/dashboard/page.tsx` — intégration backend (+33 lignes)

## Points d'attention

### 🔴 Priorité #2 — Blind test Spotify/Deezer (bloqué)
- `app/games/blindtest/page.tsx` contient **données hardcodées** (3 tracks fixes)
- **Aucune intégration Spotify/Deezer** dans le codebase — pas d'appel API, pas de client, pas de token
- C'est un prototype UI uniquement — risque élevé pour la beta juillet 2026

### 🔴 Priorité #3 — Quiz 500 questions (très en retard)
- Un seul thème disponible : `cinema_quiz_classique.json` avec **seulement 20 questions**
- Le moteur de jeu est bien avancé (reducer, state, scoring, session, parseGameDefinition)
- Il manque ~480 questions minimum + autres thèmes
- **Ratio actuel : 20/500 = 4%** des questions cibles

### 🟡 Priorité #1 — QR code + validation gérant
- API `/api/bars/[barId]/qr` opérationnelle ✅
- Page `/claim/[token]` opérationnelle ✅
- Dashboard gérant avec génération QR ✅
- Manque : rendu visuel du QR (lib frontend à brancher ?) — à vérifier en prod

### 🟡 Priorité #4 — Coins Play + classement live
- `lib/sse.ts` présent, bouton "Voir le classement en direct" dans dashboard
- TODO non résolu : `app/dashboard/page.tsx:148` — écart avec le 1er non calculé
- Coins Play **manuel** (attribution directe par gérant) : non visible dans le code

### 🟡 Priorité #5 — Dashboard gérant 1 clic
- Chargement données bar depuis API ✅, refresh 30s ✅, stats soirée ✅
- Programme soirée hardcodé (`app/dashboard/page.tsx:55`) — TODO API
- Produits vedette hardcodés (`app/dashboard/page.tsx:63`) — TODO API

## Règles métier rappel

- Coins : `floor(montant€ × tier_multiplier)` — paliers `<10€=×1` / `10-19€=×1.5` / `20-29€=×2` / `30-49€=×3` / `50€+=×4`
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta (confirmé lignes 186 et 340 de `config/business-rules.ts`)
