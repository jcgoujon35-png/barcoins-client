# BarCoins — Daily Status

Date : 2026-04-26
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
```
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
4819dcb chore: daily context update [2026-04-13]
2d021cf chore: daily context update [2026-04-12]
f67e2b2 chore: daily context update [2026-04-11]
```

> ⚠️ Aucun commit de développement depuis le **2026-04-01** (**25 jours**). Tous les commits récents sont des mises à jour d'agent. Dernier vrai commit : `11ad3f5 feat: parseGameDefinition` (adaptateur GDF vers moteur natif). Jalón juillet 2026 en danger si la vélocité ne reprend pas rapidement.

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
- ✅ API génération QR : `app/api/bars/[barId]/qr/route.ts` (POST, calcul paliers, expiry configurable)
- ✅ API claim joueur : `app/api/bars/[barId]/transactions/claim/route.ts`
- ✅ Page claim joueur : `app/claim/[token]/page.tsx` (états : loading / success / expired / already_claimed / auth_required)
- ✅ Dashboard gérant : form montant + génération QR + countdown + aperçu coins → `app/gerant/page.tsx`
- ⚠️ QR affiché via service externe `api.qrserver.com` — dépendance réseau tiers, à remplacer par lib locale avant production

**#2 — Blind test Spotify/Deezer (15%)** 🔴
- ✅ UI prototype : `app/games/blindtest/page.tsx` (3 écrans : bet / listen / result, 142 lignes)
- ❌ AUCUNE intégration API Spotify ou Deezer — 3 tracks hardcodées (Daft Punk, Stromae, The Weeknd)
- ❌ Pas de lecture audio réelle — visualisation animée simulée uniquement (timer 30s, aucun `<audio>`)
- ❌ Pas de backend pour preview 30s ni gestion licences streaming
- 🚨 Bloquant : décision architecture (Spotify OAuth vs Deezer API) non prise — aucun travail depuis le 01/04

**#3 — Quiz 500 questions (12%)** 🔴
- ✅ Moteur de jeu complet : `lib/game-engine/` (reducer, state, session, scoring, questions, parseGameDefinition)
- ✅ Adaptateur GDF `parseGameDefinition.ts` — dernier commit de dev (01/04)
- ✅ Quiz Cinema V1 jouable : `app/games/quiz-cinema/page.tsx` (70 lignes)
- ✅ Quiz générique : `app/games/quiz/page.tsx` (126 lignes, 5 questions hardcodées)
- ❌ ~20 questions au total toutes catégories — cible 500+ non atteinte (~4% du volume)
- ❌ Manque : musique, sport, culture générale, histoire, géographie, anecdotes bar
- 🚨 Bloquant : volume de contenu critique pour beta avec Founding Partners Perpignan

**#4 — Coins Play + classement live (70%)** 🟡
- ✅ Classement live SSE : `app/api/bars/[barId]/leaderboard/stream/route.ts` + `app/leaderboard/page.tsx` (232 lignes)
- ✅ `useSSE` hook : `hooks/useSSE.ts` — mises à jour temps réel fonctionnelles
- ✅ Distribution coins via QR scan opérationnelle (paliers calculés)
- ⚠️ "Coins Play manuel" (ajout coins direct par gérant sans QR) : non visible dans le dashboard gérant actuel
- ⚠️ Classement non testé sous charge réelle (pas de session bar réelle)

**#5 — Dashboard gérant 1 clic (85%)** 🟢
- ✅ Page gérant complète : `app/gerant/page.tsx` (300 lignes, connectée API réelle)
- ✅ Stats soirée : coins distribués, transactions, joueurs actifs
- ✅ Génération QR en 1 clic : saisie montant → QR + countdown expiry + aperçu coins
- ✅ Auth staff : OTP, `lib/otp.ts` (dev mode sans Twilio/Redis)
- ⚠️ OTP en mode dev (`sid !== 'TODO'`) — Twilio non configuré en production
- ⚠️ Pas de bouton start/stop soirée visible dans le dashboard

**#6 — wheelEnabled=false** ✅
- ✅ `WHEEL_ENABLED: false` — verrouillé dans `config/business-rules.ts:472`
- ✅ Commentaire : `// JAMAIS true sans validation JC`
- ✅ Double protection : règle affichage (ligne 186) + vérification serveur (ligne 340)

## Fichiers les plus actifs (derniers 5 commits de dev)
Les 5 derniers commits réels (avant l'agent) ont touché :
- `lib/game-engine/parseGameDefinition.ts` (151 lignes ajoutées — 01/04)
- `app/games/quiz-cinema/page.tsx` (fix route publique)
- `app/gerant/page.tsx` (fix imports inutilisés)
- `app/dashboard/page.tsx` (fix imports)

> Note : depuis le 07/04, seuls `barcoins-context/DAILY_STATUS.md` et `barcoins-context/TODO_REPORT.md` ont été modifiés (agent quotidien).

## Points d'attention

### 🚨 Critique
1. **25 jours sans commit de développement** — dernier commit JC le 01/04/2026. Avec un objectif beta juillet 2026, il reste ~10 semaines. Les priorités #2 et #3 nécessitent un travail substantiel.
2. **Blind test sans API** — la page est un mock visuel sans audio. Décision Spotify vs Deezer indispensable avant de coder quoi que ce soit.
3. **Quiz : ~20 questions vs 500 minimum** — le contenu est le principal bloquant pour une vraie soirée avec les Founding Partners.

### ⚠️ À surveiller
4. **Twilio OTP non configuré** — `lib/otp.ts` détecte `sid === 'TODO'` pour passer en mode dev. À configurer avant tout test avec Founding Partners.
5. **QR via api.qrserver.com** — dépendance externe non maîtrisée. Remplacer par `qrcode` npm avant production.
6. **Coins Play manuel** — le dashboard gérant ne montre pas de bouton d'ajout manuel de coins. À confirmer si c'est prévu ou si le seul flux est QR scan.
7. **HEAD détaché** (`HEAD detached from refs/heads/master`) — le repo est en checkout détaché. Vérifier le contexte CI/CD et le workflow de push.

## Règles métier rappel
- Coins : `floor(montant€ × tier_multiplier)` — paliers `<10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4`
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta — `WHEEL_ENABLED: false` dans `config/business-rules.ts:472`
