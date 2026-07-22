# T002 — Arena Layout + 5 Sloturi

**Feature:** FEAT-P1-Arena-Slots
**Status:** ready
**Depends on:** T001
**Blocks:** T003

---

## Business goal

Jucătorul vede arena cu 5 sloturi goale, fiecare cu 6 subsloturi. Poți da click pe un slot să vezi detaliile.

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| CREATE | `src/scenes/BuyScene.ts` |
| CREATE | `src/systems/Arena.ts` |
| MODIFY | `src/engine/StateMachine.ts` — adaugă BUY_PHASE stare |
| MODIFY | `src/engine/GameEngine.ts` — wiring BuyScene |

## Pași

1. Adaugă starea BUY_PHASE în StateMachine
2. Creează Arena.ts: 5 sloturi, fiecare cu 6 subsloturi
3. Creează BuyScene.ts: afișează arena cu sloturi goale
4. Conectează MenuScene "Joacă" → tranziție la BUY_PHASE
5. Click pe slot → arată subsloturile (Frame, Name, Icon, Atk, Def, Skill)

## Acceptanță

- [ ] Click Joacă în Menu → se deschide BuyScene cu 5 sloturi goale
- [ ] Click pe un slot → se deschide view cu 6 subsloturi
- [ ] Sloturile arată "0/6" când sunt goale

## Verificare

```bash
npm run dev
# Click Joacă → vezi 5 sloturi goale
# Click slot → vezi 6 subsloturi
```
