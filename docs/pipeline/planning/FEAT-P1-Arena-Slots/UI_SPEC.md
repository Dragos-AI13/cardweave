# UI_SPEC.md — P1 Arena Slots

**Feature:** FEAT-P1
**Data:** 2026-07-22
**Wireframe:** `design/wireframes/main-menu.excalidraw`

---

## 1. Main Menu

### Referință
Wireframe aprobat: `design/wireframes/main-menu.excalidraw`
Link: https://excalidraw.com/#json=pECltdr-NdsErA3vsjv3X,qJTCJlvAtYxOtPTB9lZiGA

### Componente PIXI

| Element | Tip | Descriere |
|---------|-----|-----------|
| fundal | `PIXI.Graphics` | Dreptunghi 1280×720, culoare #1e1e2e |
| panou_stânga | `PIXI.Container` | 520×720, offset 40×40, #252538 |
| panou_dreapta | `PIXI.Container` | 560×720, offset 600×40, #1a1a2e |
| titlu | `PIXI.Text` | "CARDWEAVE", font 52px, #ffd43b |
| subtitlu | `PIXI.Text` | "Auto-battle card crafting", 18px, #a5d8ff |
| btn_joaca | `PIXI.Container` | Dreptunghi verde (#2f9e44) + text "> JOACA" |
| btn_colectie | `PIXI.Container` | Dreptunghi #2a2a42 + text "<> Colectie" |
| btn_setari | `PIXI.Container` | Dreptunghi #2a2a42 + text "# Setari" |
| card_portret | `PIXI.Graphics` | Cerc 200×200, #d0bfff |
| nume_caracter | `PIXI.Text` | "IGNIS", 30px, #fff3bf |
| stats | `PIXI.Container` | 3 căsuțe cu HP, Energie, Atac |
| arena_slots_indicator | `PIXI.Text` | "[@][@][@][O][O] 3/6 active" |
| footer | `PIXI.Text` | Versiune + Offline-first tag |

### Layout

```
┌──────────────────────────────────────────────────┐
│  ┌─ stânga (520px) ──┐ │ ┌─ dreapta (560px) ─┐ │
│  │                    │ │ │                    │ │
│  │  NOUS RESEARCH     │ │ │   — STARTER —     │ │
│  │  CARDWEAVE         │ │ │                    │ │
│  │  Auto-battle...    │ │ │   (portret cerc)   │ │
│  │                    │ │ │                    │ │
│  │  ┌──────────────┐  │ │ │    IGNIS           │ │
│  │  │  > JOACA     │  │ │ │ Dragonkin | Mage   │ │
│  │  └──────────────┘  │ │ │                    │ │
│  │  ┌──────────────┐  │ │ │ [HP] [ENERGIE] [ATK]│ │
│  │  │  <> Colectie │  │ │ │  90    +5      12  │ │
│  │  └──────────────┘  │ │ │                    │ │
│  │  ┌──────────────┐  │ │ │ Stăpânul focului...│ │
│  │  │  # Setari    │  │ │ │                    │ │
│  │  └──────────────┘  │ │ │ [@][@][@][O][O]    │ │
│  │                    │ │ │                    │ │
│  │  v0.1.0  |  2026   │ │ │                    │ │
│  └────────────────────┘ │ └────────────────────┘ │
└──────────────────────────────────────────────────┘
```

### Interacțiuni

| Element | Eveniment | Rezultat |
|---------|-----------|----------|
| btn_joaca | click / Enter | Tranziție la BUY_PHASE |
| btn_colectie | click / C | (placeholder — P2) |
| btn_setari | click / S | (placeholder — P2) |
| btn_joaca | hover | Border mai luminos, cursor pointer |

### Stări

| Stare | Comportament |
|-------|-------------|
| Default | Toate elementele afișate, btn_joaca evidențiat |
| Hover (btn_joaca) | Border mai gros, fundal mai deschis |
| Hover (altele) | Border + text mai vizibile |
| Tranziție | Fade out 300ms → emit `START_GAME` → BUY_PHASE |

---

## 2. Buy Phase (P1)

### Componente (wireframe în lucru)

| Element | Descriere |
|---------|-----------|
| Arena Slots | 5 sloturi, fiecare cu preview card (3/6, ⏱, ⚡) |
| Subslot view | La click pe slot → 6 subsloturi (Frame, Name, Icon, Atk, Def, Skill) |
| Shop panel | Părți disponibile cu preț, coin counter, reroll button |
| End Buy button | Finalizează Buy Phase → Battle |

### Layout estimativ

```
┌──────────────────────────────────────────────────┐
│  ┌─ Arena Slots ──────────────────────────┐      │
│  │  [CARD 1] [CARD 2] [CARD 3] [ ] [ ]  │      │
│  │  3/6      2/6      6/6✅              │      │
│  │  ⏱1.2s   ⏱0.8s   ⏱2.5s              │      │
│  └────────────────────────────────────────┘      │
│  ┌─ Shop ─────────────────────────────────┐      │
│  │  Attack Jewel  (+8 dmg)  ...  [5G]     │      │
│  │  Defense Jewel (+6 HP)   ...  [5G]     │      │
│  │  [Reroll 2G]                 [Coins: 10]│      │
│  └────────────────────────────────────────┘      │
│                              [End Buy → Battle]  │
└──────────────────────────────────────────────────┘
```

### Interacțiuni
- Click parte în shop → selectează
- Click subslot gol în Arena → snap partea selectată
- Click End Buy → tranziție la BATTLE_PHASE

---

## 3. Battle Phase (P1)

### Componente

| Element | Descriere |
|---------|-----------|
| Character bar x2 | HP bar + Shield bar + Energy bar (jucător + AI) |
| Arena slots | Aceleași sloturi, acum cu cooldown vizual |
| Damage numbers | Efect numeric la activare |
| Battle log | (P2 — text minimal în P1) |

### Flow
1. Ambele caractere afișate cu HP/Energy
2. Sloturile se activează pe cooldown
3. Damage se aplică vizual (HP scade)
4. Când un HP = 0 → RESULTS

---

## 4. Results Screen (P1)

### Componente
- Text "Victorie!" / "Înfrângere"
- Recompense (coins primite)
- Buton "Înapoi la meniu"

---

## 5. Design System Culori (P1)

| Token | Culoare | Hex |
|-------|---------|-----|
| bg_principal | Închis | #1e1e2e |
| bg_panel | Mai deschis | #252538 |
| accent_auriu | Auriu | #ffd43b |
| text_principal | Alb | #ffffff |
| text_muted | Gri | #757575 |
| success | Verde | #b2f2bb, #2f9e44 |
| energy | Albastru | #a5d8ff |
| damage | Roșu | #ffc9c9 |
| magic | Violet | #d0bfff |
