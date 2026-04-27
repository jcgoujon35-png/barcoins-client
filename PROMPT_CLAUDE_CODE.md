# PROMPT CODEX — BARCOINS QUIZ CINEMA FIX

## CONTEXTE

Projet : BarCoins — SaaS gamification bars. Stack : Next.js 15, TypeScript strict, Prisma.
Chemin racine : `C:\Users\jean-\OneDrive\Documents\Barcoins\DEV\barcoins-client\`

Le moteur de jeu (`lib/game-engine/`) est fonctionnel pour un QCM standard.
La session JSON définit 3 manches avec mécaniques différentes (audio/buzzer/mise)
mais le moteur les ignore toutes. Aucune des 6 tâches ci-dessous n'est encore faite.

**NE PAS modifier** : `lib/game-engine/questions.ts`, `lib/game-engine/parseGameDefinition.ts`, `WEBSITE/`

---

## ORDRE D'EXÉCUTION (respecter les dépendances)

```
1. state.ts        ← tout dépend des types
2. scoring.ts      ← reducer en a besoin
3. reducer.ts      ← dépend de state + scoring
4. page.tsx        ← dépend du reducer
5. TwistRevealScreen.tsx ← dépend de state
6. LeaderboardScreen.tsx ← dépend de state
```

---

## TÂCHE 1 — `lib/game-engine/state.ts`

**Durée estimée : 10 min**

### Changement 1a — Ajouter RoundType et étendre Round

AVANT :
```typescript
export interface Round {
  id: number
  nom: string
  questionIds: string[]
  multiplier: number
}
```

APRÈS :
```typescript
export type RoundType = 'audio' | 'buzzer' | 'mise' | 'standard'

export interface Round {
  id: number
  nom: string
  type: RoundType
  questionIds: string[]
  multiplier: number
}
```

### Changement 1b — Ajouter phases BET_SCREEN et TWIST_REVEAL

AVANT :
```typescript
export type GamePhase =
  | 'LOBBY'
  | 'QUESTION'
  | 'RESULT'
  | 'LEADERBOARD'
  | 'FINAL'
```

APRÈS :
```typescript
export type GamePhase =
  | 'LOBBY'
  | 'QUESTION'
  | 'RESULT'
  | 'LEADERBOARD'
  | 'BET_SCREEN'
  | 'TWIST_REVEAL'
  | 'FINAL'
```

### Changement 1c — Ajouter champs dans GameState

AVANT :
```typescript
export interface GameState {
  pot: number;
  entryFee: number;
  phase: GamePhase
  // ... reste inchangé
```

APRÈS :
```typescript
export interface GameState {
  pot: number;
  entryFee: number;
  phase: GamePhase
  playerBets: Record<string, number>
  eliminatedPlayers: string[]
  doubleOrNothing: boolean
  // ... reste inchangé
```

### Changement 1d — Initialiser ces champs dans INITIAL_GAME_STATE

AVANT :
```typescript
export const INITIAL_GAME_STATE: GameState = {
  pot: 0,
  entryFee: 0,
  phase: 'LOBBY',
```

APRÈS :
```typescript
export const INITIAL_GAME_STATE: GameState = {
  pot: 0,
  entryFee: 0,
  phase: 'LOBBY',
  playerBets: {},
  eliminatedPlayers: [],
  doubleOrNothing: false,
```

### Test tâche 1
```bash
npx tsc --noEmit
```
Attendu : zéro erreur sur state.ts. Des erreurs apparaîtront sur reducer.ts — normal, tâche 2 les règle.

---

## TÂCHE 2 — `lib/game-engine/scoring.ts`

**Durée estimée : 10 min**

Ajouter ces deux fonctions à la FIN du fichier (ne rien modifier à l'existant) :

```typescript
/**
 * Scoring manche BUZZER.
 * Bonne réponse : +80 pts × multiplicateur
 * Mauvaise réponse : -40 pts + doit être éliminé (géré dans reducer)
 * Timeout : -20 pts, pas d'élimination
 */
export function calculateBuzzerPoints(
  isCorrect: boolean,
  timedOut: boolean,
  roundMultiplier: number
): number {
  if (timedOut) return -20
  if (isCorrect) return 80 * roundMultiplier
  return -40
}

/**
 * Scoring manche MISE.
 * Bonne réponse : +bet × 2 × multiplicateur
 * Mauvaise réponse : -bet
 * Pas de mise enregistrée : traité comme mise 0
 */
export function calculateMisePoints(
  isCorrect: boolean,
  bet: number,
  roundMultiplier: number
): number {
  if (isCorrect) return bet * 2 * roundMultiplier
  return -bet
}
```

### Test tâche 2
```bash
npx tsc --noEmit
```
Attendu : pas de nouvelle erreur introduite.

---

## TÂCHE 3 — `lib/game-engine/reducer.ts`

**Durée estimée : 20 min**

### Changement 3a — Import des nouvelles fonctions scoring

AVANT :
```typescript
import * as scoring from './scoring'
```

APRÈS :
```typescript
import * as scoring from './scoring'
import type { RoundType } from './state'
```

### Changement 3b — Étendre GameAction

AVANT :
```typescript
export type GameAction =
  | { type: 'INIT_GAME'; payload: { session: RawSession; questions: RawQuestion[]; players: Player[] } }
  | { type: 'START_GAME' }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: string; responseTimeMs: number } }
  | { type: 'TIME_UP' }
  | { type: 'TICK' }
  | { type: 'NEXT_STEP' }
  | { type: 'RESTART_GAME' }
```

APRÈS :
```typescript
export type GameAction =
  | { type: 'INIT_GAME'; payload: { session: RawSession; questions: RawQuestion[]; players: Player[] } }
  | { type: 'START_GAME' }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: string; responseTimeMs: number } }
  | { type: 'SET_BET'; payload: { playerId: string; amount: number } }
  | { type: 'PLACE_BETS' }
  | { type: 'TRIGGER_DOUBLE_OR_NOTHING' }
  | { type: 'TIME_UP' }
  | { type: 'TICK' }
  | { type: 'NEXT_STEP' }
  | { type: 'RESTART_GAME' }
```

### Changement 3c — INIT_GAME : extraire `type` des manches

AVANT :
```typescript
    case 'INIT_GAME': {
      const { session, questions, players } = action.payload
      return {
        ...INITIAL_GAME_STATE,
        phase: 'LOBBY',
        session: {
          sessionId: session.session_id,
          gameRef: session.game_ref,
          timerPerQuestion: session.configuration.temps_par_question,
          pointsDistribution: session.scoring.points_distribution,
          rounds: session.manches.map(r => ({
            id: r.id,
            nom: r.nom,
            questionIds: r.questions_ids,
            multiplier: r.multiplicateur_points,
          })),
        },
```

APRÈS :
```typescript
    case 'INIT_GAME': {
      const { session, questions, players } = action.payload
      return {
        ...INITIAL_GAME_STATE,
        phase: 'LOBBY',
        session: {
          sessionId: session.session_id,
          gameRef: session.game_ref,
          timerPerQuestion: session.configuration.temps_par_question,
          pointsDistribution: session.scoring.points_distribution,
          rounds: session.manches.map(r => ({
            id: r.id,
            nom: r.nom,
            type: ((r as any).type ?? 'standard') as RoundType,
            questionIds: r.questions_ids,
            multiplier: r.multiplicateur_points,
          })),
        },
```

### Changement 3d — SUBMIT_ANSWER : scoring 3-way selon type de manche

Remplacer le bloc de calcul `points` dans `case 'SUBMIT_ANSWER'` :

AVANT :
```typescript
      const points = scoring.calculatePoints(isCorrect, responseTimeMs, timerMs, pointsDist, roundMultiplier)
```

APRÈS :
```typescript
      const roundType: RoundType = round?.type ?? 'standard'
      let points: number
      if (roundType === 'buzzer') {
        points = scoring.calculateBuzzerPoints(isCorrect, false, roundMultiplier)
      } else if (roundType === 'mise') {
        const bet = state.playerBets[state.currentPlayerId] ?? 0
        points = scoring.calculateMisePoints(isCorrect, bet, roundMultiplier)
      } else {
        points = scoring.calculatePoints(isCorrect, responseTimeMs, timerMs, pointsDist, roundMultiplier)
      }
```

Puis, juste après la mise à jour des scores dans `SUBMIT_ANSWER`, ajouter l'élimination buzzer :

AVANT (fin du case SUBMIT_ANSWER) :
```typescript
      return {
        ...state,
        answerLocked: true,
        selectedAnswer: answer,
        questionResults: [...state.questionResults, questionResult],
        scores: updatedScores,
        seenQuestionIds: [...state.seenQuestionIds, state.currentQuestion.id],
        phase: 'RESULT',
      }
```

APRÈS :
```typescript
      const newEliminated = [...state.eliminatedPlayers]
      if (round?.type === 'buzzer' && !isCorrect) {
        newEliminated.push(state.currentPlayerId)
      }

      return {
        ...state,
        answerLocked: true,
        selectedAnswer: answer,
        questionResults: [...state.questionResults, questionResult],
        scores: updatedScores,
        eliminatedPlayers: newEliminated,
        seenQuestionIds: [...state.seenQuestionIds, state.currentQuestion.id],
        phase: 'RESULT',
      }
```

### Changement 3e — Ajouter les nouveaux cases à la fin du switch (avant `default`)

```typescript
    case 'SET_BET': {
      const { playerId, amount } = action.payload
      return {
        ...state,
        playerBets: { ...state.playerBets, [playerId]: Math.max(0, amount) },
      }
    }

    case 'PLACE_BETS': {
      return { ...state, phase: 'QUESTION' }
    }

    case 'TRIGGER_DOUBLE_OR_NOTHING': {
      return { ...state, doubleOrNothing: true, phase: 'TWIST_REVEAL' }
    }
```

### Changement 3f — NEXT_STEP : router vers BET_SCREEN et déclencher twist

Dans `case 'NEXT_STEP'`, bloc `if (state.phase === 'LEADERBOARD')` :

AVANT :
```typescript
      if (state.phase === 'LEADERBOARD') {
        const rounds = state.session.rounds
        const nextRoundIndex = state.currentRoundIndex + 1

        if (nextRoundIndex < rounds.length) {
          const round = rounds[nextRoundIndex]
          const nextQuestion = questionsModule.getQuestion(state.questionsPool, round.questionIds[0])
          if (!nextQuestion) return state
          return {
            ...state,
            phase: 'QUESTION',
            currentRoundIndex: nextRoundIndex,
            currentQuestionIndex: 0,
            currentQuestion: nextQuestion,
            selectedAnswer: null,
            answerLocked: false,
            timerRemaining: state.session.timerPerQuestion,
            questionStartTime: Date.now(),
          }
        } else {
```

APRÈS :
```typescript
      if (state.phase === 'LEADERBOARD') {
        const rounds = state.session.rounds
        const nextRoundIndex = state.currentRoundIndex + 1

        if (nextRoundIndex < rounds.length) {
          const nextRound = rounds[nextRoundIndex]
          const nextQuestion = questionsModule.getQuestion(state.questionsPool, nextRound.questionIds[0])
          if (!nextQuestion) return state

          // Déclencher twist aléatoire entre manches (30% de chance)
          const twistProb = 0.3
          if (!state.doubleOrNothing && Math.random() < twistProb) {
            return {
              ...state,
              currentRoundIndex: nextRoundIndex,
              currentQuestionIndex: 0,
              currentQuestion: nextQuestion,
              phase: 'TWIST_REVEAL',
              doubleOrNothing: true,
            }
          }

          const nextPhase = nextRound.type === 'mise' ? 'BET_SCREEN' : 'QUESTION'

          return {
            ...state,
            phase: nextPhase,
            currentRoundIndex: nextRoundIndex,
            currentQuestionIndex: 0,
            currentQuestion: nextQuestion,
            selectedAnswer: null,
            answerLocked: false,
            timerRemaining: state.session.timerPerQuestion,
            questionStartTime: nextPhase === 'QUESTION' ? Date.now() : null,
          }
        } else {
```

Également dans `NEXT_STEP`, ajouter après le bloc `LEADERBOARD` (nouveau case pour TWIST_REVEAL) :

```typescript
      if (state.phase === 'TWIST_REVEAL') {
        if (!state.session) return state
        const round = state.session.rounds[state.currentRoundIndex]
        const nextPhase = round.type === 'mise' ? 'BET_SCREEN' : 'QUESTION'
        return {
          ...state,
          phase: nextPhase,
          selectedAnswer: null,
          answerLocked: false,
          timerRemaining: state.session.timerPerQuestion,
          questionStartTime: nextPhase === 'QUESTION' ? Date.now() : null,
        }
      }
```

### Test tâche 3
```bash
npx tsc --noEmit
```
Attendu : zéro erreur TypeScript.

---

## TÂCHE 4 — `app/games/quiz-cinema/page.tsx`

**Durée estimée : 15 min**

### Changement 4a — Importer les 200 questions + nouveaux composants

AVANT :
```typescript
import sessionData from '@/data/game/cinema_quiz_classique_session_v1.json'
import questionsData from '@/data/game/cinema_quiz_classique.json'
```

APRÈS :
```typescript
import sessionData from '@/data/game/cinema_quiz_classique_session_v1.json'
import questionsData from '@/data/game/cinema_quiz_classique_extended.json'
import { BetScreen } from '@/components/barcoins-game/BetScreen'
import { TwistRevealScreen } from '@/components/barcoins-game/TwistRevealScreen'
```

### Changement 4b — Ajouter handlers bet

AVANT :
```typescript
  const handleRestart = useCallback(() => dispatch({ type: 'RESTART_GAME' }), [])
  const handleExit = useCallback(() => router.push('/games'), [router])
```

APRÈS :
```typescript
  const handleRestart = useCallback(() => dispatch({ type: 'RESTART_GAME' }), [])
  const handleExit = useCallback(() => router.push('/games'), [router])
  const handleBetChange = useCallback((playerId: string, amount: number) => {
    dispatch({ type: 'SET_BET', payload: { playerId, amount } })
  }, [])
  const handlePlaceBets = useCallback(() => dispatch({ type: 'PLACE_BETS' }), [])
  const handleTwistContinue = useCallback(() => dispatch({ type: 'NEXT_STEP' }), [])
```

### Changement 4c — Ajouter les cases manquants dans le switch

AVANT :
```typescript
  switch (state.phase) {
    case 'LOBBY':
      return <LobbyScreen state={state} onStart={handleStart} />
    case 'QUESTION':
      return <QuestionScreen state={state} onAnswer={handleAnswer} />
    case 'RESULT':
      return <ResultScreen state={state} onNext={handleNext} />
    case 'LEADERBOARD':
      return <LeaderboardScreen state={state} onNext={handleNext} />
    case 'FINAL':
      return <FinalScreen state={state} onRestart={handleRestart} onExit={handleExit} />
    default:
      return null
  }
```

APRÈS :
```typescript
  switch (state.phase) {
    case 'LOBBY':
      return <LobbyScreen state={state} onStart={handleStart} />
    case 'QUESTION':
      return <QuestionScreen state={state} onAnswer={handleAnswer} />
    case 'RESULT':
      return <ResultScreen state={state} onNext={handleNext} />
    case 'LEADERBOARD':
      return <LeaderboardScreen state={state} onNext={handleNext} />
    case 'BET_SCREEN':
      return <BetScreen state={state} onPlaceBets={handlePlaceBets} onBetChange={handleBetChange} />
    case 'TWIST_REVEAL':
      return <TwistRevealScreen state={state} onContinue={handleTwistContinue} />
    case 'FINAL':
      return <FinalScreen state={state} onRestart={handleRestart} onExit={handleExit} />
    default:
      return null
  }
```

### Test tâche 4
```bash
npx tsc --noEmit
```
Puis vérifier dans le navigateur `/games/quiz-cinema` : le jeu doit démarrer, atteindre la manche 3 et afficher BetScreen.

---

## TÂCHE 5 — `components/barcoins-game/TwistRevealScreen.tsx`

**Durée estimée : 10 min**

Vérifier que le composant accepte `{ state: GameState; onContinue: () => void }` et ne référence que des champs existants dans GameState. Si le fichier n'a pas ce contrat d'interface, le remplacer intégralement par :

```typescript
'use client'
import { GameState } from '@/lib/game-engine/state'

interface Props {
  state: GameState
  onContinue: () => void
}

export function TwistRevealScreen({ state, onContinue }: Props) {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d0d0d',
      color: '#FFD600',
      textAlign: 'center',
      padding: 32,
      gap: 24,
    }}>
      <div style={{ fontSize: 64 }}>⚡</div>
      <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>DOUBLE OU RIEN</h1>
      <p style={{ fontSize: 20, color: '#fff', maxWidth: 320 }}>
        Les points de la prochaine manche sont doublés !
      </p>
      <button
        onClick={onContinue}
        style={{
          marginTop: 16,
          padding: '18px 48px',
          fontSize: 20,
          fontWeight: 700,
          background: '#FFD600',
          color: '#111',
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
        }}
      >
        CONTINUER
      </button>
    </div>
  )
}
```

### Test tâche 5
```bash
npx tsc --noEmit
```
Attendu : zéro erreur dans tout le projet.

---

## TÂCHE 6 — `components/barcoins-game/LeaderboardScreen.tsx`

**Durée estimée : 5 min**

Lire le fichier. Trouver le rendu de chaque entrée du leaderboard et ajouter l'indicateur d'élimination.

Chercher la ligne qui rend `lb.nickname` ou `entry.nickname`. Ajouter autour :

```typescript
// Ajouter dans le .map() du leaderboard, pour chaque entry :
const isEliminated = state.eliminatedPlayers.includes(entry.playerId)
// Sur le conteneur de l'entrée ajouter :
style={{ opacity: isEliminated ? 0.4 : 1 }}
// Après le nickname ajouter :
{isEliminated && <span style={{ color: '#EF4444', marginLeft: 8, fontSize: 12 }}>ÉLIMINÉ</span>}
```

---

## RÉCAPITULATIF — Ordre et tests

| Étape | Fichier | Test |
|---|---|---|
| 1 | `state.ts` | `npx tsc --noEmit` — erreurs reducer attendues |
| 2 | `scoring.ts` | `npx tsc --noEmit` — pas de nouvelle erreur |
| 3 | `reducer.ts` | `npx tsc --noEmit` — zéro erreur |
| 4 | `page.tsx` | Browser `/games/quiz-cinema` — BetScreen visible manche 3 |
| 5 | `TwistRevealScreen.tsx` | `npx tsc --noEmit` — zéro erreur projet |
| 6 | `LeaderboardScreen.tsx` | Jouer manche 2 + mauvaise réponse → voir ÉLIMINÉ |

**Smoke test final** :
```
1. Lancer npm run dev depuis barcoins-client/
2. Ouvrir http://localhost:3000/games/quiz-cinema
3. Cliquer Commencer → vérifier manche 1 normale
4. Compléter manche 1 → vérifier leaderboard
5. Manche 2 → répondre faux → vérifier -40 points + ÉLIMINÉ dans leaderboard
6. Manche 3 → vérifier BetScreen s'affiche avant les questions
7. Twist : modifier probability à 1.0 dans NEXT_STEP pour forcer → vérifier TwistRevealScreen
```

