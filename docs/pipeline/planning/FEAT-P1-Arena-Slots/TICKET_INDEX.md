# TICKET_INDEX.md — FEAT-P1: Arena Slots Prototype

> Ticket-uri pentru P1. Se bifează linear, unul după altul.
> Status: ✅ DONE / 🔄 IN PROGRESS / 📋 NEXT / ⏳ BACKLOG

---

## Dependințe

```
T001 (Main Menu) ─→ T002 (Arena Layout) ─→ T003 (Shop + Snap)
                                              │
                                              ▼
                                        T004 (Battle) ─→ T005 (AI)
```

## Ticket-uri

| # | Nume | Status | Fișiere | Efort |
|---|------|--------|---------|-------|
| T001 | **Main Menu Scene** | ✅ DONE | src/main.ts, src/engine/*, src/scenes/MenuScene.ts | DONE |
| T002 | **Arena Layout + 5 Sloturi** | 📋 | src/scenes/BuyScene.ts, src/systems/Arena.ts | 2-3h |
| T003 | **Shop + Snap Mechanic** | 📋 | src/systems/Shop.ts, snap logic | 2-3h |
| T004 | **Auto-Battle Loop** | 📋 | src/scenes/BattleScene.ts, src/systems/Battle.ts | 3-4h |
| T005 | **AI Opponent (Cardinal P1)** | 📋 | src/systems/AIOpponent.ts | 2-3h |

---

## Detalii per ticket

Vezi `tickets/T001-main-menu.md` etc. pentru specificația completă a fiecărui ticket.
