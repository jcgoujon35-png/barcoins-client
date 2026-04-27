# 🔍 RAPPORT DE VALIDATION — BLUFF CULTURE GÉNÉRALE (V1)

**Date:** 2026-04-02  
**Jeu:** bluff-culture-generale-v1  
**Priorité:** V2 | Tech Complexity: HARD

---

## ✅ VALIDATION STRUCTURELLE

### JSON Valide ?
**✅ OUI**

### Toutes les clés présentes ?
**✅ OUI** — Complet mais COMPLEXE

---

## ✅ COHÉRENCE MÉCANIQUE

### 3-Round Escalade ?
**✅ COMPLEX BUT COHERENT**
```
M1 "Mini Bluff":
  - 1 Sachant affirme fact (vrai/faux random)
  - Bettors vote VRAI/FAUX + mise optionelle (5-50)
  - Sachant reçoit 10% mises perdants si correct

M2 "Dual Sachants":
  - 2 Sachants: 1 défend VRAI, 1 défend FAUX
  - Bettors choisissent équipe + mise (10-100)
  - Sachant correct reçoit 20% mises ennemies
  - Tension escalade

M3 "Finale Joker":
  - Rotation sachant chaque Q
  - JOKER 50/50: 1 per joueur, global session
  - Pot redistribution 50/30/20
  - Joker = free reveal (cost 0)
```

### Joker Mechanic ?
**✅ CLEAR**
```
- 1 max per joueur + session (global, not per round)
- Usage: click button during betting phase
- Effect: Answer revealed instantly (VRAI/FAUX known)
- Cost: 0 coins (gratuit)
- Consequence: No guessing = no gain (but learn truth)
- UI: Gold button, "Jokers: 1/1 remaining"

Psychological:
- Risk/reward: Use joker now or save for later?
- Creates agency + tension
```

### Role Rotation System ?
**✅ COMPLEX BUT SPEC'D**
```
M1: Random 1 Sachant, others = Bettors
M2: Random 2 Sachants, others = Bettors
M3: Different sachant per Q (auto-rotation + random)

Concern: If same player sachant 3 times = feels unfair?
→ Mitigation: Spec says "random" = system must truly randomize
   (not weighted by previous rounds)
→ Mark TODO_VALIDER_JC : verify randomization fair

Role decline:
- Spec says player can "decline sachant" + auto-replacement
- UI: Popup "You've been assigned Sachant. Accept? [YES] [NO]"
- Ensures engagement consent ✅
```

---

## ⚠️ CONFLICTS AVEC RÈGLES BARCOINS

### Sachant Bonus (10% vs 20%) ?
**⚠️ NEEDS BALANCE CHECK**
```
M1: Sachant receives 10% of losing bets
M2: Sachant receives 20% of losing bets

Example M1:
- Pot losing bets = 100 coins (4 joueurs @ 25 chacun voted wrong)
- Sachant receives = 10 coins

Is 10% fair? 20%?
→ Mark TODO_VALIDER_JC : balance test on real personas
```

### Commission 10% ?
**⚠️ SAME TIMING ISSUE**
```
Pot M3 = 500 coins
Commission 10% = 50 coins
Distribution: 250/150/50 or (500-50) split?

→ Mark TODO_VALIDER_JC : confirm strategy
(likely same math as sport game)
```

---

## 🔧 PRÊT POUR CLAUDE CODE ?

**⚠️ YES BUT HARD**

### Blocages CRITIQUES ?
```
1. Simultaneous Reveal Requirement (ESSENTIAL):
   - All bets locked server-side BEFORE reveal
   - WebSocket latency = unfair if not synced
   - Solution: Lock on server → broadcast reveal to all clients in <100ms
   
2. Role Assignment Complexity:
   - M1: assign 1 random sachant
   - M2: assign 2 random sachants (different from M1 if possible)
   - M3: assign 1 new sachant per Q
   - Balance: ensure same player not always sachant
   
3. Joker State Tracking:
   - Per-player jokerUsed flag
   - Must be session-global (not per-round)
   - UI must reflect "0/1 Jokers" remaining

4. Bet Type Complexity:
   - M1: VRAI/FAUX betting
   - M2: TEAM1/TEAM2 betting (different UI)
   - Logic change per-round = state machine required
```

### Implementation Complexity ?
**HARD** — Justified by:
- Role management + randomization
- Simultaneous websocket sync
- State machine (3 different bet types)
- Joker mechanic tracking

### Unit Tests Required ?
**CRITICAL:**
- Randomization fairness (no same player 3×)
- Simultaneous reveal (WebSocket sync)
- Joker state transitions
- Role conflict resolution (2 sachants never same person if possible)

---

## ⚠️ UX RISKS FLAGGED (VALIDATED)

| Risk | Mitigation |
|---|---|
| Multi-role confusion | Clear role badges + color coding + popup |
| Sachant refusal rate | Allow opt-out + auto-replacement + engagement notice |
| Joker mechanic unclear | Gold button + tooltip + counter "1/1 Jokers remaining" |
| Bet type switching confusion | Clear "Round X: Voting [VRAI/FAUX] or [TEAM1/TEAM2]?" |
| Simultaneous reveal latency | Server-side lock + <100ms broadcast |

**All mitigations specified ✅**

---

## 📋 VERDICT

**⚠️ READY FOR CLAUDE CODE — BUT HIGHEST COMPLEXITY**

**Priorité:** V2 (post-beta) = sensible
**Tech Complexity:** HARD = justified

**Critical Before Coding:**
- [ ] Confirm role decline flow + auto-replacement logic
- [ ] WebSocket latency budget: target <100ms sync
- [ ] Randomization algorithm: ensure fair distribution
- [ ] Joker UX: confirm gold button + counter design
- [ ] Sachant bonus % balance: test on 3-5 beta players
- [ ] Commission timing: decide and document

**Recommended Approach:**
1. Implement M1 simple flow first
2. Add M2 dual-sachants complexity
3. Layer on Joker mechanic
4. Test WebSocket sync extensively
5. Beta test real bar (psycho validation)

---

## 🎯 FINAL ASSESSMENT

**Status:** DRAFT → VALIDATED (V2 queue)
**Ready?:** YES, with pre-coding checklist
**Complexity Risk:** Manageable with testing plan

This is the most complex game—well-deserved V2 priority.

