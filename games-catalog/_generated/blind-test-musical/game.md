# 🎵 BLIND TEST MUSICAL

**Version:** 1.0  
**Statut:** Draft (Prêt pour intégration Claude Code)

---

## CONCEPT

Les joueurs écoutent des extraits musicaux de **30 secondes** issus de Spotify/Deezer et tentent de reconnaître le titre et l'artiste. 

**Le secret:** Ils misent leurs **Points Play** AVANT l'écoute, transformant chaque manche en poker musical.

- Manche 1 → Hits connus (mise optionnelle, gain x1.5)
- Manche 2 → Perles rares (mise moyenne, gain x2)
- Manche 3 → Ultra-rares (mise obligatoire, pot redistribué top 3)

---

## FLOW UTILISATEUR

```
1. Joueur scanne QR → rejoint partie "Blind Test Musical"
2. 4 joueurs min → LÉ partit démarre
3. Manche 1 : 
   - Écran "Nouvelle chanson 🎵"
   - Mise optionnelle : glisseur 10-50 coins
   - Bouton "Écouter" → extrait 30s
   - Timer 20 secondes → QCM 4 réponses
   - Score immédiat + évènement dynamique
4. Manche 2 : Identique (mise 20-100)
5. Manche 3 : 
   - Identique (mise obligatoire 50-200)
   - Pot centralisé
   - Classement final : 1er (60%), 2e (30%), 3e (10%)
6. Écran résumé + "Rejouer ?"
```

---

## RÈGLES DE JEU

### Scoring
| Timing réponse | Points |
|---|---|
| < 5s | max_points |
| 5-15s | mid_points |
| > 15s | min_points |
| Faux | 0 |

**Déjà inclus :** decay linéaire par seconde (voir `decay_per_second` dans game.json)

### Système de Mise
- **Manche 1 :** Optionnelle (10-50 coins) → x1.5 si correct
- **Manche 2 :** Optionnelle (20-100 coins) → x2 si correct
- **Manche 3 :** Obligatoire (50-200 coins) → x2.5 si correct, 0 si faux

**Exemple:**
- Joueur mise 100 coins en manche 3, répond juste
- Gagne 250 coins (100 × 2.5)
- Ses 100 coins entrent aussi dans la cagnotte finale (top 3 60/30/10)

### Événements Dynamiques
- 3 bonnes réponses = `"{player} est en feu 🔥"`
- Prend la tête = `"{player} prend la tête 📈"`
- Après manche 3 = `"Dernière manche, tout peut basculer ⚡"`
- 2 fausses réponses = `"{player} vacille... 😰"`
- 3/3 correct = `"{player} signe un SANS-FAUTE 🏆"` + bonus 100 coins

---

## SPÉCIFICATIONS TECHNIQUES

### API Audio
- **Source :** Spotify API (prefers) ou Deezer fallback
- **Format :** MP3 30 secondes
- **Fetch :** Côté serveur (backend) — ZÉRO stockage BarCoins
- **Cache :** Prefetch les 4 prochains extraits pendant manche en cours

### Composants React Requis
- `<BlindTestLobby />` — Sélection difficulté / rejoindre
- `<BlindTestQuestion />` — Affichage mise + timer + audio player
- `<BlindTestAnswer />` — QCM 4 réponses + bouton submit
- `<BlindTestScore />` — Affichage score + notification dynamique
- `<BlindTestLeaderboard />` — Top 3 final + redistribution coins

### État Prisma Requis
```prisma
model BlindTestSession {
  id String @id @default(cuid())
  gameId String
  barId String
  players BlindTestPlayer[]
  currentRound Int @default(1)
  status "joining" | "playing" | "finished"
  createdAt DateTime @default(now())
}

model BlindTestPlayer {
  id String @id @default(cuid())
  sessionId String
  userId String
  coinsStaked Int @default(0)
  coinsWon Int @default(0)
  currentStreak Int @default(0)
  correctAnswers Int @default(0)
  totalQuestions Int @default(0)
}
```

### Sécurité
- **Validation côté serveur :** Vérifier que `coinsStaked ≤ playerWallet`
- **Commission PvP :** 10% sur la cagnotte (sauf final redistribution)
- **Anomalie détectée :** Reject transaction + log audit

---

## RISQUES UX & MITIGATIONS

| Risque | Impact | Mitigation |
|---|---|---|
| Latence API Spotify (>2s) | Tension rompue avant " Écouter" | Preload 4 extraits en parallèle |
| Affichage durée audio = spoil | Joueur devine via timecode | Écran "Charger..." + durée masquée |
| Langue (FR/EN) | Confus sur écran | i18n complet (Manche, Événements, Règles) |
| Joueur désynchronisé | Désync timer / réponse | WebSocket heartbeat toutes les 2s |
| Pas assez de chansons | Répétition | DB seed 500+ extraits min |

---

## INTÉGRATION BARCOINS

✅ **Points Play :** Misables + multplicateur × 1.5 / 2 / 2.5  
✅ **Commission :** 10% cagnotte manche 3  
✅ **Leaderboard :** Soir/Hebdo/Mensuel (compatible)  
✅ **Replay :** Oui (nouvelle session, nouveau pot)

❌ **Points Fidélité :** Non (Play only)  
❌ **Roue :** Hors scope (wheelEnabled = false)

---

## CONTENUS À GÉNÉRER

### Questions Sample (11 totales)

**Manche 1 — Hits (4×)**
- "Sweet Child O' Mine" — Guns N' Roses
- "Wonderwall" — Oasis
- "No Woman No Cry" — Bob Marley
- "One" — U2

**Manche 2 — Perles (4×)**
- "Under the Bridge" — Red Hot Chili Peppers
- "Wonderwall (Acoustic)" — Oasis
- "Paranoid Android" — Radiohead
- "Baby One More Time (90s remix)" — Britney Spears

**Manche 3 — Ultra-rares (3×)**
- "Teardrop (Remix instrumental)" — Électro underground 90s
- "Fade Into You (Deep cut)" — Mazzy Star
- "Gorgeous (Ambient version)" — Nirvana (bootleg)

---

## CHECKLIST VALIDATION

- ✅ JSON valide (vérifier schéma dans game.json)
- ✅ Toutes clés présentes
- ✅ Mécanique cohérente
- ✅ Zéro conflit règles BarCoins
- ⏳ Prêt pour Claude Code (vidage API, DB seed, composants)

---

## PRIORITÉS ✍️ TODO_VALIDER_JC

- [ ] Configuration Spotify/Deezer API keys (backend)
- [ ] Choix seed : 500 chansons ou tirage aléatoire API ?
- [ ] Langue par défaut : FR ou EN + i18n ?
- [ ] Streaks affichage : EN + ticker ou popup ?
