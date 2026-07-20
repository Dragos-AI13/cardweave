# FEATURE_DESIGN.md — Card Part System

**Feature:** Card Part System
**Status:** 🟡 Game Design
**Dată:** 2026-07-18
**Pipeline:** docs/pipeline/features/card-part-system/

---

## 1. Context

Card Part System e fundația mecanicii de carduri. Tot ce construim după (shop, assembly, battle, upgrade) depinde de el. Fără un sistem clar de părți, nimic altceva nu funcționează.

---

## 2. High-Level Description

O carte e formată din **6 părți independente**. Fiecare parte are propria valoare, raritate și proveniență. Jucătorul poate combina părți din cărți diferite pentru a crea o carte nouă, hibrid. Compatibilitatea dintre părți determină bonusuri sau penalizări.

---

## 3. In Scope

- [x] 6 părți per carte (Frame, Name, Icon, Attack Jewel, Defense Jewel, Skill Rectangle)
- [x] Fiecare parte e o entitate independentă cu propriile atribute
- [x] Părțile pot fi combinate în orice combinație
- [x] Sistem de compatibilitate între părți (Synergy Score)
- [x] Asamblare în timpul Buy Phase
- [x] Partea poate fi schimbată oricând în Buy Phase

## 4. Out of Scope

- [ ] Upgrade-ul părților (+0 → +10) — va fi SYS-012
- [ ] Treirea (durability) — va fi SYS-013
- [ ] Shop-ul (de unde se cumpără părțile) — va fi SYS-006
- [ ] Combat (cum se folosesc cărțile în battle) — va fi SYS-007

---

## 5. Core Mechanics

### 5.1 Cele 6 Părți

| Parte | Funcție | Atribute | Impact vizual |
|---|---|---|---|
| **Frame** | Raritatea + chenar | rarity, color, border_style | Chenarul cărții |
| **Name** | Nume + sinergii de temă | text, theme_tag | Textul din cap |
| **Icon** | Caracter + rasă | character_id, race_id, image_id | Imaginea centrală |
| **Attack Jewel** | Damage | value, energy_cost, element | Iconiță stânga-jos |
| **Defense Jewel** | HP / blocare | value, energy_cost, element | Iconiță dreapta-jos |
| **Skill Rectangle** | Efect special | effect_id, params, cooldown | Zona de jos |

### 5.2 Proveniența părților

- Fiecare caracter are 5-15 cărți proprii (vezi SYS-037)
- Fiecare carte → 6 părți
- O parte reține ID-ul cărții din care provine (pentru calcul sinergie)

```
PartDefinition:
├── id: String
├── type: enum { FRAME, NAME, ICON, ATTACK_JEWEL, DEFENSE_JEWEL, SKILL }
├── source_card_id: String (cartea din care provine)
├── source_theme: String (ex: "vampire_bite", "shadow_magic")
├── rarity: enum { Common → Mythic }
├── value: number (depinde de tip)
└── params: Dictionary (specific per tip)
```

### 5.3 Calculul Statelor Cărții

```
Attack = Attack_Jewel.value × Rarity_Multiplier(Attack.rarity) × Synergy_Multiplier
Defense = Defense_Jewel.value × Rarity_Multiplier(Defense.rarity) × Synergy_Multiplier
Skill_effect = Skill_Rectangle.base × Synergy_Multiplier
Energy_Cost = (Attack.cost + Defense.cost + Skill.cost) / 2
```

Unde:
- **Rarity_Multiplier:** Common=1.0, Uncommon=1.5, Rare=2.0, Epic=3.0, Legendary=5.0, Mythic=8.0
- **Synergy_Multiplier:** se calculează din compatibilitatea părților (vezi secțiunea 5.4)

### 5.4 Synergy Score

| Scenariu | Synergy | Multiplier |
|---|---|---|
| Toate 6 părți din aceeași carte | 100% | ×1.2 |
| 4-5 părți din aceeași carte, restul din temă similară | 85% | ×1.1 |
| 3 părți din A, 3 din B (teme similare) | 70% | ×1.05 |
| Amestec echilibrat (teme diferite) | 50% | ×1.0 |
| Amestec haotic (4+ teme diferite) | 20% | ×0.8 |
| Diferență de raritate > 2 trepte | — | -10% per treaptă |

### 5.5 Reguli de Asamblare

- O carte completă = toate 6 sloturile umplute
- Nu poți duplica același tip de parte (2 Attack Jewels în aceeași carte)
- Poți schimba o parte oricând în Buy Phase (dacă ai alta în inventar)
- Poți dezasambla o carte în orice moment (părțile revin în inventar)
- O carte incompletă nu poate fi plasată pe grid

---

## 6. User Flow

```
START → Deschizi Shop → Cumperi părți individuale
  ↓
Deschizi Assembly → Vezi 6 sloturi goale
  ↓
Tragi o parte din inventar într-un slot
  ↓
Sistemul arată Synergy Score (verde/galben/rosu)
  ↓
Completezi toate 6 sloturile
  ↓
CARTE GATA → Arată stats finale + efect
  ↓
Place on Grid → Folosești cartea în battle
```

---

## 7. UI / Wireframe

### Asamblare

```
┌──────────────────────────────┐
│     ASAMBLEAZĂ CARTEA        │
│                              │
│  ┌────────────────────────┐  │
│  │     FRAME: Rare 🟦     │  │
│  │  ┌──────────────────┐  │  │
│  │  │ NAME: „Shadow..."│  │  │
│  │  ├──────────────────┤  │  │
│  │  │ ICON: 🦇         │  │  │
│  │  ├────────┬─────────┤  │  │
│  │  │ ATK:18 │ DEF:10  │  │  │
│  │  ├────────┴─────────┤  │  │
│  │  │ SKILL: LifeSteal │  │  │
│  │  └──────────────────┘  │  │
│  │                        │  │
│  │  SYNERGY: 🔵 85%      │  │
│  │  (aceeași carte) +20% │  │
│  └────────────────────────┘  │
│                              │
│  [Change Part]  [Place Grid] │
└──────────────────────────────┘
```

### Piesă în Shop

```
┌──────────────┐
│  ATTACK +18  │
│  🗡️ Bite     │
│  🔥 Rare     │
│  Cost: 5g    │
└──────────────┘
```

---

## 8. Balance / Valori Inițiale

| Parametru | Valoare | Note |
|---|---|---|
| Attack Jewel values | +5 (Common) → +50 (Mythic) | [PLACEHOLDER] |
| Defense Jewel values | +3 (Common) → +30 (Mythic) | [PLACEHOLDER] |
| Energy cost per part | 1-3 | Variază pe raritate |
| Synergy bonuses | ×0.8 → ×1.2 | Conform tabel 5.4 |
| Max parts per card | 6 | Fix |
| Min parts per card | 6 | O carte trebuie completă |

---

## 9. Dependențe

- [ ] SYS-001 Resource System (definițiile de părți)
- [ ] SYS-003 Part Inventory (depozitarea părților)
- [ ] SYS-037 Character Card Pool (proveniența părților)
- [ ] SYS-005 Arena + Grid (plasarea cărții finite)

---

## 10. Acceptance Criteria

- [ ] O carte poate fi asamblată din 6 părți individuale
- [ ] Fiecare parte are tip, valoare, raritate și sursă
- [ ] Synergy Score se calculează corect
- [ ] Părțile din aceeași carte → bonus
- [ ] Părți din cărți total diferite → penalty
- [ ] O carte incompletă nu poate fi folosită
- [ ] Poți schimba o parte oricând în Buy Phase

---

## 11. Întrebări Deschise

- Ce se întâmplă cu Skill Rectangle dacă părțile au teme conflictuale? (Skill-ul ratează? Slăbește? Se transformă?)
- Frame — doar estetic sau și funcțional? (ex: Frame Mythic dă +10% la toate? Sau doar arată bine?)
- Cât de des apare Synergy în UI? Doar la asamblare sau și în hover pe carte?

---

## 12. Istoric

| Dată | Schimbare |
|---|---|
| 2026-07-18 | Versiune inițială |
