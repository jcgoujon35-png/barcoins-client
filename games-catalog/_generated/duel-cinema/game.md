# ⚔️ DUEL CINÉMA

**Version:** 1.0  
**Statut:** Draft (Prêt pour intégration Claude Code)

---

## CONCEPT

Un jeu **PvP high-tension** où les joueurs se défient directement sur des questions cinéma.

**Le twist:** Le **perdant transfère des coins Play au gagnant** directement (20% → 40% → 60% selon manche).

**L'adrénaline:** Chaque défaite te rapproche de zéro. La revanche existe, mais les stakes doublent. La finale = top 2 face-à-face, tout ou rien.

---

## FLOW UTILISATEUR

```
1. 2-20 joueurs, scan QR → Duel Cinéma
2. Lobby → Classement provisoire vide
3. Manche 1 (Rivalités):
   - Système "Je suis challenger"
   - Joueur X clique "Défier" → sélectionne une victime
   - Pop-up: "Êtes-vous sûr(e)?" (accept/decline)
   - Les deux répondent SIMULTANÉMENT à la même Q (10s timer)
   - Gagnant = réponse correct + premier
   - Transfert 20% coins cible → gagnant
   - Perdant peut cliquer "Revanche ?" → même Q, stakes 40%
   - Notification: "{winner} a vaincu {loser} +150 coins !"
   - Repeat : 4 duels possibles (4 questions)

4. Manche 2 (Rivalités Intensifiées):
   - Même flow pour 3 duels
   - Transfert 40% au lieu de 20%
   - Difficulté Q augmentée
   - Après 2 pertes consécutives : UI propose "Abandonner" (opt-out)

5. Manche 3 (Grande Finale):
   - Top 2 du classement provisoire → Auto-matched
   - 1 question (15s)
   - Gagnant = 60% de la wallet adversaire
   - Affichage dramatique : "{Champion} REMPORTE LE DUEL"
   - Écran résumé + "Re-jouer ?"

6. Total durée: 8-12 min (rapide, intense)
```

---

## RÈGLES DE JEU

### Challenge Mechanic
- **Qui défie:** N'importe quel joueur peut cliquer "Défier" → sélectionne cible
- **Cible peut refuser:** Pop-up avec 3 secondes avant auto-accept (TODO_VALIDER_JC)
- **Réponse simultanée:** Les 2 cliquent une réponse, timeout = auto 0

### Transfer Logic (CRITIQUE)
```
Manche 1:
  Joueur A has 500 coins
  Joueur B (challenger) wins
  Transfer = floor(500 × 0.20) = 100 coins
  Result: A has 400, B has +100

Manche 2:
  "40% transfer"
  Same calc × 0.40

Manche 3 (Finale):
  "60% transfer"
  Same calc × 0.60
  + 150 points bonus au gagnant
```

### Revanche Mechanic
- **Trigger:** Après duel perdu, bouton "Revanche ?" visible 5 secondes
- **Règle:** Max 1 revanche par duel original
- **Stakes:** Transfer = 2× normal (40% en M1, 80% en M2, **capped at 100 coins** TODO_VALIDER_JC)
- **Anti-loop:** Si revanche loss = pas de 2e revanche

### Élimination Graduelle
- After 2 consecutive losses → player can "Tap out" (exit session, keep remaining coins)
- UI: `"You've been through a lot. Exit with {coins_remaining}?"`
- NOT mandatory — can continue if he wants

### Finale Automatique
- **Ranking after M1 + M2:** Players sorted by coins won (not total coins)
- **Top 2 auto-selected:** No choice, no declining
- **Final transfer:** 60% losers coins → winner

### Scoring (For Leaderboard Tracking)
- **Round 1:** 50 points per win
- **Round 2:** 75 points per win
- **Round 3:** 150 points per win
- **+ streak bonus:** 3 wins = x1.5 multiplier on next transfer

---

## SPÉCIFICATIONS TECHNIQUES

### Composants React Requis
- `<DuelCinemaLobby />` — Classement provisoire + "Défier" CTA
- `<DuelCinemaChallenge />` — Popover "Défi lancé par {player}"
- `<DuelCinemaQuestion />` — Q + timer + 2 réponses simultanées
- `<DuelCinemaResult />` — Gagnant/Perdant + coins transferred
- `<DuelCinemaRevanche />` — Bouton revanche 5s countdown
- `<DuelCinemaFinal />` — Top 2 face-off
- `<DuelCinemaLeaderboard />` — End of session results

### État Prisma Requis
```prisma
model DuelCinemaSession {
  id String @id @default(cuid())
  gameId String
  barId String
  players DuelCinemaPlayer[]
  currentRound Int @default(1)
  status "joining" | "playing" | "finished"
  createdAt DateTime @default(now())
}

model DuelCinemaPlayer {
  id String @id @default(cuid())
  sessionId String
  userId String
  coinsWon Int @default(0)
  coinsTransferred Int @default(0) // From loses
  duelsWon Int @default(0)
  duelsLost Int @default(0)
  consecutiveLosses Int @default(0)
  isEliminatedByChoice Boolean @default(false)
}

model DuelCinemaTransfer {
  id String @id @default(cuid())
  sessionId String
  challengerId String // Who won
  targetId String // Who lost
  amountTransferred Int
  round Int
  isRevanche Boolean @default(false)
  createdAt DateTime @default(now())
  // Audit trail for BarCoins
}
```

### Sécurité — CRITICAL
- **Server-side wallet validation:** BEFORE transfer, verify `target.wallet ≥ amount`
- **Audit log:** Every transfer = `DuelCinemaTransfer` record (never delete)
- **Commission:** 10% of transfer → BarCoins revenue (deducted AFTER transfer? TODO_VALIDER_JC)
- **Race condition protection:** If 2 challenges simultaneous, sort by timestamp server-side

---

## RISQUES UX & MITIGATIONS

| Risque | Impact | Mitigation |
|---|---|---|
| Joueur K.O. (0 coins) frustré | Quit + negative review | "Spectate mode" or "Watch & earn" side-game |
| Challenge accept timeout ambigú | Déni de service social | Clear UX: "Accept in 3s or auto-accept" |
| Revanche infinite loop | Game never ends | Strict 1 revanche per duel + score tracking |
| Wallet desync (A transfer, B reroll) | Duplicate coins | Pessimistic locking: lock wallet during transfer |
| Concurrent duels by same player | Rule violation | Queue challenges, process FIFO |
| Questions trop faciles | No tension | Content review: ensure 40% failures in Q bank |

---

## INTÉGRATION BARCOINS

✅ **Points Play:** Transferables (PvP core mechanic)  
✅ **Commission:** 10% transfer (TODO comment gérer)  
✅ **Leaderboard:** Compatible (duels won = ranking criteria)  
✅ **Replay:** Oui (new session = reset)

❌ **Points Fidélité:** Non (Play only)  
❌ **Roue:** Hors scope

---

## CONTENUS À GÉNÉRER

### 8 Questions Total (4 M1 + 3 M2 + 1 M3)

**Manche 1 — Répliques Populaires (4×)**
1. "You can't handle the..." → **TRUTH** (A Few Good Men)
2. "I'll be back" → **TERMINATOR** (The Terminator)
3. "Show me the..." → **MONEY** (Jerry Maguire)
4. "Why so serious ?" → **JOKER** (The Dark Knight)

**Manche 2 — Répliques Rares (3×)**
1. "I'm the king of the world !" — Acteur ? → **Leonardo DiCaprio** (Titanic)
2. Complète : "After all, tomorrow is another..."  → **DAY** (Gone with the Wind)
3. "The stuff that dreams are made of" — Film ? → **The Maltese Falcon**

**Manche 3 — Légende Cinéma (1×)**
1. "May the Force be with you" — Film original ? → **Episode IV: A New Hope (1977)**

---

## CHECKLIST VALIDATION

- ✅ JSON valide
- ✅ Toutes clés présentes
- ✅ Mécanique PvP claire (challenge → duel → transfer)
- ✅ Revanche et élimination bien spéc
- ✅ Zéro conflit règles BarCoins (Play transfers = built-in)
- ⏳ Prêt pour Claude Code (wallet mechanics, audit logs, concurrent handling)

---

## PRIORITÉS ✍️ TODO_VALIDER_JC

- [ ] Challenge refusal : auto-accept après 3s ou mande accept obligatoire ?
- [ ] Commission 10% prise avant ou après transfer affiche au joueur ?
- [ ] Revanche stakes capped at 100 coins ou illimité ?
- [ ] Stats affichées : coins won ou net gain (minus losses) ?
- [ ] Spectate mode possible for K.O. players ?
- [ ] Classement final : trier par coins gagnés ou coins net total ?
