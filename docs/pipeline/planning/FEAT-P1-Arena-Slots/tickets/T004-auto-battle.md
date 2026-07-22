# T004 — Auto-Battle Loop

**Feature:** FEAT-P1-Arena-Slots
**Status:** ready
**Depends on:** T003
**Blocks:** T005

---

## Business goal

Odată ce Buy Phase s-a terminat, începe bătălia. Cărțile din sloturi se activează automat pe cooldown. Jucătorul vede damage, energy, HP scăzând.

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| CREATE | `src/scenes/BattleScene.ts` |
| CREATE | `src/systems/Battle.ts` |
| CREATE | `src/scenes/ResultsScene.ts` |
| MODIFY | `src/engine/StateMachine.ts` — adaugă BATTLE + RESULTS |

## Pași

1. Adaugă stările BATTLE_PHASE și RESULTS în StateMachine
2. Creează Battle.ts: cooldown per card, energy global, damage calculation
3. Creează BattleScene.ts: 2 character bars (HP + Shield + Energy), sloturi cu cooldown
4. Implementează auto-battle loop: cooldown tick → activare → damage
5. Când HP = 0 → RESULTS (Win/Lose + coins)
6. ResultsScene: text victorie/înfrângere, buton "Înapoi la meniu"

## Acceptanță

- [ ] BattleScene arată ambele caractere cu HP + Shield + Energy
- [ ] Sloturile se activează pe cooldown (Attack Jewel → damage, Defense Jewel → shield)
- [ ] Energy scade la activare, se regenerează
- [ ] Când un character ajunge la 0 HP → ResultsScreen
- [ ] Results arată "Victorie"/"Înfrângere" + coins
- [ ] Click "Înapoi la meniu" → revine la MENU

## Verificare

```bash
npm run dev
# Buy → Battle → vezi auto-battle
# Așteaptă până un HP = 0
# Vezi Results
# Click "Înapoi la meniu"
```
