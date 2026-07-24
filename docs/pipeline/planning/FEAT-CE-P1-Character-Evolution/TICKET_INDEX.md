# TICKET_INDEX.md — FEAT-CE-P1 Character Evolution (Minimal Viable Loop)

**Feature:** FEAT-CE-P1
**Status:** planning
**Data:** 2026-07-24

---

## Descriere

P1 al noului sistem Character Evolution. Un loop jucabil cap-la-cap: alegi personaj → cumperi subalterni + items/skills → auto-battle → results → level-up + fame.

Vezi `docs/pipeline/features/character-evolution/FEATURE_DESIGN.md` pentru spec-ul complet.

---

## Ticket-uri

| # | Nume | Depinde de | Efort | Status |
|---|------|-----------|-------|--------|
| CE-P1-01 | Main Menu + Character Selection | — | 1-2h | ⬜ |
| CE-P1-02 | Arena Layout (5 sloturi pentru subalterni) | CE-P1-01 | 1-2h | ⬜ |
| CE-P1-03 | Shop 2-Panel + Subalterni | CE-P1-02 | 2-3h | ⬜ |
| CE-P1-04 | Item/Skill Crafting + Shop Population | CE-P1-03 | 2-3h | ⬜ |
| CE-P1-05 | Auto-Battle (subalterni atacă) | CE-P1-03 | 3-4h | ⬜ |
| CE-P1-06 | Main Character Vulnerability | CE-P1-05 | 1h | ⬜ |
| CE-P1-07 | AI Opponent (adaptat) | CE-P1-05 | 2-3h | ⬜ |
| CE-P1-08 | Fame + Level + Skill Tree | CE-P1-05 | 2-3h | ⬜ |
| CE-P1-09 | Results Screen + Restart | CE-P1-08 | 1-2h | ⬜ |

### Dependințe

```
CE-P1-01 (Main Menu) ─→ CE-P1-02 (Arena) ─→ CE-P1-03 (Shop + Subalterni)
                                                      │
                                            ┌───────┴────────┐
                                            ▼                ▼
                                    CE-P1-04 (Crafting)  CE-P1-05 (Battle)
                                                              │
                                              ┌───────────────┼───────────────┐
                                              ▼               ▼               ▼
                                        CE-P1-06 (Vulnerability)  CE-P1-07 (AI)  CE-P1-08 (Fame + Level)
                                                                                      │
                                                                                      ▼
                                                                                CE-P1-09 (Results + Restart)
```

---

## Detalii per ticket

### CE-P1-01 — Main Menu + Character Selection
- Titlu LOWBORN
- Buton "Joacă" → alege personaj (doar Țăran în P1)
- Buton "Restart" (când ai un personaj activ)
- Show level + fame + name

### CE-P1-02 — Arena Layout
- 5 sloturi, fiecare ține un subaltern
- Slot gol = arată placeholder
- Slot ocupat = arată subaltern + items/skills echipate
- Click pe slot → detalii subaltern

### CE-P1-03 — Shop 2-Panel
- Panel stânga: Subalterni (filtrați pe tier, în funcție de faimă)
- Panel dreapta: Items + Skills (doar cele craftate apar)
- Click cumpără → subalternul apare în primul slot liber
- Click item/skill → se echipează pe subalternul selectat

### CE-P1-04 — Crafting
- UI simplu: selectezi ce să craftezi (item sau skill)
- Dacă ai materialele → apare în shop
- Materiale = drop din bătălii

### CE-P1-05 — Auto-Battle
- Subalternii au cooldown individual
- Când cooldown = 0 → atacă inamicul cu cele mai puține HP
- Damage = base_ATK + item_bonus + skill_effect
- Fără energy în P1 (doar cooldown)

### CE-P1-06 — Main Character Vulnerability
- Când o tabără rămâne fără subalterni → atacă personajul principal
- Personaj principal = HP separat (baseHp + boosturi din skill tree)
- personaj principal mort → round lost

### CE-P1-07 — AI Opponent
- Același sistem ca playerul: alege subalterni, items, skills
- Cardinal P1 adaptat (4 parametri ADN, WeightedRandomSelection)

### CE-P1-08 — Fame + Level + Skill Tree
- Fame = victorii (deblochează tier-uri de subalterni)
- Level = XP (deblochează noduri în skill tree)
- Skill tree vizual: 4 căi, fiecare cu 2-3 noduri
- La level-up, jucătorul alege ce nod să deblocheze

### CE-P1-09 — Results Screen + Restart
- Win/Lose + XP + coins + fame + material drops
- Buton "Main Menu" sau "Next Round"
- Buton "Restart" = începe de la 0 cu un personaj nou
