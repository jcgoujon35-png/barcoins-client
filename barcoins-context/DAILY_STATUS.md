# BarCoins — Daily Status

Date : 2026-04-19
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
```
cda25bd chore: daily context update [2026-04-18]
d1ff510 chore: daily context update [2026-04-17]
d8a414e chore: daily context update [2026-04-16]
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
```

> ⚠️ Aucun commit de développement depuis le 2026-04-07 (12 jours). Les commits récents sont tous des mises à jour d'agent.

## Avancement beta
| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 88% | 🟢 |
| #2 | Blind test Spotify/Deezer | 20% | 🔴 |
| #3 | Quiz 500 questions | 10% | 🔴 |
| #4 | Coins Play + classement live | 70% | 🟡 |
| #5 | Dashboard gérant 1 clic | 88% | 🟢 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

### Détail par priorité

**#1 — QR code + validation gérant (88%)**
- ✅ API génération QR : `app/api/bars/[barId]/qr/route.ts` (POST, calcul paliers, expiry 90s)
- ✅ API claim joueur : `app/api/bars/[barId]/transactions/claim/route.ts`
- ✅ Page claim joueur : `app/claim/[token]/page.tsx`
- ✅ Dashboard gérant avec form QR + aperçu + countdown : `app/gerant/page.tsx`
- ⚠️ QR affiché via service externe `api.qrserver.com` (dépendance réseau tiers, à remplacer par lib locale)

**#2 — Blind test Spotify/Deezer (20%)**
- ✅ UI prototype complète : `app/games/blindtest/page.tsx` (3 écrans : bet/listen/result)
- ❌ AUCUNE intégration API Spotify ou Deezer — tracks hardcodées (3 tracks mock)
- ❌ Pas de lecture audio réelle — visualisation simulée seulement
- ❌ Pas de backend pour prévisualisation (preview 30s) ni licence streaming

**#3 — Quiz 500 questions (10%)**
- ✅ Moteur de jeu complet : `lib/game-engine/` (reducer, state, session, scoring, questions, parseGameDefinition)
- ✅ Quiz Cinema V1 jouable en démo : `app/games/quiz-cinema/page.tsx`
- ❌ Seulement 20 questions dans `data/game/cinema_quiz_classique.json` (cible : 500+)
- ❌ Une seule catégorie (cinéma) — pas de quiz musique, sport, culture générale, etc.

**#4 — Coins Play + classement live (70%)**
- ✅ API leaderboard : `app/api/bars/[barId]/leaderboard/route.ts` (SOIREE/HEBDO/MENSUEL/ANNUEL)
- ✅ SSE stream temps réel : `app/api/bars/[barId]/leaderboard/stream/route.ts`
- ✅ Page classement : `app/leaderboard/page.tsx`
- ✅ Coins distribués via claim QR → `coinLedger`
- ⚠️ "Coins Play manuel" (sans QR, attribution directe par gérant) : non confirmé implémenté
- ⚠️ TODO dans `app/dashboard/page.tsx:148` : calcul écart avec le 1er non implémenté

**#5 — Dashboard gérant 1 clic (88%)**
- ✅ Lancer/terminer soirée en 1 clic
- ✅ Stats temps réel (joueurs, transactions, points distribués)
- ✅ Génération QR intégrée avec countdown
- ✅ Accès classement TV depuis dashboard
- ⚠️ TODOs restants : programme soirée depuis API bar (l. 55-63), produits vedette dynamiques

**#6 — wheelEnabled=false (✅)**
- `config/business-rules.ts:344` : `ENABLED_DEFAULT: false`
- Commentaire explicite : "wheelEnabled = false pendant TOUTE la beta — vérification serveur"

## Fichiers les plus actifs (derniers vrais commits features)
```
lib/game-engine/parseGameDefinition.ts  (151 lignes — nouveau)
app/dashboard/page.tsx                  (modifié)
app/gerant/page.tsx                     (modifié)
middleware.ts                           (modifié — route /games/quiz-cinema publique)
```

## Points d'attention

### 🔴 BLOQUANT
- **Blind test sans API** : `app/games/blindtest/page.tsx` utilise 3 tracks hardcodées. Intégration Spotify/Deezer (preview 30s) est priorité #2 mais à 0% d'implémentation réelle. Nécessite compte dev Spotify/Deezer + gestion auth + prévisualisations audio.
- **Quiz : 20 questions / 500 cible** : Le moteur est prêt mais la base de questions est quasi vide. Travail éditorial massif requis (ou génération assistée).

### 🟡 À SURVEILLER
- **12 jours sans commit feature** : Dernier commit réel le 07/04. Activité dev arrêtée ou en cours hors dépôt ?
- **QR via service externe** : `api.qrserver.com` dans `app/gerant/page.tsx` — dépendance externe en prod, à remplacer par `qrcode` ou `react-qr-code`.
- **Coins Play manuel** : Non clairement implémenté. Attribution directe par gérant sans QR = cas edge important pour beta.
- **OTP / Auth** : `lib/otp.ts:21-26` contient des vérifications `!== 'TODO'` — config Twilio/Redis absente en dev mode. À vérifier avant déploiement prod.

### 🟢 RASSURANT
- Pipeline QR → claim → leaderboard fonctionnel de bout en bout
- Moteur de jeu (game-engine) solide et extensible
- Business rules centralisées dans `config/business-rules.ts`
- wheelEnabled verrouillé false

## Règles métier rappel
- Coins : `floor(montant€ × tier_multiplier)` — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors `business-rules.ts`
- `wheelEnabled = false` en beta
