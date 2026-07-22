# T003 — Shop + Snap Mechanic

**Feature:** FEAT-P1-Arena-Slots
**Status:** ready
**Depends on:** T002
**Blocks:** T004

---

## Business goal

Jucătorul poate cumpăra părți din shop și le plasează direct în sloturi (snap). Fiecare parte cumpărată e imediat activă.

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| CREATE | `src/systems/Shop.ts` |
| CREATE | `src/data/parts.ts` |
| MODIFY | `src/scenes/BuyScene.ts` — adaugă panel shop + buton End Buy |
| MODIFY | `src/systems/Arena.ts` — adaugă snap logic |

## Pași

1. Creează `src/data/parts.ts`: Attack Jewel (+8 damage, 3 energy), Defense Jewel (+6 HP, 2 energy)
2. Creează Shop.ts: listă de părți, coin counter, reroll
3. Adaugă panel shop în BuyScene (dreapta sau jos)
4. Implementează snap: click parte în shop → click subslot gol → partea apare
5. Când un slot ajunge la 6/6 → marcaj vizual (boost)
6. Buton "End Buy" → tranziție la BATTLE_PHASE

## Acceptanță

- [ ] Shop-ul arată Attack Jewel + Defense Jewel cu preț
- [ ] Click pe o parte + click pe subslot gol → partea apare în slot
- [ ] Slotul arată câte părți are (ex: 3/6)
- [ ] Când toate 6 sunt ocupate → slotul e marcat "complet"
- [ ] Buton "End Buy" → trece la BATTLE_PHASE (navigare)

## Verificare

```bash
npm run dev
# BuyScene → vezi shop cu părți
# Click Attack Jewel → click slot gol → apare în slot
# Verifică slot count
# Click End Buy → log BATTLE_PHASE
```
