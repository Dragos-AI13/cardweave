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

**Game Design — Arena Slots + Snap Mechanic**
Documentația finală e completă. Aștept G1 pentru a începe coding-ul.

| Feature | Status |
|---------|--------|
| **Arena Slots** (Snap + Auto-Battle) | 🟡 Game Design (post-GDD, pre-G1) |
| Card Part System | 💡 Backlog (P2) |
| Cardinal AI (P1) | 📐 Inclus în Arena Slots sprint |

---

## Decizii Finale

| ID | Decizie | Status |
|----|---------|--------|
| D006 | Tech stack (actualizat D009): PixiJS pur | ✅ Decis |
| D008 | Offline-first: 100% local, zero server | ✅ Decis |
| D009 | Stack: PixiJS pur (TypeScript), fără React | ✅ Decis |

---

## Lifecycle

| Faza GDD | Status | Progres |
|----------|--------|---------|
| P0 — Core Design | ✅ GDD complet + Systems Catalog | 100% |
| **P1 — Arena Slots + AI Opponent** | 🟡 **Game Design** | 90% (gata de G1) |
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

*2026-07-22 — Cleanup complet + Arena Slots final*
- Merge documentation → main: toată documentația nouă integrată
- Godot șters din SYSTEMS_CATALOG (37 secțiuni → TypeScript/PixiJS)
- Cardinal segmentat pe faze (P1: doar 4 parametri ADN)
- Drop rates offline-friendly (Common 40% → Mythic 1%)
- Economie P1: doar coins
- D009: PixiJS pur confirmat (fără React)
- Grid Arena → Arena Slots: toate doc-urile actualizate

---

## Known Issues

*(none)*

---

## Notes

- **Tech Stack:** PixiJS pur + TypeScript + Tauri ✅ (D009)
- **Game Model:** Offline-first, AI opponent adaptiv ✅ (D008)
- **Arena Slots** e feature-ul activ P1 (înlocuiește Grid 12×8)
- **Branch strategy**: `main` (stabil), `feat/*` (features)
- **Documentație tehnică:** `Documentation/` | **Pipeline:** `docs/pipeline/`
