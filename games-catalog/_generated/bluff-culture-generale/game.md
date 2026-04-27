# 🎭 BLUFF CULTURE GÉNÉRALE

**Version:** 1.0  
**Statut:** Draft (Prêt pour intégration Claude Code)  
**Priorité:** V2 (complexité la plus haute)

---

## CONCEPT

Le jeu le plus **psychologique** de BarCoins.

- **Round 1:** Un "Sachant" affirme un fait (vrai/faux aléatoire). Autres parient POUR ou CONTRE.
- **Round 2:** 2 Sachants en **conflit direct** — l'un défend VRAI, l'autre FAUX de la même affirmation. War de persuasion.
- **Round 3:** 3 affirmations rapides, rotation sachant. 1 **JOKER 50/50** par joueur (usage global session) = révèle la vérité instant.

**Le twist:** Les gagnants = ceux qui ont bien deviné, PAS ceux qui connaissaient. Intelligence sociale > culture.

---

## FLOW UTILISATEUR

```
1. 3+ joueurs, scan QR → Bluff Culture Générale
2. Lobby: distribution rôles aléatoires (1 Sachant)
3. Tours de révélation: "Your role is Sachant" ou "You're a Bettor"

4. MANCHE 1 — Mini Bluff (5 questions):
   a) Sachant affiche phrase: "La tour Eiffel a été construite en 1889"
      - Type: affirmation brute (pas "Vrai ou Faux ?")
   b) UI: Bettors voient 2 boutons: "C'est VRAI ✓" vs "C'est BLUFF ✗"
   c) Glisseur optionnel: "Combien mises ?" (5-50 coins)
   d) 30s pour parier (tous les bettors en même temps)
   e) Révélation simultanée: VRAI annoncé
   f) Ceux qui ont cliqué VRAI gagnent +Mise×2
      Ceux qui ont cliqué BLUFF perdent -Mise
   g) Sachant reçoit 10% des mises des trompés
   h) Affichage: "{sachant} avait raison ! Bluffeurs tombent. 🎭"
   i) Rotation: nouveau Sachant (random)
   j) Repeat 5×

5. MANCHE 2 — Double Sachants (4 questions):
   a) Annonce: "2 Sachants face-à-face !"
   b) Sachant 1 défend "VRAI"
   c) Sachant 2 défend "FAUX" (du même fait)
   d) UI:Bettors voient:
      - 2 grandes cartes: "Team Sachant1 (VRAI)" vs "Team Sachant2 (FAUX)"
      - Clique une équipe + mise optionnelle (10-100)
   e) 35s pour parier
   f) Révélation: "La réponse est... VRAI !"
      - Team Sachant1 + leurs pariants: gagnent
      - Team Sachant2 + leurs pariants: perdent
   g) Sachant correct reçoit 20% des mises ennemies
   h) Affichage: "⚔️ {sachant1} a pulvérisé {sachant2} !"
   i) Repeat 4×

6. MANCHE 3 — Finale Joker (3 questions):
   a) Annonce: "3 affirmations finales. 1 JOKER 50/50 par joueur (global session)"
   b) Q1: Sachant affiche "Napoléon était nain"
   c) Bettors: "VRAI" ou "BLUFF" + Mise (20-200)
   d) OPTION: Clique "Joker 🎰" → affirmation révélée DIRECTEMENT (vrai/faux)
      - Coûte 0 coins (gratuit)
      - Mais révèle la réponse (no mystery)
      - Max 1 par joueur + session
   e) Les autres parient sans joker (confiance pure)
   f) 40s timer, révélation, gains
   g) Pot redistribution: 1er (50%), 2e (30%), 3e (20%)
   h) Affichage final leaderboard

7. Durée totale: 12-18 min
```

---

## RÈGLES DE JEU

### Rôles & Rotation
- **Sachant:** Affirme une phrase (vrai/faux sélectionné par système, caché du Sachant)
- **Bettors:** Parient si affirmation est vraie ou faux
- **Rotation:** Chaque Q = nouveau Sachant (random parmi tous les joueurs)
- **Refusal:** Joueur peut décliner "Sachant" → replacement random (TODO_VALIDER_JC)

### Pari Système

**Manche 1 (Simple):**
```
Sachant affirme: "La Joconde a été peinte par Léonard de Vinci"
Bettors vote: VRAI / FAUX
Mise: 5-50 coins (optionnel)

Result VRAI (correct):
  - Bettor qui a voté VRAI: +Mise × 2
  - Bettor qui a voté FAUX: -Mise
  - Sachant: +10% des -Mise perdants

Result FAUX (bluff detected):
  - Bettor qui a voté FAUX: +Mise × 2
  - Bettor qui a voté VRAI: -Mise
  - Sachant: 0 (reçoit rien)
```

**Manche 2 (Dual Sachants):**
```
Sachant1 défend VRAI
Sachant2 défend FAUX
(Même affirmation)

Bettors vote: "Team 1 (VRAI)" / "Team 2 (FAUX)"
Mise: 10-100 coins

Result VRAI:
  - Team 1 Bettors & Sachant1: gagnent
  - Team 2 Bettors & Sachant2: perdent
  - Sachant1: +20% des mises Team2

Result FAUX:
  - Team 2 Bettors & Sachant2: gagnent
  - Team 1 Bettors & Sachant1: perdent
  - Sachant2: +20% des mises Team1
```

**Manche 3 (Finale):**
```
Same as M1, mais:
- Mise: 20-200 coins
- JOKER 50/50: 1 par joueur, global session
- Pot redistribution: 50/30/20 top 3
```

### Joker 50/50 Mechanic
- **Usage:** Clique bouton "Joker 🎰" pendant phase betting
- **Effect:** 
  * Affirmation révélée instantanément (VRAI / FAUX)
  * Pas de pari possible après (la vérité est connue)
  * Gain = 0 (c'est gratuit, mais tu apprends)
- **Limitation:** 1 MAX par joueur + session
  * Après usage, bouton disparaît pour ce joueur
  * Compteur affiché: "1 Joker restant" → "0 Jokers"
- **UI:** Bouton joker couleur or/doré, visible à tout moment pendant phase betting

### Streak Bonus
- **Trigger:** 3 bonnes intuitions consécutives (paris corrects)
- **Effect:** +50% sur prochain pari (mise × 1.5)
- **Sachant bonus:** 3 fois sachant & raison = +100 bonus points

### Scoring System
- **M1 correct bet:** +Mise × 2
- **M1 wrong bet:** -Mise
- **M2 same:** But divided by teams
- **M3 same:** Plus pot redistribution
- **Bonus:** Streak x1.5, Sachant accuracy x2

---

## SPÉCIFICATIONS TECHNIQUES

### Composants React Requis
- `<BluffCultureGeneraleLobby />` — Rôles assignment
- `<BluffCultureGeneraleRoleCard />` — "You are Sachant" ou "You're Betting"
- `<BluffCultureGeneraleAffirmation />` — Grande affichage phrase
- `<BluffCultureGeneraleBetOptions />` — 2 boutons "VRAI" / "FAUX" (M1)
  ou 2 cartes "Team 1" / "Team 2" (M2)
- `<BluffCultureGeneraleBetSlider />` — Mise optionnelle
- `<BluffCultureGeneraleJokerButton />` — Joker 50/50 (visible si unused)
- `<BluffCultureGeneraleReveal />` — Affichage la réponse + résultats
- `<BluffCultureGeneralePotFinal />` — Redistribution M3

### État Prisma Requis
```prisma
model BluffCultureGeneraleSession {
  id String @id @default(cuid())
  gameId String
  barId String
  players BluffCultureGeneralePlayer[]
  currentRound Int @default(1)
  currentQuestion Int @default(1)
  currentAffirmation String
  currentAffirmationAnswer Boolean // the truth
  sachantId String? // current sachant player
  status "joining" | "betting" | "revealing" | "finished"
  finalPotAmount Int @default(0)
  createdAt DateTime @default(now())
}

model BluffCultureGeneralePlayer {
  id String @id @default(cuid())
  sessionId String
  userId String
  totalCoinsWon Int @default(0)
  correctBets Int @default(0)
  totalBets Int @default(0)
  currentStreak Int @default(0)
  timesAssignedSachant Int @default(0)
  timesSachantCorrect Int @default(0)
  jokerUsed Boolean @default(false)
  createdAt DateTime @default(now())
}

model BluffCultureGeneraleBet {
  id String @id @default(cuid())
  sessionId String
  playerId String
  round Int
  question Int
  teamChosen String // "VRAI" / "FAUX" (M1) or "TEAM1" / "TEAM2" (M2)
  betAmount Int
  isCorrect Boolean
  gainAmount Int
  jokerUsed Boolean @default(false)
  createdAt DateTime @default(now())
}

model BluffCultureGeneraleAffirmation {
  id String @id @default(cuid())
  text String
  answer Boolean // true = vrai, false = faux
  difficulty "easy" | "medium" | "hard"
  category String // "géographie", "histoire", etc.
}
```

### Sécurité
- **Role security:** Sachant CANNOT see the answer before revealing
- **Simultaneous betting:** All bets locked server-side BEFORE reveal (no latency cheating)
- **Joker validation:** Check `player.jokerUsed == false` before allowing Joker click
- **Bet validation:** `user.wallet ≥ bet_amount` BEFORE betting allowed
- **Audit log:** Every bet + every joker usage = logged with timestamp

---

## RISQUES UX & MITIGATIONS

| Risque | Impact | Mitigation |
|---|---|---|
| Role complexity too high (confusion) | Quit rate | Tutorial round + clear color badges + role popup |
| Sachant psychology: feels exposed | Decline rate | Allow opt-out + auto-replacement |
| Joker mechanic not obvious | Underused feature | Prominent gold button + tooltip "Skip guessing, see truth" |
| Bet type switch (M1 vs M2) | Cognitive load | Clear "Round 1: Simple VRAI/FAUX" messaging |
| Multi-role confusion (I'm Sachant AND bettor?) | Logic error | ONE role per round, clearly displayed |
| Simultaneous reveal latency | Unfair advantage | Server-side lock BEFORE reveal broadcast |
| Pot math (multi-team redistribution) | Trust broken | Server-side recalc 100%, unit test coverage |
| Sachant bonus (20% of enemy bets) unclear | Dispute | Clear UI: "{sachant} reçoit 20% des mises ennemies (+X coins)" |

---

## INTÉGRATION BARCOINS

✅ **Points Play:** Misables + gagnables  
✅ **Commission:** 10% pot M3 (TODO_VALIDER_JC)  
✅ **Leaderboard:** Compatible (points cumulables)  
✅ **Replay:** Oui (new session, joker reset)

❌ **Points Fidélité:** Non (Play only)  
❌ **Roue:** Hors scope

---

## CONTENUS À GÉNÉRER

### 12 Affirmations (5 M1 + 4 M2 + 3 M3)

**Manche 1 — Simples (5×)**
1. "La tour Eiffel a été construite en 1889" → **VRAI**
2. "L'océan Pacifique couvre 50% de tous les océans" → **VRAI**
3. "La Grande Muraille est visible de l'espace à l'oeil nu" → **FAUX**
4. "Shakespeare a écrit 39 pièces de théâtre" → **VRAI**
5. "Le Titanic a coulé en 1912 après un iceberg" → **VRAI**

**Manche 2 — Face-à-Face (4×)**
1. "La Joconde a été peinte par Léonard de Vinci entre 1503-1519" → **VRAI**
2. "La Révolution française a commencé en 1788" → **FAUX** (1789)
3. "L'Égypte ancienne s'est étendue sur plus de 3000 ans" → **VRAI**
4. "Rome a été construite en un jour" → **FAUX**

**Manche 3 — Finale (3×)**
1. "Les dinosaures et les humains vivaient à la même époque" → **FAUX**
2. "L'Antarctique est un continent désertique" → **VRAI**
3. "Napoléon était nain par rapport aux standards de son époque" → **FAUX**

---

## CHECKLIST VALIDATION

- ✅ JSON valide
- ✅ Toutes clés (meta + 3 rounds distincts + dynamic_events + joker mechanic)
- ✅ Mécanique complexe mais cohérente (rôles, pari sur autrui, joker)
- ✅ Zéro conflit BarCoins (Play only, commission TODO)
- ⏳ HARD: Prêt pour Claude Code (role sync, simultaneous reveal, joker state, pot redistribution)

---

## PRIORITÉS ✍️ TODO_VALIDER_JC

- [ ] Role decline enabled ou forced participation ?
- [ ] Joker display "1 Joker restant" ou "Joker utilisé ✓" ?
- [ ] Commission 10% : déductée du pot avant ou après ?
- [ ] Sachant bonus (10% vs 20%) : équitable ?
- [ ] Affirmations trop faciles ? Tester difficulté réelle
- [ ] Max joueurs : vraiment 3-20 ou limiter ?
- [ ] Simultaneity: WebSocket suffisant ou besoin Redis ?
