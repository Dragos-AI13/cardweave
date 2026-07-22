# Arena Slots — Snap Mechanic + Auto-Battle

**Feature:** Arena Slots
**Status:** 🟡 Game Design (post-GDD, pre-G1)
**Data:** 2026-07-22
**Departament:** Game Design → Production
**Superseeds:** Grid Arena + Cell System + Recipes (arhivat)

---

## 1. Context

Designul final al Cardweave folosește **Arena Slots** în loc de Grid 6×6 sau 12×8. 
Jucătorul are o arenă cu sloturi, fiecare slot ține o carte. Fiecare carte are 6 subsloturi (Frame, Name, Icon, Attack Jewel, Defense Jewel, Skill Rectangle).

Părțile se cumpără din shop și **snap direct** într-un subslot liber — fără inventar, fără drag & drop.

Vezi documentația completă:
- `Documentation/mechanics/SYSTEM_FINAL_CONFIRMARE.md` — confirmare design
- `Documentation/mechanics/CARDWEAVE_GDD.md` §4 — Arena Slots
- `Documentation/mechanics/SYSTEMS_CATALOG.md` SYS-005 (Arena Slots), SYS-007 (Duel)

---

## 2. High-Level Description

O arenă cu 5 sloturi (deblocabile până la 8). Fiecare slot conține o carte formată din 6 părți.
Jucătorul cumpără părți din shop în Buy Phase → snap direct în sloturi.
În Battle Phase, cărțile se activează automat pe cooldown, consumând energie globală.

---

## 3. In Scope (P1)

- [x] 5 Arena Sloturi, fiecare cu 6 subsloturi
- [x] Snap mechanic: parte cumpărată → direct în subslot
- [x] Părți active independent (1/6 = activ, 6/6 = boost ×1.3)
- [x] Energy globală + cooldown per card
- [x] Auto-battle real-time
- [x] AI opponent simplu (Cardinal P1: 4 parametri ADN)

## 4. Out of Scope (P2+)

- [ ] Skill Rectangle effects complexe (Burn, Bleed, Stun)
- [ ] Buff/Debuff system
- [ ] Mutat părți între sloturi
- [ ] Sloturi 6+ deblocabile
- [ ] Boost ×1.3 vizual
- [ ] Battle log

---

## 5. Core Mechanics

### 5.1 Arena

```
┌───────────────────────────────────────────────────────────────┐
│                          ARENA                                │
│                                                               │
│  Slot 1        Slot 2        Slot 3        Slot 4    Slot 5  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ ┌──────┐ │
│ │Scorch    │ │ Ember    │ │ Dragon   │ │        │ │      │ │
│ │Claw      │ │ Shield   │ │ Breath   │ │ Gol    │ │ Gol  │ │
│ │🔥🛡️🧪   │ │🛡️🧪     │ │🔥🛡️🧪   │ │        │ │      │ │
│ │3/6 părți│ │2/6 părți│ │6/6 ✅   │ │        │ │      │ │
│ │⏱1.2s   │ │⏱0.8s   │ │⏱2.5s   │ │        │ │      │ │
│ │⚡3e    │ │⚡2e    │ │⚡5e    │ │        │ │      │ │
│ └──────────┘ └──────────┘ └──────────┘ └────────┘ └──────┘ │
│                                                               │
│  Click pe slot → vezi subsloturile                            │
│  Click pe subslot gol → shop filtrat pe acel tip              │
└───────────────────────────────────────────────────────────────┘
```

### 5.2 Snap Mechanic

1. Jucătorul cumpără o parte din shop
2. Partea snap direct într-un subslot liber de același tip
3. Dacă nu există subslot liber, jucătorul alege unde să înlocuiască
4. Partea e activă în battle din momentul snap-ului

### 5.3 Card Progresiv

| Stare | Ce face în battle |
|-------|-------------------|
| **Gol (0/6)** | Inactiv |
| **Parțial (1–5/6)** | Fiecare parte prezentă își face efectul |
| **Complet (6/6)** | Toate efectele + boost (×1.3) |

### 5.4 Battle Phase

- Fiecare carte cu part_count ≥ 1 se activează pe propriul cooldown
- La activare: Attack Jewel → damage, Defense Jewel → shield
- Energy globală se regenerează continuu; activarea consumă energie
- Când HP caracter = 0 → rundă pierdută

---

## 6. P1 Implementation Scope

| Component | Ce conține P1 |
|-----------|---------------|
| **Arena** | 5 sloturi goale la start |
| **Shop** | Părți random (doar Attack + Defense Jewel) |
| **Snap** | Click parte → click slot → partea apare |
| **Battle** | Auto-activare pe cooldown, damage la opponent |
| **Energy** | Bară + regen + consum |
| **AI** | 4 parametri ADN, WeightedRandomSelection |
| **Character** | Ignis (Dragonkin Mage) — stats de bază |

**Nu intră în P1:** Skill Rectangle, Frame/Name/Icon effects, buff/debuff, slot expansion, part moving, battle log, speed control.

---

## 7. Dependencies

- SYS-005 — Arena Slots System
- SYS-004 — Card Assembly (snap)
- SYS-006 — Shop + Buy Phase
- SYS-007 — Duel System
- SYS-038 — AI Opponent (Cardinal P1)
- Cardinal Engine §11 — P1 roadmap

---

## 8. Istoric

| Dată | Schimbare |
|------|-----------|
| 2026-07-22 | Creat — înlocuiește Grid Arena + Cell System + Recipes |
