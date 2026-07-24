# Project Status

> Statusul general al proiectului Lowborn.

---

## Identitate

| Proprietate | Valoare |
|-------------|---------|
| **Nume** | Lowborn |
| **Gen** | Auto-battler single-player cu character evolution + subordinates |
| **Motor** | Godot 4.x (GDScript) |
| **Desktop** | Godot native export (Steam) |
| **Web** | Itch.io (aceeași bază de cod) |
| **Model** | Offline-first — 100% local, zero server |
| **AI** | Opponent adaptiv (Cardinal P1: ADN + WeightedSelection) |
| **Pipeline** | docs/pipeline/ configurat |

---

## Current Phase

**Planning P1 — Character Evolution + Subordinates System**
Feature design scris. Așteaptă G1.

| Feature | Status |
|---------|--------|
| **FEAT-CE-P1: Character Evolution Prototype** | 🟡 **Game Design** (FEATURE_DESIGN.md scris, pre-G1) |
| Character Skill Tree (PoE-lite) | 💡 Backlog (P2) |
| Multiple Races | 💡 Backlog (P2) |
| Procedural Evolution (80%) | 💡 Backlog (P3) |

---

## Decizii Finale

| ID | Decizie | Status |
|----|---------|--------|
| D006 | Tech stack (actualizat D009): PixiJS pur | ✅ Decis |
| D008 | Offline-first: 100% local, zero server | ✅ Decis |
| D009 | Stack: PixiJS pur (TypeScript), fără React | ✅ Decis |
| D010 | Pivot: Card parts → Character Evolution + Subordinates | ✅ Decis |

---

## Lifecycle

| Faza | Status | Progres |
|------|--------|---------|
| P0 — Core Design (pivotat) | ✅ Arhivat | — |
| **P1 — Character Evolution Prototype** | 🟡 **Game Design** | 80% (FEATURE_DESIGN gata) |
| P2 — Skill Tree + Rase | ⬜ | 0% |
| P3 — Procedural Evolution | ⬜ | 0% |
| P4 — Polish + Release | ⬜ | 0% |

---

## Last Session Summary

*2026-07-24 — Pivot Character Evolution + Cleanup*
- Brainstorming: character evolution înlocuiește card parts
- 6 doc-uri vechi arhivate (SUPERSEDED)
- Noul FEATURE_DESIGN.md scris — `docs/pipeline/features/character-evolution/FEATURE_DESIGN.md`
- D010 adăugat în DECISION_LOG
- DESIGN_PIPELINE, NEXT_ACTIONS, CURRENT_SESSION actualizate
- config.ts + characters.ts rescrise pentru noul model
- TICKET_INDEX nou creat (CE-P1-01 → CE-P1-09)
- Următorul pas: G1 — aprobare Character Evolution design

---

## Notes

- **Planning P1:** `docs/pipeline/planning/FEAT-CE-P1-Character-Evolution/`
- **Feature design:** `docs/pipeline/features/character-evolution/FEATURE_DESIGN.md`
- **Branch strategy:** `main` (stabil), `feat/ce-p1-character-evolution` (implementare)
- **Design vechi arhivat:** Arena Slots (card parts), Card Part System, Character Card Population, GDD v1, CHARACTERS_v1, CHARACTER_DESIGN_PROPUNERE, SYSTEM_FINAL_CONFIRMARE
