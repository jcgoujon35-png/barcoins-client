# BarCoins — Daily Status

Date : 2026-04-18
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
1. `d1ff510` chore: daily context update [2026-04-17]
2. `d8a414e` chore: daily context update [2026-04-16]
3. `75d3419` chore: daily context update [2026-04-15]
4. `e7a2592` chore: daily context update [2026-04-14]
5. `4819dcb` chore: daily context update [2026-04-13]
6. `2d021cf` chore: daily context update [2026-04-12]
7. `f67e2b2` chore: daily context update [2026-04-11]
8. `198a553` chore: daily context update [2026-04-10]
9. `fc4299d` chore: daily context update [2026-04-09]
10. `74261b7` chore: daily context update [2026-04-08]
11. `40f89e1` chore: daily context update [2026-04-07]
12. `11ad3f5` feat: parseGameDefinition — adaptateur GDF vers moteur natif
13. `ef72089` fix: rendre /games/quiz-cinema public (demo sans auth)
14. `1867648` fix: remove mult ref in dashboard + PlanKey unused import in gerant
15. `42f8ec6` fix: build errors — remove boostActive ref + unused import

> **Note :** Dernier commit de code réel = 1er avril 2026 (11ad3f5). Les 11 derniers commits sont des mises à jour de contexte agent. Aucune feature codée depuis 17 jours.

## Avancement beta
| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 70% | 🟡 |
| #2 | Blind test Spotify/Deezer | 10% | 🔴 |
| #3 | Quiz 500 questions | 4% | 🔴 |
| #4 | Coins Play + classement live | 50% | 🟡 |
| #5 | Dashboard gérant 1 clic | 65% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 — QR code + validation gérant (70% 🟡)**
- ✅ `app/api/bars/[barId]/qr/route.ts` — génération token QR côté API
- ✅ `app/api/bars/[barId]/transactions/claim/route.ts` — validation claim côté API
- ✅ `app/claim/[token]/page.tsx` — page joueur avec auth + redirection login
- ✅ `app/gerant/page.tsx` — formulaire montant + countdown expiration QR
- ⚠️ Manque : rendu visuel QR code dans UI gérant (l'API retourne l'URL, pas l'image QR)
- ⚠️ Pas de test e2e flux complet gérant → scan → coins crédités

**#2 — Blind test Spotify/Deezer (10% 🔴)**
- ✅ `app/games/blindtest/page.tsx` — UI mockée avec 3 tracks hardcodées
- ❌ Aucune intégration Spotify/Deezer API
- ❌ Pas de preview audio réel
- ❌ `lib/validations.ts` a des guards Spotify/Deezer mais aucune route API active
- Bloqué : démo statique uniquement, zéro backend musical

**#3 — Quiz 500 questions (4% 🔴)**
- ✅ `lib/game-engine/parseGameDefinition.ts` — adaptateur GDF vers moteur natif (151 lignes, 1er avril)
- ✅ `lib/game-engine/questions.ts` — module indexation + anti-répétition
- ✅ `app/games/quiz-cinema/page.tsx` — UI quiz opérationnelle
- ❌ `data/game/cinema_quiz_classique.json` — seulement **20 questions** (objectif = 500 minimum)
- Bloqué : volume de contenu quasi inexistant, 1 seule catégorie (cinéma)

**#4 — Coins Play manuel + classement live (50% 🟡)**
- ✅ `app/api/bars/[barId]/leaderboard/route.ts` — API classement
- ✅ `lib/sse.ts` — Server-Sent Events pour updates live
- ✅ `app/dashboard/page.tsx` — affichage classement joueur avec delta
- ✅ `lib/game-engine/reducer.ts` — moteur d'état jeu
- ⚠️ TODO non résolu : `dashboard/page.tsx:148` — écart avec le 1er non calculé
- ⚠️ "Coins Play manuel" par le gérant (attribution directe hors QR) non confirmé implémenté

**#5 — Dashboard gérant 1 clic (65% 🟡)**
- ✅ `app/gerant/page.tsx` — 300 lignes, interface QR + stats session + jeu actif
- ✅ Données réelles (commit 67bacb4 `feat: wire all pages to real data`)
- ⚠️ Programme soirée et produits vedette encore hardcodés (TODO `dashboard/page.tsx:55,63`)
- ⚠️ Pas de contrôle "lancer une partie" directement depuis le dashboard gérant

**#6 — wheelEnabled=false (✅ bloqué en beta)**
- `app/games/page.tsx:9` — `active: false, soon: 'ANJ'`
- `config/business-rules.ts:340` — commentaire explicite beta

## Fichiers les plus actifs (derniers 5 commits)
Les 5 derniers commits sont tous des commits d'agent (barcoins-context/). Derniers fichiers de code modifiés :
- `lib/game-engine/parseGameDefinition.ts` — 1er avril (nouveau, 151 lignes)
- `middleware.ts` — 31 mars (route quiz-cinema public)
- `app/dashboard/page.tsx` — 31 mars (fix refs boostActive)
- `app/gerant/page.tsx` — 31 mars (fix unused import)
- `app/games/quiz-cinema/page.tsx` — 31 mars (fix build)

## Points d'attention

### 🔴 CRITIQUE — Silence code depuis 17 jours
Aucun commit de code depuis le 1er avril. Objectif beta juillet 2026 = 2,5 mois restants.
Les priorités #2 (Blind test) et #3 (Quiz 500 questions) sont quasi à zéro.

### 🔴 Quiz : volume contenu insuffisant
20 questions actuelles vs 500 objectif = 4% du volume cible. Nécessite un chantier contenu urgent (CSV/JSON à alimenter ou script de génération).

### 🔴 Blind test : aucune API musicale intégrée
`app/games/blindtest/page.tsx` est une démo statique (3 titres hardcodés). L'intégration Spotify/Deezer (auth OAuth, preview 30s, recherche par artiste) reste entière.

### 🟡 QR code : affichage visuel manquant
L'API génère l'URL du claim mais l'UI gérant ne génère pas encore l'image QR (besoin d'une lib type `qrcode.react` ou `react-qr-code`).

### 🟡 TODO décisions JC non résolus
`business-rules.ts` — `MISE_MIN_COINS`, `MISE_MAX_COINS`, `ANNUEL` encore à `TODO_VALIDER_JC`. Ces valeurs bloquent la logique de paris blind test.

### 🟡 OTP Twilio : guards de config basiques
`lib/otp.ts:21,26` — validation Twilio SID/URL sur présence de `'TODO'` en placeholder. À remplacer par vraies variables d'environnement en prod.

## Règles métier rappel
- Coins : `floor(montant€ × tier_multiplier)` — paliers `<10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4`
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
