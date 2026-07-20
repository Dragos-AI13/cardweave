# Tech Stack — Cardweave

**Status:** ✅ Final
**Dată:** 2026-07-18
**Descriere:** Stack-ul tehnologic ales pentru Cardweave.

---

## Stack Final

| Strat | Tehnologie | Justificare |
|---|---|---|
| **Game Engine** | TypeScript pur (clase, event system, state machine) | Un singur limbaj, fără runtime, fără GC surprises |
| **Rendering** | **PixiJS** (standalone, pur) | WebGL accelerat, sprite batching, 60fps. **Fără React.** |
| **UI** | **PixiJS** (construit intern) | Același rendering context ca jocul — zero sincronizare |
| **Desktop** | **Tauri 2** | ~5MB, cross-platform (Steam, Web) |
| **Web** | Vite + deploy static | Aceeași bază de cod, doar în browser |
| **Cardinal** | TypeScript pur | Seed engine procedural — matematică + reguli, fără framework |
| **Mobile** | Web version (PWA) | Tauri mobile e instabil — amânat post-lansare |

---

## De ce PixiJS pur (fără React)

| Criteriu | PixiJS pur | React + PixiJS |
|---|---|---|
| **Lumi paralele** | Una (doar canvas) | Două (DOM + canvas), permanent de sincronizat |
| **Bug-uri de sincronizare** | Zero | Frecvente — "canvas-ul nu se updat ează când s-a schimbat starea în React" |
| **Re-render** | Controlat manual | React re-render-ui pot cauza jank |
| **Viteză dezvoltare** | Mai rapid | Mai lent — pierzi timp cu bridge-uri |
| **Complexitate** | Simplu | Mediu — două sisteme de gestionat |
| **Dimensiune finală** | ~5MB (cu Tauri) | ~8MB |

**Decizie:** PixiJS pur. Zero framework UI. O singură lume, un singur canvas, zero bridge-uri.

---

## De ce NU Godot / Unity / Bevy

| Motor | Motiv |
|---|---|
| **Godot 4** | UI slab. Trebuie să lupt cu Control + CanvasItem. Pentru un joc 90% UI, e o alegere greșită. |
| **Unity** | 30MB+ install, licență, componente moarte. Overkill pentru un card game 2D. |
| **Bevy (Rust)** | ECS paradigm, scriu de 3× mai mult, ecosistem imatur. Frumos, dar lent de dezvoltat. |
| **Phaser 3** | Bun, dar UI-ul e primitiv și greu de customizat. PixiJS e mai flexibil. |

---

## Arhitectura

```
┌────────────────────────────────────────────┐
│              TAURI 2                        │
│                                              │
│  ┌────────────────────────────────────┐    │
│  │         PIXIJS (un canvas)          │    │
│  │                                      │    │
│  │  ┌──────┐ ┌──────┐ ┌──────┐        │    │
│  │  │ MENIU │ │ SHOP │ │GRID  │        │    │
│  │  │(Pixi) │ │(Pixi) │ │(Pixi)│        │    │
│  │  └──────┘ └──────┘ └──────┘        │    │
│  │                                      │    │
│  │  ┌───────────┐ ┌───────────┐        │    │
│  │  │GAME ENGINE │ │ CARDINAL  │        │    │
│  │  │ (TS pure)  │ │ (TS pure) │        │    │
│  │  └───────────┘ └───────────┘        │    │
│  └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```

**Un singur rendering context. Un singur event loop. O singură stare. Zero bridge-uri.**

---

## Structura proiectului

```
cardweave/
├── src/
│   ├── main.ts              ← Entry point Tauri
│   ├── engine/              ← Game engine
│   │   ├── GameEngine.ts    ← Main loop
│   │   ├── StateMachine.ts  ← Stări (menu, shop, battle...)
│   │   └── EventBus.ts      ← Evenimente între sisteme
│   ├── scenes/              ← Ecranele jocului
│   │   ├── MenuScene.ts
│   │   ├── ShopScene.ts
│   │   ├── BattleScene.ts
│   │   └── ...
│   ├── ui/                  ← Componente UI în PixiJS
│   │   ├── Button.ts
│   │   ├── Card.ts
│   │   ├── Grid.ts
│   │   └── ...
│   ├── cardinal/            ← Cardinal engine
│   │   ├── SeedEngine.ts
│   │   ├── QuestFactory.ts
│   │   └── RewardSystem.ts
│   └── data/                ← Definiții, configurații
│       ├── races.ts
│       ├── classes.ts
│       └── cards/
├── src-tauri/               ← Tauri config
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Performance Target

| Criteriu | Țintă |
|---|---|
| **FPS** | 60 constant (și pe laptopuri vechi) |
| **Dimensiune finală** | < 10MB (Tauri) |
| **Ram usage** | < 200MB |
| **Load time** | < 2 secunde |
| **Offline** | 100% funcțional |

---

## Referințe

- [D006 — Tech Stack Final](../docs/pipeline/state/DECISION_LOG.md)
- [D007 — Game Model: Ghost Battles + Offline](../docs/pipeline/state/DECISION_LOG.md)
- [D008 — Offline-First](../docs/pipeline/state/DECISION_LOG.md)
