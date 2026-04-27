# 🍹 QUIZ CULTURE BAR

**Version:** 1.0  
**Statut:** Draft (Prêt pour intégration Claude Code)

---

## CONCEPT

Un **quiz multi-manches** centré sur alcools, cocktails et histoire des bars. 

**L'engagement:** Entry fee manche 1 (15 coins) → les joueurs y gagnent ou y perdent rapidement, créant urgence psychologique.

**L'excitement:** Manche 5 = JACKPOT : toutes les fees des 4 premières manches vont au premier qui répond juste.

---

## FLOW UTILISATEUR

```
1. Scan QR → Rejoint partie Quiz Culture Bar
2. 2 joueurs min → LÉ partit démarre
3. Manche 1 (Alcools & Origines):
   - Entry fee: 15 coins (obligatoire, wallet validé)
   - 5 questions, timer 15s chacune
   - Premier qui clique = point full (80 max) ou 0
   - Affichage score + notification dynamique
4. Manches 2-4: Identique (pas d'entry fee supplémentaire) 
   - Manche 2: Cocktails (x1.25 streak après 3)
   - Manche 3: Culture générale bar
   - Manche 4: Thème du jour (gérant choisit, 10 thèmes prédéfinis)
5. Manche 5 (Finale Jackpot):
   - 1 question, timer 20s
   - Pot = 15 × nb_joueurs_entree (tous les entry fees)
   - Premier qui répond = 100% du pot
   - Affichage réaction type "JACKPOT !!!" si winner
6. Écran résumé classement + "Re-jouer ?"
```

---

## RÈGLES DE JEU

### Entry Fee & Pot
- **Manche 1:** 15 coins Play obligatoires (validation wallet côté serveur)
- **Manches 2-5:** Gratuit
- **Pot manche 5:** Total des fees = 15 coins × nombre de joueurs ayant payé la manche 1
- **Distribution jackpot:** 100% au premier correct, 0% aux autres

### Scoring
- **First correct:** 100% points si rapide, 0% sinon
- **Points par manche:** 80 (M1) → 100 (M2) → 120 (M3) → 90 (M4) → 500 (M5 jackpot)
- **Streak bonus:** +25% après 3 correctes consécutives en M2 et M4

**Exemple:**
- Joueur paye 15 coins M1
- 0 correctes = -15 coins
- 5 correctes = +80 coins + entry fee récupéré = +80 coins net
- Final jackpot gagné = +210 coins (15×14 joueurs)

### Manche 4 — Thème du Jour
Le gérant active UN thème parmi:
- Bières du monde
- Rhums & rhummeries
- Vins & terroirs
- Whisky & scotch
- Tequila & mezcal
- Liqueurs & digestifs
- Champagne & effervescents
- Apéritifs français
- Cocktails exotiques
- Histoires de bars célèbres

**UI:** Simple dropdown ou carousel, 2 clics max | Impossible pour joueur de débloquer (gérant uniquement)

### Événements Dynamiques
- **3 consécutives:** `"{player} maîtrise la culture bar 🍹"`
- **Takes lead:** `"{player} devient le Quiz Master du bar 👑"`
- **M4 unlock:** `"🎯 Thème du jour déverrouillé : {theme}"`
- **M5 start:** `"C'EST LA FINALE ! Une question, une réponse, LE JACKPOT 💣"`
- **M5 winner:** `"{player} REMPORTE LE JACKPOT !!! 🏆💰💰💰"`
- **2 wrong:** `"{player} vacille sur la culture bar... 🍷"`

---

## SPÉCIFICATIONS TECHNIQUES

### Composants React Requis
- `<QuizCultureBarLobby />` — Sélection entrée (s'il a 15 coins)
- `<QuizCultureBarQuestion />` — Affichage Q + 4 réponses (QCM)
- `<QuizCultureBarTimer />` — Countdown 15s-20s
- `<QuizCultureBarThemeSelector />` — Dropdown thème (gérant uniquement)
- `<QuizCultureBarResult />` — Résultat + pot info
- `<QuizCultureBarLeaderboard />` — Classement final

### État Prisma Requis
```prisma
model QuizCultureBarSession {
  id String @id @default(cuid())
  gameId String
  barId String
  players QuizCultureBarPlayer[]
  currentRound Int @default(1)
  theme String? // Manche 4 theme
  status "joining" | "playing" | "finished"
  entryFeePot Int @default(0) // Somme entry fees M1
  createdAt DateTime @default(now())
}

model QuizCultureBarPlayer {
  id String @id @default(cuid())
  sessionId String
  userId String
  coinsWon Int @default(0)
  correctAnswers Int @default(0)
  totalQuestions Int @default(0)
  currentStreak Int @default(0)
  paidEntryFee Boolean @default(false)
}

model QuizTheme {
  id String @id @default(cuid())
  name String // "Bières du monde", etc.
  questions String[] // 4 questions thématiques pour M4
}
```

### Sécurité
- **Entry fee validation:** `user.wallet ≥ 15` avant M1 start
- **Pot handling:** Blockchain-style: enregistrer pot setup → distribuer après M5 réponse
- **Commission:** 10% du pot si > 100 coins (TODO_VALIDER_JC)

---

## RISQUES UX & MITIGATIONS

| Risque | Impact | Mitigation |
|---|---|---|
| Entry fee démoralisante | Joueurs quittent si perdent M1 | "Rejoin next round" prompt + annoncer pot size |
| QCM trivial (réponses obvies) | Jeu pas fun | Curation soigneuse des réponses (3 pièges) |
| Thème gérant pas visible | Staff oublie de l'activer | Notification push + icon spinner M4 start |
| Jackpot non-payé (bug) | Dispute grave | Unit test 100% : entry fee calc, pot dist, transaction |
| Manche 1-4 pas assez stressante | Jackpot est the only exciting bit | Make M1 "teasing" : afficher pot size possible |

---

## INTÉGRATION BARCOINS

✅ **Points Play:** Stakeable (entry fee) + gagnables  
✅ **Commission:** 10% pot final (si applicable)  
✅ **Leaderboard:** Compatible (points cumulables hebdo/mensuel)  
✅ **Rejouer:** Oui (nouvelle session)

❌ **Points Fidélité:** Non (Play only)  
❌ **Roue:** Hors scope

---

## CONTENUS À GÉNÉRER

### 19 Questions Total

**Manche 1 (5 questions):**
1. Quel alcool principal du Mojito ? → Rhum
2. Quelle est la région viticole espagnole célèbre pour ses rouges ? → Rioja
3. Vrai ou faux : le Martini vient d'Italie → Faux (USA)
4. Quel est le plus vieux type de alcool distillé connu ? → Eau-de-vie
5. Le Champagne doit venir obligatoirement de... ? → Champagne (région)

**Manche 2 (5 questions):**
1. Combien d'ingrédients en Margarita classique ? → 3
2. Quel fruit est pressé dans un Mojito ? → Citron vert
3. Vrai ou faux : Daiquiri = rhum + glaçon → Faux (rhum + citron + sucre)
4. Le Piña Colada vient d'où ? → Porto Rico
5. Qui était le créateur du premier cocktail moderne ? → Jerry Thomas

**Manche 3 (4 questions):**
1. Vrai ou faux : le champagne peut être produit partout en France → Faux
2. Quel est le plus vieux bar du monde encore en activité ? → (multiple selon source, ex "La Bodega", Madrid)
3. En quelle année le Champagne est-il devenu prestigieux ? → 17ème-18ème (approx)
4. Qui a inventé le Champagne ? → Dom Pérignon (legende)

**Manche 4 — Thème (4 questions par thème, stockées en DB):**
*Exemple "Bières du monde":*
1. D'où vient la Guinness originale ? → Irlande
2. Quel pays produit la plus de bière annuellement ? → Chine
3. La Belgique est célèbre pour ses... → Abbaye (Trappiste)
4. Quel style de bière = "India Pale Ale" ? → IPA

**Manche 5 (1 question):**
1. Jerry Thomas a créé quel cocktail historique ? → Martinez / Martini (selon source)

---

## CHECKLIST VALIDATION

- ✅ JSON valide
- ✅ Toutes clés présentes (meta + rounds + events + tech_needs)
- ✅ Mécanique cohérente (entry → jackpot progression claire)
- ✅ Zéro conflit règles BarCoins (Play coins, pas fidélité)
- ⏳ Prêt pour Claude Code (seed thèmes, questions, drop UI)

---

## PRIORITÉS ✍️ TODO_VALIDER_JC

- [ ] Commission 10% après jackpot ou avant ? (transaction design)
- [ ] Entrée gratuite possible après M1 perte ? (re-entry fee?)
- [ ] UI thème M4 : dropdown vs carousel vs modal ?
- [ ] Réponses QCM : 4 toujours ou variable ?
- [ ] Streak affichage real-time ou end-of-round ?
