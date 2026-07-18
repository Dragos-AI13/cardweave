# Changelog Working

> Jurnalul de lucru. Se adaugă entry-uri NOI în SUS.

---

## 2026-07-18 — Decizii Tech Stack + Game Model + Cleanup

### Added
- **D006** — Tech Stack Final: React + PixiJS + Tauri / Rust + Axum + PostgreSQL
- **D007** — Game Model: Offline (AI) + Online Ghost Battles (snapshot PvP)
- DECISION_LOG.md — D006 + D007 adăugate

### Changed
- README.md — motor actualizat (Godot → React/PixiJS + Rust)
- CARDWEAVE_GDD.md — motor + platforme actualizate
- PROJECT_STATUS.md — tech stack + game model reflectate
- NEXT_ACTIONS.md — întrebări deschise rezolvate
- CURRENT_SESSION.md — actualizat cu progresul
- DESIGN_PIPELINE.md + DEV_PIPELINE.md — header cu stack decizional
- GOVERNANCE.md — Development output actualizat (React + PixiJS + Rust)
- Documentation/state/* — sync cu noile decizii

### Removed
- Branch `development` (local + remote) — era identic cu `main`

---

## 2026-07-18 — Sync Documentație (Merge)

### Added
- **SYNC:** Branch `documentation` actualizat de la `origin/documentation` (fast-forward)
  - Systems Catalog (37 sisteme, SYS-001 → SYS-037) cu anatomie completă per sistem
  - Pipeline restructurat: DESIGN_PIPELINE.md + DEV_PIPELINE.md
  - GDD actualizat: Moștenire Tower Run (8 sisteme), clase, Character Card Pool
  - Sisteme noi: Item, Class, Character Pool + Compatibility, Infinite Leveling, Rankings, Tournaments, Onboarding, Settings, Disconnect/Reconnect, Collection, Friends, Daily Rewards, Reports, Achievements, Match History, Notifications
  - 10 rase redesign cu identități proprii

### Changed
- DOCUMENTATION/CURRENT_SESSION.md — focus pe restructurare pipeline
- DOCUMENTATION/NEXT_ACTIONS.md — așteaptă decizie tech stack
- DOCS/PIPELINE/PIPELINE.md — șters (înlocuit de DESIGN_PIPELINE.md + DEV_PIPELINE.md)
- DOCS/PIPELINE/state files — unificate între ambele instanțe
- DOCS/PIPELINE/GOVERNANCE.md — dual department (Design VPS + Dev PC)
- DOCS/PIPELINE/WORKFLOW.md — rescris pentru design-only VPS workflow

### Fixed
- Conflicte git între stash (Grid Arena) și upstream (restructurare pipeline) — rezolvate

---

## 2026-07-14

### Added
- `docs/pipeline/features/grid-arena-recipes/FEATURE_DESIGN.md` — design complet
  - Grid 12×8 cu celule extensibile și 5 tipuri (Ofensive, Defensive, Energie, Sinergie, Neutru)
  - Card sizes variabile (1×1, 2×2, 3×3, 4×4)
  - Itemi de grid 1×1 (Piatră de Putere, Scut, Capcane etc.)
  - Upgrade celule (+0→+10) cu Dust
  - Recipes — combinarea cărților complete între dueluri
  - Economie integrată cu sistemele existente (Gold, Dust, Essence, Coins)
  - Plan de implementare pe 4 faze (P1-P4)

### Changed
- NEXT_ACTIONS.md — feature activ mutat pe Grid Arena
- CURRENT_SESSION.md — focus pe designul curent
- PROJECT_STATUS.md — P1 actualizat
- PIPELINE.md — Grid Arena adăugat în pipeline
