# DESIGN_PASS.md — FEAT-CE-P1 Character Evolution

**Feature:** FEAT-CE-P1 — Character Evolution + Subordinates (Minimal Viable Loop)
**Data:** 2026-07-24
**Status:** aprobat (G1 ✅)
**Superseeds:** FEAT-P1 Arena Slots (arhivat)

---

## 1. Arhitectură Generală (Godot 4.x)

```
E:\GitHub Projects\Lowborn\game\lowborn\
├── project.godot
│
├── assets/
│   ├── art/                    ← Sprite-uri, tilemap-uri
│   ├── audio/                  ← Muzică, SFX
│   ├── fonts/                  ← Fonturi
│   └── ui/                     ← Theme-uri, icons
│
├── scenes/
│   ├── main_menu.tscn           ← Scena de titlu
│   ├── hub.tscn                 ← Gateway principal (Duel, Crafting, Training)
│   ├── duel_popup.tscn          ← Popup alegere caracter → buy phase
│   ├── buy_phase.tscn           ← Shop + Arena (buy phase)
│   ├── battle_phase.tscn        ← Auto-battle vizual
│   ├── results_screen.tscn      ← Win/Lose + recompense
│   ├── crafting_screen.tscn     ← Materiale, items, blueprints, bench-uri
│   ├── training_screen.tscn     ← Antrenament profesii
│   ├── subalterns_tree_screen.tscn ← Branch-uri subalterni (skill tree rebrand)
│   └── components/              ← Sub-scene reutilizabile
│       ├── subordinate_slot.tscn
│       ├── shop_item.tscn
│       ├── skill_node.tscn
│       ├── profession_card.tscn
│       └── blueprint_card.tscn
│
├── scripts/
│   ├── autoloads/
│   │   ├── game_manager.gd      ← Stare globală, semnale, tranziții
│   │   ├── event_bus.gd         ← Pub/sub între sisteme
│   │   ├── save_manager.gd      ← Save/load JSON
│   │   └── audio_manager.gd     ← Muzică, SFX
│   ├── state_machines/
│   │   └── game_state_machine.gd ← States: MENU/HUB/DUEL/BUY/BATTLE/RESULTS
│   ├── systems/
│   │   ├── shop_system.gd       ← Shop logic, coins
│   │   ├── battle_system.gd     ← Cooldown, damage, auto-battle
│   │   ├── crafting_system.gd   ← Item/skill crafting + bench-uri
│   │   ├── fame_system.gd       ← Fame tracking + tier unlocks
│   │   ├── subalterns_tree_system.gd ← Branch-uri, noduri, bonusuri
│   │   ├── training_system.gd   ← Profesii, antrenament, deblocări
│   │   └── ai_opponent.gd       ← Cardinal P1 adaptat
│   └── utils/
│       ├── constants.gd         ← Config, balance values
│       └── rng.gd               ← Seeded RNG pentru battle
│
├── resources/
│   ├── subordinate_data.tres    ← Definiții subalterni (T1-T3)
│   ├── item_data.tres           ← Definiții items craftable
│   ├── skill_data.tres          ← Definiții skills
│   ├── subalterns_tree_data.tres  ← Branch-uri, paths, bonusuri
│   ├── profession_data.tres     ← Definiții profesii
│   ├── blueprint_data.tres      ← Blueprint-uri de crafting
│   ├── character_data.tres      ← Personaj principal (stat-uri bază)
│   └── material_data.tres       ← Materiale pentru crafting
│
└── shaders/
    └── (placeholder)
```

### Pattern-uri Arhitecturale

| Pattern | Unde | Rol |
|---------|------|-----|
| **StateMachine** | `game_state_machine.gd` | Tranziții MENU → BUY → BATTLE → RESULTS → MENU |
| **EventBus** | `event_bus.gd` (autoload) | Cuplare slabă între scene și sisteme |
| **Autoloads** | `game_manager.gd`, etc. | Stare globală persistentă între scene |
| **Godot Resources** | `.tres` / `.res` | Date tipate, editabile în editor, fără runtime loading |
| **Composition** | Sub-scene în `components/` | Reutilizare UI (sloturi, butoane, carduri) |

---

## 2. Componente

### 2.1 Autoloads (Singletons)

| Autoload | Script | Rol |
|----------|--------|-----|
| `GameManager` | `scripts/autoloads/game_manager.gd` | Stare globală (coins, fame, XP, round), semnale de tranziție |
| `EventBus` | `scripts/autoloads/event_bus.gd` | Evenimente: `buy_complete`, `battle_over`, `level_up`, `fame_changed` |
| `SaveManager` | `scripts/autoloads/save_manager.gd` | Save/load stare joc în JSON local |
| `AudioManager` | `scripts/autoloads/audio_manager.gd` | Muzică fundal, SFX (placeholder P1 — zero audio) |

### 2.2 Scene-uri

| Scenă | Fișier | Responsabilitate |
|-------|--------|-----------------|
| MainMenu | `scenes/main_menu.tscn` | Titlu joc, background, buton "Joacă" |
| Hub | `scenes/hub.tscn` | Gateway principal: portret + stats, butoane Duel/Crafting/Training |
| DuelPopup | `scenes/duel_popup.tscn` | Popup alegere caracter → buy phase |
| BuyPhase | `scenes/buy_phase.tscn` | 2 paneluri (subalterni stânga, items/skills dreapta), arena slots sus |
| BattlePhase | `scenes/battle_phase.tscn` | Auto-battle vizual, HP bars, cooldown indicators, damage numbers |
| ResultsScreen | `scenes/results_screen.tscn` | Win/Lose, XP, coins, fame, material drops, buton "Hub" / "Next Round" |
| GameOverScreen | `scenes/game_over_screen.tscn` | Run stats, New Run / Main Menu, items păstrate |
| CraftingScreen | `scenes/crafting_screen.tscn` | Materiale, blueprints, bench-uri, buton craft |
| TrainingScreen | `scenes/training_screen.tscn` | Listă profesii, mastery, antrenament, deblocări |
| SubalternsTreeScreen | `scenes/subalterns_tree_screen.tscn` | Branch-uri, noduri, confirmare (fost SkillTreeScreen) |

### 2.3 Sisteme de Joc

| Sistem | Script | Rol |
|--------|--------|-----|
| GameStateMachine | `scripts/state_machines/game_state_machine.gd` | Tranziții între scene, `enter()`/`exit()` per stare |
| ShopSystem | `scripts/systems/shop_system.gd` | Populează shop-ul, gestionează cumpărarea, coins |
| BattleSystem | `scripts/systems/battle_system.gd` | Cooldown per subaltern, damage calc, target selection |
| CraftingSystem | `scripts/systems/crafting_system.gd` | Item/skill crafting din materiale, bench-uri, blueprints |
| FameSystem | `scripts/systems/fame_system.gd` | Fame tracking, tier unlocks, modificatori |
| SubalternsTreeSystem | `scripts/systems/subalterns_tree_system.gd` | Încarcă tree-ul, aplică bonusuri la level-up |
| TrainingSystem | `scripts/systems/training_system.gd` | Profesii, mastery, antrenament, deblocări în tree |
| AIOpponent | `scripts/systems/ai_opponent.gd` | Alege subalterni + items, auto-battle, adaptare |

### 2.4 Resurse (Date)

| Resursă | Fișier | Conținut |
|---------|--------|----------|
| SubordinateData | `resources/subordinate_data.tres` | Array de subalterni: nume, tier, HP, ATK, DEF, cost |
| ItemData | `resources/item_data.tres` | Items craftable: tip, bonus, material cost, skill unlocked |
| SkillData | `resources/skill_data.tres` | Skills: efect, damage bonus, cost craft |
| SubalternsTreeData | `resources/subalterns_tree_data.tres` | Branch-uri + noduri: level requirement, bonus type, valoare |
| ProfessionData | `resources/profession_data.tres` | Profesii: nume, mastery levels, deblocări, cost antrenament |
| BlueprintData | `resources/blueprint_data.tres` | Blueprint-uri: item/skill rezultat, materiale necesare, bench necesar |
| CharacterData | `resources/character_data.tres` | Personaj principal: HP bază, ATK bază, DEF bază |
| MaterialData | `resources/material_data.tres` | Materiale: tip, raritate, icon |

---

## 3. Game Flow

### 3.1 High-Level View

```
MAIN MENU
  ├── Titlu joc ("Lowborn")
  ├── Background art
  ├── Buton "Joacă" (prima dată / după Game Over)
  └── Click "Joacă" → HUB
        │
        ▼
HUB (gateway principal)
  ├── Portret personaj + stats rezumate (level, fame, coins)
  ├── [⚔️ Duel] → popup alegere caracter → BUY PHASE
  ├── [🔧 Crafting] → CRAFTING SCREEN
  ├── [🏋️ Training] → TRAINING SCREEN (profesii)
  └── Buton "Main Menu" → MAIN MENU
```

### 3.2 Duel Flow

```
[HUB] → click "⚔️ Duel"
  │
  ▼
DUEL POPUP
  ├── Listă caractere disponibile (P1: doar Țăran)
  ├── Click pe caracter → vezi stats sumare
  └── Click "OK" → BUY PHASE
        │
        ▼
BUY PHASE
  ├── Sus: Arena (5 sloturi goale)
  ├── Stânga: Shop Subalterni (T1-T3, în funcție de fame)
  │     ├── Click pe subaltern → cumpără → apare în primul slot liber
  │     └── Dacă toate sloturile ocupate → "Sell" sau "Replace"
  ├── Dreapta: Shop Items + Skills
  │     ├── Items: arme, armuri, accesorii (apar doar dacă sunt craftate)
  │     └── Skills: apar doar dacă itemul care le deblochează e craftat
  ├── Click pe slot → echipează/desechipează items + skills
  ├── Buton "Gata de Luptă"
  └── Click → BATTLE PHASE
        │
        ▼
BATTLE PHASE
  ├── 2 tabere: Player (stânga) vs AI (dreapta)
  ├── Fiecare subaltern are:
  │     ├── HP bar + name
  │     ├── Cooldown circle (1.5-3.0s)
  │     └── Attack animation (basic P1)
  ├── Când cooldown = 0 → alege ținta (lowest HP) → atacă
  │     ├── Damage number animat pe target
  │     ├── HP bar scade vizual
  │     └── Subaltern mort → dispare cu efect
  ├── O tabără fără subalterni → atacă personajul principal
  ├── Personaj principal mort → GAME OVER SCREEN
  └── Round normal (nimeni mort) → RESULTS SCREEN
        │
        ├── Win → RESULTS
        └── Lose (personaj viu) → RESULTS
        │
        ▼
RESULTS SCREEN
  ├── Win / Lose banner
  ├── Recompense:
  │     ├── +XP (50 win / 15 lose)
  │     ├── +Coins (10 + 3 × round)
  │     ├── +Fame (20 win / -5 lose)
  │     └── +Materiale (1-3 random, doar win)
  ├── Dacă level-up → deschide SUBALTERNS TREE
  │     ├── Alege un nod (dacă ai suficiente level-uri)
  │     ├── Confirmă → primești bonus
  │     └── Închide subalterns tree
  ├── Buton "Hub" → HUB
  └── Buton "Next Round" → BUY PHASE (continuă run-ul)

GAME OVER SCREEN
  ├── "Run Over" banner
  ├── Stats run-ului: rounduri, win/loss, subalterni cumpărați
  ├── Items craftate rămân în inventar (persistent)
  ├── Buton "New Run" → DUEL POPUP (coins reset)
  └── Buton "Main Menu" → MAIN MENU
```

### 3.3 Hub Sections Detail

| Element | Acțiune |
|---------|---------|
| **Portret + Stats** | Level, Fame, Coins, Round curent (dacă e în run) |
| **⚔️ Duel** | Deschide DUEL POPUP → alege caracter → buy → battle |
| **🔧 Crafting** | Deschide CRAFTING SCREEN (vezi secțiunea dedicată) |
| **🏋️ Training** | Deschide TRAINING SCREEN (vezi secțiunea dedicată) |
| **Main Menu** | Revino la ecranul de titlu |
| **Subalterns Tree** | Accesibil și din Results (la level-up) și din Hub (icon dedicat) |

### 3.4 Crafting Screen

```
[HUB] → click "🔧 Crafting"
  │
  ▼
CRAFTING SCREEN
  ├── Stânga: Materialele tale (lemn, fier, piatră, cristal, etc.)
  ├── Centru: Blueprint-uri disponibile
  │     ├── Items (arme, armuri, accesorii)
  │     └── Skills (deblocate de items)
  ├── Dreapta: Bench-uri de crafting
  │     ├── Forjă (arme + armuri)
  │     ├── Alchimiă (potiuni, accesorii)
  │     └── Fiecare bench deblocat prin Training
  ├── Click pe blueprint → vezi materiale necesare
  │     ├── Dacă ai materiale → buton "Craft" (verde)
  │     └── Dacă nu ai → buton gri + ce-ți lipsește
  ├── Click "Craft" → consumă materiale → item/skill creat
  │     ├── Itemul apare în inventar
  │     └── Skill-ul apare în shop (Buy Phase)
  └── Buton "Back" → HUB
```

### 3.5 Training & Professions Screen

```
[HUB] → click "🏋️ Training"
  │
  ▼
TRAINING SCREEN
  ├── Centru: Listă profesii disponibile (P1: 2-3)
  │     ├── Fierar → deblochează subalterni războinici + bench Forjă
  │     ├── Alchimist → deblochează subalterni magici + bench Alchimiă
  │     └── Strateg → deblochează subalterni comandant + cooldown reduction
  │
  ├── Click pe o profesie → vezi:
  │     ├── Nume, descriere
  │     ├── Nivel curent / Mastery
  │     ├── Ce deblochează (subalterni, bench-uri, bonusuri)
  │     ├── Ce resurse / condiții necesare pentru antrenament
  │     └── Buton "Antrenează" (dacă îndeplinești condițiile)
  │
  ├── La antrenament:
  │     ├── Consumă resurse (coins, materiale, sau timp — P1 simplu: coins)
  │     ├── Crește mastery-ul profesiei
  │     ├── La milestone-uri: deblochează branch-uri din Subalterns Tree
  │     └── Bonus pasiv: items din profesia respectivă sunt mai puternice
  │
  └── Buton "Back" → HUB
```

### 3.6 Subalterns Tree (fost Skill Tree)

Rebrand de la "Skill Tree" → "Subalterns Tree" — același sistem, dar focus pe deblocarea branch-urilor de subalterni:

```
                    ┌── Războinic ──┐
                    │   (ATK boost)  │
                    │   Lv3 → Lv6   │
                   ┌┘               └┐
Țăran (Lv1) ───────┤                  ├── Comandant (Lv8)
                    │                  │   (ATK + DEF boost)
                    └┐               ┌┘
                     │   Magician ───┘
                     │   (Skill boost)
                     │   Lv3 → Lv6
                     │
                     └── Negustor ────┐
                         (Shop discount)│
                         Lv3 → Lv6    ├── Mecena (Lv8)
                                       │   (Shop rare items)
                                       │
                                       └── Haiduc ────┐
                                           (Fame boost)│
                                           Lv3 → Lv6  ├── Legendă (Lv8)
                                                       │   (Max fame gain)
```

**Cum interacționează cu Training:**
- Training-ul într-o profesie (ex: Fierar) **deblochează ramuri suplimentare** în Subalterns Tree
- Antrenând Fierar → deblochezi noduri războinice avansate în tree
- Antrenând Alchimist → deblochezi noduri magice avansate
- **Training + Tree** = două sisteme care se completează: tree-ul e vertical (level-up), training-ul e orizontal (profesii)

### StateMachine States

```
MENU → HUB → DUEL → BUY → BATTLE → RESULTS → HUB (sau BUY)
                                        ↘ GAME_OVER → MENU (sau HUB)
              HUB → CRAFTING → HUB
              HUB → TRAINING → HUB
              HUB → SUBALTERNS_TREE → HUB
```

Tranziții:
- `MENU → HUB`: click "Joacă"
- `HUB → DUEL`: click "⚔️ Duel"
- `DUEL → BUY`: click "OK" (caracter selectat)
- `BUY → BATTLE`: click "Gata de Luptă"
- `BATTLE → RESULTS`: o rundă se termină (win sau lose cu personaj viu)
- `BATTLE → GAME_OVER`: personaj principal mort
- `RESULTS → BUY`: click "Next Round"
- `RESULTS → HUB`: click "Hub"
- `GAME_OVER → HUB`: click "New Run" (→ DUEL)
- `GAME_OVER → MENU`: click "Main Menu"
- `HUB → CRAFTING → HUB`: navigare crafting screen
- `HUB → TRAINING → HUB`: navigare training screen
- `HUB → SUBALTERNS_TREE → HUB`: navigare tree (accesibil și din Results)
- `BUY → HUB`: abandon rundă (opțional)

---

## 4. Data Model (Godot Resources)

### 4.1 SubordinateData

```
extends Resource
class_name SubordinateData

@export var id: String
@export var name: String
@export var tier: int          # 1, 2, 3
@export var hp_base: int
@export var atk_base: int
@export var def_base: int
@export var cost: int          # coins
@export var cooldown: float    # 1.5-3.0 secunde
@export var icon_path: String  # cale către sprite
@export var description: String
```

### 4.2 ItemData

```
extends Resource
class_name ItemData

@export var id: String
@export var name: String
@export var type: String       # "weapon", "armor", "accessory"
@export var stat_bonus: String # "atk", "def", "hp"
@export var bonus_value: int
@export var material_cost: Dictionary  # {"wood": 3, "iron": 2}
@export var unlocks_skill_id: String   # skill deblocat de acest item
@export var description: String
```

### 4.3 SkillData

```
extends Resource
class_name SkillData

@export var id: String
@export var name: String
@export var effect: String     # "damage_bonus", "shield", "heal"
@export var effect_value: int
@export var material_cost: Dictionary
@export var required_item_id: String  # item care deblochează acest skill
@export var description: String
```

### 4.4 SkillTreeNodeData

```
extends Resource
class_name SkillTreeNodeData

@export var id: String
@export var name: String
@export var path: String        # "warrior", "mage", "merchant", "outlaw"
@export var level_required: int
@export var bonus_type: String  # "hp", "atk", "def", "fame_boost", "shop_discount", "cooldown_reduction"
@export var bonus_value: int
@export var description: String
@export var children: Array[SkillTreeNodeData]  # noduri următoare
```

### 4.5 Runtime State (nu e Resource — e în GameManager)

```gdscript
# GameManager.gd — runtime state
var current_round: int = 1
var coins: int = 10
var fame: int = 0
var xp: int = 0
var level: int = 1
var materials: Dictionary = {}

var subordinates: Array[SubordinateInstance] = []  # subalternii din inventar
var arena_slots: Array[SubordinateInstance] = []    # subalternii plasați în arenă (max 5)
var crafted_items: Array[String] = []               # id-uri de items craftate
var crafted_skills: Array[String] = []              # id-uri de skills craftate
var unlocked_skill_nodes: Array[String] = []        # id-uri de noduri deblocate
```

**Notă:** `SubordinateInstance` e o structură runtime (nu Resource):
```gdscript
class SubordinateInstance:
    var data: SubordinateData
    var current_hp: int
    var equipped_item: ItemData
    var equipped_skill: SkillData
```

---

## 5. Config / Balance Values (P1)

| Parametru | Valoare | Note |
|-----------|---------|------|
| **Canvas** | 1280×720 | 16:9, scalabil |
| **Arena sloturi** | 5 | Fix P1 |
| **Coins per round** | 10 + 3 × round_nr | Crește progresiv |
| **Fame per win** | +20 | Bonusuri din skill tree |
| **Fame per lose** | -5 | Nu scade sub 0 |
| **XP per win** | +50 | |
| **XP per lose** | +15 | |
| **XP per level** | 100 × level | Level 1→2 = 100XP, 2→3 = 200XP |
| **Subaltern max** | Nelimitat (5 pe arenă) | Poți cumpăra și înlocui |
| **Cooldown** | 1.5-3.0s | Per subaltern, variază pe tier |
| **Main Character HP** | 100 | Bază, modificabil din skill tree |
| **Main Character ATK** | 10 | Bază, când atacă direct |
| **Material drops per win** | 1-3 random | Din setul de materiale disponibile |
| **Energy** | ❌ Nu există în P1 | Doar cooldown |

### Config (constants.gd)

```gdscript
# constants.gd — P1 balance values
const CANVAS_WIDTH := 1280
const CANVAS_HEIGHT := 720
const MAX_ARENA_SLOTS := 5
const COINS_BASE := 10
const COINS_PER_ROUND := 3
const FAME_PER_WIN := 20
const FAME_PER_LOSE := -5
const FAME_MIN := 0
const XP_PER_WIN := 50
const XP_PER_LOSE := 15
const XP_PER_LEVEL_MULTIPLIER := 100
const MAIN_HP_BASE := 100
const MAIN_ATK_BASE := 10
const MATERIAL_DROPS_MIN := 1
const MATERIAL_DROPS_MAX := 3
const COOLDOWN_MIN := 1.5
const COOLDOWN_MAX := 3.0
```

---

## 6. Main Menu + Hub + Duel Popup (P1)

### 6.1 Main Menu Layout

```
┌─────────────────────────────────────┐
│                                     │
│           L O W B O R N             │
│        (titlu, big font)            │
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   Background art       │      │
│    │   (statuary / atmosferă)│      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
│    ┌──────────┐                     │
│    │  JOACĂ   │  → deschide HUB    │
│    └──────────┘                     │
│                                     │
│    ┌─────────────────────────┐      │
│    │  &quot;Un țăran devine       │      │
│    │   legendă...&quot;           │      │
│    │   (subtitle / flavor)   │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

### 6.2 Hub Layout

```
┌────────────────────────────────────────────┐
│                 H U B                       │
│                                            │
│   ┌──────────┐   Stats:                    │
│   │ Portret  │   Level 3 | Fame 120       │
│   │ Personaj │   Coins 45 | Run: Round 4  │
│   └──────────┘                             │
│                                            │
│   ┌────────────────────────────────┐       │
│   │  ⚔️ Duel                       │       │
│   ├────────────────────────────────┤       │
│   │  🔧 Crafting                   │       │
│   ├────────────────────────────────┤       │
│   │  🏋️ Training                   │       │
│   ├────────────────────────────────┤       │
│   │  🌳 Subalterns Tree            │       │
│   └────────────────────────────────┘       │
│                                            │
│   [Main Menu]                              │
└────────────────────────────────────────────┘
```

### 6.3 Duel Popup Layout

```
┌─────── DUEL — Alege Caracter ────────┐
│                                       │
│   ┌─────────────────────────────┐    │
│   │  Țăran Gheorghe             │ ← │
│   │  Lv.3 • HP: 100/100        │    │
│   │  Fame: 120 • ATK: 10       │    │
│   └─────────────────────────────┘    │
│                                       │
│   ┌─────────────────────────────┐    │
│   │  [blocat] Războinic         │ P2+│
│   └─────────────────────────────┘    │
│                                       │
│   ┌─────────────────────────────┐    │
│   │  [blocat] Mage              │ P2+│
│   └─────────────────────────────┘    │
│                                       │
│          [OK]  [Back]                 │
└───────────────────────────────────────┘
```

### 6.4 Funcționalități

| Element | Acțiune |
|---------|---------|
| Main Menu — Titlu "LOWBORN" | Decorativ, animat (opțional) |
| Main Menu — Background art | Imagine statică sau animată |
| Main Menu — Buton "JOACĂ" | Click → deschide HUB |
| Main Menu — Flavor text | Decorativ, schimbă la fiecare încărcare |
| Hub — Portret + Stats | Level, Fame, Coins, Round curent |
| Hub — ⚔️ Duel | Click → Duel Popup → alege caracter → OK |
| Hub — 🔧 Crafting | Click → Crafting Screen |
| Hub — 🏋️ Training | Click → Training Screen |
| Hub — 🌳 Subalterns Tree | Click → Subalterns Tree (accesibil și din Results) |
| Duel Popup — Caracter | Click selectare, vezi stats sumare |
| Duel Popup — OK | Click → BUY PHASE |
| Duel Popup — Back | Click → HUB |

---

## 7. P1 Scope Summary

### In Scope (P1)

| # | Component | Prioritizare |
|---|-----------|-------------|
| 1 | **Main Menu** — titlu, background, buton Joacă | Must-have |
| 2 | **Hub** — portret + stats, butoane Duel/Crafting/Training/Tree | Must-have |
| 3 | **Duel Popup** — alegere caracter, OK → buy phase | Must-have |
| 4 | **Buy Phase** — 2 paneluri (subalterni + items/skills), arena slots | Must-have |
| 5 | **Battle Phase** — auto-battle, cooldown, damage, target selection | Must-have |
| 6 | **Visual Feedback** — damage numbers, tween sprite, HP bar animate | Must-have |
| 7 | **Results Screen** — win/lose, recompense, buton Hub/Next Round | Must-have |
| 8 | **Game Over Screen** — run stats, New Run / Main Menu | Must-have |
| 9 | **Subalterns Tree** — 4 paths, 2-3 noduri fiecare, level-up unlock | Must-have |
| 10 | **Fame System** — tracking, tier unlocks | Must-have |
| 11 | **Round Progression** — AI budget scaling per round | Must-have |
| 12 | **Crafting Screen** — materiale, blueprints, bench-uri, buton craft | Must-have |
| 13 | **Training Screen** — 2-3 profesii, mastery, antrenament (coins) | Should-have |
| 14 | **AI Opponent** — Cardinal P1 (același shop pool, budget per round) | Must-have |
| 15 | **Tooltip** — hover pe subalterni/items: stats, cost, tier | Should-have |
| 16 | **Sell Subaltern** — 50% refund, right-click | Should-have |
| 17 | **Coins Indicator** — persistent în UI, orice fază | Should-have |
| 18 | **Tier Badge** — T1/T2/T3 pe subalterni în shop și arenă | Should-have |
| 19 | **Subordinate Data** — 3 tier-uri, 8+ subalterni | Must-have |
| 20 | **Item/Skill Data** — 3-4 items, skills deblocate de items | Must-have |
| 21 | **Profession Data** — 2-3 profesii cu mastery levels | Should-have |
| 22 | **Blueprint Data** — blueprints pentru items + skills | Should-have |
| 23 | **Material Data** — 4+ materiale (lemn, fier, piatră, cristal) | Should-have |
| 24 | **Save/Load** — stare joc în JSON local | Should-have |
| 25 | **Restart** — reset personaj, păstrează items craftate | Should-have |

### NOT in P1 (P2+)

| Feature | Target |
|---------|--------|
| Colecția caractere (multiple characters) | P2 |
| Sunet / Muzică | P8 |
| Speed control (1×/2×/3×) | P3 |
| Battle log | P2 |
| 6-8 arena sloturi | P2 |
| Multiple races | P2 |
| Complex crafting recipes | P2 |
| Multi-item synergy | P2 |
| Procedural evolution (80%) | P3 |
| Full PoE-style skill tree (150+ noduri) | P3 |
| Animații complexe / VFX | P3 |
| Achievement system | P4 |

---

## 8. Decizii Arhitecturale

| Decizie | Motiv |
|---------|-------|
| **Godot 4.x (GDScript)** | Engine nativ, rapid de dezvoltat, cross-platform |
| **Resource .tres pentru date** | Tipate, editabile în editor, fără runtime loading |
| **Autoloads pentru stare globală** | Singleton pattern — accesibil din orice scenă |
| **StateMachine externă** | Separă logica de tranziții de UI |
| **Fără Energy în P1** | Simplifică balancing-ul; doar cooldown per subaltern |
| **Subalternii nu se evoluvează** | Deblocați pe orizontală (faimă); mai simplu de balance-at |
| **Items deblochează Skills** | Lanț natural de progresie: craft → deblochează → echipează |
| **1280×720 rezoluție** | 16:9 standard, ușor de scalat |
| **JSON local pentru save** | Portabil, transparent, jucătorul poate face backup |

---

## 9. Dependințe

| Sistem | Pentru | Când |
|--------|--------|------|
| **Main Menu** | Punctul de intrare | P1 — prima componentă |
| **GameManager** | Stare globală | P1 — înainte de orice |
| **StateMachine** | Tranziții între scene | P1 — după Main Menu |
| **Hub** | Gateway principal | P1 — după Main Menu, înainte de Duel |
| **Duel Popup** | Alegere caracter → Buy Phase | P1 — după Hub |
| **ShopSystem** | Cumpărare subalterni + items/skills | P1 — după Duel |
| **Arena Slots** | Sloturi fizice pentru subalterni | P1 — după Shop |
| **BattleSystem** | Auto-battle, damage, cooldown | P1 — după Arena |
| **FameSystem** | Fame tracking + tier unlocks | P1 — după Battle |
| **SubalternsTree** | Branch-uri, noduri | P1 — după Level System |
| **TrainingSystem** | Profesii, mastery, deblocări | P1 — după Hub, paralel cu Duel |
| **CraftingSystem** | Item/skill crafting, bench-uri, blueprints | P1 — după Hub, paralel cu Duel |
| **AIOpponent** | Cardinal P1 adaptat | P1 — paralel cu Battle |

**Ordine de implementare (recomandată):**
1. **Main Menu** + GameManager + StateMachine
2. **Hub** + Duel Popup
3. **Buy Phase** + ShopSystem + Arena Slots
4. **Battle Phase** + BattleSystem + Visual Feedback
5. **Results Screen** + Game Over Screen
6. **FameSystem** + Fame tracking
7. **Round Progression** (AI budget scaling)
8. **Subalterns Tree** + SubalternsTreeSystem
9. **Crafting Screen** + CraftingSystem + Item/Blueprint Data
10. **Training Screen** + TrainingSystem + Profession Data
11. **AI Opponent**
12. Tooltip + Coins Indicator + Tier Badge
13. Sell Subaltern
14. Save/Load + Restart

---

## 10. Resurse Umane

- **Solo dev** — Dragoș implementează tot
- **AI assist** — Hermes Agent scrie codul cu MCP Godot
- **Testare** — manuală, după fiecare componentă funcțională

---

*Document actualizat: 2026-07-24 (v2 — Hub + Duel + Training adăugate)*
*Status: Design aprobat → pregătit pentru UI_SPEC și tickete*
