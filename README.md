# Cardweave

> **„Nu găsești cărți gata făcute. Ți le construiești singur, din părți."**

Cardweave este un **auto-battler single-player** unde îți construiești singur cărțile din părți (shard-uri) în timpul unui duel. Fiecare carte e unică, fiecare meci e diferit. Inteligentul artificial se adaptează la stilul tău și evoluează odată cu tine.

**Motor:** PixiJS (TypeScript pur)  
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
│   ├── systems/
│   │   └── cardinal/              ← Cardinal Engine design
│   ├── state/                       ← State files (NEXT_ACTIONS, TICKET_INDEX etc.)
│   ├── art/                         ← Concept art, style guide
│   └── design/                      ← Wireframe-uri, mockup-uri
├── docs/pipeline/                   ← Pipeline design docs
├── cardweave/                       ← (schelet Godot — de înlocuit)
├── app/                             ← Cod sursă (PixiJS + TypeScript + Tauri)
└── README.md
```

---

## Roadmap

| Fază | Conținut |
|------|----------|
| **P0 — Core Design** | Game Design Document complet + întrebări deschise |
|| **P1 — Prototype** | Arena Slots, auto-battle, snap mechanic, AI opponent simplu (Cardinal P1) |
|| **P2 — Card Assembly** | Toate părțile, Buy Phase, combinare, Cardinal scoring avansat |
|| **P3 — Rase + AI** | 2-3 rase, shop pe rasă, AI adaptiv (Cardinal mediu) |
|| **P4 — Run Loop** | 13 win / 3 lose, recompense, progresie |
|| **P5 — Profesii** | Arbore de profesii |
|| **P6 — Blueprint-uri** | Cercetare + crafting |
|| **P7 — Upgrade + Treire** | +0 → +10 |
|| **P8 — Cardinal complet** | GA, Archaeology, Tutor, Empty Chair |
|| **P9 — Polish** | Balance, UI, VFX, sunet, narrative |
|| **P10 — Release** | Steam, Itch.io |
