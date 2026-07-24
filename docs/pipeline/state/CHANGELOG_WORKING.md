# Changelog Working

> Jurnalul de lucru. Se adaugă entry-uri NOI în SUS.

---

## 2026-07-24 — Pivot Character Evolution + Doc Cleanup (D010)

### Added
- **D011** — Godot 4.x înlocuiește PixiJS + TypeScript + Tauri ca stack
- Skill lowborn-development actualizat: Godot 4.x / GDScript

### Changed
- README.md — complet rescris cu Godot + character evolution
- DEVELOPMENT_CONSTITUTION.md — arhitectură + dependințe Godot
- FEATURE_DESIGN.md (character-evolution) — arhitectură Godot
- PROJECT_STATUS.md — motor Godot
- docs/pipeline/README.md — Godot în header
- design/wireframes/README.md — Main Menu marcat vechi design
- CURRENT_SESSION.md — updated with Godot switch

### Removed
- `app/` — tot codul PixiJS + TypeScript + Vite + Tauri (șters)

### Archived (SUPERSEDED)
- `Documentation/tech/TECH_STACK.md` — stack-ul vechi PixiJS

## 2026-07-24 — Pivot Character Evolution + Doc Cleanup (D010)
- `docs/pipeline/planning/FEAT-CE-P1-Character-Evolution/TICKET_INDEX.md` — 9 ticket-uri noi
- `app/src/data/characters.ts` — rescris: MainCharacter + SkillTree + Subordinates + Items + Skills
- Skill tree pentru Human (4 paths: Războinic, Magician, Negustor, Haiduc)
- 10 subalterni (T1-T3), 4 items, 3 skills (date P1)
- Config actualizat: fără SLOT_SUBSLOTS/BOOST_COMPLETE, cu FAME_TIERS/etc.

### Changed
- DESIGN_PIPELINE.md — Character Evolution adăugat, vechi features arhivate
- DECISION_LOG.md — D010 adăugat
- CURRENT_SESSION.md — pivot session tracking
- NEXT_ACTIONS.md — resetat pentru noul design
- PROJECT_STATUS.md — fază + decizii actualizate
- `app/src/engine/config.ts` — rescris pentru noul model

### Archived (SUPERSEDED)
- Arena Slots (card parts) FEATURE_DESIGN.md
- Card Part System FEATURE_DESIGN.md
- Character Card Population FEATURE_DESIGN.md
- LOWBORN_GDD.md (v1)
- CHARACTERS_v1.md
- CHARACTER_DESIGN_PROPUNERE.md
- SYSTEM_FINAL_CONFIRMARE.md
- Planning FEAT-P1-Arena-Slots (T001-T005)

### Added
- Proiect PixiJS + Vite + TypeScript inițializat în `app/`
- `app/src/engine/` — GameEngine, StateMachine, EventBus, config
- `app/src/scenes/MenuScene.ts` — Main Menu complet (wireframe aprobat)
- `app/src/data/characters.ts` — definiție Ignis

### Verified
- `npx tsc --noEmit` → 0 erori
- `npm run dev` → Main Menu randat corect, 0 erori consolă
- Elemente vizibile: LOWBORN titlu, buton Joacă, portret Ignis, stats

### Changed
- NEXT_ACTIONS.md — T001 bifat, T002 promovat next
- TICKET_INDEX.md — T001 → DONE

---

### Added
- Planning package P1 complet: `docs/pipeline/planning/FEAT-P1-Arena-Slots/`
- FEATURE.md — feature spec cu scope, acceptanță, dependințe
- DESIGN_PASS.md — arhitectură PixiJS, state machine, componente
- UI_SPEC.md — wireframe → componente, layout, interacțiuni
- TICKET_INDEX.md + 5 ticket-uri (T001-T005)
- Wireframe Main Menu aprobat în `design/wireframes/`

### Changed
- NEXT_ACTIONS.md — T001 promovat ca next
- PROJECT_STATUS.md — fază actualizată la Planning

---

### Added
- **D009** — Stack clarificat: PixiJS pur, fără React
- CARDINAL_ENGINE.md — roadmap pe 4 faze (P1: opponent simplu, P4+: complet)
- Arena Slots FEATURE_DESIGN.md (înlocuiește Grid 12×8)

### Changed
- Merge `documentation` → `main`: 17 fișiere, 2911 linii noi integrate
- SYSTEMS_CATALOG.md: 37 secțiuni Godot → TypeScript/PixiJS, .gd → .ts, *.tres → *.json
- Drop rates: gacha (0.1% Mythic) → offline-friendly (1% Mythic + pity timer)
- Economie: doar coins în P1 (Essence/Dust/Gems → P5+)
- GDD, README, CURRENT_SESSION: React șters → PixiJS pur
- DESIGN_PIPELINE.md: Grid Arena → Arena Slots
- State files (NEXT_ACTIONS, PROJECT_STATUS): actualizate cu noul design
- grid-arena-recipes arhivat (înlocuit cu Arena Slots feature design)

### Removed
- Toate referințele Godot din SYSTEMS_CATALOG.md
- Grid 12×8 din toate state/planning files
- Referințe React din toată documentația

---

### Added
- **D008** — Offline-First: zero server, zero online, 100% local
- DEVELOPMENT_CONSTITUTION.md rescris offline-first (10 secțiuni)
- AI Tests + Save/Load Tests + Performance Tests în secțiunea de testing

### Changed
- README.md — direcție offline-first, fără server/PvP
- LOWBORN_GDD.md — single-player, offline-first
- PROJECT_STATUS.md — identitate + model actualizate
- DECISION_LOG.md — D008 adăugat
- GOVERNANCE.md — redus la o singură echipă (fără dual pipeline)
- DESIGN_PIPELINE.md — curățat
- WORKFLOW.md — rescris offline-first
- CURRENT_SESSION.md + NEXT_ACTIONS.md — actualizate

### Removed
- DEV_PIPELINE.md — nu mai e necesar (offline-first, o singură mașină)
- Toate referințele la server (Rust, PostgreSQL, Redis, ghost battles, HMAC, audit log)
- Secțiunile de anti-cheat server-side din DEVELOPMENT_CONSTITUTION.md

---

## 2026-07-18 — Securitate: Race Conditions, Bot Protection, Supply Chain

### Added
- 3.5 Idempotency & Race Condition Prevention
- 3.6 Replay Attack Protection (nonce + timestamp)
- 3.7 Bot / Automation Protection (turn timer, click timing)
- 3.8 Snapshot Pool Poisoning
- 3.9 Rating / Win Trading Protection
- 10.1 Tipuri Numerice (BIGINT, no float)
- 11 Supply Chain Security
- 12 Tauri IPC Security
- 13 Offline ↔ Online Sync
- 14 Integritatea Numerelor
- 15 noi security tests

### Changed
- DEVELOPMENT_CONSTITUTION.md extins (446 linii noi)

---

## 2026-07-18 — Decizii Tech Stack + Game Model + Cleanup

### Added
- D006 — Tech Stack Final
- D007 — Game Model (Ghost Battles + Offline)
- DECISION_LOG.md — D006 + D007

### Changed
- README.md, GDD, state files — tech stack reflectat

### Removed
- Branch `development`

---

## 2026-07-18 — Sync Documentație (Merge)

### Added
- Systems Catalog (37 sisteme)
- Pipeline restructurat
- GDD actualizat

### Changed
- State files unificate între ambele instanțe

---

## 2026-07-14

### Added
- Grid Arena FEATURE_DESIGN.md (Grid 12×8, 5 tipuri celule, recipes)
