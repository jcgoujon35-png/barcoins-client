# BarCoins — Daily Status

Date : 2026-04-12
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)

| Hash | Message |
|---|---|
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
| `3aef0b7` | fix: regenerate package-lock.json from clean install (all resolved URLs present) |
| `4de15dd` | fix: vercel.json — npm ci for clean install (bypass cache) |

## Avancement beta

| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 85% | 🟢 |
| #2 | Blind test Spotify/Deezer | 15% | 🔴 |
| #3 | Quiz 500 questions | 10% | 🔴 |
| #4 | Coins Play + classement live | 65% | 🟡 |
| #5 | Dashboard gérant 1 clic | 80% | 🟢 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 — QR code + validation gérant (85% 🟢)**
- `app/api/bars/[barId]/qr/route.ts` : génération QR complète — calcul coins, tier multiplier, token, expiry 90s
- `app/api/bars/[barId]/transactions/claim/route.ts` : claim ACID via `creditCoins`, broadcast SSE leaderboard
- `app/claim/[token]/page.tsx` : flow client complet — states loading / success / expired / already_claimed / error
- `app/gerant/page.tsx` : formulaire montant + QR affiché via api.qrserver.com + countdown 90s
- Manque : tests E2E end-to-end, QR offline (ne dépend pas d'un CDN tiers), UX polish

**#2 — Blind test Spotify/Deezer (15% 🔴)**
- `app/games/blindtest/page.tsx` : UI complète (3 états : bet / listen / result) avec timer et blocage 8s
- Données entièrement hardcodées (3 titres mock : Daft Punk, Stromae, The Weeknd)
- Aucune intégration Spotify/Deezer API détectée dans le code
- Aucun fichier `spotify.ts`, `deezer.ts`, config OAuth ou preview URL trouvé
- BLOQUANT : la feature est visuellement aboutie mais non fonctionnelle

**#3 — Quiz 500 questions (10% 🔴)**
- Moteur de jeu complet : `lib/game-engine/` (reducer, state, scoring, questions, session, parseGameDefinition)
- UI 5 écrans : Lobby / Question / Result / Leaderboard / Final (`components/barcoins-game/`)
- Quiz "bar culture" : 5 questions hardcodées dans `app/games/quiz/page.tsx`
- Quiz cinéma V1 : **20 questions** dans `data/game/cinema_quiz_classique.json`
- **Total actuel : 25 questions sur 500 requises (5%)** — l'infrastructure est prête, le contenu est le vrai chantier

**#4 — Coins Play + classement live (65% 🟡)**
- `lib/coins.ts` : moteur ACID complet (creditCoins / debitCoins / transferCoins / getBalance)
- `app/api/bars/[barId]/leaderboard/` : API REST + SSE stream live
- `app/leaderboard/page.tsx` : classement joueurs avec mise à jour SSE en temps réel
- `app/dashboard/page.tsx` : affichage rang, solde, lien classement live
- Manque : attribution **manuelle** de coins par le gérant (récompense soirée hors-QR), intégration game engine → crédits réels en session

**#5 — Dashboard gérant 1 clic (80% 🟢)**
- `app/gerant/page.tsx` : stats soirée (joueurs / transactions / coins distribués), lancer/terminer session, QR generator, lien classement écran TV
- Refresh automatique 30s, countdown QR intégré
- Manque : données programme soirée et produits vedette dynamiques (`app/dashboard/page.tsx:55,63`), calcul écart avec le 1er (:148)

**#6 — wheelEnabled=false (✅ bloqué en beta)**
- `config/business-rules.ts` : `WHEEL_CONFIG.ENABLED_DEFAULT: false`, `FEATURE_FLAGS.WHEEL_ENABLED: false`
- Commentaire explicite : `// wheelEnabled = false pendant TOUTE la beta — vérification serveur`
- `// Activation uniquement par JC après validation ANJ`

## Fichiers les plus actifs (derniers 5 commits non-daily)

```
lib/game-engine/parseGameDefinition.ts   feat: adaptateur GDF vers moteur natif
lib/game-engine/reducer.ts               feat: quiz cinema V1 — moteur complet
lib/game-engine/state.ts                 feat: quiz cinema V1 — moteur complet
lib/game-engine/scoring.ts              feat: quiz cinema V1 — moteur complet
lib/game-engine/session.ts              feat: quiz cinema V1 — moteur complet
components/barcoins-game/QuestionScreen.tsx  feat: UI 5 écrans
components/barcoins-game/LobbyScreen.tsx     feat: UI 5 écrans
components/barcoins-game/FinalScreen.tsx     feat: UI 5 écrans
app/games/quiz-cinema/page.tsx           feat: quiz cinema V1
config/business-rules.ts                 fix: cleanup boostActive + PlanKey
```

## Points d'attention

1. **Blind test Spotify/Deezer complètement bloqué** — aucune API réelle, 3 titres hardcodés. Nécessite OAuth Spotify (30s preview) OU Deezer preview URL (sans OAuth). C'est la feature la plus en retard pour la beta.

2. **Quiz : banque de questions insuffisante** — 25 questions sur 500 requises. Le moteur GDF est prêt et scalable. Décision JC requise : génération via script (GPT batch) ou saisie manuelle par catégorie ?

3. **Coins Play manuel non implémenté** — Interface gérant sans bouton d'attribution manuelle. Le `creditCoins` existe en backend mais aucune route API ni UI gérant ne l'expose pour des attributions hors-QR.

4. **Données hardcodées dashboard joueur** — `app/dashboard/page.tsx:55,63` : programme soirée et produits vedette sont statiques. Risque de cohérence avec plusieurs bars beta à Perpignan.

5. **OTP/Twilio en mode dev mock** — `lib/otp.ts:21,26` : guards `sid !== 'TODO'` et `url !== 'TODO'` actifs. Le SMS OTP ne fonctionne pas réellement. Bloquant avant go-live Founding Partners.

6. **HEAD détaché (detached HEAD)** — `git status` indique `HEAD detached from refs/heads/master`. À corriger avant tout développement : `git checkout master`.

7. **QR code via CDN tiers** — `app/gerant/page.tsx` utilise `api.qrserver.com` pour générer le QR. En production bar (réseau potentiellement limité), une librairie locale (`qrcode.react`) serait plus fiable.

## Règles métier rappel

- Coins : `floor(montant€ × tier_multiplier)` — paliers `<10€=×1` / `10-19€=×1.5` / `20-29€=×2` / `30-49€=×3` / `50€+=×4`
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
