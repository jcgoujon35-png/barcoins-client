# BarCoins — Daily Status

Date : 2026-04-16
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
```
75d3419 chore: daily context update [2026-04-15]
e7a2592 chore: daily context update [2026-04-14]
4819dcb chore: daily context update [2026-04-13]
2d021cf chore: daily context update [2026-04-12]
f67e2b2 chore: daily context update [2026-04-11]
198a553 chore: daily context update [2026-04-10]
fc4299d chore: daily context update [2026-04-09]
74261b7 chore: daily context update [2026-04-08]
40f89e1 chore: daily context update [2026-04-07]
11ad3f5 feat: parseGameDefinition — adaptateur GDF vers moteur natif
ef72089 fix: rendre /games/quiz-cinema public (demo sans auth)
1867648 fix: remove mult ref in dashboard + PlanKey unused import in gerant
42f8ec6 fix: build errors — remove boostActive ref + unused import
8b3c839 feat: quiz cinema V1 — moteur de jeu complet + UI 5 écrans
605a16d fix: middleware public routes exact match + staff redirect to /gerant
```

## Avancement beta
| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 75% | 🟡 |
| #2 | Blind test Spotify/Deezer | 10% | 🔴 |
| #3 | Quiz 500 questions | 15% | 🔴 |
| #4 | Coins Play + classement live | 65% | 🟡 |
| #5 | Dashboard gérant 1 clic | 80% | 🟢 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 QR code + validation gérant (75%)**
- ✅ API `POST /api/bars/[barId]/qr` — génération token + calcul coins + expiry
- ✅ Page `/claim/[token]` — scan, validation, attribution coins
- ✅ Dashboard gérant avec formulaire QR + countdown + aperçu
- ⚠️ Rendu QR via service externe `api.qrserver.com` (dépendance réseau, pas de lib native)
- ⚠️ Association joueur↔bar au moment du claim à tester en conditions réelles

**#2 Blind test Spotify/Deezer (10%)**
- ✅ UI mockup complète (3 écrans : bet / listen / result)
- ✅ Mécanique de pari + timer + blocage réponses 8s
- ❌ Aucune intégration Spotify ou Deezer API — 3 tracks hardcodées
- ❌ Pas de streaming audio réel
- 🔴 Bloqué : clés API + backend d'appel audio manquants

**#3 Quiz 500 questions (15%)**
- ✅ Moteur de jeu complet : `lib/game-engine/` (reducer, scoring, questions, session, parseGameDefinition)
- ✅ Quiz Cinéma V1 UI — 5 écrans opérationnels
- ✅ Adaptateur GDF (`parseGameDefinition.ts`) pour format JSON → moteur natif
- ⚠️ Seulement **20 questions** dans `data/game/cinema_quiz_classique.json`
- ❌ Thèmes manquants (sport, musique, géo, histoire, etc.)
- 🔴 Bloqué : contenu — objectif 500 questions non atteint

**#4 Coins Play + classement live (65%)**
- ✅ Classement live SSE — `app/leaderboard/page.tsx` + `/api/bars/[barId]/leaderboard/stream`
- ✅ Distribution coins via QR scan → transaction → leaderboard
- ✅ Page historique joueur (`app/history/page.tsx`)
- ⚠️ Attribution manuelle de coins gérant (hors QR) non visible dans le dashboard
- ⚠️ `app/dashboard/page.tsx:148` — TODO : calcul écart avec le 1er non implémenté

**#5 Dashboard gérant 1 clic (80%)**
- ✅ Lancer / terminer soirée en 1 clic
- ✅ Génération QR avec montant, countdown, aperçu coins
- ✅ Stats soirée : joueurs / transactions / coins distribués (refresh 30s)
- ✅ Health score + plan actif + boost indicator
- ✅ Accès direct classement écran TV
- ⚠️ Programme soirée et produits vedette hardcodés (TODOs actifs)
- ⚠️ Pas de lancement de jeu direct depuis le dashboard

**#6 wheelEnabled=false (✅)**
- `config/business-rules.ts:472` — `WHEEL_ENABLED: false` ← JAMAIS true sans validation JC
- Commentaire explicite ligne 340 : bloqué toute la beta

## Fichiers les plus actifs (derniers 5 commits de code réel)
> Note : les 9 derniers commits sont des mises à jour d'agent quotidien. Les dernières modifications de code remontent au ~10 avril.

| Fichier | Commits |
|---|---|
| `lib/game-engine/parseGameDefinition.ts` | feat: adaptateur GDF |
| `app/games/quiz-cinema/page.tsx` | feat: quiz cinema V1 |
| `components/barcoins-game/*.tsx` | feat: quiz cinema V1 (5 composants) |
| `app/gerant/page.tsx` | fix: unused imports, build errors |
| `middleware.ts` | fix: public routes + staff redirect |

## Points d'attention
1. **Stagnation du code** — Aucun commit de code depuis le 10 avril (6 jours). Seules les mises à jour d'agent quotidien sont présentes. Vérifier si du travail est en cours hors branche.

2. **Blind test bloqué** — Priorité #2 à 10% : dépend d'une intégration API tierce (Spotify/Deezer). Risque sur le planning beta juillet si non démarré.

3. **Contenu quiz insuffisant** — 20 questions / 500 objectif = 4%. Le moteur est prêt mais sans contenu, la feature ne peut pas être démontrée aux Founding Partners.

4. **Dépendance externe QR** — `api.qrserver.com` utilisé pour le rendu QR dans le dashboard gérant. En environnement sans internet (bar avec mauvais réseau), le QR ne s'affichera pas. À remplacer par `qrcode` ou `react-qr-code`.

5. **TODOs non résolus** — 3 TODOs actifs sur `app/dashboard/page.tsx` concernant programme soirée, produits vedette, et calcul écart classement.

6. **MISE_MIN_COINS / MISE_MAX_COINS** — valeurs marquées `TODO_VALIDER_JC` dans `config/business-rules.ts:295-296`. À valider avant ouverture du jeu de paris.

## Règles métier rappel
- Coins : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
