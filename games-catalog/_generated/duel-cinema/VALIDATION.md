# 🔍 RAPPORT DE VALIDATION — DUEL CINÉMA (V1)

**Date:** 2026-04-02  
**Jeu:** duel-cinema-v1  
**Priorité:** V1 | Tech Complexity: MEDIUM

---

## ✅ VALIDATION STRUCTURELLE

### JSON Valide ?
**✅ OUI**

### Toutes les clés présentes ?
**✅ OUI** — Complet (id, meta, 3 rounds, events, bonuses, tech_needs, ux_risks)

---

## ✅ COHÉRENCE MÉCANIQUE

### PvP Transfer Logic ?
**✅ CLEAR & SCARY (Intended)**
```
M1: 20% transfer (challengeur gagne 20% de wallet cible)
M2: 40% transfer (difficulté + risque)
M3: 60% transfer (BRUTAL - finale suprême)

Revanche mechanic:
- Après duel perdu, option "Revanche ?" (5s window)
- Stakes DOUBLENT (40% en M1, 80% en M2, capped 100)
- Max 1 revanche par duel original ✅

Elimination:
- Après 2 pertes consécutives, joueur peut "tap out" (exit)
- Keep remaining coins ✅ (design humain)
```

### Final Face-Off ?
**✅ EXCELLENT**
```
Top 2 provisoires auto-matched → duel final → 60% transfer
Classement by coins won (not total) ✅
```

---

## ⚠️ CONFLITS AVEC RÈGLES BARCOINS

### Transfer Commission ?
**⚠️ UNCLEAR**
```
Transfer 20%: A a 500, B gagne
  - B receives 100
  - Commission 10% = 10 coins
  - B receiving 90 ou 100 ?
  
→ Mark TODO_VALIDER_JC : commission timing (before/after display)
```

### Audit Trail Required ?
**✅ CRITICAL** — Marked in spec via `DuelCinemaTransfer` model
```
Every transfer = audit log entry
Prevents "coin duplication" bugs ✅
```

---

## 🔧 PRÊT POUR CLAUDE CODE ?

**✅ OUI MAIS CRITICAL ATTENTION**

### Blocages Techniques ?
```
⚠️ Concurrent wallet access:
   - Player A and B duel simultaneously
   - Race condition: A transfers to B, B transfers to A
   - Solution: Pessimistic locking (lock wallet during transfer)

⚠️ Revanche infinite loop:
   - Player can't request revanche after losing revanche ✅
   - Validated in spec: "max 1 revanche per duel"

⚠️ Server-side validation CRITICAL:
   - MUST verify target.wallet ≥ transfer_amount
   - MUST NOT trust client UI
```

### Implementation Complexity ?
**MEDIUM** — PvP state machine + wallet locking + audit trail

---

## 📋 VERDICT

**✅ PRÊT POUR CLAUDE CODE AVEC GARDE-FOUS**

**Avant coding:**
- [ ] Clarifier commission avant/après transfer affichage
- [ ] Implémenter wallet locking (pessimistic)
- [ ] Comprehensive unit tests: race conditions
- [ ] Audit log schema finalisé

