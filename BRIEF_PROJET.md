# 📋 BRIEF PROJET BARCOINS — GAME DESIGN ENGINE ENFORCEMENT

**Date:** Avril 2, 2026  
**Status:** 🟡 **EN COURS — Implémentation partielle**  
**Stack:** Next.js 15, React 19, TypeScript, Tailwind, Prisma 5.22.0, PostgreSQL  
**Environnement:** Node.js v24.14.1, Dev Server Port 3000  

---

## 🎯 OBJECTIF GLOBAL

Transformer le système de jeu BarCoins Quiz Cinéma d'une **simple QCM répétitive et générique** en une **expérience de jeu complexe et variée** conforme aux standards **BARCOINS GAME DESIGN ENGINE** : 
- ✅ Minimum 3 manches avec **MÉCHANIQUES DIFFÉRENTES**
- ✅ **Systèmes de notation variés** (rapidité, élimination, mise stratégique)
- ✅ **Événements/twists** aléatoires
- ✅ **Pas de répétition** — chaque manche offre un gameplay distinct

---

## 📊 CONTEXTE ET HISTORIQUE

### Phase 1 : Demande Initiale (Rejetée)
**Utilisateur:** "Créer 5 jeux BarCoins complets et testables"  
**Agent:** Création de 5 spécifications de jeu en Game Definition Format (GDF)  
**Résultat:** ❌ Trop ambitieux, identifiées des lacunes architecturales (SSE, multi-device)

### Phase 2 : Pivot Stratégique (Partial Success)
**Utilisateur:** "Focus sur 1 jeu : quiz-cinema + 200 questions + transitions auto"  
**Agent:** 
- ✅ Généré 200 questions cinéma (`cinema_quiz_classique_extended.json`)
- ✅ Implémenté auto-transitions (3sec countdown après RESULT/LEADERBOARD)
- ✅ Modifiée architecture timer avec champs `autoAdvanceTimer`
- ✅ Déployé en local sur http://localhost:3000

**Problème découvert:** Jeu trop générique — QCM répétitive, pas de variation mécanique

### Phase 3 : Game Design Engine Enforcement (ACTUELLE)
**Utilisateur:** "Le jeu doit respecter BarCoins standards — 3 manches DIFFÉRENTES avec méchaniques variées"  
**Exigences:**
1. **Manche 1:** Rapidité-based (répliques audio)
2. **Manche 2:** Élimination (buzzer avec pénalité)
3. **Manche 3:** Stratégie (mise en coins avec pari)
4. **Twist:** Événement aléatoire DOUBLE_OU_RIEN

**Agent:** Refaçonnage complet du game engine pour supporter variations

---

## 🏗️ ARCHITECTURE ACTUELLE

### 1. State Management (`lib/game-engine/state.ts`)

**GamePhase Types:**
```
'LOBBY' → 'BET_SCREEN' (optionnel) → 'QUESTION' → 'RESULT' → 'LEADERBOARD' 
→ 'TWIST_REVEAL' (optionnel) → prochain round ou 'FINAL'
```

**Champs d'État Critiques:**
- `phase`: Phase actuelle du jeu
- `currentRoundType`: 'audio' | 'buzzer' | 'mise' | 'standard'
- `playerBets`: Enregistrement des misespar joueur (pour manche MISE)
- `eliminatedPlayers`: Array de IDs des joueurs éliminés (buzzer)
- `doubleOrNothing`: Flag twist actif
- `autoAdvanceTimer`: Countdown pour transitions auto (RESULT/LEADERBOARD)

**RoundType Definition:**
```typescript
type RoundType = 'audio' | 'buzzer' | 'mise' | 'standard'

interface Round {
  id: number
  nom: string
  type: RoundType  // ← NOUVEAU
  questionIds: string[]
  multiplier: number
  …
}
```

### 2. Game Engine Reducer (`lib/game-engine/reducer.ts`)

**Actions Supportées:**

| Action | Trigger | Effet |
|--------|---------|-------|
| `INIT_GAME` | Page mount | Parse session, initialise questions pool, joueurs |
| `START_GAME` | Bouton Commencer | Route vers QUESTION ou BET_SCREEN selon round type |
| `SET_BET` | BetScreen input | Enregistre la mise `playerBets[playerId] = amount` |
| `PLACE_BETS` | Bouton Valider mises | BET_SCREEN → QUESTION |
| `SUBMIT_ANSWER` | Joueur répond | **3SYSTÈMESde notation selon type** |
| `ELIMINATE_PLAYER` | Buzzer wrong answer | Marque joueur éliminé (buzzer) |
| `TRIGGER_DOUBLE_OR_NOTHING` | Random event | Déflagre twist, ×2 multiplicateur |
| `TIME_UP` | Timer 0 | Rend réponse comme incorrecte |
| `TICK` | Timer décrémente | COUNT DOWN timer, auto-advance |
| `NEXT_STEP` | Auto-transition | Passe à phase suivante (gère éliminations, transitions complexes) |
| `RESTART_GAME` | Bouton Recommencer | INITIAL_GAME_STATE reset |

### 3. Système de Notation Multi-Manche (`lib/game-engine/scoring.ts` + reducer SUBMIT_ANSWER)

**MANCHE 1 — RAPIDITÉ (audio):**
- Points basés sur **temps de réaction** (decay linéaire)
- Réponse rapide = plus de points
- Logique: `points = MAX_POINTS * (1 - responseTimeMs / timerMs)`
- Bot scoring: Répond en 2-5 secondes aléatoires

**MANCHE 2 — BUZZER (élimination):**
- Bonne réponse: **+80 points** × multiplicateur
- Mauvaise réponse: **-40 points** + **ÉLIMINATION**
- Timeout: -20 points (pas d'élimination)
- Joueurs éliminés: Ne peuvent plus jouer (grayed out leaderboard)
- Bot scoring: 70% de réussite aléatoire

**MANCHE 3 — MISE (stratégie):**
- Affiche **BET_SCREEN** avant la question
- Joueur parie un montant X
- Si correct: **+bet × 2** (multiplicateur)
- Si incorrect: **-bet**
- Multiplicateur final ×2 pour last manche

### 4. Session Configuration (`data/game/cinema_quiz_classique_session_v1.json`)

Structure JSON définie:
```json
{
  "session_id": "cinema_quiz_classique_v2_barcoins",
  "game_ref": "quiz_cinema_v2",
  "configuration": {
    "nombre_total_questions": 15,
    "temps_par_question": 10,
    "temps_affichage_reponse": 3,
    "entree_fee": 10
  },
  "manches": [
    {
      "id": 1,
      "nom": "RECONNAISSANCE AUDIO",
      "type": "audio",
      "questions_ids": ["q1","q2","q3","q4","q5"],
      "multiplicateur_points": 1,
      "scoring_mode": "rapidite",
      "rules": { "ranking_based": true, "points": [100,60,30,10,0] }
    },
    {
      "id": 2,
      "nom": "BUZZER — RÉPLIQUES CÉLÈBRES",
      "type": "buzzer",
      "questions_ids": ["q6","q7","q8","q9","q10"],
      "multiplicateur_points": 1,
      "scoring_mode": "buzzer",
      "rules": { "elimination": true, "correct_points": 80, "wrong_penalty": -40 }
    },
    {
      "id": 3,
      "nom": "FINALE — MISE EN COINS",
      "type": "mise",
      "questions_ids": ["q11","q12","q13","q14","q15"],
      "multiplicateur_points": 2,
      "scoring_mode": "mise",
      "rules": { "bet_required": true, "correct_multiplier": 2, "wrong_penalty": "lose_bet" }
    }
  ],
  "twist": {
    "name": "DOUBLE OU RIEN",
    "probability": 0.3,
    "effect": "double_final_round"
  },
  …
}
```

---

## 📁 FICHIERS CRÉÉS / MODIFIÉS

### Fichiers **CRÉÉS:**

| Fichier | Objectif |
|---------|----------|
| `components/barcoins-game/BetScreen.tsx` | Phase MISE — input pari joueur |
| `components/barcoins-game/TwistRevealScreen.tsx` | Affiche événement DOUBLE_OU_RIEN |
| `start-dev.bat` | Script démarrage dev server (Node.js PATH fix) |

### Fichiers **MODIFIÉS:**

| Fichier | Changes |
|---------|---------|
| `lib/game-engine/state.ts` | + GamePhase ('BET_SCREEN', 'TWIST_REVEAL'), + RoundType, + 5 champs état (bets, eliminated, twist, etc) |
| `lib/game-engine/reducer.ts` | ++ 6 actions (SET_BET, PLACE_BETS, ELIMINATE_PLAYER, TRIGGER_DOUBLE_OR_NOTHING), SUBMIT_ANSWER 3-way split, NEXT_STEP rewritten |
| `data/game/cinema_quiz_classique_session_v1.json` | Structure 3 manches différentes, type + rules par manche |
| `data/game/cinema_quiz_classique_extended.json` | 200 questions (q1-q200) |
| `components/barcoins-game/QuestionScreen.tsx` | + Indicateur visuel "MANCHE X/3" |
| `components/barcoins-game/BetScreen.tsx` | + Indicateur visuel "MANCHE X/3" |
| `app/games/quiz-cinema/page.tsx` | + BetScreen import, + TwistRevealScreen import, + case handlers |
| `app/game-demo/page.tsx` | + Démonstration composants (non-production) |

---

## 🚀 ÉTAT ACTUEL DU DÉVELOPPEMENT

### ✅ COMPLÉTÉ

1. **State Machine Refactorée**
   - ✅ GameState étendu avec champs pour bets, eliminations, twist
   - ✅ GamePhase inclut BET_SCREEN et TWIST_REVEAL
   - ✅ RoundType enum défini

2. **Reducer Actions**
   - ✅ SET_BET — enregistre pari joueur
   - ✅ PLACE_BETS — BET_SCREEN → QUESTION
   - ✅ ELIMINATE_PLAYER — marquage élimination
   - ✅ TRIGGER_DOUBLE_OR_NOTHING — twist event
   - ✅ SUBMIT_ANSWER — 3 systèmes notation distincts (rapidité/buzzer/mise)

3. **NEXT_STEP Transitions**
   - ✅ Gère RESULT → QUESTION (questions restantes) ou RESULT → LEADERBOARD (fin manche)
   - ✅ Gère LEADERBOARD → BET_SCREEN (si manche suivante est mise)
   - ✅ Gère LEADERBOARD → QUESTION (autres types manche)
   - ✅ Applique doubleOrNothing × multiplicateur si twist actif

4. **Composants UI**
   - ✅ BetScreen.tsx — sliders + inputs numériques pour pari
   - ✅ TwistRevealScreen.tsx — animation événement twist
   - ✅ QuestionScreen.tsx — + indicateur "MANCHE X/3"

5. **Data Files**
   - ✅ cinema_quiz_classique_session_v1.json — 3 manches structurées (audio/buzzer/mise)
   - ✅ cinema_quiz_classique_extended.json — 200 questions (q1-q200)

### 🟡 PARTIELLEMENT COMPLÉTÉ / PROBLÉMATIQUE

1. **Logique Bot**
   - ⚠️ Bots créés mais **N'EXÉCUTENT PAS LEURS RÉPONSES AUTOMATIQUEMENT**
   - ⚠️ Code inclut `createDefaultPlayers(4)` mais pas de dispatch auto pour bots
   - ⚠️ **Actuellement:** Jeu en attente de réponse humaine, bots paralysés

2. **BetScreen Validation**
   - ⚠️ Phase BET_SCREEN existe mais:
     - Pas de validation que tous les joueurs ont parié
     - Pas de UI distincte pour joueurs éliminés
     - Pas de countdown avant auto-confirm

3. **Twist Probability**
   - ⚠️ Configué à 30% dans session JSON
   - ⚠️ **Mais:** Jamais déclenché (pas de logic random dans NEXT_STEP)
   - ⚠️ TRIGGER_DOUBLE_OR_NOTHING case existe mais jamais appelé

4. **Questions Répétitives**
   - ⚠️ Session charge q1-q15 dans les 3 manches
   - ⚠️ Mêmes 5 questions par manche à chaque restart
   - ⚠️ Pool de 200 questions jamais utilisé pour shuffle/variation

### ❌ NON COMPLÉTÉ

1. **Multi-Device Gerant Control (Phase 2)**
   - ❌ SSE (Server-Sent Events) pour broadcast gérant actions
   - ❌ GerantDashboard component (play/pause, kick players, etc)
   - ❌ Différenciation gérant vs joueur

2. **Persistance PostgreSQL**
   - ❌ Prisma schema défini mais aucune table jeu_session/game_result
   - ❌ Pas de save scores/progression

3. **Audio Réel (Manche AUDIO)**
   - ❌ Type nommée "AUDIO" mais c'est encore du texte QCM
   - ❌ Pas de fichiers audio ou intégration Cloudinary

---

## 🐛 PROBLÈMES IDENTIFIÉS

### **PROBLÈME CRITIQUE #1 : Les Manches Sont Toutes Identique**

**Symptôme:** Screenshots montrent "MANCHE 1/3" et "MANCHE 2/3" avec titres différents **MAIS** questions sont les mêmes QCM sans variation mécanique observable

**Cause Probable:**
- BetScreen pour MANCHE 3 ne s'affiche **pas** — le jeu passe directement aux questions
- Pas de transition visuelle entre manche 1 (rapidité) et manche 2 (buzzer)
- Élimination buzzer jamais appliquée
- Aucune indication visuelle que points sont calculés différemment

**À Vérifier:**
1. INIT_GAME parse correctement `type` de session manches?
2. START_GAME préféré vers BET_SCREEN si round.type === 'mise'?
3. BetScreen condition `if (state.phase !== 'BET_SCREEN') return state` dans reducer?

### **PROBLÈME CRITIQUE #2 : Plus Aucun Bot**

**Symptôme:** `createDefaultPlayers(1)` au lieu de 4 → jeu solo

**Contexte:** Changement fait pour simplifier testing mais **bot logic n'existe pas anyway**

**Impact:** Leaderboard vide, pas d'interaction multiplayer

### **PROBLÈME CRITIQUE #3 : Twist Jamais Déclenché**

**Symptôme:** TRIGGER_DOUBLE_OR_NOTHING case dans reducer mais jamais appelé

**Cause:** NEXT_STEP n'a pas de logique `if (Math.random() < 0.3) dispatch(TRIGGER_DOUBLE_OR_NOTHING)`

**Impact:** Événement twist configuré dans session JSON mais 0% chance déclenchement

---

## 📋 CHECKLIST COMPLÉTUDE

### Must-Have (Game Design Engine Compliance)
- [x] Manche 1 avec rapidité-based scoring
- [x] Manche 2 avec buzzer + élimination
- [x] Manche 3 avec mise stratégique
- [ ] Twist aléatoire DOUBLE_OU_RIEN
- [ ] Variations questions observables/testables
- [ ] Bots jouent automatiquement

### Should-Have (MVP Extended)
- [ ] Multi-device gerant control (SSE)
- [ ] Persistance scores (PostgreSQL)
- [ ] Audio réel pour reconnaissances audio
- [ ] Shuffle questions per game session

### Nice-to-Have (Polish)
- [ ] Animations twist
- [ ] Sound effects par manche type
- [ ] Statistiques session

---

## 🔧 INSTRUCTIONS POUR PROCHAINE ÉTAPE

### Développeur Reprenant:

1. **Vérifier INIT_GAME Parse:**
   ```typescript
   // In reducer.ts INIT_GAME case, verify:
   rounds: session.manches.map(r => ({
     ...
     type: (r as any).type || 'standard',  // ← Getting type?
   }))
   ```

2. **Debug START_GAME BET_SCREEN Routing:**
   - Ajouter `console.log('Round type:', firstRound.type)` dans START_GAME
   - Vérifier `if (roundType === 'mise')` condition

3. **Implémenter Bot Auto-Play:**
   ```typescript
   // In /games/quiz-cinema/page.tsx useEffect:
   if (state.phase === 'QUESTION' && state.currentPlayerId !== 'human-player-id') {
     // Auto-dispatch SUBMIT_ANSWER for bot
     setTimeout(() => dispatch(botAnswer), 1000 + Math.random() * 2000)
   }
   ```

4. **Déclencher Twist Aléatoire:**
   - Dans NEXT_STEP, avant fin de manche:
   ```typescript
   if (Math.random() < 0.3 && session.twist.probability) {
     dispatch({ type: 'TRIGGER_DOUBLE_OR_NOTHING' })
   }
   ```

5. **Shuffle Questions Per Session:**
   - Modifier INIT_GAME pour mélanger questionIds per session (pas hardcoded q1-q15)

---

## 📌 LIENS IMPORTANTS

- **Live:** http://localhost:3000/games/quiz-cinema
- **Demo:** http://localhost:3000/game-demo
- **Dev Server:** `npm run dev` (après `$env:Path += ";C:\Program Files\nodejs"`)
- **Batch Script:** `start-dev.bat` dans dossier racine

---

## � PROBLÈMES CRITIQUES À CORRIGER (Audit Exhaustif)

### **PROBLÈME #1 [CRITICAL] — BetScreen N'Est Jamais Affichée**

**Symptôme:**
- Manche 3 (type: 'mise') devrait afficher BetScreen avant les questions
- Au lieu de ça: Le jeu passe directement aux questions avec BET_SCREEN skippée

**Cause Probable (à vérifier):**

1. **INIT_GAME ne parse pas correctement `type`:**
   ```typescript
   // Fichier: lib/game-engine/reducer.ts, case INIT_GAME
   rounds: session.manches.map(r => ({
     ...
     type: (r as any).type || 'standard',  // ← EST-CE QUE TYPE EST BIE LU?
   }))
   ```
   ❓ Vérifier que `session.manches[2].type === 'mise'` arrive bien

2. **START_GAME n'émis pas vers BET_SCREEN:**
   ```typescript
   // Fichier: lib/game-engine/reducer.ts, case START_GAME
   const roundType = firstRound.type || 'standard'
   if (roundType === 'mise') {
     return { phase: 'BET_SCREEN', … }  // ← CETTE BRANCHE S'EXÉCUTE-T-ELLE?
   }
   ```
   ❓ Debug: Console.log(roundType) pour voir quelle valeur arrive

3. **BetScreen n'est pas dans le switch case de page.tsx:**
   ```typescript
   // Fichier: app/games/quiz-cinema/page.tsx
   case 'BET_SCREEN':
     return <BetScreen state={state} … />  // ← CE CAS EXISTE?
   ```
   ✅ Vérifié: Oui, présent dans switch

**À Corriger:**
- [ ] Ajouter debug logs dans INIT_GAME et START_GAME pour tracer `type`
- [ ] Vérifier que session JSON manche 3 a `"type": "mise"` (non `"type": "MISE"` ou autre)
- [ ] S'assurer START_GAME condition `roundType === 'mise'` est exacte (case-sensitive!)
- [ ] Tester BetScreen phase transition avec console.log

---

### **PROBLÈME #2 [CRITICAL] — Bots N'Exécutent Aucune Action**

**Symptôme:**
- `createDefaultPlayers(1)` crée 1 seul joueur (dernièrement ramené à 1)
- Même avec 4 joueurs, seul le joueur humain peut répondre
- Les bots restent "paralysés" — jamais dispatch SUBMIT_ANSWER
- Leaderboard vide = score ne change jamais

**Cause:**
- Code n'a **JAMAIS IMPLÉMENTÉ** de logique auto-play pour bots
- Pas de useEffect qui dit "Si phase=QUESTION ET currentPlayerId=bot → auto-répondre"
- Pas de randomisation temps réponse bot

**À Corriger:**
- [ ] Implémenter `useBotAutoPlay()` hook dans page.tsx
  ```typescript
  useEffect(() => {
    if (state.phase === 'QUESTION' && !state.answerLocked) {
      const currentPlayer = state.players.find(p => p.id === state.currentPlayerId)
      if (currentPlayer?.isBot) {
        // Bot pense 1-3 sec, répond aléatoirement (70% correct)
        const delay = 1000 + Math.random() * 2000
        const timeout = setTimeout(() => {
          const correctAnswer = state.currentQuestion?.bonne_reponse
          const answer = Math.random() < 0.7 ? correctAnswer : randomWrongOption()
          dispatch({ type: 'SUBMIT_ANSWER', payload: { answer, responseTimeMs: delay } })
        }, delay)
        return () => clearTimeout(timeout)
      }
    }
  }, [state.phase, state.answerLocked, state.currentPlayerId])
  ```
- [ ] Revenir à `createDefaultPlayers(4)` pour avoir vrais matchs
- [ ] Vérifier que Player interface inclut flag `isBot: boolean`

---

### **PROBLÈME #3 [CRITICAL] — Les 3 Manches Sont Visuellement Identiques**

**Symptôme:**
- Titre change (Manche 1/2/3) mais gameplay exactement pareil
- Pas de différence visuelle/mécanique observable entre QCM audio et QCM buzzer
- Élimination buzzer jamais visible
- Système de pari jamais sensible

**Cause:**
1. **BetScreen jamais affichée** → Manche 3 passe inaperçue
2. **Élimination buzzer markup absent** → Pas "grayed out" joueurs éliminés
3. **Points affichés identiques** → Pas distinction scoring rapidité vs buzzer
4. **Aucun indicator mécanique** → Pas écrit "Réponse rapide = +100" vs "Erreur = -40 + OUT"

**À Corriger:**
- [ ] Faire BetScreen work (voir Problème #1)
- [ ] Ajouter **visule indicator** dans ResultScreen:
  ```typescript
  if (roundType === 'audio') {
    display: "RAPIDITÉ: +{points} en {responseTimeMs}ms"
  }
  if (roundType === 'buzzer') {
    display: "BUZZER: {isCorrect ? '+80' : '-40 + ÉLIMINÉ'}"
  }
  ```
- [ ] Dans LeaderboardScreen, grayed-out joueurs éliminés:
  ```typescript
  opacity: eliminatedPlayers.includes(entry.playerId) ? 0.4 : 1
  ```
- [ ] Ajouter **header/instruction** distinc par manche (composant MancheHeader)

---

### **PROBLÈME #4 [HIGH] — Twist DOUBLE_OU_RIEN Jamais Déclenché**

**Symptôme:**
- Session JSON configure: `"probability": 0.3` twist
- Aucune chance déclenchement actuelle (0%)
- TRIGGER_DOUBLE_OR_NOTHING action existe mais jamais disparché

**Cause:**
- NEXT_STEP n'a pas logique randomization
- Pas de: `if (Math.random() < session.twist.probability) dispatch(TRIGGER_DOUBLE_OR_NOTHING)`

**À Corriger:**
- [ ] Dans reducer.ts, case NEXT_STEP, après fin de manche avant leaderboard:
  ```typescript
  if (state.phase === 'RESULT') {
    // ... logique questions restantes ...
    // À la fin de la manche (nextQuestionIndex >= round.questionIds.length):
    if (Math.random() < (state.session?.twist?.probability || 0)) {
      return { ...state, phase: 'TWIST_REVEAL', doubleOrNothing: true, autoAdvanceTimer: 3 }
    }
    // Sinon continuer vers LEADERBOARD normalement
  }
  ```
- [ ] Test: Probabilité 100% pour vérifier, puis 30%

---

### **PROBLÈME #5 [HIGH] — Questions Toujours Identiques (q1-q15)**

**Symptôme:**
- Pool de 200 questions existe (`cinema_quiz_classique_extended.json`)
- Mais chaque partie charge toujours q1-q15 rigidement
- Pas de shuffling ou variation
- Très peu de rejeu

**Cause:**
- Session JSON hardcodes `"questions_ids": ["q1","q2",...,"q15"]`
- INIT_GAME utilise directement ces IDs sans remix

**À Corriger:**
- [ ] Dans `lib/game-engine/session.ts`, créer `shuffleSessionQuestions()`:
  ```typescript
  export function shuffleSessionQuestions(session: RawSession, allQuestions: RawQuestion[]): string[][] {
    const questionsPerRound = 5 // 3 manches × 5 Q = 15 total
    const shuffled = allQuestions.sort(() => Math.random() - 0.5)
    return [
      shuffled.slice(0, 5).map(q => q.id),      // Manche 1
      shuffled.slice(5, 10).map(q => q.id),    // Manche 2
      shuffled.slice(10, 15).map(q => q.id),   // Manche 3
    ]
  }
  ```
- [ ] Dans page.tsx INIT_GAME dispatch:
  ```typescript
  const questionIds = shuffleSessionQuestions(rawSession, rawQuestions)
  const sessionWithShuffled = {
    ...rawSession,
    manches: rawSession.manches.map((m, i) => ({
      ...m,
      questions_ids: questionIds[i]
    }))
  }
  dispatch({ type: 'INIT_GAME', payload: { session: sessionWithShuffled, … } })
  ```

---

### **PROBLÈME #6 [MEDIUM] — Pas de Validation BetScreen Complète**

**Symptôme:**
- BetScreen affichée mais pas de contrôles robustes
- Joueur peut confirmer pari en laissant tout à 0
- Pas de timer countdown avant auto-confirm

**À Corriger:**
- [ ] Ajouter validation dans PLACE_BETS:
  ```typescript
  case 'PLACE_BETS': {
    const allPlayersHaveBeD = state.players.every(p => 
      state.playerBets[p.id] !== undefined && state.playerBets[p.id] > 0
    )
    if (!allPlayersHaveBeD) return state  // Ignorer si incomplet
    return { ...state, phase: 'QUESTION', … }
  }
  ```
- [ ] Ajouter timer auto-confirm dans BetScreen (afficher countdown)

---

### **PROBLÈME #7 [MEDIUM] — Élimination Buzzer Pas Appliquée Leaderboard**

**Symptôme:**
- ELIMINATE_PLAYER action existe et push à `eliminatedPlayers[]`
- Mais LeaderboardScreen n'en tient pas compte
- Joueurs éliminés affichés normalement (non grayed out)

**À Corriger:**
- [ ] Dans LeaderboardScreen.tsx:
  ```typescript
  const isEliminated = state.eliminatedPlayers.includes(entry.playerId)
  <div style={{ opacity: isEliminated ? 0.4 : 1 }}>
    {isEliminated && " ❌ ÉLIMINÉ"}
  </div>
  ```
- [ ] S'assurer ELIMINATE_PLAYER est dispatché correctement dans SUBMIT_ANSWER buzzer case

---

### **PROBLÈME #8 [MEDIUM] — Pas de Écran Entre-Manches d'Élimination**

**Symptôme:**
- Après manche 2 (buzzer), joueurs éliminés devraient voir message "Vous êtes éliminé"
- Actuellement: Non géré

**À Corriger:**
- [ ] Créer composant EliminationScreen.tsx (simple modal "Tu es out!")
- [ ] Dans suite NEXT_STEP → LEADERBOARD → TWIST/prochain round, vérifier éliminations
- [ ] Afficher pour joueurs éliminés (currentPlayerId in eliminatedPlayers)

---

### **PROBLÈME #9 [LOW] — Twist Animation Minimale**

**Symptôme:**
- TwistRevealScreen.tsx existe mais animations très basiques
- Pas d'effets visuels frappants

**À Corriger:**
- [ ] Ajouter Framer Motion ou CSS animations
- [ ] Effet "pulse" ou "spin" sur icône⚡
- [ ] Particules ou confetti (optionnel)

---

### **PROBLÈME #10 [LOW] — Type 'audio' Toujours QCM**

**Symptôme:**
- Manche 1 nommée "RECONNAISSANCE AUDIO" mais c'est du texte QCM comme les autres
- Pas de fichiers audio, pas d'éléments audio réels

**À Corriger (Low Priority):**
- [ ] Pour MVP: Laisser tel quel (même if misleading)
- [ ] Future: Intégrer Cloudinary audio files, Howler.js player

---

## 📋 CHECKLIST CORRECTIVES (Priorité d'Exécution)

### Phase 1 — CRITIQUES (sans ça ≈ ne marche pas)
- [ ] Problème #1 — BetScreen n'apparaît jamais
- [ ] Problème #2 — Bots ne jouent pas
- [ ] Problème #3 — Les 3 manches visually identiques

### Phase 2 — FEATURES CORE
- [ ] Problème #4 — Twist jamais trigger
- [ ] Problème #5 — Questions toujours q1-q15
- [ ] Problème #6 — Validation BetScreen

### Phase 3 — POLISH
- [ ] Problème #7 — Élimination UI
- [ ] Problème #8 — Entre-écran élimination
- [ ] Problème #9 — Animations twist
- [ ] Problème #10 — Audio réel

---

## 💡 BRIEF POUR CLAUDE CODE — INSTRUCTIONS SPÉCIFIQUES

**Fichier:** PROMPT_CLAUDE_CODE.md (créé à côté de ce brief)

Claude Code doit:
1. ✅ Lire ce BRIEF_PROJET.md ENTIÈREMENT
2. ✅ Analyser les 9 fichiers clés mentionnés
3. ✅ Identifier les 10 problèmes + solutions
4. ✅ Produire un plan d'exécution pas à pas numéroté (20-30 étapes)
5. ✅ Inclure snippets de code exacts, testables
6. ✅ Classer par dépendances (ordre d'exécution)

**Output attendu:** Rapport Markdown complet avec:
- Audit par fichier
- Liste des bugs avec causes
- Plan détaillé 30 étapes
- Code snippets prêts à copier-coller
- Instructions de test pour chaque étape

**Chemin source racine:** `C:\Users\jean-\OneDrive\Documents\Barcoins\DEV\barcoins-client\`

---

**Généré:** 2026-04-02 | **Last Updated:** 2026-04-02  
**Statut:** 70% Implémentation, 30% Debugging — **10 Problèmes Identifiés & Solutions Proposées**

