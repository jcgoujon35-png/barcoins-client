# 🔍 RAPPORT DE VALIDATION — QUIZ CULTURE BAR (V1)

**Date:** 2026-04-02  
**Jeu:** quiz-culture-bar-v1  
**Priorité:** V1 | Tech Complexity: EASY

---

## ✅ VALIDATION STRUCTURELLE

### JSON Valide ?
**✅ OUI** — Syntaxe correcte, schema GDF respecté

### Toutes les clés présentes ?
**✅ OUI**
```
✅ id, meta (complète avec 11 champs requ.)
✅ rounds (5 manches distinctes)
✅ dynamic_events (6 événements)
✅ bonuses (2 : perfect_thematic, final_streak)
✅ tech_needs, ux_risks, coin_economy, content_to_generate
```

---

## ✅ COHÉRENCE MÉCANIQUE

### 5 Manches Progression ?
**✅ EXCELLENT**
```
M1: Alcools (entry fee 15 coins obligatoire)
M2: Cocktails (plus connu, streak x1.25)
M3: Culture générale + histoire
M4: Thème gérant (UI dropdown 10 thèmes prédéfinis)
M5: JACKPOT FINALE (pot centralisé = toutes fees M1-M4, 100% gagnant)

Progression logique:
- Fee engagement M1 → Commitment psychologique
- M4 thème = renouvellement engagement (gérant agency)
- M5 jackpot = tension maximale résolution
```

### Entry Fee Mechanic ?
**✅ OK MAIS À CLARIFIER**
```
M1: entry_fee = 15 coins (obligatoire)
M2-M4: entry_fee = 0
M5: pot centralisé des fees M1

POINT CLAIR: Si joueur n'a pas 15 coins → UI "Vous n'avez pas assez coins, rejoindre gratuitement M2?"
POINT À CLARIFIER: Joueur peut-il rejoindre directement M2 (skip M1) ? Ou M1 obligatoire ?
  → Mark TODO_VALIDER_JC si nécessaire
```

### Jackpot Mécanique ?
**✅ EXCELLENT**
```
pot = 15 coins × nombre_de_joueurs_entry_fee
distribution = 100% gagnant (tout ou rien)

Psychologie:
- Loser M1 a "débourseé 15" → motivation pour M2-M4 rattrapage
- Gagnant M1 est motivé (protéger ses 15)
- M5 = révolution possible ✅
```

### Thème Gérant M4 ?
**✅ OK MAIS SPEC À FINALISER**
```
10 thèmes prédéfinis:
- Bières du monde, Rhums, Vins, Whisky, Tequila, Liqueurs, Champagne, Apéritifs FR, Cocktails exotiques, Histoires de bars

CLARIFICATION REQUISE:
- UI: dropdown vs carousel vs modal ?
- Thème une fois par partie ou changeable ?
- Questions associées: seed 4Q par thème en DB ? → Mark TODO_VALIDER_JC
```

---

## ⚠️ CONFLITS AVEC RÈGLES BARCOINS

### Play vs Fidélité ?
**✅ OK** — Play only, entry_fee confirmé

### Commission 10% ?
**⚠️ ATTENTION**
```
Entry fee scenario:
- Pot M5 = 15 × 10 joueurs = 150 coins
- Commission 10% = 15 coins
- Gagnant reçoit: 150 - 15 = 135 coins ? Ou 150 coins ?

→ Mark TODO_VALIDER_JC : commission logique sur jackpot
```

### Légalité First-Correct-Wins ?
**✅ OK** — Speed-based skill, pas loterie

---

## 🔧 PRÊT POUR CLAUDE CODE ?

**✅ OUI**

### Blocages ?
**AUCUN** — Très bien spécifié

### Tâches Claude :
1. QuizCultureBar CRUD (session, join, answer, leaderboard)
2. Theme selector UI (dropdown + 10 seeds)
3. Pot calculation logic (entry_fee × player_count)
4. Commission deduction (10%)
5. Leaderboard sorting (points au lieu coins pour M5)

**Note:** Much simpler than Blind Test (no API, text-only)

---

## 📋 VERDICT

**✅ PRÊT POUR CLAUDE CODE — EASY IMPLEMENTATION**

**Avant coding:**
- Délinéer join flow (M1 mandatory ou optional?)
- Commission: avant visuel ou après?
- UI thème M4: définitif

