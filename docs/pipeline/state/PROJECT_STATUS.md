# Project Status

> Statusul general al proiectului Cardweave.

---

## Identitate

| Proprietate | Valoare |
|-------------|---------|
| **Nume** | Cardweave |
| **Gen** | Auto-battler single-player cu card crafting din părți |
| **Motor** | React + TypeScript + PixiJS |
| **Desktop** | Tauri (Steam) |
| **Web** | Itch.io (aceeași bază de cod) |
| **Model** | Offline-first — 100% local, zero server |
| **AI** | Opponent adaptiv + quest generator procedural |
| **Pipeline** | docs/pipeline/ configurat |

---

## Current Phase

**Game Design — Grid Arena + Cell System + Recipes**
Am terminat brainstromul și am scris FEATURE_DESIGN.md. Aștept G1.

| Feature | Status |
|---------|--------|
| Card Part System | 💡 Backlog |
| **Grid Arena + Cell System + Recipes** | 🟡 **Game Design** (pre-G1) |

---

## Decizii Finale

| ID | Decizie | Status |
|----|---------|--------|
| D006 | Tech stack: React + PixiJS + Tauri | ✅ Decis |
| D008 | Offline-first: 100% local, zero server | ✅ Decis |

---

## Lifecycle

| Faza GDD | Status | Progres |
|----------|--------|---------|
| P0 — Core Design | ✅ GDD complet + Systems Catalog | 100% |
| P1 — Grid Arena + AI Opponent | 🟡 Game Design | 60% (design scris, așteaptă G1) |
| P2 — Card Assembly | ⬜ | 0% |
| P3 — Rase + AI | ⬜ | 0% |
| P4 — Run Loop | ⬜ | 0% |
| P5 — Professions | ⬜ | 0% |
| P6 — Blueprints | ⬜ | 0% |
| P7 — Upgrade + Tier | ⬜ | 0% |
| P8 — Polish | ⬜ | 0% |
| P9 — Release | ⬜ | 0% |

---

## Last Session Summary

*2026-07-18 — Decizie Offline-First*
- Direcția jocului schimbată: **offline-first complet**
- Fără server, fără PostgreSQL, fără ghost battles PvP
- Jocul e 100% local cu AI opponent adaptiv
- DEVELOPMENT_CONSTITUTION.md rescris — fără server-authoritative, anti-cheat, deploy
- README, GDD, state files actualizate

---

## Known Issues

*(none)*

---

## Notes

- **Tech Stack:** React + TypeScript + PixiJS + Tauri ✅ Decis (D006)
- **Game Model:** Offline-first, AI opponent adaptiv ✅ Decis (D008)
- **Grid Arena** e feature-ul activ P1
- **Branch strategy**: `documentation` (design) | `main` (stabil)
- Toată documentația e rendundată — vezi docs/pipeline/
