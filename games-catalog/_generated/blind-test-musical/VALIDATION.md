# 🔍 RAPPORT DE VALIDATION — BLIND TEST MUSICAL (V1)

**Date:** 2026-04-02  
**Jeu:** blind-test-musical-v1  
**Priorité:** V1 | Tech Complexity: MEDIUM

---

## ✅ VALIDATION STRUCTURELLE

### JSON Valide ?
**✅ OUI**
```
- Valide selon le schema GDF
- Pas d'erreurs de syntaxe
- Toutes les parenthèses fermées
```

### Toutes les clés présentes ?
**✅ OUI**
```
Clés attendues (GDF spec):
✅ id (blind-test-musical-v1)
✅ meta (title, theme, sub_themes, version, difficulty, target_players, duration_minutes, bar_potential, monetization_potential, priority, tech_complexity, media_required)
✅ rounds (3 rounds détaillés)
✅ dynamic_events (6 événements)
✅ bonuses (1 streak_multiplier)
✅ tech_needs (8 flags)
✅ ux_risks (3 risques identifiés)
✅ coin_economy (3 flags)
✅ content_to_generate (specs contenu)
```

---

## ✅ COHÉRENCE MÉCANIQUE

### Round Flow Logique ?
**✅ OUI**
- **R1 (Échauffement):** Mise optionnelle 10-50, x1.5 si correct
- **R2 (Difficulté):** Mise optionnelle 20-100, x2 si correct  
- **R3 (Finale):** Mise obligatoire 50-200, x2.5 si correct + pot 60/30/10

✅ Progression claire : stakes augmentent (10-50 → 20-100 → 50-200)
✅ Multiplicateurs cohérents (x1.5 → x2 → x2.5)
✅ Pot finale M3 = mécanisme d'engagement final bien pensé

### Scoring System Cohérent ?
**✅ OUI**
```
M1: speed_decay à chaque Q
  - max_points = 100
  - min_points = 20
  - decay_per_second = 4

M2: speed_decay (difficulté +)
  - max_points = 150
  - min_points = 30
  - decay_per_second = 5

M3: speed_decay (finale tension)
  - max_points = 200
  - min_points = 40
  - decay_per_second = 6
  
✅ Cohérent avec urgence croissante
✅ Decay accélère avec chaque manche (plus d'urgence)
```

### Prebet Multiplier Fonctionnement ?
**✅ OUI**
```
La mécanique est bien pensée :
- Mise AVANT audio = joueur prend risque + decision
- x1.5 / x2 / x2.5 si correct
- x0 si faux = tout perdu

Exemple R3:
  Joueur mise 100 coins, répond juste → +250 (100×2.5)
  Sa mise entre aussi dans pot final (60/30/10)
  ✅ Cohérent
```

### Dynamic Events Coverage ?
**✅ OUI (PARTIEL)**
```
Événements spécifiés:
✅ streak_3 → "{player} est en feu 🔥"
✅ leaderboard_overtake → "{player} prend la tête"
✅ final_round → message
✅ wrong_x2 → "{player} vacille"
✅ perfect_round → "{player} sans-faute + bonus"
✅ high_bet_win → "{player} remporte mise énorme"

⚠️ Note: "perfect_round" donne +100 bonus coins — assurez-vous que ce bonus est ajouté au wallet AFTER la manche, pas juste dans l'affichage.
```

---

## ⚠️ CONFLITS AVEC RÈGLES BARCOINS

### Play Coins vs Fidélité Coins ?
**✅ OK**
```
- play_coins_used: true ✅
- fidelite_coins_used: false ✅
Conforme au spec "Points Play ≠ misables, jamais accessibles au gérant"
```

### Roue (wheelEnabled) ?
**✅ OK**
```
- Aucune mention Roue
- Hors scope BETA ✅
- Zéro conflit
```

### Commission PvP 10% ?
**✅ OK MAIS CLARIFICATION NÉCESSAIRE**
```
coin_economy.pvp_commission_rate: 0.10 ✅

POINT D'ATTENTION:
- Jeu 1 ne fait PAS de PvP direct
- Prebet gagnant remporte coins des perdants indirectement (pot redistribution)
- Commission: s'applique-t-elle au pot M3 ?
  - Si oui: 1er reçoit 60% - 10% = 54%
  - Configuration: TODO_VALIDER_JC ✅ (marqué dans game.md)
```

### Légalité Quiz ?
**✅ OK**
```
- Blind test = compétition de compétence (pas loterie) ✅
- Basé sur skill audio recognition
- Zéro problem légal
```

### API Audio (Spotify/Deezer) ?
**✅ OK**
```
- Extraits 30s ✅
- Zéro stockage BarCoins ✅
- Fetched server-side ✅
- Rights gérés par providers ✅
```

---

## 🔧 PRÊT POUR CLAUDE CODE ?

**✅ OUI AVEC PREREQUIS**

### Blocages Identifiés ?
**AUCUN** — Le jeu est spécifié de manière exhaustive

### Tâches Claude Code Requises :
1. **Backend RESTful:**
   - POST `/api/blindtest/session` → crée session
   - POST `/api/blindtest/join` → ajoute joueur
   - POST `/api/blindtest/answer` → valide réponse + scoring
   - GET `/api/blindtest/leaderboard` → classement live

2. **Spotify/Deezer Integration:**
   - Fetch extraits 30s (batch prefetch pour M2+M3 pendant M1)
   - Cache strategy
   - Fallback Deezer si Spotify fail

3. **Frontend Components:**
   - BlindTestLobby, Question, Answer, Score, Leaderboard
   - Slider mise (UI bien testée)
   - Timer animations
   - Event notifications (streaks, etc.)

4. **Prisma Schema:**
   - Session, Player, Bet, Transfer entities
   - Audit logging

5. **Validation Rules:**
   - Wallet validation (user can't bet > wallet)
   - Server-side scoring (don't trust client)
   - Commission deduction logic

### Livrables Immédiatement Exécutables ?
**✅ OUI**
- Schema GDF complet = détails suffisants pour coder
- Exemples questions fournies
- Flow utilisateur spécifié
- Risques UX identifiés + mitigations suggérées

---

## 📋 CHECKLIST INTÉGRATION

- ✅ JSON structure = OK
- ✅ Mécanique = claire & cohérente
- ✅ Règles BarCoins = respectées
- ✅ Contenu identifié = 11 questions + 11 extraits audio
- ✅ TODO_VALIDER_JC marqués = 1 (commission logique)
- ✅ UX risks flaggés = 3 (latence API, spoil timecode, i18n)
- ✅ Tech complexity = MEDIUM (justifié : API × auth × real-time)
- ✅ Priority = V1 (go-to-market launch)

---

## 🎯 VERDICT FINAL

**✅ PRÊT POUR CLAUDE CODE**

**Statut:** DRAFT → VALIDATED (poursuivre implémentation)

**Actions Avant Coding:**
1. Confirmer commission 10% logique (TODO_VALIDER_JC)
2. Confirmer spi Spotify/Deezer keys disponibles
3. Seeds : 500+ chansons ou tirage live API ?

**Debut Implementation:** Immédiat possible
