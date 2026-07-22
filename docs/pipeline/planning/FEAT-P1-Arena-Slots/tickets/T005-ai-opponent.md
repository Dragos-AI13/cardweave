# T005 — AI Opponent (Cardinal P1)

**Feature:** FEAT-P1-Arena-Slots
**Status:** ready
**Depends on:** T004
**Blocks:** —

---

## Business goal

AI-ul adversar trebuie să joace împotriva jucătorului: cumpără părți, le plasează în sloturi, și cărțile lui se activează în battle. Nu vrem un sac de box care stă pasiv.

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| CREATE | `src/systems/AIOpponent.ts` |
| CREATE | `src/cardinal/DNA.ts` |
| MODIFY | `src/scenes/BuyScene.ts` — AI cumpără în paralel |
| MODIFY | `src/scenes/BattleScene.ts` — AI slots vizibile + battle |

## Pași

1. Creează `DNA.ts` cu 4 parametri: `aggression, defense, economy, synergy`
2. Creează `AIOpponent.ts`:
   - În Buy Phase: folosește WeightedRandomSelection să aleagă ce parte să cumpere
   - Plasează în sloturi (aleator, primul gol disponibil)
   - Buget: aceleași coins ca jucătorul
3. Integrează în BuyScene: AI face mișcările lui în paralel (instantaneu)
4. În BattleScene: sloturile AI se activează la fel ca ale jucătorului
5. AI opponent are același Ignis ca bază (HP 90, Energy +5)

## Acceptanță

- [ ] La Buy Phase, AI cumpără părți (se vede în shop că dispar)
- [ ] AI își umple sloturile
- [ ] În Battle, cărțile AI se activează și fac damage la jucător
- [ ] Jucătorul poate pierde (HP = 0)
- [ ] AI nu trișează (aceleași reguli ca jucătorul)

## Verificare

```bash
npm run dev
# Buy → vezi că și AI cumpără
# Battle → vezi că și AI atacă
# Joacă câteva runde, AI poate câștiga
```
