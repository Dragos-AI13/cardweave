# Cardweave

> **„Nu găsești cărți gata făcute. Ți le construiești singur, din părți."**

Cardweave este un **PvP auto-battler** unde jucătorii își construiesc singuri cărțile din părți (shard-uri) în timpul unui duel. Fiecare carte e unică, fiecare meci e diferit.

**Motor:** React + PixiJS + Tauri (client) / Rust + Axum + PostgreSQL (server)  
**Model:** Offline (AI) + Online Ghost Battles (snapshot PvP)  
**Platforme:** Steam (Tauri) + Web (itch.io) + Mobile (Capacitor, post-lansare)  
**Status:** Game Design phase

---

## Documentație

- [Game Design Document](./Documentation/mechanics/CARDWEAVE_GDD.md) — viziunea completă

---

## Structură

```
shardbound/
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
├── server/                          ← Server Rust (Axum + PostgreSQL)
└── README.md
```

---

## Roadmap

| Fază | Conținut |
|---|---|
| **P0 — Core Design** | Game Design Document complet + întrebări deschise |
| **P1 — Prototype** | Grid, auto-battle de bază, o carte |
| **P2 — Card Assembly** | Toate părțile, Buy Phase, combinare |
| **P3 — Rase + Shop** | 2-3 rase, shop pe rasă |
| **P4 — Run Loop** | 13 win / 3 lose, recompense |
| **P5 — Profesii** | Arbore de profesii |
| **P6 — Blueprint-uri** | Cercetare + crafting |
| **P7 — Upgrade + Treire** | +0 → +10 |
| **P8 — Polish** | Balance, UI, VFX, sunet |
| **P9 — Early Access** | Steam, matchmaking |
