# BarCoins — Daily Status

Date : 2026-04-29
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
```
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
75d3419 chore: daily context update [2026-04-15]
e7a2592 chore: daily context update [2026-04-14]
```

> ⚠️ **ALERTE VÉLOCITÉ** — Aucun commit de développement depuis le **2026-04-01** (**28 jours**).
> Tous les commits récents sont des mises à jour d'agent automatique.
> Dernier vrai commit : `11ad3f5 feat: parseGameDefinition` (01/04/2026 16h23).
> **Jalon juillet 2026 en danger critique si la vélocité ne reprend pas cette semaine.**

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
- ✅ Page claim joueur : `app/claim/[token]/page.tsx` (172 lignes, états : loading / success / expired / already_claimed / auth_required)
- ✅ Dashboard gérant : form montant + génération QR + countdown expiry + aperçu coins → `app/gerant/page.tsx`
- ⚠️ QR affiché via service externe `api.qrserver.com` — dépendance réseau tiers, à remplacer par lib locale avant production
- ⚠️ OTP en mode dev (`sid !== 'TODO'`) dans `lib/otp.ts` — Twilio/Redis non configuré

**#2 — Blind test Spotify/Deezer (15%)** 🔴
- ✅ UI prototype : `app/games/blindtest/page.tsx` (142 lignes, 3 écrans : bet / listen / result)
- ❌ AUCUNE intégration API Spotify ou Deezer — 3 tracks hardcodées (Daft Punk, Stromae, The Weeknd)
- ❌ Pas de lecture audio réelle — visualisation animée simulée, aucun `<audio>`, timer 30s factice
- ❌ Pas de backend pour preview 30s ni gestion licences streaming
- 🚨 **Bloquant** : décision architecture (Spotify OAuth vs Deezer API) non prise — aucun travail depuis 28 jours

**#3 — Quiz 500 questions (12%)** 🔴
- ✅ Moteur de jeu complet : `lib/game-engine/` (reducer, state, session, scoring, questions, parseGameDefinition)
- ✅ Adaptateur GDF : `lib/game-engine/parseGameDefinition.ts` (dernier commit de dev 01/04)
- ✅ Quiz Cinema V1 jouable : `app/games/quiz-cinema/page.tsx` (70 lignes)
- ✅ Quiz générique : `app/games/quiz/page.tsx` (126 lignes, ~5 questions hardcodées)
- ❌ ~20 questions au total — cible 500+ atteinte à ~4%
- ❌ Catégories manquantes : musique, sport, culture générale, histoire, géographie, anecdotes bar
- 🚨 **Bloquant** : volume de contenu critique pour beta Founding Partners Perpignan

**#4 — Coins Play + classement live (70%)** 🟡
- ✅ Classement live SSE : `app/api/bars/[barId]/leaderboard/stream/route.ts` + `app/leaderboard/page.tsx` (232 lignes)
- ✅ Hook `useSSE` : `hooks/useSSE.ts` — mises à jour temps réel fonctionnelles
- ✅ Distribution coins via QR scan opérationnelle (paliers calculés)
- ⚠️ "Coins Play manuel" (ajout coins direct par gérant sans QR) : non visible dans le dashboard gérant actuel
- ⚠️ Classement non testé sous charge réelle (aucune session bar réelle)

**#5 — Dashboard gérant 1 clic (85%)** 🟢
- ✅ Page gérant complète : `app/gerant/page.tsx` (300 lignes, connectée à l'API réelle)
- ✅ Stats soirée : coins distribués, transactions, joueurs actifs
- ✅ Génération QR en 1 clic : saisie montant → QR + countdown expiry + aperçu coins
- ✅ Auth staff OTP fonctionnelle (`lib/otp.ts`, dev mode sans Twilio/Redis)
- ⚠️ Pas de bouton start/stop soirée visible
- ⚠️ Programme soirée et produits vedette hardcodés dans `app/dashboard/page.tsx` (lignes 55, 63)

**#6 — wheelEnabled=false** ✅
- ✅ `WHEEL_ENABLED: false` verrouillé dans `config/business-rules.ts:472`
- ✅ Commentaire : `// ← JAMAIS true sans validation JC`
- ✅ Double protection : règle affichage (ligne 186) + vérification serveur (ligne 340)

## Fichiers les plus actifs (derniers 5 commits)
> Les 5 derniers commits ne touchent que les fichiers de contexte agent :
- `barcoins-context/DAILY_STATUS.md` (+/- 82 lignes par mise à jour)
- `barcoins-context/TODO_REPORT.md` (+/- 36 lignes par mise à jour)

Derniers fichiers modifiés par du vrai code (commit 11ad3f5, 01/04) :
- `lib/game-engine/parseGameDefinition.ts`
- `lib/game-engine/questions.ts`
- `lib/barcoins/gameTypes.ts`

## Points d'attention
1. **28 jours sans commit de dev** — risque jalon juillet 2026 élevé. Les 2 priorités critiques (#2 et #3) sont à <15%.
2. **Blind test (P2)** : décision bloquante non prise (Spotify OAuth vs Deezer API). Aucun extrait audio réel.
3. **Quiz contenu (P3)** : ~20 questions disponibles sur 500 requises. Founding Partners Perpignan attendent du contenu.
4. **Coins Play manuel (P4)** : fonctionnalité absente du dashboard gérant — gérant ne peut pas distribuer des coins hors QR scan.
5. **OTP production (P1/P5)** : Twilio/Redis non configurés — `lib/otp.ts` tourne en mode dev avec `sid !== 'TODO'`.
6. **QR externe** : `api.qrserver.com` = dépendance réseau tiers non maîtrisée pour production.
7. **TODOs hardcodés** : programme soirée (`dashboard/page.tsx:55`) et produits vedette (`dashboard/page.tsx:63`) codés en dur.

## Règles métier rappel
- Coins : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta — jamais activer sans validation JC
