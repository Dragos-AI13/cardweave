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

**Planning P1 — Character Evolution + Subordinates System (v2 cu Hub + Training)**
Design aprobat. Urmează UI_SPEC și tickete.

| Feature | Status |
|---------|--------|
| **FEAT-CE-P1: Character Evolution Prototype** | 🟡 **Game Design** (DESIGN_PASS v2 gata — Hub + Duel + Crafting + Training + Subalterns Tree) |
| Colecția caractere (multiple characters) | 💡 Backlog (P2) |
| Multiple Races | 💡 Backlog (P2) |
| Procedural Evolution (80%) | 💡 Backlog (P3) |

---

## Decizii Finale

| ID | Decizie | Status |
|----|---------|--------|
| D006 | Tech stack (actualizat D009): PixiJS pur | ✅ Decis (arhivat D011) |
| D008 | Offline-first: 100% local, zero server | ✅ Decis |
| D009 | Stack: PixiJS pur (TypeScript), fără React | ✅ Decis (arhivat D011) |
| D010 | Pivot: Card parts → Character Evolution + Subordinates | ✅ Decis |
| D011 | Switch: PixiJS → Godot 4.x / GDScript | ✅ Decis |

---

## Lifecycle

| Faza | Status | Progres |
|------|--------|---------|
| P0 — Core Design (pivotat) | ✅ Arhivat | — |
| **P1 — Character Evolution Prototype (v2 cu Hub)** | 🟡 **Game Design** | 90% (DESIGN_PASS gata, UI_SPEC urmează) |
| P2 — Skill Tree + Rase | ⬜ | 0% |
| P3 — Procedural Evolution | ⬜ | 0% |
| P4 — Polish + Release | ⬜ | 0% |

---

## Last Session Summary

*2026-07-24 — Hub + Training + DESIGN_PASS v2*
- Brainstorm Hub: Main Menu → Hub (gateway) → Duel/Crafting/Training/Tree
- Duel Popup: alegere caracter → Buy Phase (P1: doar Țăran)
- Training/Profesii: 2-3 profesii (Fierar, Alchimist, Strateg), mastery levels, deblocări în Subalterns Tree
- Crafting Screen: materiale, blueprints, bench-uri (deblocate prin Training)
- Subalterns Tree: rebrand de la Skill Tree, completat de Training
- DESIGN_PASS.md actualizat (v2) — arhitectură, flow, P1 scope, dependințe
- FEATURE_DESIGN.md actualizat — User Flow cu Hub
- Push pe GitHub (commit 7a47539)
- Următorul pas: UI_SPEC + TICKET_INDEX + tickete

---

## Notes

- **Planning P1 (v2):** `docs/pipeline/planning/FEAT-CE-P1-Character-Evolution/DESIGN_PASS.md`
- **Feature design:** `docs/pipeline/features/character-evolution/FEATURE_DESIGN.md`
- **Branch strategy:** `main` (stabil), `feat/ce-p1-character-evolution` (implementare)
- **Design vechi arhivat:** Arena Slots (card parts), Card Part System, Character Card Population, GDD v1, CHARACTERS_v1, CHARACTER_DESIGN_PROPUNERE, SYSTEM_FINAL_CONFIRMARE
