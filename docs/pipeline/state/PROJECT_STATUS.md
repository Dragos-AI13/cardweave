# Project Status

> Statusul general al proiectului Cardweave.

---

## Identitate

| Proprietate | Valoare |
|-------------|---------|
| **Nume** | Cardweave |
| **Gen** | PvP Auto-battler cu card crafting din părți |
| **Motor** | React + PixiJS + Tauri (client) / Rust + Axum (server) |
| **Platforme** | Steam (Tauri) + Web (itch.io) + Mobile (Capacitor) |
| **Model joc** | Offline (AI) + Online Ghost Battles (snapshot PvP) |
| **Pipeline** | ✅ Dual: Design (VPS) + Development (PC) |

---

## Current Phase

**Game Design — Grid Arena + Cell System + Recipes**
Am terminat brainstromul și am scris FEATURE_DESIGN.md. Aștept G1.

| Feature | Status |
|---------|--------|
| Card Part System | 💡 Backlog — așteaptă decizie tech stack + Grid Arena |
| **Grid Arena + Cell System + Recipes** | 🟡 **Game Design** (pre-G1) |
| Systems Catalog (37 sisteme) | ✅ Complet — pe branch-ul `documentation` |

---

## Documentație Adăugată (branch `documentation`)

Cealaltă instanță Hermes a scris pe branch-ul `documentation`:
- **Systems Catalog** — 37 de sisteme detaliate (SYS-001 → SYS-037)
- **Pipeline restructurat** — Design (VPS) + Dev (PC) cu DESIGN_PIPELINE.md + DEV_PIPELINE.md
- **GDD actualizat** — Tower Run inheritance (8 sisteme), clase, Character Card Pool
- **Sisteme noi**: Item System, Class System, Character Pool + Compatibility, Infinite Leveling, Rankings, Tournaments, Onboarding, Settings, Disconnect/Reconnect, Collection, Friends, Daily Rewards, Reports, Achievements, Match History, Notifications

---

## Lifecycle

| Faza GDD | Status | Progres |
|----------|--------|---------|
| P0 — Core Design | ✅ GDD complet + Systems Catalog | 100% |
| P1 — Grid Arena + Cell System | 🟡 Game Design | 60% (design scris, așteaptă G1) |
| P2 — Card Assembly | ⬜ | 0% |
| P3 — Rase + Shop | ⬜ | 0% |
| P4 — Run Loop | ⬜ | 0% |
| P5 — Professions | ⬜ | 0% |
| P6 — Blueprints | ⬜ | 0% |
| P7 — Upgrade + Tier | ⬜ | 0% |
| P8 — Polish | ⬜ | 0% |
| P9 — Early Access | ⬜ | 0% |

---

## Last Session Summary

*2026-07-18 — Merge Sync*
- Git merge: `origin/documentation` → local `documentation` (9 commit-uri noi)
- Conflicte rezolvate: PIPELINE.md → DESIGN_PIPELINE.md + DEV_PIPELINE.md
- Păstrat: FEATURE_DESIGN.md pentru Grid Arena (design din sesiunea PC)
- Now: repo e sync-at cu ambele instanțe

---

## Known Issues

*(none)*

---

## Notes

- **Tech Stack:** React + PixiJS + Tauri (client) / Rust + Axum (server) ✅ Decis
- **Game Model:** Ghost Battles (snapshot PvP) + Offline (AI) ✅ Decis
- **Grid Arena** e feature-ul activ P1 (are prioritate față de Card Part System ca design)
- **Card Part System** e în DOCUMENTATION branch cu Systems Catalog — GDD detaliu la nivel de sistem
- **Branch strategy**: `documentation` (design) | `game-development` (cod) | `main` (stabil)
- Branch `development` șters (2026-07-18) — era identic cu `main`
