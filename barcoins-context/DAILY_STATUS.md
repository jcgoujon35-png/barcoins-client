# BarCoins — Daily Status

Date : 2026-04-11
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)

| Hash | Message |
|---|---|
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
| `3aef0b7` | fix: regenerate package-lock.json from clean install (all resolved URLs present) |
| `4de15dd` | fix: vercel.json — npm ci for clean install (bypass cache) |
| `67bacb4` | feat: wire all pages to real data — full backend integration |

## Avancement beta

| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 70% | 🟡 |
| #2 | Blind test Spotify/Deezer | 15% | 🔴 |
| #3 | Quiz 500 questions | 20% | 🔴 |
| #4 | Coins Play + classement live | 60% | 🟡 |
| #5 | Dashboard gérant 1 clic | 65% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 — QR code + validation gérant (70% 🟡)**
- `app/claim/[token]/page.tsx` : flow client complet (QR valide / expiré / déjà utilisé)
- `app/api/bars/[barId]/qr/` : route API génération QR
- `app/gerant/page.tsx` : génération QR avec countdown 90 secondes
- Manque : tests E2E, edge cases (multi-claim, offline), UX polish countdown

**#2 — Blind test Spotify/Deezer (15% 🔴)**
- `app/games/blindtest/page.tsx` : UI maquette présente (bet / listen / result)
- Données hardcodées (3 titres mock : Daft Punk, Stromae, The Weeknd)
- Aucune intégration Spotify/Deezer API détectée dans le code
- Aucun fichier `spotify.ts`, `deezer.ts`, ou config token OAuth trouvé

**#3 — Quiz 500 questions (20% 🔴)**
- Moteur de jeu complet : `lib/game-engine/` (reducer, state, scoring, questions, session, parseGameDefinition)
- UI 5 écrans : Lobby / Question / Result / Leaderboard / Final (`components/barcoins-game/`)
- Quiz cinema V1 : seulement **20 questions** dans `data/game/cinema_quiz_classique.json`
- Objectif 500 questions : 4% atteint — la banque de questions est le vrai chantier

**#4 — Coins Play + classement live (60% 🟡)**
- Scoring game engine : `lib/game-engine/scoring.ts` (calculateBcoinsReward)
- Leaderboard API : `app/api/bars/[barId]/leaderboard/route.ts` + SSE stream
- Dashboard joueur : affichage playBalance, lien vers classement live
- Manque : attribution manuelle coins par le gérant (interface + API), intégration jeu → coins dans session live

**#5 — Dashboard gérant 1 clic (65% 🟡)**
- `app/gerant/page.tsx` : stats session (coins distribués, nb transactions, nb joueurs), génération QR, lien classement écran
- Quelques données encore hardcodées dans `app/dashboard/page.tsx` (programme soirée, produits vedette)
- TODO restants : écart avec le 1er dans classement, données soirée depuis API bar

**#6 — wheelEnabled=false (✅ bloqué en beta)**
- Verrouillé dans `config/business-rules.ts:340` : `// wheelEnabled = false pendant TOUTE la beta — vérification serveur`

## Fichiers les plus actifs (derniers 5 commits)

```
barcoins-context/DAILY_STATUS.md         (mises à jour daily)
barcoins-context/TODO_REPORT.md          (mises à jour daily)
lib/game-engine/parseGameDefinition.ts   (+151 lignes — adaptateur GDF)
lib/game-engine/reducer.ts               (+248 lignes)
lib/game-engine/state.ts                 (+130 lignes)
lib/game-engine/scoring.ts               (+98 lignes)
components/barcoins-game/QuestionScreen.tsx (+100 lignes)
config/business-rules.ts                 (581 modifs cumulées)
app/games/quiz-cinema/page.tsx           (+70 lignes)
```

## Points d'attention

1. **Blind test Spotify/Deezer complètement bloqué** — aucune API réelle, données mock. Nécessite OAuth Spotify OU Deezer preview URL, stockage token, et intégration audio. C'est le chantier le plus en retard pour la beta.

2. **Quiz : banque de questions insuffisante** — 20 questions cinéma sur 500 requises. Le moteur est prêt, c'est le contenu qui manque. Décision JC : générer en masse (script GPT ?) ou saisir manuellement ?

3. **Coins Play manuel gérant non implémenté** — Le classement et les coins post-jeu sont partiellement câblés, mais l'interface gérant pour attribuer des coins manuellement (ex. : récompense soirée hors-jeu) n'est pas visible dans le code.

4. **Données hardcodées dans dashboard joueur** — `app/dashboard/page.tsx:55` et `:63` : programme soirée et produits vedette sont fixes. Si plusieurs bars beta à Perpignan, chaque bar aura le même programme affiché.

5. **OTP/Twilio en mode dev mock** — `lib/otp.ts` vérifie `sid !== 'TODO'` et `url !== 'TODO'` : le vrai Twilio n'est pas encore connecté. À surveiller avant le premier Founding Partner live.

6. **HEAD détaché (detached HEAD)** — `git status` indique `HEAD detached from refs/heads/master`. Le prochain commit daily sera sur un HEAD détaché. À corriger : `git checkout master`.

## Règles métier rappel

- Coins : `floor(montant€ × tier_multiplier)` — paliers `<10€=×1` / `10-19€=×1.5` / `20-29€=×2` / `30-49€=×3` / `50€+=×4`
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
