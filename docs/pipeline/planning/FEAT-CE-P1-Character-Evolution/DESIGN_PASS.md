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
│   ├── buy_phase.tscn           ← Shop + Arena (buy phase)
│   ├── battle_phase.tscn        ← Auto-battle vizual
│   ├── results_screen.tscn      ← Win/Lose + recompense
│   ├── skill_tree_screen.tscn   ← Skill tree modal
│   └── components/              ← Sub-scene reutilizabile
│       ├── subordinate_slot.tscn
│       ├── shop_item.tscn
│       └── skill_node.tscn
│
├── scripts/
│   ├── autoloads/
│   │   ├── game_manager.gd      ← Stare globală, semnale, tranziții
│   │   ├── event_bus.gd         ← Pub/sub între sisteme
│   │   ├── save_manager.gd      ← Save/load JSON
│   │   └── audio_manager.gd     ← Muzică, SFX
│   ├── state_machines/
│   │   └── game_state_machine.gd ← States: MENU/BUY/BATTLE/RESULTS
│   ├── systems/
│   │   ├── shop_system.gd       ← Shop logic, coins
│   │   ├── battle_system.gd     ← Cooldown, damage, auto-battle
│   │   ├── crafting_system.gd   ← Item/skill crafting
│   │   ├── fame_system.gd       ← Fame tracking + tier unlocks
│   │   ├── skill_tree_system.gd ← Evolution paths, nodes
│   │   └── ai_opponent.gd       ← Cardinal P1 adaptat
│   └── utils/
│       ├── constants.gd         ← Config, balance values
│       └── rng.gd               ← Seeded RNG pentru battle
│
├── resources/
│   ├── subordinate_data.tres    ← Definiții subalterni (T1-T3)
│   ├── item_data.tres           ← Definiții items craftable
│   ├── skill_data.tres          ← Definiții skills
│   ├── skill_tree_data.tres     ← Node-uri, paths, bonusuri
│   └── character_data.tres      ← Personaj principal (stat-uri bază)
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
| MainMenu | `scenes/main_menu.tscn` | Titlu joc, background, buton "Joacă", selecție personaj |
| BuyPhase | `scenes/buy_phase.tscn` | 2 paneluri (subalterni stânga, items/skills dreapta), arena slots sus |
| BattlePhase | `scenes/battle_phase.tscn` | Auto-battle vizual, HP bars, cooldown indicators, damage numbers |
| ResultsScreen | `scenes/results_screen.tscn` | Win/Lose, XP, coins, fame, material drops, buton "Next" / "Menu" |
| GameOverScreen | `scenes/game_over_screen.tscn` | Run stats, New Run / Main Menu, items păstrate |
| SkillTreeScreen | `scenes/skill_tree_screen.tscn` | Modal overlay — branching paths, noduri, confirmare |

### 2.3 Sisteme de Joc

| Sistem | Script | Rol |
|--------|--------|-----|
| GameStateMachine | `scripts/state_machines/game_state_machine.gd` | Tranziții între scene, `enter()`/`exit()` per stare |
| ShopSystem | `scripts/systems/shop_system.gd` | Populează shop-ul, gestionează cumpărarea, coins |
| BattleSystem | `scripts/systems/battle_system.gd` | Cooldown per subaltern, damage calc, target selection |
| CraftingSystem | `scripts/systems/crafting_system.gd` | Item/skill crafting din materiale, deblocare skills |
| FameSystem | `scripts/systems/fame_system.gd` | Fame tracking, tier unlocks, modificatori din skill tree |
| SkillTreeSystem | `scripts/systems/skill_tree_system.gd` | Încarcă tree-ul, aplică bonusuri la level-up |
| AIOpponent | `scripts/systems/ai_opponent.gd` | Alege subalterni + items, auto-battle, adaptare |

### 2.4 Resurse (Date)

| Resursă | Fișier | Conținut |
|---------|--------|----------|
| SubordinateData | `resources/subordinate_data.tres` | Array de subalterni: nume, tier, HP, ATK, DEF, cost |
| ItemData | `resources/item_data.tres` | Items craftable: tip, bonus, material cost, skill unlocked |
| SkillData | `resources/skill_data.tres` | Skills: efect, damage bonus, cost craft |
| SkillTreeData | `resources/skill_tree_data.tres` | Paths + noduri: level requirement, bonus type, valoare |
| CharacterData | `resources/character_data.tres` | Personaj principal: HP bază, ATK bază, DEF bază |

---

## 3. Game Flow

```
MAIN MENU
  ├── Titlu joc ("Lowborn")
  ├── Background art
  ├── Buton "Joacă"
  ├── Selecție personaj (Țăran — singurul disponibil P1)
  └── Click "Joacă" → BUY PHASE
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
  ├── Dacă level-up → deschide SKILL TREE
  │     ├── Alege un nod (dacă ai suficiente level-uri)
  │     ├── Confirmă → primești bonus
  │     └── Închide skill tree
  ├── Buton "Main Menu" → MAIN MENU
  └── Buton "Next Round" → BUY PHASE

GAME OVER SCREEN
  ├── "Run Over" banner
  ├── Stats run-ului: rounduri, win/loss, subalterni cumpărați
  ├── Items craftate rămân în inventar (persistent)
  ├── Buton "New Run" → BUY PHASE (coins reset)
  └── Buton "Main Menu" → MAIN MENU
```

#### StateMachine States

```
MENU → BUY → BATTLE → RESULTS → MENU (sau BUY)
                       ↘ GAME_OVER → MENU (sau BUY)
```

Tranziții:
- `MENU → BUY`: click "Joacă", selectează personaj
- `BUY → BATTLE`: click "Gata de Luptă"
- `BATTLE → RESULTS`: o rundă se termină (win sau lose cu personaj viu)
- `BATTLE → GAME_OVER`: personaj principal mort
- `RESULTS → BUY`: click "Next Round"
- `RESULTS → MENU`: click "Main Menu"
- `GAME_OVER → BUY`: click "New Run"
- `GAME_OVER → MENU`: click "Main Menu"
- (opțional) `BUY → MENU`: abandon rundă

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

## 6. Main Menu (P1)

### 6.1 Layout

```
┌─────────────────────────────────────┐
│                                     │
│           L O W B O R N             │
│        (titlu, big font)            │
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │   Portret Personaj      │      │
│    │   (Țăran placeholder)   │      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
│    Nume: Țăran Gheorghe             │
│    (generat random)                 │
│                                     │
│    ┌──────────┐                     │
│    │  JOACĂ   │  ← buton principal  │
│    └──────────┘                     │
│                                     │
│    Alte personaje: [blocate/gri]    │
│    (P1 — doar Țăran disponibil)     │
│                                     │
│    ┌─────────────────────────┐      │
│    │  "Un țăran devine       │      │
│    │   legendă..."           │      │
│    │   (subtitle / flavor)   │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

### 6.2 Funcționalități

| Element | Acțiune |
|---------|---------|
| Titlu "LOWBORN" | Decorativ, animat (opțional) |
| Portret personaj | Placeholder (icon-ul jocului sau un sprite simple) |
| Nume generat | Random din listă (ex: Gheorghe, Ion, Andrei, Maria) |
| Buton "JOACĂ" | Click → inițializează round 1 → BUY PHASE |
| Personaje blocate | Gri, tooltip "Disponibil în update-uri viitoare" |
| Flavor text | Decorativ, schimbă la fiecare încărcare |

---

## 7. P1 Scope Summary

### In Scope (P1)

| # | Component | Prioritizare |
|---|-----------|-------------|
| 1 | **Main Menu** — titlu, buton Joacă, selecție personaj | Must-have |
| 2 | **Buy Phase** — 2 paneluri (subalterni + items/skills), arena slots | Must-have |
| 3 | **Battle Phase** — auto-battle, cooldown, damage, target selection | Must-have |
| 4 | **Visual Feedback** — damage numbers, tween sprite, HP bar animate | Must-have |
| 5 | **Results Screen** — win/lose, recompense, buton Next/Menu | Must-have |
| 6 | **Game Over Screen** — run stats, New Run / Main Menu | Must-have |
| 7 | **Skill Tree** — 4 paths, 2-3 noduri fiecare, level-up unlock | Must-have |
| 8 | **Fame System** — tracking, tier unlocks | Must-have |
| 9 | **Round Progression** — AI budget scaling per round | Must-have |
| 10 | **Crafting** — 3-4 items, skills deblocate de items | Must-have |
| 11 | **AI Opponent** — Cardinal P1 (același shop pool, budget per round) | Must-have |
| 12 | **Tooltip** — hover pe subalterni/items: stats, cost, tier | Should-have |
| 13 | **Sell Subaltern** — 50% refund, right-click | Should-have |
| 14 | **Coins Indicator** — persistent în UI, orice fază | Should-have |
| 15 | **Tier Badge** — T1/T2/T3 pe subalterni în shop și arenă | Should-have |
| 16 | **Save/Load** — stare joc în JSON local | Should-have |
| 17 | **Restart** — reset personaj, păstrează items craftate | Should-have |

### NOT in P1 (P2+)

| Feature | Target |
|---------|--------|
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
| **ShopSystem** | Cumpărare subalterni + items/skills | P1 — după Main Menu |
| **Arena Slots** | Sloturi fizice pentru subalterni | P1 — după Shop |
| **BattleSystem** | Auto-battle, damage, cooldown | P1 — după Arena |
| **FameSystem** | Fame tracking + tier unlocks | P1 — după Battle |
| **SkillTree** | Evolution paths | P1 — după Level System |
| **CraftingSystem** | Item/skill crafting | P1 — după Shop |
| **AIOpponent** | Cardinal P1 adaptat | P1 — paralel cu Battle |

**Ordine de implementare (recomandată):**
1. Main Menu + GameManager + StateMachine
2. Buy Phase + ShopSystem + Arena Slots
3. Battle Phase + BattleSystem + Visual Feedback
4. Results Screen + Game Over Screen
5. FameSystem + Fame tracking
6. Round Progression (AI budget scaling)
7. Skill Tree + SkillTreeSystem
8. CraftingSystem + Items/Skills
9. AIOpponent
10. Tooltip + Coins Indicator + Tier Badge
11. Sell Subaltern
12. Save/Load + Restart

---

## 10. Resurse Umane

- **Solo dev** — Dragoș implementează tot
- **AI assist** — Hermes Agent scrie codul cu MCP Godot
- **Testare** — manuală, după fiecare componentă funcțională

---

*Document actualizat: 2026-07-24*
*Status: G1 aprobat → pregătit pentru UI_SPEC și tickete*
