# Project Status

> Statusul general al proiectului Cardweave.

---

## Identitate

| Proprietate | Valoare |
|-------------|---------|
| **Nume** | Cardweave |
| **Gen** | Auto-battler single-player cu card crafting din părți |
| **Motor** | PixiJS (TypeScript pur) |
| **Desktop** | Tauri (Steam) |
| **Web** | Itch.io (aceeași bază de cod) |
| **Model** | Offline-first — 100% local, zero server |
| **AI** | Opponent adaptiv (Cardinal P1: ADN + WeightedSelection) |
| **Pipeline** | docs/pipeline/ configurat |

---

## Current Phase

**Planning P1 — Arena Slots Prototype**
Feature spec + arhitectură + wireframe + 5 ticket-uri gata. Așteaptă T001.

| Feature | Status |
|---------|--------|
| **FEAT-P1: Arena Slots Prototype** | 🟠 **Planning** (tickets gata, pre-implementare) |
| Card Part System | 💡 Backlog (P2) |

---

## Decizii Finale

| ID | Decizie | Status |
|----|---------|--------|
| D006 | Tech stack (actualizat D009): PixiJS pur | ✅ Decis |
| D008 | Offline-first: 100% local, zero server | ✅ Decis |
| D009 | Stack: PixiJS pur (TypeScript), fără React | ✅ Decis |

---

## Lifecycle

| Faza | Status | Progres |
|------|--------|---------|
| P0 — Core Design | ✅ GDD complet + Systems Catalog | 100% |
| **P1 — Arena Slots Prototype** | 🟠 **Planning** | 95% (planning complet) |
| P2 — Card Assembly | ⬜ | 0% |
| P3 — Rase + AI | ⬜ | 0% |
| P4 — Run Loop | ⬜ | 0% |
| P5 — Professions | ⬜ | 0% |
| P6 — Blueprints | ⬜ | 0% |
| P7 — Upgrade + Tier | ⬜ | 0% |
| P8 — Cardinal complet | ⬜ | 0% |
| P9 — Polish | ⬜ | 0% |
| P10 — Release | ⬜ | 0% |

---

## Last Session Summary

*2026-07-22 — Planning P1 complet + Wireframe Main Menu*
- Wireframe Main Menu aprobat → `design/wireframes/`
- Planning package P1 creat: FEATURE.md, DESIGN_PASS.md, UI_SPEC.md
- 5 ticket-uri P1 definite (T001-T005) cu dependințe
- Main Menu wireframe oficial în `design/wireframes/`
- Următorul pas: T001 — Main Menu Scene (inițializare proiect + cod)

---

## Notes

- **Planning P1:** `docs/pipeline/planning/FEAT-P1-Arena-Slots/`
- **Wireframe oficial:** `design/wireframes/main-menu.excalidraw`
- **Branch strategy:** `main` (stabil), `feat/p1-arena-slots` (implementare)
