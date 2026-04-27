# 🔍 RAPPORT DE VALIDATION — QUIZ SPORT À MISE VARIABLE (V1)

**Date:** 2026-04-02  
**Jeu:** quiz-sport-mise-variable-v1  
**Priorité:** V1 | Tech Complexity: MEDIUM

---

## ✅ VALIDATION STRUCTURELLE

### JSON Valide ?
**✅ OUI**

### Toutes les clés présentes ?
**✅ OUI** — Complète

---

## ✅ COHÉRENCE MÉCANIQUE

### Variable Bet Progression ?
**✅ CLEAR**
```
M1: 5-50 coins, ×2 if correct
M2: 10-100 coins, ×2 if correct + TRAP QUESTION vaut ×4/−1
M3: 20-200 coins, ×2 if correct + pot redistribution 60/30/10

Stakes escalate logiquement ✅
Trap question M2 = tension surprise ✅
```

### Trap Question Logic ?
**✅ EXCELLENT MECHANIC**
```
M2, Q2 = hidden multiplier ×2 (means ×4 gain, ×−1 loss)
Announcement: "Une question vaut double..."

Risk/Reward:
- Joueurs savent qu'une Q vaut double
- MAIS NE SAVENT PAS LAQUELLE
- Décision psychologique: mise gros ou prudent ?
✅ Poker tension du bar
```

### Pot Calculation M3 ?
**✅ OK MAIS MATH REQUISE**
```
Pot = somme(toutes mises M3)
Distribution: 1er 60%, 2e 30%, 3e 10%

Rounding edge cases:
- 7 joueurs @ 50 coins = 350 coins
- 60% = 210, 30% = 105, 10% = 35 ✅
- Pas de reste (lucky)

MAIS: 7 joueurs @ 51 coins = 357
- 60% = 214.2 → floor? ceil?
→ Mark TODO_VALIDER_JC : rounding strategy

Audit log: every bet MUST be logged (validation)
```

---

## ⚠️ CONFLITS AVEC RÈGLES BARCOINS

### Commission 10% ?
**⚠️ NEEDS CLARIFICATION**
```
Pot M3 = 350 coins
Commission 10% = 35 coins

Distribution:
- Option A: Commission THEN distribute
  - 1er: (350−35) × 0.60 = 189
  - 2e: (350−35) × 0.30 = 94.5
  - 3e: (350−35) × 0.10 = 31.5

- Option B: Distribute THEN commission
  - 1er: 210 − (210 × 0.10) = 189 ✅ Same
  - 2e: 105 − (105 × 0.10) = 94.5 ✅ Same
  - 3e: 35 − (35 × 0.10) = 31.5 ✅ Same

Both yield same result.
→ Mark TODO_VALIDER_JC : confirm strategy</s
```

### Slider UX on Mobile ?
**⚠️ RISK IDENTIFIED**
```
Risk: Slider bet "finicky" on mobile
Mitigation: 
- Min 50px touch target
- Large labels (min, max, current)
- Test on iPhone + Android real devices
```

---

## 🔧 PRÊT POUR CLAUDE CODE ?

**✅ OUI**

### Tâches Key :
1. Slider component (React, accessible)
2. Server-side pot calculation
3. Rounding strategy (confirmed)
4. Commission deduction logic
5. Leaderboard sorting (by total points)

### Tech Complexity Justified ?
**✅ YES**
- Slider implementation
- Proportional bet scoring
- Pot redistribution logic
- Streak multiplier tracking

---

## 📋 VERDICT

**✅ PRÊT POUR CLAUDE CODE**

**Avant coding:**
- Slider implementation: tested design
- Rounding strategy: confirm floor/ceil
- Commission timing: Option A ou B?

