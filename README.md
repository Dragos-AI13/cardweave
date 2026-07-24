# Lowborn

> Un auto-battler single-player unde îți alegi un personaj, îl crești din țăran în legendă, cumperi subalterni, craftezi items și te bați în arenă.

**Motor:** Godot 4.x (GDScript)  
**Desktop:** Godot native export  
**Web:** Godot Web export (Itch.io)  
**Model:** Offline-first — 100% local, zero server  
**Direcție:** Character Evolution + Subordinates System (D010)

---

## Documentație

- [Development Constitution](./docs/pipeline/DEVELOPMENT_CONSTITUTION.md) — regulile de development
- [Feature Design — Character Evolution](./docs/pipeline/features/character-evolution/FEATURE_DESIGN.md) — designul curent
- [Pipeline README](./docs/pipeline/README.md) — cum funcționează pipeline-ul

---

## Structură

```
lowborn/
├── Documentation/
│   ├── mechanics/            ← Design docs (unele arhivate)
│   ├── systems/              ← System designs (Cardinal)
│   ├── state/                ← State files vechi (Documentation/)
│   ├── tech/                 ← Tech stack
│   └── art/                  ← Concept art, style guide
├── docs/pipeline/            ← Pipeline design docs + state files
│   ├── features/             ← Feature designs
│   ├── planning/             ← Ticket-uri + planning per feature
│   ├── state/                ← State files active
│   └── templates/            ← Template-uri
├── design/                   ← Wireframe-uri (Excalidraw)
│   ├── mockups/              ← Drafts
│   └── wireframes/           ← Aprobate
├── game/                     ← Cod sursă (Godot 4.x)
└── README.md
```

---

## Roadmap

| Fază | Conținut |
|------|----------|
| **P0 — Core Design** | ✅ Arhivat (designul vechi cu card parts) |
| **P1 — Character Evolution Prototype** | 🟡 Game Design — FEATURE_DESIGN scris, așteaptă G1 |
| **P2 — Skill Tree + Multiple Races** | 💡 Backlog |
| **P3 — Procedural Evolution (80%)** | 💡 Backlog |
| **P4 — Polish + Release** | ⬜ |
