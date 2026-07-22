# DESIGN_PASS.md — P1 Arena Slots

**Feature:** FEAT-P1
**Data:** 2026-07-22
**Status:** draft

---

## 1. Arhitectură Generală

```
┌──────────────────────────────────────────────────┐
│                    main.ts                        │
│  ┌────────────────────────────────────────────┐  │
│  │              GameEngine                     │  │
│  │  ┌────────────────────────────────────┐    │  │
│  │  │          StateMachine              │    │  │
│  │  │  ┌────────┐ ┌──────┐ ┌─────────┐ │    │  │
│  │  │  │  MENU  │→│ BUY  │→│ BATTLE  │→│ ... │  │
│  │  │  │ Scene  │ │Phase │ │ Phase   │ │    │  │
│  │  │  └────────┘ └──────┘ └─────────┘ │    │  │
│  │  └────────────────────────────────────┘    │  │
│  │                                             │  │
│  │  ┌────────────────────────────────────┐    │  │
│  │  │          EventBus                  │    │  │
│  │  │  (evenimente între sisteme)        │    │  │
│  │  └────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │              PixiJS Application             │  │
│  │  ┌────────┐ ┌──────────┐ ┌──────────────┐ │  │
│  │  │ Menu   │ │   Shop   │ │   Arena +    │ │  │
│  │  │ Scene  │ │   UI     │ │ Battle UI    │ │  │
│  │  └────────┘ └──────────┘ └──────────────┘ │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## 2. Componente

### 2.1 GameEngine
- **Fișier:** `src/engine/GameEngine.ts`
- Inițializează PixiJS Application + StateMachine + EventBus
- Loop principal: `update(delta)` → delega la scena curentă

### 2.2 StateMachine
- **Fișier:** `src/engine/StateMachine.ts`
- Stări: `MENU → BUY_PHASE → BATTLE_PHASE → RESULTS → MENU`
- Fiecare stare: `enter()`, `update(delta)`, `exit()`
- Tranziții controlate de evenimente (click pe buton, timer expirat)

### 2.3 EventBus
- **Fișier:** `src/engine/EventBus.ts`
- Pub/sub simplu: `on(event, handler)`, `emit(event, data)`
- Evenimente: `BUY_COMPLETE`, `BATTLE_OVER`, `CARD_ACTIVATED`, `ENERGY_CHANGED`

### 2.4 Scene-uri
| Scenă | Fișier | Responsabilitate |
|-------|--------|-----------------|
| MenuScene | `src/scenes/MenuScene.ts` | Titlu, buton Joacă, character card |
| BuyScene | `src/scenes/BuyScene.ts` | Arena + shop + snap |
| BattleScene | `src/scenes/BattleScene.ts` | Auto-battle vizual |
| ResultsScene | `src/scenes/ResultsScene.ts` | Win/Lose + coins |

### 2.5 Sisteme de Joc
| Sistem | Fișier | Rol |
|--------|--------|-----|
| Arena | `src/systems/Arena.ts` | 5 sloturi, subsloturi |
| Shop | `src/systems/Shop.ts` | Parts for sale, coins |
| Battle | `src/systems/Battle.ts` | Cooldown, energy, damage |
| AIOpponent | `src/systems/AIOpponent.ts` | Cardinal P1 |

### 2.6 Data
| Fișier | Conținut |
|--------|----------|
| `src/data/characters.ts` | Ignis (HP 90, Energy +5, Atk 12) |
| `src/data/parts.ts` | Attack Jewel, Defense Jewel definiții |
| `src/data/races.ts` | Dragonkin, Mage definiții |

## 3. Flow-ul Jocului

```
MENU → click "Joacă" → BUY_PHASE
  BUY_PHASE → primești coins → vezi shop → cumperi părți
    → snap în slot → când ești gata → END BUY
  BATTLE_PHASE → auto-battle → cărți se activează
    → energy scade → damage la opponent
    → HP = 0 → RESULTS
  RESULTS → vezi win/lose + recompense
    → click "Main Menu" → MENU
```

## 4. PixiJS Setup

```typescript
const app = new PIXI.Application({
  width: 1280,
  height: 720,
  backgroundColor: 0x1e1e2e,
  antialias: true,
});
document.getElementById('game')!.appendChild(app.view as HTMLCanvasElement);
```

Toate scene-urile sunt containere PIXI adăugate/eliminate din `app.stage`.

## 5. Decizii Arhitecturale

| Decizie | Motiv |
|---------|-------|
| Fără framework UI | O singură lume canvas, zero bridge-uri |
| StateMachine manuală | Simplu, predictibil, fără dependințe |
| EventBus intern | Cuplare slabă între sisteme |
| Date în TypeScript, nu JSON | Tipare, autocomplete, fără runtime loading |
| 1280×720 rezoluție | 16:9 standard, ușor de scalat |

## 6. Config

```typescript
export const CONFIG = {
  CANVAS_WIDTH: 1280,
  CANVAS_HEIGHT: 720,
  BG_COLOR: 0x1e1e2e,
  MAX_SLOTS: 5,
  SLOT_SUBSLOTS: 6,
  ENERGY_CAP: 50,
  ENERGY_REGEN: 3,     // per secundă
  COOLDOWN_MIN: 0.3,   // secunde
  COOLDOWN_MAX: 5.0,   // secunde
  BOOST_COMPLETE: 1.3, // multiplicator carte 6/6
};
```

## 7. NOT Implementat în P1

- Skill Rectangle effects → P2
- Frame/Name/Icon bonuses → P2
- Mutat părți între sloturi → P2
- Sloturi 6+ → P2
- Battle log → P2
- Speed control → P3
- Sunet → P8
