# BarCoins — TODO Report

Date : 2026-05-05

## TODO_VALIDER_JC (décision JC requise)

- `config/business-rules.ts:295` — `MISE_MIN_COINS: 'TODO_VALIDER_JC'` — mise minimale en coins non définie
- `config/business-rules.ts:296` — `MISE_MAX_COINS: 'TODO_VALIDER_JC'` — mise maximale en coins non définie
- `config/business-rules.ts:334` — `ANNUEL: 'TODO_VALIDER_JC'` — tarif abonnement annuel non fixé
- `config/business-rules.ts:482` — `// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta`
- `config/business-rules.ts:493` — `// Toute valeur non listée dans ce fichier = TODO_VALIDER_JC`

## TODO techniques

- `app/dashboard/page.tsx:55` — Programme fixe soirée (TODO : venir de l'API bar quand le gérant peut le saisir)
- `app/dashboard/page.tsx:63` — Produits vedette fixes (TODO : venir de la carte saisie par le gérant)
- `app/dashboard/page.tsx:148` — TODO: calculer l'écart avec le 1er quand le classement est chargé
- `lib/otp.ts:21` — guard `sid !== 'TODO'` — Twilio SID non configuré (mode dev actif)
- `lib/otp.ts:26` — guard `url !== 'TODO'` — Twilio URL non configurée (mode dev actif)

## FIXME

Aucun FIXME détecté dans les fichiers source `.ts` / `.tsx` / `.js`.

## Total

- **TODO_VALIDER_JC** : 5
- **TODO** : 5
- **FIXME** : 0

---

## Manques structurels non marqués TODO (détectés à l'analyse)

Ces éléments ne sont pas balisés dans le code mais représentent des gaps fonctionnels réels :

- **Blind test** — `app/games/blindtest/page.tsx` : 3 tracks hardcodés, aucun appel à `lib/blindtest/providers.ts`. La page est un prototype déconnecté de l'API.
- **Quiz** — `app/games/quiz/page.tsx` : 5 questions hardcodées, aucune connexion au moteur `lib/game-engine/` ni à une base de données.
- **Game engine → coins** — pas de câblage entre la fin de partie (`FinalScreen`) et `creditCoins()`. Les scores restent dans le state React local.
- **Twilio OTP** — `lib/otp.ts` en mode dev avec guards `!== 'TODO'` : authentification SMS non fonctionnelle hors dev local.
