# BarCoins — Daily Status

Date : 2026-04-10
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
```
fc4299d chore: daily context update [2026-04-09]
74261b7 chore: daily context update [2026-04-08]
40f89e1 chore: daily context update [2026-04-07]
11ad3f5 feat: parseGameDefinition — adaptateur GDF vers moteur natif
ef72089 fix: rendre /games/quiz-cinema public (demo sans auth)
1867648 fix: remove mult ref in dashboard + PlanKey unused import in gerant
42f8ec6 fix: build errors — remove boostActive ref + unused import
8b3c839 feat: quiz cinema V1 — moteur de jeu complet + UI 5 écrans
605a16d fix: middleware public routes exact match + staff redirect to /gerant
a579bf5 fix: add staff login form + OTP dev mode without Twilio/Redis
40c8578 fix: add prisma generate to vercel build command
3aef0b7 fix: regenerate package-lock.json from clean install (all resolved URLs present)
4de15dd fix: vercel.json — npm ci pour clean install (bypass cache)
67bacb4 feat: wire all pages to real data — full backend integration
5a24412 feat: BottomNav — fond navy rgba(13,27,46,0.95), active gold #C9922A, hauteur 72px
```

## Avancement beta
| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 70% | 🟡 |
| #2 | Blind test Spotify/Deezer | 15% | 🔴 |
| #3 | Quiz 500 questions | 15% | 🔴 |
| #4 | Coins Play + classement live | 55% | 🟡 |
| #5 | Dashboard gérant 1 clic | 65% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail avancement

**#1 QR code + validation gérant — 70% 🟡**
- ✅ Route API `/api/bars/[barId]/qr/route.ts` — génération token + calcul coins
- ✅ Route `/api/bars/[barId]/transactions/route.ts` — QR avec expiry
- ✅ Page `/app/claim/[token]/` — scan côté client
- ✅ Dashboard gérant avec `handleGenerateQR` wired sur API réelle
- ⚠️ Manque : test E2E complet scan→validation→coins crédités ; UI de confirmation post-claim côté gérant

**#2 Blind test Spotify/Deezer — 15% 🔴**
- ✅ UI blind test fonctionnelle (bet / listen / result)
- ❌ Données 100% hardcodées (3 pistes mock dans `app/games/blindtest/page.tsx`)
- ❌ Aucune intégration API Spotify ni Deezer — zéro appel API, zéro token, zéro preview audio réel
- ❌ Aucun fichier d'intégration musicale dans le projet

**#3 Quiz 500 questions — 15% 🔴**
- ✅ Moteur de jeu complet (reducer, session, scoring, questions) — `lib/game-engine/`
- ✅ Adaptateur `parseGameDefinition` (GDF → moteur natif)
- ✅ Quiz Cinema V1 — 5 écrans UI complets
- ❌ Seulement 20 questions dans `data/game/cinema_quiz_classique.json` (cible : 500)
- ❌ `parseGameDefinition` pas encore connecté à une page app (aucun import trouvé dans `/app`)
- ⚠️ Un seul thème (cinéma) — besoin de diversifier les catégories

**#4 Coins Play + classement live — 55% 🟡**
- ✅ Leaderboard avec SSE (`/api/bars/[barId]/leaderboard/stream`) + fallback polling 30s
- ✅ Session start/end depuis dashboard gérant (`handleLaunchSession`, `handleEndSession`)
- ✅ Moteur de scoring coins intégré dans game engine
- ⚠️ Manque : attribution manuelle de coins par le gérant (hors QR scan)
- ⚠️ Coins Play liés aux jeux pas encore câblés à la base de données

**#5 Dashboard gérant 1 clic — 65% 🟡**
- ✅ Page `/app/gerant/page.tsx` (300 lignes) — QR generation, session management, refresh 30s
- ✅ Wired sur données réelles (commit `67bacb4`)
- ✅ Lien classement live
- ⚠️ Manque : attribution manuelle coins, historique soirée, stats visuelles simples

**#6 wheelEnabled=false — ✅ bloqué en beta**
- `prisma/seed.ts:42` — `wheelEnabled: false // JAMAIS true en beta`
- `config/business-rules.ts:340` — règle documentée serveur

## Fichiers les plus actifs (derniers 5 commits)
- `barcoins-context/DAILY_STATUS.md` — contexte agent quotidien
- `barcoins-context/TODO_REPORT.md` — rapport TODO agent quotidien
- `lib/game-engine/parseGameDefinition.ts` — adaptateur GDF (151 lignes, nouveau)
- `middleware.ts` — ajout route publique quiz-cinema

## Points d'attention

1. **Blind test bloqué** — priorité #2 est la plus à risque pour juillet 2026. Zéro intégration musicale. Choisir entre Spotify Preview API (30s, gratuit) ou Deezer API et démarrer l'intégration dès maintenant.

2. **Quiz : volume questions insuffisant** — 20 questions pour une cible de 500 (4%). Besoin d'un script de génération ou d'un import massif par catégorie. `parseGameDefinition` est prêt mais non utilisé en prod.

3. **Attribution manuelle coins absente** — pour "Coins Play manuel" (priorité #4), aucune interface gérant permettant d'attribuer des coins manuellement à un joueur (hors QR scan). Besoin Founding Partners Perpignan.

4. **OTP Twilio/Redis** — mode dev sans Twilio actif (`a579bf5`), à câbler avant beta réelle avec vrais devices.

5. **3 daily updates consécutifs sans commits fonctionnels** — activité dev concentrée sur le moteur de jeu quiz cinema (commits `8b3c839`, `11ad3f5`). Prochaine étape : connecter le moteur à l'app et alimenter les questions.

## Règles métier rappel
- Coins : floor(montant€ × tier_multiplier) — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors business-rules.ts
- wheelEnabled = false en beta
