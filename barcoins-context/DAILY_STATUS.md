# BarCoins — Daily Status

Date : 2026-04-13
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)

| Hash | Message |
|---|---|
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
| `3aef0b7` | fix: regenerate package-lock.json from clean install (all resolved URLs present) |

> ⚠️ **Aucun commit code depuis le 2026-04-07** (`11ad3f5`). Les 6 commits suivants sont uniquement des mises à jour de contexte agent. Aucune progression sur les priorités beta cette semaine.

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
- `app/api/bars/[barId]/transactions/claim/route.ts` : claim ACID, broadcast SSE leaderboard
- `app/claim/[token]/page.tsx` : flow client complet — états loading / success / expired / already_claimed / error
- `app/gerant/page.tsx` : formulaire montant + QR affiché via api.qrserver.com + countdown 90s
- Manque : QR rendu offline (dépend CDN tiers api.qrserver.com), tests E2E, UX polish

**#2 — Blind test Spotify/Deezer (15% 🔴)**
- `app/games/blindtest/page.tsx` : UI complète (3 états : bet / listen / result) avec timer et blocage 8s
- Données entièrement hardcodées (3 titres mock : Daft Punk, Stromae, The Weeknd)
- Aucune intégration Spotify/Deezer API dans le code — aucun fichier `spotify.ts`, `deezer.ts`, OAuth, ou preview URL
- **BLOQUANT** : visuellement abouti, non fonctionnel — l'API de streaming est toute la valeur

**#3 — Quiz 500 questions (10% 🔴)**
- Moteur de jeu complet : `lib/game-engine/` (reducer, state, scoring, questions, session, parseGameDefinition)
- UI 5 écrans : Lobby / Question / Result / Leaderboard / Final (`components/barcoins-game/`)
- Quiz "bar culture" : 5 questions hardcodées dans `app/games/quiz/page.tsx`
- Quiz cinéma V1 : **20 questions** dans `data/game/cinema_quiz_classique.json`
- **Total actuel : ~25 questions sur 500 requises (5%)** — infrastructure prête, contenu = vrai chantier

**#4 — Coins Play + classement live (65% 🟡)**
- `app/api/bars/[barId]/leaderboard/route.ts` : classement soirée/semaine/all-time ✅
- `app/api/bars/[barId]/leaderboard/stream/route.ts` : SSE temps réel ✅
- `app/leaderboard/page.tsx` : UI classement avec SSE live ✅
- `hooks/useSSE.ts` : hook client pour connexion SSE ✅
- Manque : interface gérant pour **crédit manuel Coins Play** (MANUAL_CREDIT référencé dans dashboard joueur mais sans route API ni UI gérant dédiée), validation SSE en production

**#5 — Dashboard gérant 1 clic (80% 🟢)**
- `app/gerant/page.tsx` : lancer/terminer soirée, générer QR, stats temps réel (joueurs/transactions/coins), plan + health score, accès classement
- Auto-refresh 30s ✅
- Manque : crédit manuel coins depuis dashboard, gestion lancement jeux (blindtest/quiz), données programme dynamiques

**#6 — wheelEnabled=false (✅ bloqué en beta)**
- `prisma/seed.ts:42` : `wheelEnabled: false, // JAMAIS true en beta`
- `config/business-rules.ts:186,340` : règle documentée et vérification serveur
- Aucune UI wheel détectée dans le code

## Fichiers les plus actifs (derniers commits de code, jusqu'au 2026-04-07)

```
lib/game-engine/parseGameDefinition.ts   feat: adaptateur GDF vers moteur natif
app/games/quiz-cinema/page.tsx           fix: rendu public (demo sans auth)
app/gerant/page.tsx                      fix: nettoyage imports/refs inutiles
app/dashboard/page.tsx                   fix: suppression boostActive ref
middleware.ts                            fix: routes publiques exact match + redirect staff
```

## Points d'attention

1. **Stagnation 6 jours** : aucun commit code depuis le 07/04. Si intentionnel (pause, autres priorités), OK. Sinon identifier le frein.

2. **Blind test (#2) = priorité critique non démarrée** : l'API Spotify preview nécessite OAuth + compte développeur. Deezer preview URL est sans auth (plus simple). À démarrer en priorité.

3. **Quiz : banque de questions insuffisante** : 25/500. Le moteur GDF est prêt. Décision JC : génération par script (GPT batch) ou saisie manuelle par catégorie ?

4. **MANUAL_CREDIT sans interface** : le type de transaction existe en base mais aucune route API ni UI gérant ne permet de créditer manuellement un joueur. Bloquant pour #4.

5. **OTP Twilio non fonctionnel** : `lib/otp.ts:21,26` — guards `sid !== 'TODO'` et `url !== 'TODO'` actifs. SMS OTP ne fonctionne pas réellement. Bloquant avant go-live Founding Partners.

6. **HEAD détaché** : `git status` indique `HEAD detached from refs/heads/master`. À corriger avant tout développement : `git checkout master`.

7. **QR via CDN tiers** : `api.qrserver.com` utilisé en production. En réseau bar potentiellement limité, intégrer une lib locale (`react-qr-code`) pour fiabilité.

## Règles métier rappel

- Coins : `floor(montant€ × tier_multiplier)` — paliers `<10€=×1` / `10-19€=×1.5` / `20-29€=×2` / `30-49€=×3` / `50€+=×4`
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
