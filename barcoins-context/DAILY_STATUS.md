# BarCoins — Daily Status

Date : 2026-05-06
Généré par : agent remote planifié (07h00 Paris)

## Derniers commits (15)
- `fd51b62` chore: daily context update [2026-05-05]
- `f207a5c` feat(marketing): page standalone HTML + redirect /marketing → /marketing/index.html
- `9965756` fix(ERR-04): label Bcoins ce soir
- `77d9959` fix(ERR-03): multiplicateur depuis business-rules.ts
- `a1c8605` fix(ERR-03): multiplicateur depuis business-rules.ts
- `0307c06` fix(ERR-03): multiplicateur depuis business-rules.ts
- `0e8fa42` fix(ERR-04): label Bcoins ce soir
- `aecfba7` fix(ERR-04): label Bcoins ce soir
- `c6750b1` fix(ERR-03): multiplicateur depuis business-rules.ts
- `243cc17` chore: daily context update [2026-05-04]
- `826b0da` chore: daily context update [2026-05-03]
- `7353eeb` chore: daily context update [2026-05-02]
- `d840a4d` chore: daily context update [2026-04-30]
- `8a15083` chore: daily context update [2026-04-29]
- `86c9f4b` chore: daily context update [2026-04-28]

## Avancement beta
| Priorité | Feature | Avancement | Statut |
|---|---|---|---|
| #1 | QR code + validation gérant | 75% | 🟡 |
| #2 | Blind test Spotify/Deezer | 20% | 🔴 |
| #3 | Quiz 500 questions | 5% | 🔴 |
| #4 | Coins Play + classement live | 60% | 🟡 |
| #5 | Dashboard gérant 1 clic | 70% | 🟡 |
| #6 | wheelEnabled=false | ✅ | bloqué en beta |

## Fichiers les plus actifs (derniers 5 commits)
- `public/marketing/index.html` — +3971 lignes (page marketing standalone)
- `public/marketing/barcoins-init.js` — +645 lignes
- `public/marketing/barcoins-marketing.css` — +2165 lignes
- `barcoins-context/DAILY_STATUS.md` — mises à jour quotidiennes
- `config/business-rules.ts` — fix ERR-03 multiplicateur
- `app/gerant/page.tsx` — fix ERR-04 label
- `next.config.ts` — redirect /marketing ajouté
- `middleware.ts` — 1 ligne ajoutée

## Points d'attention

### 🔴 BLOQUANT — Blind test (#2) : UI démo non connectée API
`app/games/blindtest/page.tsx` contient 3 tracks hardcodées (`tracks = [...]`). Le fichier `lib/blindtest/providers.ts` est correctement écrit (Spotify + Deezer), mais **n'est pas importé ni utilisé dans la page**. Aucune connexion réelle aux APIs audio. Le jeu n'est pas jouable en vrai.

### 🔴 BLOQUANT — Quiz questions (#3) : contenu manquant
Les dossiers `games-catalog/_generated/` (5 jeux) existent mais les fichiers JSON ont **0 questions** parsables. Le composant `BarQuiz.tsx` (781 lignes) est prêt côté UI, mais sans contenu à servir. Objectif 500 questions non atteint.

### 🟡 ATTENTION — ERR-03 / ERR-04 : correctifs répétés
4 commits `fix(ERR-03)` + 3 commits `fix(ERR-04)` sur la même semaine suggèrent une instabilité persistante sur le multiplicateur et le label "Bcoins ce soir". À surveiller — vérifier que les corrections sont stables.

### 🟡 ATTENTION — Coins Play manuel (#4) : route API MANUAL_CREDIT absente
Aucune route `app/api/bars/[barId]/credits` ou équivalent trouvée. Le classement live (SSE) est fonctionnel, mais la distribution manuelle de coins par le gérant pendant la soirée n'a pas d'endpoint dédié.

### 🟡 INFO — Dashboard programme/produits (#5) : hardcodés
`app/dashboard/page.tsx:55,63` — Le programme de soirée et les produits vedette sont hardcodés dans le composant. Acceptable pour beta, mais crée une friction pour les Founding Partners qui veulent personnaliser.

### ✅ OK — Page marketing standalone ajoutée
`public/marketing/index.html` (3971 lignes HTML) + assets CSS/JS déployés. Redirect `/marketing` → `/marketing/index.html` configuré dans `next.config.ts`. Bonne avancée commerciale avant lancement octobre.

## Règles métier rappel
- Coins : floor(montant€ × tier_multiplier) — paliers <10€=×1 / 10-19€=×1.5 / 20-29€=×2 / 30-49€=×3 / 50€+=×4
- Jamais hardcoder hors business-rules.ts
- wheelEnabled = false en beta
