# 🏆 QUIZ SPORT À MISE VARIABLE

**Version:** 1.0  
**Statut:** Draft (Prêt pour intégration Claude Code)

---

## CONCEPT

Un quiz sport où **chaque joueur choisit combien miser AVANT de répondre**.

**Le poker du bar:** Bonne réponse = mise × 2 | Mauvaise = tout perdu.

**L'escalade:**
- M1 : Mise libre (5-50 coins) — test
- M2 : Stakes ++  (10-100 coins) + Question Piège = double
- M3 : Bankroll war (20-200 coins) + pot central 60/30/10

---

## FLOW UTILISATEUR

```
1. 2-25 joueurs, scan QR → Quiz Sport Mise Variable
2. Manche 1 — Échauffement (5 questions):
   - Q affichée → Slider "Combien mises ?" (min 5, max 50)
   - Valider mise → 20s timer pour répondre
   - QCM 4 réponses
   - Résultat:
     * Correct = +mise × 2 coins
     * Faux = -mise (tout perdu)
   - Notification: "{player} mise 25 coins et gagne +50 ! 💰"
   - Repeat 5 questions

3. Manche 2 — Intensité Piège (4 questions):
   - Identical flow (10-100 slider)
   - Annonce: "Une question vaut DOUBLE..."
   - Question 2 = piège : x4 si correct, x-1 si faux
   - Tension maximale sur Q2 : joueurs hésitent mises

4. Manche 3 — Finale Pot (3 questions):
   - HIGH STAKES: 20-200 slider
   - Toutes les mises vont dans pot central
   - Calcul final: classement par points totaux
   - Distribution: 1er 60%, 2e 30%, 3e 10% du pot

5. Total durée: 10-16 min
```

---

## RÈGLES DE JEU

### Système de Mise
**Format:** Avant chaque Q, slider apparaît
- **Manche 1:** min 5, max 50 coins
- **Manche 2:** min 10, max 100 coins
- **Manche 3:** min 20, max 200 coins

**UX:** Slider large + affichage dynamique du gain potentiel
```
Exemple M3:
- Glisseur à 150
- Text: "Si tu réponds juste: +300 coins"
- Text: "Si tu te trompes: -150 coins"
```

### Scoring — Proportional Bet
```
Formule: 
  IF correct:
    gain = mise × 2
  ELSE:
    gain = -mise

Manche 3 bonus:
  IF correct:
    gain = mise × 2 + 50 points bonus

Pot redistribution M3:
  pot_total = somme(toutes les mises M3)
  classement_final = sorted by total_points
  1er: pot × 0.60
  2e: pot × 0.30
  3e: pot × 0.10
```

### Question Piège (Manche 2)
- **Trigger:** Question 2 de la Manche 2
- **Annonce:** Au début M2 : "🪤 Une question vaut DOUBLE..."
- **Effet:**
  * Si correct: mise × 4 (au lieu de × 2)
  * Si faux: mise × -1 (au lieu de 0)
  * Ex: mise 50, correct = +200; faux = -50
- **Stratégie:** Équilibre : joueurs vont-ils jouer gros ou prudent sur Q2?

### Streak Bonus
- **Trigger:** 3 réponses correctes consécutives
- **Effet:** +25% sur la prochaine mise (max 250 coins)
- **UX:** Badge "Streak ×1.25" + notification

---

## SPÉCIFICATIONS TECHNIQUES

### Composants React Requis
- `<QuizSportMiseLobby />` — Classement provisoire
- `<QuizSportMiseQuestion />` — Affichage Q
- `<QuizSportMiseSlider />` — Slider interactive (5-50 / 10-100 / 20-200)
- `<QuizSportMisePotentialGains />` — Affichage dynamique "Gains si correct: +X"
- `<QuizSportMiseAnswer />` — QCM après mise validée
- `<QuizSportMiseResult />` — "+mise × 2" ou "-mise"
- `<QuizSportMiseFinal />` — Pot redistribution 60/30/10

### État Prisma Requis
```prisma
model QuizSportMiseSession {
  id String @id @default(cuid())
  gameId String
  barId String
  players QuizSportMisePlayer[]
  currentRound Int @default(1)
  currentQuestion Int @default(1)
  status "joining" | "playing" | "finished"
  finalPotAmount Int @default(0)
  createdAt DateTime @default(now())
}

model QuizSportMisePlayer {
  id String @id @default(cuid())
  sessionId String
  userId String
  totalCoinsWon Int @default(0)
  totalPointsRound1 Int @default(0)
  totalPointsRound2 Int @default(0)
  totalPointsRound3 Int @default(0)
  currentStreak Int @default(0)
  betsPlaced Int @default(0)
  correctAnswers Int @default(0)
}

model QuizSportMiseBet {
  id String @id @default(cuid())
  sessionId String
  playerId String
  round Int
  question Int
  betAmount Int
  isCorrect Boolean
  gainAmount Int // can be negative
  createdAt DateTime @default(now())
}
```

### Sécurité
- **Bet validation:** `user.wallet ≥ bet_amount` BEFORE slider shows
- **Answer locking:** Don't allow bet change AFTER timer starts (anti-cheat)
- **Pot calculation:** Recalculate server-side AFTER all M3 answers (don't trust client)
- **Audit log:** Every bet = `QuizSportMiseBet` record + user_id + timestamp

---

## RISQUES UX & MITIGATIONS

| Risque | Impact | Mitigation |
|---|---|---|
| Slider "finicky" on mobile | Frustration, poor UX | Increase touch target (50px min), use range input |
| Player loses big, quits | Churn risk | "Want to rejoin? You still have X coins left" |
| Bet submitted but Q hasn't loaded | Confusion | Pre-load Q before enabling slider |
| Pot math wrong (rounding errors) | Trust broken | Server-side unit test: 100% coverage of redistribution |
| Trap question not obvious | No tension | Add 🪤 emoji + banner "Question piège activée !" |
| High bet psychology (FOMO) | Bad decisions | Clear display of potential loss (not just gain) |
| Slider max too low/high | Players bored or afraid | Test stakes on real bar staff (TODO_VALIDER_JC) |

---

## INTÉGRATION BARCOINS

✅ **Points Play:** Misables + gagnables  
✅ **Commission:** 10% pot M3 (TODO_VALIDER_JC: avant ou après redistribution?)  
✅ **Leaderboard:** Compatible (points cumulables hebdo/mensuel)  
✅ **Replay:** Oui (new session = reset)

❌ **Points Fidélité:** Non (Play only)  
❌ **Roue:** Hors scope

---

## CONTENUS À GÉNÉRER

### 12 Questions Total (5 M1 + 4 M2 + 3 M3)

**Manche 1 — Warmup (5×)**
1. Combien de Coupes du Monde Pelé ? → **3**
2. Quel tenniseur le plus titré ? → **Djokovic**
3. Rugby: quel pays + de Coupes ? → **Nouvelle-Zélande**
4. F1: quel pilote + de podiums ? → **Hamilton**
5. Basketball: joueurs par équipe ? → **5**

**Manche 2 — Intense + Piège (4×)**
1. [PIÈGE] Record victoires consécutives tennis ? → **14**
2. Coupe du Monde créée en ? → **1930**
3. Score max au bowling ? → **300**
4. Pays à première Coupe rugby ? → **16**

**Manche 3 — Finale (3×)**
1. Record de Cristiano Ronaldo ? → **Buts totaux**
2. Athlète + de médailles olympiques ? → **Phelps**
3. Ballon d'Or Messi (2024) ? → **8**

---

## CHECKLIST VALIDATION

- ✅ JSON valide
- ✅ Toutes clés présentes (meta + rounds + scoring + coin_logic)
- ✅ Mécanique cohérente (proportional bet bien spécifiée)
- ✅ Question piège intégrée proprement
- ✅ Pot redistribution clara
- ✅ Zéro conflit BarCoins (Play only, commission spécifiée)
- ⏳ Prêt pour Claude Code (slider implementation, pot calculation, audit logs)

---

## PRIORITÉS ✍️ TODO_VALIDER_JC

- [ ] Stakes trop élevées ? Tester max bets sur vraies personas
- [ ] Commission 10% : déducte du pot avant ou après redistribution ?
- [ ] Question piège multiplicateur × 4 : trop ? (vs × 3)
- [ ] Slider min/max M1 / M2 / M3 : bonnes valeurs ?
- [ ] Pot redistribution avec 6+ joueurs : arrondir comment ?
- [ ] Replay: nouveau pot ou continuer même pot ? (new game = reset coins/pot)
