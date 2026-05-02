# BarCoins — Daily Status

Date : 2026-05-02
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
```
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
d1ff510 chore: daily context update [2026-04-17]
d8a414e chore: daily context update [2026-04-16]
```

> ⚠️ **ALERTE VÉLOCITÉ — CRITIQUE** — Aucun commit de développement depuis le **2026-04-07** (**25 jours**).
> Tous les commits récents sont des mises à jour d'agent automatique.
> Dernier vrai commit de dev : `11ad3f5 feat: parseGameDefinition` (~07/04/2026).
> **Jalon juillet 2026 à 60 jours. Priorités #2 et #3 à <15%. Risque beta Perpignan très élevé.**

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
- ✅ Page claim joueur : `app/claim/[token]/page.tsx` (états : loading / success / expired / already_claimed / auth_required)
- ✅ Dashboard gérant : form montant + génération QR + countdown expiry + aperçu coins → `app/gerant/page.tsx`
- ⚠️ QR affiché via service externe `api.qrserver.com` — dépendance réseau tiers, à remplacer par lib locale avant production
- ⚠️ OTP en mode dev (`sid !== 'TODO'`) dans `lib/otp.ts` — Twilio/Redis non configuré pour production

**#2 — Blind test Spotify/Deezer (15%)** 🔴
- ✅ UI prototype : `app/games/blindtest/page.tsx` (3 écrans : bet / listen / result)
- ❌ AUCUNE intégration API Spotify ou Deezer — 3 tracks hardcodées (Daft Punk, Stromae, The Weeknd)
- ❌ Pas de lecture audio réelle — visualisation animée simulée, timer 30s factice, aucun `<audio>`
- ❌ Pas de backend pour preview 30s ni gestion licences streaming
- 🚨 **Bloquant** : décision architecture (Spotify OAuth vs Deezer API) non prise — 25 jours sans avancement

**#3 — Quiz 500 questions (12%)** 🔴
- ✅ Moteur de jeu complet : `lib/game-engine/` (reducer, state, session, scoring, questions, parseGameDefinition)
- ✅ Adaptateur GDF : `lib/game-engine/parseGameDefinition.ts`
- ✅ Quiz Cinema V1 jouable : `app/games/quiz-cinema/page.tsx`
- ⚠️ Un seul fichier de questions : `data/game/cinema_quiz_classique.json` (22 lignes ≈ 5 questions max)
- ❌ Objectif 500 questions non atteint — stock de contenu quasiment vide
- 🚨 **Bloquant** : contenu quiz à créer entièrement — travail manuel important

**#4 — Coins Play manuel + classement live (70%)** 🟡
- ✅ SSE stream classement : `app/api/bars/[barId]/leaderboard/stream/route.ts`
- ✅ Page leaderboard joueur : `app/leaderboard/page.tsx`
- ✅ Moteur de jeu complet avec 5 écrans (Lobby / Question / Result / Leaderboard / Final)
- ✅ Dashboard joueur affiche rang et delta vs 1er
- ⚠️ TODO dans `app/dashboard/page.tsx:148` — calcul écart avec 1er non implémenté
- ⚠️ Coins Play "manuel" (hors jeu) non testé en conditions réelles

**#5 — Dashboard gérant 1 clic (85%)** 🟢
- ✅ Page gérant complète : `app/gerant/page.tsx` (300 lignes)
- ✅ Stats soirée (coins distribués, transactions, joueurs)
- ✅ Génération QR 1 clic avec montant libre
- ⚠️ Programme soirée fixe hardcodé (`app/dashboard/page.tsx:55`) — pas encore saisissable par gérant
- ⚠️ Produits vedette fixes (`app/dashboard/page.tsx:63`) — pas encore via carte gérant

**#6 — wheelEnabled=false (✅)** — bloqué en beta
- ✅ `WHEEL_CONFIG.ENABLED_DEFAULT = false` dans `config/business-rules.ts:340`
- ✅ Badge ANJ "Disponible prochainement" sur la page games

## Fichiers les plus actifs (derniers 5 commits)
> Aucun fichier source modifié — uniquement les 2 fichiers de contexte agent :
- `barcoins-context/DAILY_STATUS.md`
- `barcoins-context/TODO_REPORT.md`

## Points d'attention

### 🚨 Critique
- **Vélocité nulle** — 25 jours sans commit de dev. Jalon beta juillet 2026 à 60 jours.
- **Blind test** (#2) : décision architecture Spotify vs Deezer bloquante. 0% de lecture audio réelle.
- **Quiz questions** (#3) : 5 questions disponibles pour un objectif de 500. Travail de contenu massif non commencé.

### ⚠️ À surveiller
- OTP Twilio/Redis non configuré — mode dev uniquement (`lib/otp.ts:21-26`)
- QR dépendant de `api.qrserver.com` externe — à remplacer par `qrcode` lib locale
- `MISE_MIN_COINS` / `MISE_MAX_COINS` / `ANNUEL` en `TODO_VALIDER_JC` dans business-rules — décisions commerciales en suspens
- Programme soirée et carte produits hardcodés dans le dashboard joueur

### ✅ Solide
- Architecture backend QR claim + anti-fraude opérationnelle
- Dashboard gérant fonctionnel
- Moteur de jeu quiz avec SSE live leaderboard

## Règles métier rappel
- Coins : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
