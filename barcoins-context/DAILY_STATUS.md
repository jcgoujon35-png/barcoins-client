# BarCoins — Daily Status

Date : 2026-04-09
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)

```
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
4de15dd fix: vercel.json — npm ci for clean install (bypass cache)
67bacb4 feat: wire all pages to real data — full backend integration
5a24412 feat: BottomNav — fond navy rgba(13,27,46,0.95), active gold #C9922A, hauteur 72px
4ecffd9 feat: profile — navy migration, avatar amber, barres progression navy, coins 3xl
```

> ⚠️ Aucun commit feature depuis J-1. Seul le commit agent daily est apparu aujourd'hui.

## Avancement beta

| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 78% | 🟡 |
| #2 | Blind test Spotify/Deezer | 10% | 🔴 |
| #3 | Quiz 500 questions | 13% | 🔴 |
| #4 | Coins Play + classement live | 52% | 🟡 |
| #5 | Dashboard gérant 1 clic | 72% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

## Fichiers les plus actifs (derniers 5 commits)

- `lib/game-engine/parseGameDefinition.ts` — adaptateur GDF → moteur natif (nouveau, +151 lignes)
- `app/dashboard/page.tsx` — suppression ref boostActive, nettoyage
- `app/games/quiz-cinema/page.tsx` — rendu public sans auth (demo)
- `app/gerant/page.tsx` — suppression import PlanKey inutilisé
- `middleware.ts` — correction route publique quiz-cinema

## Points d'attention

### 🔴 Priorité #2 — Blind test Spotify/Deezer (bloqué — critique)
- Aucun client API créé dans tout le codebase (`lib/spotify.ts` ou `lib/deezer.ts` inexistants)
- `app/games/blindtest/page.tsx` contient des tracks hardcodées — prototype UI uniquement
- Zéro token OAuth, zéro endpoint, zéro intégration réelle
- **Action urgente** : choisir API (Spotify OAuth vs Deezer public), créer le client, brancher sur l'UI existante
- Risque critique pour la beta juillet 2026 si non démarré rapidement

### 🔴 Priorité #3 — Quiz 500 questions (très en retard)
- **~20 questions** dans `data/game/cinema_quiz_classique.json` — ratio ≈ 4% de l'objectif 500
- Moteur de jeu complet : reducer, state, scoring, session, `parseGameDefinition` ✅
- `parseGameDefinition.ts` (commit `11ad3f5`) facilite l'ingestion de nouveaux JSON GDF
- **Déblocage possible** : produire des JSON GDF pour musique, sport, culture générale, géo…
- Manque : ~480 questions minimum + au moins 4 thèmes supplémentaires

### 🟡 Priorité #1 — QR code + validation gérant (quasi prêt)
- API `/api/bars/[barId]/qr` opérationnelle ✅
- Page `/claim/[token]` opérationnelle ✅
- UI gérant avec génération QR + countdown expiration ✅
- Rendu QR via `qrserver.com` (service externe) — fonctionnel mais dépendance tierce à surveiller
- Manque : tests end-to-end du flow complet (scan → claim → coins crédités en base)

### 🟡 Priorité #4 — Coins Play manuel + classement live
- `/api/bars/[barId]/leaderboard/stream` SSE + `lib/sse.ts` présents ✅
- `app/leaderboard/page.tsx` + lien "Voir le classement en direct" dans dashboard ✅
- `app/dashboard/page.tsx:148` — TODO non résolu : calcul écart avec le 1er manquant
- Attribution manuelle Coins Play par le gérant : **non implémentée** — à construire

### 🟡 Priorité #5 — Dashboard gérant 1 clic
- Chargement données bar depuis API ✅, refresh 30s ✅, stats soirée ✅
- `app/dashboard/page.tsx:55` — programme soirée hardcodé (TODO API gérant)
- `app/dashboard/page.tsx:63` — produits vedette hardcodés (TODO API carte)
- Interface fonctionnelle mais données mock résiduelles à remplacer

### ⚠️ OTP — variables d'environnement placeholder détectées
- `lib/otp.ts:21` — comparaison `sid !== 'TODO'` → variable Twilio SID non configurée en prod ?
- `lib/otp.ts:26` — comparaison `url !== 'TODO'` → URL Twilio non configurée en prod ?
- À vérifier : env vars `TWILIO_ACCOUNT_SID` et `TWILIO_AUTH_TOKEN` dans Vercel/prod

## Règles métier rappel

- Coins : `floor(montant€ × tier_multiplier)` — paliers `<10€=×1` / `10-19€=×1.5` / `20-29€=×2` / `30-49€=×3` / `50€+=×4`
- Jamais hardcoder hors `config/business-rules.ts`
- `wheelEnabled = false` en beta (verrouillé `config/business-rules.ts` lignes 186 et 340, `prisma/seed.ts` ligne 42)
