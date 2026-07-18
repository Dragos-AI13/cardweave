# Cardweave

> **„Nu găsești cărți gata făcute. Ți le construiești singur, din părți."**

Cardweave este un **auto-battler single-player** unde îți construiești singur cărțile din părți (shard-uri) în timpul unui duel. Fiecare carte e unică, fiecare meci e diferit. Inteligentul artificial se adaptează la stilul tău și evoluează odată cu tine.

**Motor:** React + TypeScript + PixiJS  
**Desktop:** Tauri (Steam, cross-platform)  
**Web:** Itch.io (aceeași bază de cod)  
**Model:** Offline-first — 100% local, zero server  
**Status:** Game Design phase

---

## Documentație

- [Game Design Document](./Documentation/mechanics/CARDWEAVE_GDD.md) — viziunea completă
- [Development Constitution](./docs/pipeline/DEVELOPMENT_CONSTITUTION.md) — regulile de development

---

## Structură

```
cardweave/
├── Documentation/
│   ├── mechanics/
│   │   ├── CARDWEAVE_GDD.md       ← Game Design Document
│   │   └── SYSTEMS_CATALOG.md     ← 37 de sisteme detaliate
│   ├── state/                       ← State files (NEXT_ACTIONS, TICKET_INDEX etc.)
│   ├── art/                         ← Concept art, style guide
│   └── design/                      ← Wireframe-uri, mockup-uri
├── docs/pipeline/                   ← Pipeline design docs
├── cardweave/                       ← (schelet Godot — de înlocuit)
├── app/                             ← Cod sursă (React + PixiJS + Tauri)
└── README.md
```

---

## Roadmap

| Fază | Conținut |
|------|----------|
| **P0 — Core Design** | Game Design Document complet + întrebări deschise |
| **P1 — Prototype** | Grid, auto-battle de bază, o carte, AI opponent |
| **P2 — Card Assembly** | Toate părțile, Buy Phase, combinare |
| **P3 — Rase + AI** | 2-3 rase, shop pe rasă, AI adaptiv |
| **P4 — Run Loop** | 13 win / 3 lose, recompense, progresie |
| **P5 — Profesii** | Arbore de profesii |
| **P6 — Blueprint-uri** | Cercetare + crafting |
| **P7 — Upgrade + Treire** | +0 → +10 |
| **P8 — Polish** | Balance, UI, VFX, sunet, narrative |
| **P9 — Release** | Steam, Itch.io |
