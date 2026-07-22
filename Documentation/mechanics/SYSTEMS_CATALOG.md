# Cardweave — Systems & Mechanics Catalog

> Catalogul complet al tuturor sistemelor necesare pentru Cardweave.
> Fiecare sistem are o anatomie care descrie exact cum e construit.
> Când creăm un sistem nou sau îmbunătățim unul existent, folosim acest format.

---

## Anatomy of a System — Template

```
┌─────────────────────────────────────────────────────────────┐
│                     SYSTEM ANATOMY                         │
├─────────────────────────────────────────────────────────────┤
│ 1. IDENTITATE                                               │
│    Nume, scop, categorii, dependențe                        │
│                                                             │
│ 2. DATA (ce stochează)                                      │
│    Variabile, resurse, fișiere, DB tables                   │
│                                                             │
│ 3. LOGICĂ (ce face)                                         │
│    Funcții, stări, tranziții, reguli                        │
│                                                             │
│ 4. UI (cum se vede)                                         │
│    Screens, controale, wireframe-uri                        │
│                                                             │
│ 5. NETWORK (cum comunică)                                   │
│    Sync între jucători, server-side validation              │
│                                                             │
│ 6. CONFIG (ce se poate ajusta)                              │
│    Parametri balansabili, valori inițiale                   │
│                                                             │
│ 7. IMPLEMENTARE (TypeScript + PixiJS)                       │
│    Module, clase, fișiere în src/                           │
│                                                             │
│ 8. TESTARE (cum verifici că funcționează)                   │
│    Criterii de acceptanță, edge cases                       │
│                                                             │
│ 9. ISTORIC (ce s-a schimbat)                                │
│    Changelog per sistem                                     │
└─────────────────────────────────────────────────────────────┘
```

---

# Catalogul Sistemelor

---

## SYS-001 — Resource System

### 1. Identitate
- **Nume:** Resource System
- **Scop:** Fundația datelor — toate entitățile jocului sunt date definite în TypeScript
- **Categorii:** data, foundation
- **Dependențe:** nimic (e primul)

### 2. Data
```
Type Definitions (.ts / .json):
├── PartDefinition.ts (base class)
│   ├── FramePart.ts
│   ├── NamePart.ts
│   ├── IconPart.ts
│   ├── AttackJewel.ts
│   ├── DefenseJewel.ts
│   └── SkillRectangle.ts
├── RarityDefinition.ts (Common→Mythic)
├── RaceDefinition.ts (Pyros, Aqua, etc.)
├── BlueprintDefinition.ts (rețete)
└── ProfessionDefinition.ts (arbore profesii)
```

### 3. Logică
- Fiecare parte de carte e o entitate TypeScript
- Părțile sunt stocate în fișiere `.json` sau `.ts`
- Se definesc direct în TypeScript
- Se încarcă dinamic la runtime din JSON

### 4. UI
- — (e invizibil, doar date)

### 5. Network
- Resursele sunt doar pe client. Serverul are propriul model de date.

### 6. Config
- Valorile se configurează în fișiere JSON, nu în cod. Poți balansa fără să rescrii.

### 7. Implementation (TypeScript + PixiJS)
```
src/data/
├── parts/
│   ├── PartDefinition.ts       ← Base class
│   ├── frames/
│   │   ├── FramePart.ts
│   │   └── *.json              ← Instanțe
│   ├── jewels/
│   │   ├── AttackJewel.ts
│   │   ├── DefenseJewel.ts
│   │   └── *.json
│   └── skills/
│       ├── SkillRectangle.ts
│       └── *.json
├── rarities/
│   └── *.json
├── races/
│   └── *.json
└── blueprints/
    └── *.json
```

### 8. Testare
- [ ] O parte poate fi încărcată din resursă
- [ ] Valorile se configurează în fișiere JSON
- [ ] O parte goală e diferită de o parte completă

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-002 — Game State Machine

### 1. Identitate
- **Nume:** Game State Machine
- **Scop:** Controlează flow-ul jocului — în ce stare e jocul acum
- **Categorii:** core, flow
- **Dependențe:** SYS-001 (are nevoie de date)

### 2. Data
```
Stări:
├── MENU
│   └── MainMenu, Settings, Collection
├── MATCHMAKING
│   └── Căutare, Lobby
├── RACE_SELECT
│   └── Alege rasa
├── BUY_PHASE
│   └── Shop, Assembly, Grid
├── BATTLE_PHASE
│   └── Auto-battle, Animation
├── RESULTS
│   └── Win/Lose, Rewards
└── BETWEEN_ROUNDS
    └── Pause, Strategizing
```

### 3. Logică
- State Machine pattern (vezi `src/core/state/`)
- Tranzițiile sunt controlate de evenimente (timer, player action, sync)
- Nu se poate sări peste stări
- Fiecare stare are: enter(), update(delta), exit()

### 4. UI
- Fiecare stare are propriul ei screen / layer UI

### 5. Network
- Client: își schimbă starea pe baza comenzilor serverului
- Server: autoritar — validează că clientul e în starea corectă
- Tranzițiile sunt syncronizate (ambii jucători sunt în aceeași stare)

### 6. Config
- Durata max per Buy Phase
- Durata Battle Phase
- Tranziții disponibile (lista albă)

### 7. Implementation (TypeScript + PixiJS)
```
src/core/game_state_machine/
├── GameStateMachine.ts        ← singleton
├── states/
│   ├── MenuState.ts
│   ├── MatchmakingState.ts
│   ├── RaceSelectState.ts
│   ├── BuyPhaseState.ts
│   ├── BattlePhaseState.ts
│   ├── ResultsState.ts
│   └── BetweenRoundsState.ts
└── transitions.ts             ← Tabelul tranzițiilor
```

### 8. Testare
- [ ] Jocul pornește în MENU
- [ ] Poți ajunge la BATTLE fără să sari peste BUY
- [ ] La disconnect, revii la MENU
- [ ] Timerul de Buy Phase expiră → treci automat la BATTLE

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-003 — Part Inventory

### 1. Identitate
- **Nume:** Part Inventory
- **Scop:** Gestionarea părților de cărți pe care le are jucătorul în duel
- **Categorii:** card, inventory
- **Dependențe:** SYS-001

### 2. Data
```
PlayerInventory:
├── gold: int
├── parts: Array[PartDefinition]
│   ├── frame_parts: Array[FramePart]
│   ├── name_parts: Array[NamePart]
│   ├── icon_parts: Array[IconPart]
│   ├── attack_jewels: Array[AttackJewel]
│   ├── defense_jewels: Array[DefenseJewel]
│   └── skill_rectangles: Array[SkillRectangle]
├── assembled_cards: Array[Card]
│   └── Card = { frame, name, icon, attack, defense, skill, position, orientation }
└── coins: int
```

### 3. Logică
- Adaugă parte (când cumperi din shop)
- Scoate parte (când combini sau plasezi)
- Validează: ai loc? ai destule resurse?
- Combină: 2×Common → 1×Uncommon (pierzi ambele)

### 4. UI
- Grid de părți, sortabile pe tip
- Card preview când asamblezi
- Filtrare pe raritate / tip

### 5. Network
- Trimite serverului inventarul actualizat
- Serverul validează înainte de battle

### 6. Config
- Inventar maxim (câte părți poți avea simultan)
- Cost combinare

### 7. Implementation (TypeScript + PixiJS)
```
src/features/inventory/
├── PartInventory.ts
├── InventoryUI.ts
└── CardAssemblyUI.ts
```

### 8. Testare
- [ ] Poți cumpăra o parte → apare în inventar
- [ ] Poți combina 2 părți → dispare, apare una mai bună
- [ ] Poți asambla o carte din 6 părți
- [ ] Inventarul se păstrează între runde

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-004 — Card Assembly (prin Snap în Arena Slot)

### 1. Identitate
- **Nume:** Card Assembly
- **Scop:** Asamblarea cărților direct în Arena Slot — nu mai există fază separată de assembly
- **Categorii:** card, core mechanic
- **Dependențe:** SYS-001, SYS-005 (Arena Slots)

### 2. Data
```
CardInSlot:
├── slot_index: int (poziția în Arena)
├── parts:
│   ├── frame: FramePart (⬜ gol / 🟢 ocupat)
│   ├── name: NamePart
│   ├── icon: IconPart
│   ├── attack_jewel: AttackJewel
│   ├── defense_jewel: DefenseJewel
│   └── skill: SkillRectangle
├── part_count: int (câte sloturi sunt ocupate, 0-6)
├── complete: bool (part_count == 6)
├── rarity: enum { Common→Mythic } (se urcă prin rune)
├── energy_cost: int (calculat din suma părților + raritate)
├── cooldown: float (calculat din suma părților)
├── damage: int (din attack_jewel dacă e prezent)
├── shield_value: int (din defense_jewel dacă e prezent)
└── effect: SkillEffect (din skill_rectangle dacă e prezent)
```

### 3. Logică

**Filosofie:** Nu exiști „inventar de părți" și „ecran de assembly". Partea pe care o cumperi din shop **snap direct** într-un subslot liber al unui Arena Slot.

#### 3.1 Snap
1. Jucătorul cumpără o parte din shop
2. Dacă există un subslot liber de același tip (ex: cumpăr Attack Jewel → caută slot cu Attack Jewel liber):
   - **Snap automat** (sau jucătorul alege slotul)
   - Partea apare instant în subslot
3. Dacă nu există slot cu acel subslot liber:
   - Jucătorul trebuie să deblocheze un slot nou sau să mute o parte existentă

#### 3.2 Card Progresiv
- O carte cu 1/6 părți e **deja activă** în battle
- O carte cu 6/6 părți e **completă** → primește boost multiplier (ex: ×1.3)
- Poți **înlocui** o parte oricând (partea veche dispare, partea nouă o înlocuiește)
- Poți **muta** o parte dintr-un slot în altul (costă? — NEDECIS)

#### 3.3 Synergy Score
Când o carte are părți din teme diferite:
- Toate 6 din aceeași carte originală → ×1.2
- Teme similare → ×1.1
- Teme diferite → ×1.0
- Amestec haotic → ×0.8

Synergy Score se aplică ca multiplier la toate efectele cărții.

### 4. UI
```
┌──────────────────────────────────────┐
│  SLOT 1: Scorch Claw (3/6)          │
│                                      │
│  ┌──────────┐                        │
│  │          │  Frame  🟢 Common      │
│  │   CARTE  │  Name   🟢 "Scorch"    │
│  │          │  Icon   ⬜ gol          │
│  │   PREVIEW│  Attack 🟢 dmg 8-12    │
│  │          │  Def    ⬜ gol          │
│  │          │  Skill  🟢 Burn        │
│  └──────────┘                        │
│                                      │
│  Click pe subslot gol → deschide     │
│  shop filtrat pe acel tip de parte   │
└──────────────────────────────────────┘
```

- Fiecare Arena Slot arată câte părți are (3/6)
- Subsloturile sunt vizibile la click pe slot
- Subslot gol = poți snap o parte
- Preview carte se actualizează în timp real

### 5. Network
- Serverul știe ce părți sunt în fiecare slot
- La snap, serverul validează că ai cumpărat partea
- La început de battle, serverul trimite starea sloturilor

### 6. Config
- Max sloturi în Arena (implicit 5, deblocabil)
- Cost mutare parte între sloturi (dacă există)
- Boost multiplier la carte completă (ex: 1.3)

### 7. Implementation (TypeScript + PixiJS)
```
src/features/card_assembly/
├── ArenaSlot.ts           ← Un slot cu 6 subsloturi
├── SubSlot.ts             ← Un subslot (Frame, Name, etc.)
├── SnapHandler.ts         ← Logica de snap când cumperi o parte
├── ArenaUI.ts             ← Toată Arena
├── SlotPreview.ts         ← Preview card + stats curente
└── PartMoveHandler.ts     ← Mutat părți între sloturi
```

### 8. Testare
- [ ] Cumpăr Attack Jewel → snap în slot gol → apare în subslot
- [ ] Carte 1/6 → activă în battle (face damage)
- [ ] Carte 6/6 → boost activat
- [ ] Înlocuiesc o parte → partea nouă o înlocuiește pe cea veche
- [ ] Mut o parte din Slot 1 în Slot 2 → efectul se mută
- [ ] Synergy Score calculat corect

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-20 | Rescriere — assembly prin snap direct în Arena Slot. Fără inventar separat. Fiecare parte activă individual. |

---

## SYS-005 — Arena Slots System

### 1. Identitate
- **Nume:** Arena Slots
- **Scop:** Arena cu sloturi pentru cărți. Fiecare slot = o carte cu 6 subsloturi (Frame, Name, Icon, Attack, Defense, Skill)
- **Categorii:** battle, arena
- **Dependențe:** SYS-001, SYS-004

### 2. Data
```
Arena:
├── slots: Array[CardSlot] (implicit 5, deblocabil)
│   └── CardSlot:
│       ├── index: int
│       ├── card: CardInSlot (vezi SYS-004)
│       ├── locked: bool
│       │   └── unlock_cost: int
│       └── active_in_battle: bool (true dacă part_count ≥ 1)
├── max_slots: int (configurabil)
└── character: Character (Ignis, Noctis, etc.)
```

### 3. Logică

#### 3.1 Sloturi și Subsloturi
- Arena are **5 sloturi** implicite (deblocabile până la 8)
- Fiecare slot conține **6 subsloturi** pentru părți
- Un slot poate fi:
  - **Gol** (0/6) — nu face nimic în battle
  - **Parțial** (1–5/6) — activ în battle, părțile prezente își fac efectul
  - **Complet** (6/6) — activ + boost multiplier

#### 3.2 Snap Mechanic
- Cumperi o parte din shop → **snap** direct într-un subslot
- Snap = instant, fără drag & drop (click partea dorită în shop, apoi click subslotul)
- Poți **muta** o parte dintr-un slot în altul (cost: NEDECIS)

#### 3.3 Slot Expansion
- Sloturile 1-5 sunt disponibile din start
- Sloturile 6+ se **deblochează** în Buy Phase contra cost
- Cost crește cu câte sloturi ai deja

### 4. UI
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
│ │⬜⬜⬜   │ │⬜⬜⬜⬜ │ │🌟🌟    │ │        │ │      │ │
│ └──────────┘ └──────────┘ └──────────┘ └────────┘ └──────┘ │
│                                                               │
│  Click pe slot → deschide subsloturile                        │
│  Click pe subslot gol → shop filtrat pe acel tip              │
│  Sloturi 6+ = gri (blocate, arată preț deblocare)            │
└───────────────────────────────────────────────────────────────┘
```

Elemente UI:
- Fiecare slot arată preview-ul cărții (3/6, ⏱cooldown, ⚡energy)
- Slot complet (6/6) are efect vizual (glow/stars)
- Sloturile blocate au overlay gri cu preț
- Click pe slot → vede 6 subsloturi
- Subslot gol = puls, invită la snap
- Battle overlay: sloturile arată în battle exact la fel

### 5. Network
- Arena e syncronizată — ambii jucători își văd sloturile
- Serverul validează snap-urile
- La început de battle, serverul confirmă starea sloturilor

### 6. Config
- Sloturi implicite: 5
- Max sloturi: 8
- Cost deblocare slot nou: (slot_index * 10) gold
- Cost mutare parte: 0 sau 5 gold

### 7. Implementation (TypeScript + PixiJS)
```
src/features/arena/
├── Arena.ts                ← Gestionează toate sloturile
├── CardSlot.ts             ← Un slot cu 6 subsloturi
├── SubSlot.ts              ← Un subslot (Frame, Name, etc.)
├── ArenaUI.ts              ← UI principală
├── SlotPreview.ts          ← Preview card
├── SlotExpansionUI.ts      ← Deblocare sloturi noi
└── SnapAnimation.ts        ← Animație la snap
```

### 8. Testare
- [ ] 5 sloturi vizibile, toate goale la start
- [ ] Cumpăr parte → snap în subslot → apare vizual
- [ ] Slot gol = inactiv, slot 1/6 = activ, slot 6/6 = boost
- [ ] Poți debloca sloturi 6+
- [ ] Poți muta o parte între sloturi
- [ ] Preview card se actualizează imediat după snap
- [ ] Sync între jucători (ambii își văd sloturile)

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-20 | v3 — Arena Slots cu 6 subsloturi per carte. Snap direct din shop. Fără separat assembly. |
| 2026-07-20 | v2 — Skill Bar |
| 2026-07-20 | v1 — Grid 6×6 |

---

## SYS-006 — Shop + Buy Phase

### 1. Identitate
- **Nume:** Shop & Buy Phase
- **Scop:** Faza de cumpărare între bătălii
- **Categorii:** economy, store
- **Dependențe:** SYS-001, SYS-003, SYS-005

### 2. Data
```
Shop:
├── round: int (1-13)
├── coins: int (primite în această rundă)
├── total_coins: int (cumulat)
├── parts_for_sale: Array[PartDefinition]
├── reroll_count: int
└── racial_pool: RaceDefinition (aleasă la început)
```

### 3. Logică
- La începutul fiecărei runde, primești X coins (crește cu runda)
- Se generează părți random din **card pool-ul caracterului ales** (nu din pool generic)
- O parte care e deja în inventar nu mai apare
- Poți rerola (costă coins, costul crește cu fiecare rerol)
- Poți cumpăra părți individual
- Poți combina 2 părți de același tip + raritate → 1 de raritate superioară

### 4. UI
- Shop grid cu părți disponibile
- Coin counter
- Reroll button (cu cost)
- Buton combinare (apare când ai 2 părți combinabile)
- Timer: cât timp mai ai în Buy Phase

### 5. Network
- Shop-ul e generat pe server (anti-cheat)
- Serverul validează cumpărăturile

### 6. Config
- Coins per round (formulă: base + round * increment)
- Reroll cost (formulă)
- Șanse per raritate (Common 40%, Uncommon 30%, Rare 18%, Epic 8%, Legendary 3%, Mythic 1% — offline-friendly, fără gacha)
- Max parts in shop

### 7. Implementation (TypeScript + PixiJS)
```
src/features/shop/
├── ShopManager.ts
├── ShopUI.ts
├── RerollButton.ts
└── CombineUI.ts
```

### 8. Testare
- [ ] Buy Phase începe după battle
- [ ] Primești coins la început
- [ ] Poți cumpăra o parte → coins scad, partea apare în inventar
- [ ] Rerollul costă și reîmprospătează shop-ul
- [ ] Combinarea 2×Common → Uncommon funcționează
- [ ] Timerul expiră → treci la Battle

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-007 — Duel System (Arena Slots + Energy + Auto-Battle)

### 1. Identitate
- **Nume:** Duel System
- **Scop:** Auto-battle real-time — cărțile din Arena Slots se activează automat pe cooldown
- **Categorii:** battle, core
- **Dependențe:** SYS-004 (Card Assembly via Snap), SYS-005 (Arena Slots), SYS-006 (Shop)

### 2. Data
```
BattleState:
├── character:
│   ├── base_hp: int (din caracter)
│   ├── current_hp: int
│   ├── shield: int (temporar, generat de Defense Jewel)
│   └── energy:
│       ├── cap: int (base + modificatori)
│       ├── current: float
│       └── regen_rate: float (base + modificatori) — energy/sec
├── arena_slots: Array[CardSlot]
│   └── CardSlot:
│       ├── slot_index: int
│       ├── parts: CardParts (6 subsloturi, unele goale)
│       ├── part_count: int (0-6)
│       ├── complete: bool
│       ├── cooldown_timer: float
│       ├── cooldown: float
│       ├── energy_cost: int
│       ├── damage: int (0 dacă Attack Jewel lipsește)
│       ├── shield_value: int (0 dacă Defense Jewel lipsește)
│       ├── effect: SkillEffect (null dacă Skill Rectangle lipsește)
│       ├── boost_multiplier: float (1.3 dacă complete, 1.0 altfel)
│       └── disabled: bool (stun/silence)
├── battle_timer: float
├── battle_log: Array[BattleEvent]
└── winner: enum { PLAYER1, PLAYER2, DRAW, NONE }
```

### 3. Logică

#### 3.1 Character HP
```
CharacterHP = BaseHP (din caracter)
```
- **HP** e determinat de caracter — nu mai există bonus HP din cărți
- **Shield** = generat de Defense Jewel la activarea cărții
- Când `current_hp ≤ 0` → jucătorul pierde runda

#### 3.2 Energy System
```
Energia se regenerează continuu. Fiecare activare de carte consumă energie.
```
- **Energy cap** = valoare de bază (ex: 50) + modificatori
- **Regen rate** = valoare de bază (ex: 3/s)
- **Energy cost per card** = calculat din suma părților + raritate
- Energia se resetează la cap la începutul fiecărei bătălii

#### 3.3 Card Activation Loop (Auto-Battle)
```
Fiecare carte din Arena Slots se activează pe propriul cooldown.
Toate efectele lovesc caracterul oponent.
```

1. Fiecare carte cu `part_count ≥ 1` are un **cooldown_timer**
2. Când `cooldown_timer ≤ 0`:
   a. Verifică energia: `current_energy ≥ energy_cost`?
   b. **DA** → consumă energia, **activează cartea**, resetează `cooldown_timer = cooldown`
   c. **NU** → activarea se amână
3. La activare, **fiecare parte prezentă** își face efectul:
   - **Attack Jewel** → `damage = value × rarity_mult × boost_mult` la opponent
   - **Defense Jewel** → `shield += value × rarity_mult × boost_mult`
   - **Skill Rectangle** → aplică efectul (Burn, Bleed, Stun, etc.)
   - **Frame** → bonus pasiv (damage% sau shield%)
   - **Name** → bonus sinergie (dacă match)
   - **Icon** → bonus rasial
4. Dacă **complete = true** (6/6): toate efectele au `boost_mult = 1.3`
5. Dacă **complete = false**: `boost_mult = 1.0`

#### 3.4 Exemplu — Aceeași Carte în Diferite Stadii

```
Slot: Scorch Claw (cooldown 1.2s, energy cost 3)

La activare, dacă:
  Attack Jewel doar (1/6):
    → 10 damage la opponent. Gata.

  Attack Jewel + Skill Rectangle (2/6):
    → 10 damage + Burn 3/s, 4s

  Attack Jewel + Skill Rect + Frame (3/6):
    → 10 damage + Burn + 5% damage bonus

  TOATE 6 părțile (6/6):
    → 10 × 1.3 = 13 damage + Burn × 1.3 + Shield 8 × 1.3 + Frame + Name + Icon
    → Boost activ!
```

#### 3.5 Cooldown
- Fiecare carte are un **cooldown** calculat din părți
- Cooldown-ul e influențat de buffs (Haste) și debuffs (Slow, Stun)
- Range tipic: 0.5s–3.0s
- **Cooldown minim**: 0.3s

#### 3.6 Shield
- Generat la activarea cărții dacă Defense Jewel e prezent
- Se consumă primul la orice damage
- Expiră la final de rundă

#### 3.7 Sfârșitul Bătăliei
- HP ≤ 0 → pierzi
- HP simultan 0 → DRAW
- Time cap (ex: 60s) → câștigă cel cu mai mult HP %

### 4. UI
```
┌──────────────────────────────────────────────┐
│  Ignis                     Titanus           │
│  HP ████████ 88/100        HP ██████ 70/130 │
│  Shield ██░ 12             Shield ██░ 8     │
│  Energy 35/55 +3/s         Energy 28/50     │
│                                              │
│  ARENA SLOTS:                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──┐ │
│  │Scorch│ │Ember │ │Dragon│ │      │ │  │ │
│  │Claw  │ │Shield│ │Brth  │ │ Gol  │ │G │ │
│  │⚔️🔥  │ │🛡️   │ │🔥🛡️ │ │      │ │O │ │
│  │3/6   │ │2/6   │ │6/6✅│ │      │ │L│ │
│  │⏱0.6s │ │⏱1.2s│ │⏱1.8s│ │      │ │ │ │
│  │⚡3e  │ │⚡2e  │ │⚡5e  │ │      │ │ │ │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──┘ │
│                                              │
│  [1×] [2×] [3×]       Battle Log scrollabil │
└──────────────────────────────────────────────┘
```

Elemente UI:
- HP bar + Shield bar
- Energy bar (curent/cap + regen/s)
- Arena Slots: fiecare slot arată starea (3/6), cooldown, energy cost, efecte active (⚔️🔥🛡️)
- Slot complet (6/6) are efect vizual distinct (glow)
- Battle log: ce s-a activat, ce damage, ce efect
- Viteză: 1×, 2×, 3×

### 5. Network
- Server-authoritative — serverul simulează tot duelul
- Clientul primește BattleEvent[] și rulează animațiile
- Offline-first: AI-ul local simulează opponentul

### 6. Config
| Parametru | Default | Range | Descriere |
|---|---|---|---|
| Energy base cap | 50 | 20–200 | Câtă energie poți stoca |
| Energy base regen | 3.0/s | 1.0–10.0 | Viteză regenerare |
| Cooldown minim | 0.3s | 0.1–0.5 | Limită inferioară |
| Cooldown maxim | 5.0s | 3.0–8.0 | Limită superioară |
| Battle time cap | 60s | 30–120 | Max duration |
| Boost complet | 1.3× | 1.1–2.0 | Multiplier carte 6/6 |

### 7. Implementation (TypeScript + PixiJS)
```
src/features/battle/
├── BattleManager.ts          ← Orchestrator
├── BattleSimulator.ts        ← Calculează rezultatul
├── CardActivator.ts          ← Activează cărțile pe cooldown
├── PartEffectHandler.ts      ← Execută efectele fiecărei părți
├── EnergyBar.ts              ← UI energy
├── HealthBar.ts              ← UI HP + Shield
├── ArenaSlotUI.ts            ← Slot vizual în battle
├── CooldownViz.ts            ← Countdown vizual per slot
├── BattleEvent.ts            ← Log entry
└── BattleSpeedControl.ts     ← 1×/2×/3× toggle
```

### 8. Testare
- [ ] Carte 1/6 → atacă (doar Attack Jewel face damage)
- [ ] Carte 3/6 → damage + shield + efect
- [ ] Carte 6/6 → toate efectele + boost
- [ ] Cooldown amânat dacă energia e insuficientă
- [ ] Shield se consumă primul
- [ ] HP = 0 → pierzi
- [ ] DRAW la HP simultan
- [ ] Time cap → tie-break
- [ ] Viteza 2× accelerează totul
- [ ] Stun → carte nu se activează
- [ ] Haste → cooldown redus

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-20 | v3 — Arena Slots. Fiecare parte activă independent. Boost la carte completă 6/6. |
| 2026-07-20 | v2 — Skill Bar (abilități directe). |
| 2026-07-20 | v1 — Card HP stacking + attack speed per card. |

---

## SYS-008 — Match Manager (Run)

### 1. Identitate
- **Nume:** Match Manager
- **Scop:** Gestionează run-ul: 13 win / 3 lose
- **Categorii:** progression, match
- **Dependențe:** SYS-007

### 2. Data
```
Match:
├── wins: int
├── losses: int
├── current_round: int
├── max_wins: 13
├── max_losses: 3
├── status: enum { IN_PROGRESS, WIN, LOSE }
└── rewards: Array[Reward]
```

### 3. Logică
- Câștigi o rundă → wins++
- Pierzi o rundă → losses++
- Când wins = 13 → WIN (recompense mari)
- Când losses = 3 → LOSE (recompense mici)
- Recompensele depind de numărul de win-uri

### 4. UI
- Win/Lose counter
- Round indicator
- Reward screen la final

### 5. Network
- Starea run-ului e pe server
- Matchmaking-ul asociază jucători cu același win/loss ratio

### 6. Config
- Max wins = 13
- Max losses = 3
- Reward scaling

### 7. Implementation (TypeScript + PixiJS)
```
src/features/match/
├── MatchManager.ts
├── RewardsScreen.ts
└── WinLossTracker.ts
```

### 8. Testare
- [ ] wins++ la victorie
- [ ] losses++ la înfrângere
- [ ] La 13 win-uri → ecran de victorie + recompense
- [ ] La 3 lose-uri → ecran de înfrângere + recompense

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-009 — Race Selection

### 1. Identitate
- **Nume:** Race Selection
- **Scop:** Alegerea rasei înainte de duel
- **Categorii:** progression, race
- **Dependențe:** SYS-001

### 2. Data
```
RaceSelection:
├── available_races: Array[RaceDefinition]
├── selected_race: RaceDefinition
├── unlocked_races: Array[RaceDefinition] (din profesii)
└── multi_race: bool (2-3 rase, deblocat din profesii)
```

### 3. Logică
- La început, ai acces doar la o rasă (Human/Neutru)
- Prin profesii, deblochezi rase noi
- Profesiile avansate permit 2-3 rase simultan
- Rasa aleasă determină pool-ul de părți din shop

### 4. UI
- Carduri cu rase (imagine + nume + descriere)
- Rase blocate = gri, arată cum se deblochează
- Tooltip cu părțile exclusive ale rasei

### 5. Network
- Serverul confirmă rasa aleasă
- Serverul folosește rasa să genereze pool-ul

### 6. Config
- Rase disponibile la launch
- Condiții de deblocare per rasă

### 7. Implementation (TypeScript + PixiJS)
```
src/features/race/
├── RaceSelectionUI.ts
├── RaceCard.ts
└── RaceDefinition.ts (resursă)
```

### 8. Testare
- [ ] Rasa implicită e selectabilă
- [ ] Rasele blocate nu pot fi selectate
- [ ] Profesiile deblochează rase noi

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-010 — Profession System

### 1. Identitate
- **Nume:** Profession System
- **Scop:** Arbori de profesii care controlează progresia
- **Categorii:** progression, professions
- **Dependențe:** SYS-001, SYS-009

### 2. Data
```
ProfessionTree:
├── professions: Array[ProfessionDefinition]
│   ├── Forging (Edge, Jewel, Frame sub-branches)
│   ├── Racial Lore (per rasă)
│   └── Combat (Energy, Tactician, Veteran)
├── player_levels: Dictionary { profession_id: level }
└── max_level: int (10)
```

### 3. Logică
- Fiecare profesie are niveluri (1-10)
- Fiecare nivel deblochează ceva (blueprint, bonus, rasă)
- Se învață cu gold + timp (sau quest-uri)
- Se poate respec? (NEDECIS)

### 4. UI
- Arbore vizual (asemănător cu skill tree)
- Nivelurile deblocate sunt luminoase
- Tooltip: ce deblochează următorul nivel

### 5. Network
- Progresia e salvată pe server
- Se validează înainte de duel ce rase are deblocate

### 6. Config
- Niveluri per profesie
- Cost per nivel
- Bonusuri per nivel

### 7. Implementation (TypeScript + PixiJS)
```
src/features/professions/
├── ProfessionTree.ts
├── ProfessionUI.ts
├── ProfessionNode.ts
└── ProfessionDefinition.ts
```

### 8. Testare
- [ ] Poți investi într-o profesie → nivelul crește
- [ ] Bonusul e aplicat (ex: Forging→poți combina)
- [ ] Rasa deblocată apare în Race Selection

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-011 — Blueprint System

### 1. Identitate
- **Nume:** Blueprint System
- **Scop:** Rețete pentru crafting părți între dueluri
- **Categorii:** progression, crafting
- **Dependențe:** SYS-001, SYS-010

### 2. Data
```
Blueprint:
├── id: String
├── name: String
├── required_profession: String + level
├── required_materials: Dictionary { material_id: count }
├── gold_cost: int
├── result_part: PartDefinition
└── research_time: int (ore/minut)
```

### 3. Logică
- Blueprint-urile se obțin din: shop, cercetare, drops, quest-uri
- Cercetarea consumă materiale + timp
- O dată deblocat, poți crafting de câte ori vrei
- Fiecare rasă are blueprint-uri exclusive

### 4. UI
- Listă de blueprint-uri (deblocate / deblocabile / blocate)
- Research queue (ce cercetezi acum)
- Crafting UI (materiale necesare, buton craft)

### 5. Network
- Blueprint-urile sunt pe server
- Serverul validează materialele înainte de crafting

### 6. Config
- Timpi de cercetare
- Materiale per blueprint
- Gold cost

### 7. Implementation (TypeScript + PixiJS)
```
src/features/blueprints/
├── BlueprintManager.ts
├── BlueprintUI.ts
├── ResearchQueueUI.ts
└── CraftingUI.ts
```

### 8. Testare
- [ ] Poți cerceta un blueprint
- [ ] După cercetare, poți crafting
- [ ] Materialele sunt consumate corect

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-012 — Upgrade System (+0 → +10)

### 1. Identitate
- **Nume:** Upgrade System
- **Scop:** Upgrade-ul părților de cărți între dueluri
- **Categorii:** progression, upgrade
- **Dependențe:** SYS-001, SYS-003

### 2. Data
```
Upgrade:
├── part: PartDefinition
├── current_level: int (0-10)
├── max_level: 10
├── dust_cost_per_level: int
└── stat_multiplier_per_level: float
```

### 3. Logică
- O parte poate fi upgrade-uită până la +10
- Upgrade-ul mărește puterea (damage, HP, efect)
- Raritatea nu se schimbă — un Rare +10 rămâne Rare
- Costă Dust (se obține din dezasamblare părți)

### 4. UI
- Part card cu nivel afișat (+0, +1, etc.)
- Buton Upgrade + cost
- Preview: cum va fi partea după upgrade

### 5. Network
- Progresia e salvată pe server
- Serverul validează costul

### 6. Config
- Cost per level
- Stat increase per level (formulă)
- Dust obținut din dezasamblare

### 7. Implementation (TypeScript + PixiJS)
```
src/features/upgrade/
├── UpgradeManager.ts
├── UpgradeUI.ts
└── PartCard.ts (with level display)
```

### 8. Testare
- [ ] Poți upgrade o parte +0 → +1
- [ ] Costul e corect
- [ ] Stats cresc după upgrade
- [ ] O parte +10 nu mai poate fi upgrade-uită

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-013 — Treire (Durability)

### 1. Identitate
- **Nume:** Treire / Durability
- **Scop:** Părțile au durabilitate limitată — se degradează cu folosirea
- **Categorii:** progression, economy
- **Dependențe:** SYS-003, SYS-012

### 2. Data
```
Durability:
├── max_durability: int (ex: 10 dueluri)
├── current_durability: int
├── decay_per_duel: int (1)
├── broken_state: bool
└── repair_cost: int
```

### 3. Logică
- După fiecare duel, părțile folosite pierd 1 durabilitate
- Când durabilitatea ajunge la 0, partea e "treită" (nu mai poate fi folosită)
- Poate fi reparată (costă gold sau materiale)
- Upgrade-ul poate crește durabilitatea maximă

### 4. UI
- Durabilitate afișată pe parte (ex: 8/10)
- Culoare: verde > 50%, galben 25-50%, roșu < 25%
- Avertisment când o parte e aproape treită

### 5. Network
- Durabilitatea e salvată pe server
- Serverul decrementează după duel

### 6. Config
- Durabilitate maximă per raritate
- Decay per duel
- Cost reparație

### 7. Implementation (TypeScript + PixiJS)
```
src/features/durability/
├── DurabilityManager.ts
├── DurabilityIndicator.ts
└── RepairUI.ts
```

### 8. Testare
- [ ] O parte nouă are durabilitate maximă
- [ ] După un duel, scade cu 1
- [ ] La 0, partea e marcată "treită"
- [ ] Reparația o readuce la durabilitate maximă

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-014 — Economy

### 1. Identitate
- **Nume:** Economy System
- **Scop:** Gestionarea resurselor — **P1: doar coins.** Essence, Dust, Gems → P5+
- **Categorii:** economy, foundation
- **Dependențe:** SYS-001

### 2. Data
```
P1 — Economie simplă:
└── coins: int (se primesc la fiecare rundă în duel)

P5+ — Economie completă:
├── gold: int (principală)
├── essence: int (specială, pentru blueprint-uri)
├── dust: int (pentru upgrade)
└── gems: int (premium / drops rare)
```

### 3. Logică
- **P1:** Coins se primesc la începutul fiecărei runde. Se cheltuie în shop. Atât.
- **P5+:** Gold, Essence, Dust, Gems, blueprint-uri, upgrade, crafting.
- Fiecare tranzacție e semnată HMAC (anti-cheat) — doar în P5+

### 4. UI
- Balance afișat în top bar
- Animații când câștigi/cheltui

### 5. Network
- Serverul e autoritar pentru balanță
- HMAC signing pentru fiecare tranzacție
- Audit DB (append-only log)

### 6. Config
- Gold per win
- Gold per loss
- Drop rates per raritate
- Gem exchange rate (dacă există)

### 7. Implementation (TypeScript + PixiJS)
```
src/features/economy/
├── CurrencyManager.ts
├── EconomyUI.ts
├── Transaction.ts
└── HmacSigner.ts
```

### 8. Testare
- [ ] Tranzacțiile sunt înregistrate
- [ ] Balanța nu poate fi negativă
- [ ] HMAC semnătura e validată
- [ ] Audit log e append-only

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-015 — Player Profile

### 1. Identitate
- **Nume:** Player Profile
- **Scop:** Toate datele persistente ale jucătorului
- **Categorii:** data, persistence
- **Dependențe:** SYS-014

### 2. Data
```
PlayerProfile:
├── player_id: String
├── username: String
├── rank: int
├── rating: int
├── gold: int
├── essence: int
├── dust: int
├── gems: int
├── owned_parts: Array[PartDefinition] (î îndreptar)
├── unlocked_blueprints: Array[BlueprintDefinition]
├── professions: Dictionary { profession_id: level }
├── upgrade_levels: Dictionary { part_id: int }
├── win_count: int
├── loss_count: int
└── last_login: DateTime
```

### 3. Logică
- Se salvează după fiecare acțiune importantă
- Se încarcă la login
- Backup periodic

### 4. UI
- Profile screen: stats, rank, collection

### 5. Network
- Profilul e pe server
- Clientul face request-uri (get/update)

### 6. Config
- Salvarea automată la interval
- Backup frequency

### 7. Implementation (TypeScript + PixiJS)
```
src/features/profile/
├── PlayerProfile.ts
├── ProfileUI.ts
└── StatsDisplay.ts
```

### 8. Testare
- [ ] Profilul se salvează corect
- [ ] După reload, datele sunt restaurate
- [ ] Rank-ul se actualizează după duel

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-016 — Matchmaking + Lobby

### 1. Identitate
- **Nume:** Matchmaking & Lobby
- **Scop:** Găsește adversari, creează conexiunea
- **Categorii:** network, pvp
- **Dependențe:** SYS-015

### 2. Data
```
Matchmaking:
├── queue: Array[PlayerProfile]
├── rating_range: int (cât de flexibil e)
├── max_wait_time: int (secunde)
└── match_found: bool

Lobby:
├── player1: PlayerProfile
├── player2: PlayerProfile
├── status: enum { CONNECTING, READY, IN_GAME }
└── connection_info: Dictionary
```

### 3. Logică
- Jucătorul intră în coadă
- Sistemul caută adversar cu rating similar
- După un timeout, lărgește căutarea
- Când găsește match, creează lobby
- Ambii jucători confirmă → începe jocul

### 4. UI
- Queue screen: timp estimat, anulează
- Match found: animație, countdown
- Lobby: nume adversar, status

### 5. Network
- Serverul menține coada
- WebSocket pentru comunicare în timp real
- Timeout handling (dacă un jucător nu confirmă)

### 6. Config
- Max wait time
- Rating range initial
- Rating range expansion per timeout

### 7. Implementation (TypeScript + PixiJS)
```
src/features/network/
├── Matchmaking.ts
├── Lobby.ts
├── QueueUI.ts
└── LobbyUI.ts
```

### 8. Testare
- [ ] Poți intra în coadă
- [ ] Poți anula căutarea
- [ ] Match found → lobby creat
- [ ] Timeout → lărgește căutarea

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-017 — Game State Sync

### 1. Identitate
- **Nume:** Game State Sync
- **Scop:** Asigură că ambii jucători au aceeași stare a jocului
- **Categorii:** network, sync
- **Dependențe:** SYS-016

### 2. Data
```
SyncState:
├── game_id: String
├── current_state: enum (aleator)
├── round: int
├── player1_state: Dictionary
├── player2_state: Dictionary
├── last_sync_time: int
└── sync_interval: int (ms)
```

### 3. Logică
- Serverul e autoritar — toate deciziile se iau pe server
- Clientul trimite acțiuni (am cumpărat X, am plasat Y)
- Serverul validează și răspunde cu starea actualizată
- Sync la fiecare acțiune + periodic
- Dacă un client e deconectat, serverul așteaptă X secunde

### 4. UI
- Indicator de conexiune (verde, galben, roșu)
- Reconnect button

### 5. Network
- WebSocket persistent
- Mesaje cu sequence numbers (prevenim reordering)
- Timestamp pe fiecare mesaj

### 6. Config
- Sync interval
- Disconnect timeout
- Max reconnection attempts

### 7. Implementation (TypeScript + PixiJS)
```
src/features/network/
├── SyncManager.ts
├── NetworkMessage.ts
├── ConnectionIndicator.ts
└── ReconnectUI.ts
```

### 8. Testare
- [ ] Ambii jucători văd aceleași cărți
- [ ] Deconectare → reconnect → stare restaurată
- [ ] Serverul respinge acțiuni invalide

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-018 — Anti-Cheat & Security

### 1. Identitate
- **Nume:** Anti-Cheat & Security
- **Scop:** Prevenirea trișatului — server-authoritative
- **Categorii:** network, security
- **Dependențe:** SYS-017

### 2. Data
```
Security:
├── transaction_log: Array[Transaction] (append-only)
├── hmac_keys: Dictionary { player_id: key }
├── banned_players: Array[player_id]
└── suspicious_actions: Array[Action]
```

### 3. Logică
- Server-authoritative: serverul validează orice acțiune
- Clientul nu decide niciodată: damage, câștig, resurse
- Tranzacțiile sunt HMAC-signed
- Pattern detection pentru comportament suspect
- Audit DB — totul e înregistrat

### 4. UI
- — (invizibil)

### 5. Network
- Toată logica executabilă pe server
- Clientul doar trimite comenzi, serverul execută

### 6. Config
- HMAC key rotation
- Ban thresholds

### 7. Implementation (TypeScript + PixiJS)
```
src/features/security/
├── TransactionAudit.ts
├── HmacSigner.ts
└── (restul pe server, nu în client)
```

### 8. Testare
- [ ] O tranzacție falsificată e respinsă
- [ ] Audit log e complet
- [ ] Pattern detection marchează acțiuni suspecte

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-019 — UI Framework

### 1. Identitate
- **Nume:** UI Framework
- **Scop:** Sistemul de interfață — ecrane, ferestre, tranziții
- **Categorii:** ui, foundation
- **Dependențe:** nimic (independent)

### 2. Data
```
UISystem:
├── screens: Dictionary { screen_id: Scene }
├── current_screen: String
├── overlay_stack: Array[Overlay]
├── transitions: Dictionary { from_to: Animation }
└── theme: CardTheme
```

### 3. Logică
- Screen Manager — controlează ce ecran e activ
- Overlay System — pop-up-uri peste ecranul curent
- Tranziții între ecrane (fade, slide)
- Temă globală (culori, fonturi, stiluri)

### 4. UI
- Acest sistem e UI-ul însuși

### 5. Network
- — (UI e doar pe client)

### 6. Config
- Culori temă
- Fonturi
- Animații tranziții

### 7. Implementation (TypeScript + PixiJS)
```
src/ui/
├── ScreenManager.ts (Autoload)
├── screens/
│   ├── MainMenu.tscn + .ts
│   ├── Matchmaking.tscn + .ts
│   ├── RaceSelect.tscn + .ts
│   ├── BuyPhase.tscn + .ts
│   ├── Battle.tscn + .ts
│   ├── Results.tscn + .ts
│   └── Profile.tscn + .ts
├── overlays/
│   ├── Settings.tscn + .ts
│   └── ConfirmDialog.tscn + .ts
├── components/
│   ├── Button.ts
│   ├── CardDisplay.ts
│   └── HealthBar.ts
└── theme/
    └── cardweave_theme.json
```

### 8. Testare
- [ ] Tranzițiile între ecrane sunt smooth
- [ ] Overlay-ul nu blochează ecranul de dedesubt incorect
- [ ] Tema se aplică global

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-020 — Audio System

### 1. Identitate
- **Nume:** Audio System
- **Scop:** Muzică, efecte, voice
- **Categorii:** audio, polish
- **Dependențe:** SYS-019 (UI events)

### 2. Data
```
AudioSystem:
├── music: Dictionary { track_id: AudioStream }
├── sfx: Dictionary { sfx_id: AudioStream }
├── current_music: String
├── volume_music: float
├── volume_sfx: float
└── ambient: AudioStream (optional)
```

### 3. Logică
- Muzică pe strat diferit de efecte
- Crossfade între piese
- Sfaturi:
  - Buy Phase: muzică calmă, de strategie
  - Battle: muzică intensă, alertă
  - Main Menu: temă principală

### 4. UI
- Volume slider in Settings

### 5. Network
- — (doar client)

### 6. Config
- Volume default
- Mute on focus lost

### 7. Implementation (TypeScript + PixiJS)
```
src/features/audio/
├── AudioManager.ts (Autoload)
├── MusicPlayer.ts
├── SFXPlayer.ts
└── audio_files/
    ├── music/
    └── sfx/
```

### 8. Testare
- [ ] Muzica pornește la Main Menu
- [ ] Battle Phase schimbă muzica
- [ ] Efectele se aud la acțiuni (cumpărare, atac)
- [ ] Se poate da mute

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-021 — Results + Rewards

### 1. Identitate
- **Nume:** Results & Rewards
- **Scop:** Ecranul de final de rundă/run — recompense
- **Categorii:** progression, ui
- **Dependențe:** SYS-008, SYS-014

### 2. Data
```
Results:
├── round_result: enum { WIN, LOSE }
├── rewards: Array[Reward]
│   ├── gold_reward: int
│   ├── essence_reward: int
│   ├── part_drops: Array[PartDefinition]
│   └── blueprint_drop: BlueprintDefinition (rar)
├── rank_change: int
└── stats: Dictionary (damage dealt, shield absorbed, energy spent, etc.)
```

### 3. Logică
- La final de luptă, se calculează recompensele
- Win = gold + eventual drops
- Lose = gold mai puțin
- Streak-ul de win-uri bonus
- Rank se actualizează

### 4. UI
- Ecran cu recompense animate
- Buton "Next Round" sau "Back to Menu"

### 5. Network
- Serverul calculează recompensele
- Clientul doar le afișează

### 6. Config
- Gold per win/lose
- Drop rates (șanse per raritate)
- Streak bonus

### 7. Implementation (TypeScript + PixiJS)
```
src/features/results/
├── ResultsUI.ts
├── RewardAnimation.ts
└── StatsDisplay.ts
```

### 8. Testare
- [ ] Win → gold + posibil drops
- [ ] Lose → gold mai puțin
- [ ] Animațiile se termină → poți continua

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## Index

| ID | Sistem | Dependențe | Categorie |
|---|---|---|---|
| SYS-001 | Resource System | — | data |
| SYS-002 | Game State Machine | SYS-001 | core |
| SYS-003 | Part Inventory | SYS-001 | card |
| SYS-004 | Card Assembly (Snap) | SYS-001, SYS-005 | card |
| SYS-005 | Arena Slots | SYS-001, SYS-004 | battle |
| SYS-006 | Shop + Buy Phase | SYS-001, SYS-003, SYS-005 | economy |
| SYS-007 | Duel System | SYS-004, SYS-005, SYS-006 | battle |
| SYS-008 | Match Manager | SYS-007 | progression |
| SYS-009 | Race Selection | SYS-001 | progression |
| SYS-010 | Profession System | SYS-001, SYS-009 | progression |
| SYS-011 | Blueprint System | SYS-001, SYS-010 | progression |
| SYS-012 | Upgrade System | SYS-001, SYS-003 | progression |
| SYS-013 | Treire (Durability) | SYS-003, SYS-012 | progression |
| SYS-014 | Economy | SYS-001 | economy |
| SYS-015 | Player Profile | SYS-014 | data |
| SYS-016 | Matchmaking + Lobby | SYS-015 | ❌ removed (offline-first) |
| SYS-017 | Game State Sync | SYS-016 | ❌ removed (offline-first) |
| SYS-018 | Anti-Cheat | SYS-017 | ❌ removed (offline-first) |
| SYS-019 | UI Framework | — | ui |
| SYS-020 | Audio System | SYS-019 | audio |
| SYS-021 | Results + Rewards | SYS-008, SYS-014 | progression |
| SYS-022 | Infinite Leveling | SYS-015 | progression |
| SYS-023 | Rankings | SYS-015 | progression |
| SYS-024 | Tournament System | SYS-021 | feature |
| SYS-025 | Item System | SYS-001, SYS-010, SYS-012 | progression |
| SYS-026 | Tutorial / Onboarding | SYS-019 | feature |
| SYS-027 | Settings / Options | SYS-019 | feature |
| SYS-028 | Disconnect / Reconnect | SYS-017 | ❌ removed (offline-first) |
| SYS-029 | Collection Manager | SYS-003, SYS-025 | ui |
| SYS-030 | Friend System | — | ❌ removed (offline-first) |
| SYS-031 | Daily Rewards / Login Streak | SYS-021 | feature |
| SYS-032 | Report System | — | ❌ removed (offline-first) |
| SYS-033 | Achievement System | SYS-015 | progression |
| SYS-034 | Match History | — | ❌ removed (offline-first) |
| SYS-035 | Notification System | SYS-015 | feature |
| SYS-036 | Class System | SYS-001, SYS-009, SYS-025 | progression |
| SYS-037 | Character Card Pool + Compatibility | SYS-001, SYS-004, SYS-009 | card |
| SYS-038 | AI Opponent | SYS-007, SYS-009 | core |
| SYS-039 | Offline Save / Load | SYS-015 | data |
| SYS-040 | Quest Factory | SYS-021, SYS-038 | feature |

**Total: 40 sisteme** (6 removed, 34 active)

---

## SYS-022 — Infinite Leveling

### 1. Identitate
- **Nume:** Infinite Leveling System
- **Scop:** Fiecare caracter poate face level-up infinit, cu randament descrescător
- **Categorii:** progression, character
- **Dependențe:** SYS-015 (Player Profile)

### 2. Data
```
CharacterLevel:
├── character_id: String
├── level: int (începe de la 1, fără limită maximă)
├── current_xp: int
├── xp_to_next: int (crește cu nivelul)
├── total_stats_bonus: Dictionary 
│   ├── attack_bonus: float (per level)
│   ├── defense_bonus: float (per level)
│   └── skill_bonus: float (per level)
└── prestige_level: int (opțional, după X nivele)
```

### 3. Logică
- XP se câștigă din dueluri (câștigate sau pierdute)
- XP necesar per level crește exponențial
- Bonusurile per level scad după un punct (diminishing returns)
- Nivelul caracterului influențează puterea acestuia în duel

**Scaling:**
| Nivel | Bonus per level | XP needed | Notă |
|---|---|---|---|
| 1-10 | 100% (ex: +5 atk) | 100 × level | Creștere rapidă, satisfăcătoare |
| 11-50 | 50% | 500 × level | Creștere moderată |
| 51-100 | 25% | 2000 × level | Greu, doar pentru dedicați |
| 101+ | 10% | 10000 × level | Extrem de lent, simbol de statut |

### 4. UI
- Bara de XP sub caracter
- Level afișat cu efect vizual (glow, culoare, iconiță)
- Animație la level-up (satisfacție imediată)
- Tooltip: "Level 847 — bonus total: +3,420%"

### 5. Network
- Serverul calculează XP-ul (authoritative)
- Clientul afișează progresul

### 6. Config
- XP per win / loss
- XP multiplier per nivel
- Bonus per level per stat
- Cap la bonus (dacă există)

### 7. Implementation (TypeScript + PixiJS)
```
src/features/leveling/
├── LevelingManager.ts
├── XPBar.ts
├── LevelUpEffect.ts
└── CharacterLevelDisplay.ts
```

### 8. Testare
- [ ] Câștigi XP după duel
- [ ] La XP suficient, level-up
- [ ] Bonusurile se aplică corect
- [ ] Diminishing returns funcționează (bonus scade după nivel 10)
- [ ] Nivelul poate trece de 1000 fără bug-uri

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-023 — Rankings

### 1. Identitate
- **Nume:** Rankings / Leaderboard System
- **Scop:** Clasamente competitive — rating, win streak, level
- **Categorii:** progression, competitive
- **Dependențe:** SYS-015 (Player Profile), SYS-016 (Matchmaking)

### 2. Data
```
Rankings:
├── leaderboards: Dictionary
│   ├── by_rating: Array[RankedPlayer]
│   ├── by_win_streak: Array[RankedPlayer]
│   ├── by_highest_level: Array[RankedPlayer]
│   └── by_collection: Array[RankedPlayer]
├── player_rank: int (poziția curentă)
├── player_rating: int (ELO / Glicko)
├── season: int
└── season_end: DateTime
```

### 3. Logică
- Clasament pe mai multe criterii (rating, streak, level)
- Rating se actualizează după fiecare duel (sistem ELO-like)
- Sezoane competitive (reset periodic)
- Jucătorul își vede poziția și câți pași are până la următorul rang

### 4. UI
- Leaderboard screen
- Poziția curentă în header
- Animație când urci/cobori în rank

### 5. Network
- Serverul menține clasamentul
- Clientul face request-uri periodice
- Actualizare în timp real (WebSocket + polling)

### 6. Config
- K-factor (ELO sensitivity)
- Season duration
- Number of leaderboard entries displayed

### 7. Implementation (TypeScript + PixiJS)
```
src/features/rankings/
├── RankingManager.ts
├── LeaderboardUI.ts
├── RankingEntry.ts
└── SeasonTimer.ts
```

### 8. Testare
- [ ] După un duel, ratingul se actualizează
- [ ] Leaderboard-ul arată jucători în ordinea corectă
- [ ] La reset de sezon, rankingurile se resetează
- [ ] Poziția playerului e corectă în clasament

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

---

## SYS-024 — Tournament System

### 1. Identitate
- **Nume:** Tournament System
- **Scop:** Turnee automate — zilnice, săptămânale, lunare — cu rewards automate
- **Categorii:** feature, competitive
- **Dependențe:** SYS-016 (Matchmaking), SYS-021 (Results + Rewards)

### 2. Data
```
Tournament:
├── id: String
├── type: enum { DAILY, WEEKLY, MONTHLY }
├── start_time: DateTime
├── end_time: DateTime
├── status: enum { UPCOMING, ACTIVE, ENDED, REWARDS_SENT }
├── participants: Array[PlayerProfile]
├── points: Dictionary { player_id: int }
├── rewards: Dictionary { rank_range: Array[Reward] }
└── player_rank: int (poziția în turneu)
```

### 3. Logică
- Turneele sunt **automate** — nu necesită administrare manuală
- Jucătorul se înscrie cu un click
- În perioada turneului, fiecare win acordă **puncte de turneu**
- La final, rewards se distribuie automat pe baza rankului
- Punctaj: win = 10 puncte, lose = 2 puncte (participare)

| Turneu | Durată | Rewards | Matchmaking |
|---|---|---|---|
| **Daily** | 24h | Mici (gold, dust) | Pe același rank |
| **Weekly** | 7 zile | Medii (blueprint, părți Rare) | Pe rank ± 2 |
| **Monthly** | 28 zile | Mari (părți Legendare, exclusive, gems) | Global |

### 4. UI
- Tournament hub — lista turneelor active / viitoare
- Contor: cât timp mai e până la final
- Poziția curentă + câte puncte ai
- Preview rewards per poziție
- History: turneele anterioare și rankul obținut

### 5. Network
- Serverul gestionează tot (program, punctaj, rewards)
- Clientul face subscribe la tournament events
- La final, serverul calculează și trimite rewards automat

### 6. Config
- Daily: start hour, reward tiers
- Weekly: start day, reward tiers
- Monthly: start date, reward tiers
- Points per win/loss

### 7. Implementation (TypeScript + PixiJS)
```
src/features/tournaments/
├── TournamentManager.ts
├── TournamentHubUI.ts
├── TournamentEntry.ts
├── TournamentTimer.ts
├── RewardsPreview.ts
└── TournamentHistory.ts
```

### 8. Testare
- [ ] Turneul începe automat la ora stabilită
- [ ] Jucătorul se poate înscrie
- [ ] Punctele se adună corect după fiecare meci
- [ ] La final, rewards se distribuie automat
- [ ] Jucătorul primește notificare cu rankul final + rewards
- [ ] Daily se resetează, weekly se resetează, monthly se resetează

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-025 — Item System

### 1. Identitate
- **Nume:** Item System
- **Scop:** 3 sloturi (Weapon, Armor, Accessory) care modifică comportamentul cardurilor, nu stats
- **Categorii:** progression, equipment
- **Dependențe:** SYS-001 (Resource System), SYS-010 (Profession System), SYS-012 (Upgrade System)

### 2. Data
```
Item:
├── id: String
├── type: enum { WEAPON, ARMOR, ACCESSORY }
├── name: String
├── rarity: enum { Common→Mythic }
├── upgrade_level: int (0-10)
├── max_upgrade: int (variază după raritate)
├── recipe: Dictionary { material_id: count }
├── equipped_character: String
│
├── WEAPON properties:
│   ├── attack_pattern: String
│   ├── damage_modifier: float
│   ├── special: String
│   └── requirements: Dictionary { race: level }
│
├── ARMOR properties:
│   ├── damage_mitigation: Dictionary
│   │   ├── type: enum { DODGE, REDUCTION, REFLECT, HEAL, RETALIATE }
│   │   └── value: float
│   ├── special: String
│   └── requirements: Dictionary
│
└── ACCESSORY properties:
    ├── effect_type: enum { ECONOMY, INFORMATION, SYNERGY, RULE_CHANGE }
    ├── effect_description: String
    ├── cooldown: int
    └── requirements: Dictionary
```

### 3. Logică

**Filosofie:** Items nu concurează cu cardurile. Cardurile determină stats. Items determină comportamentul — CUM ataci, CUM iei damage, CE reguli se aplică.

**Weapon** — schimbă CUM ataci.

| Weapon | Efect | Rasă |
|---|---|---|
| 🗡️ Dagger | Atacă de 2 ori, damage -30% | Lycan, Void |
| 🛡️ Sword & Shield | Prima carte +50% damage | Knight |
| 🔮 Staff | Skill Rectangle ×2 | Eldritch, Fae |
| 🏹 Bow | Atacă cartea din spate | Void |
| ⚔️ Greatsword | Damage +100%, 1 atac/2 ture | Dragonkin, Construct |

**Armor** — schimbă CUM iei damage.

| Armor | Efect | Rasă |
|---|---|---|
| 🧥 Leather | Dodge 20% | Lycan, Void |
| ⛓️ Chainmail | Damage -30% | Construct, Knight |
| 🧙 Robe | +1 energie la start | Eldritch, Celestial |
| 🩸 Blood Armor | 10% damage → heal | Vampire |
| 🪦 Bone Armor | La fiecare atac primit → 3 damage retur | Necro |

**Accessory** — schimbă REGULILE.

| Accessory | Efect |
|---|---|
| 💍 Ring of Haste | Buy Phase -10s, +2 coins |
| 📿 Amulet of Insight | Vezi inventarul adversarului |
| 🎭 Mask of Deception | 1 rerol gratis/rundă |
| ⏳ Hourglass | 25% energie între ture |
| 🔥 Ember Core | Dragonkin -1 energie cost |
| 🧊 Frost Pearl | Prima carte adversă înghețată |
| 🌑 Void Stone | 1×/run, înlocuiești o carte din shop |
| 💀 Necronomicon | 10% Skill Rectangle ×2 |

### 4. UI
- 3 sloturi în Character Screen
- Fiecare item: nume, raritate, upgrade level, efect
- Crafting UI: rețetă + materiale
- Upgrade UI: același ca la card parts
- Efectele vizibile în Battle

### 5. Network
- Serverul salvează items în Player Profile
- La început de duel, validează items echipate
- Efectele se aplică server-side

### 6. Config
- Crafting recipes
- Upgrade cost per level
- Rarity scaling
- Material drop rates

### 7. Implementation (TypeScript + PixiJS)
```
src/features/items/
├── Item.ts
├── WeaponItem.ts
├── ArmorItem.ts
├── AccessoryItem.ts
├── ItemManager.ts
├── InventoryUI.ts
├── CraftingUI.ts
├── UpgradeUI.ts
├── EquipmentSlotsUI.ts
├── ItemEffectHandler.ts
└── data/
    ├── weapons/
    ├── armors/
    └── accessories/
```

### 8. Testare
- [ ] Echipezi item → efectul se aplică
- [ ] Dezechipat → efectul dispare
- [ ] Weapon schimbă atacul
- [ ] Armor modifică damage-ul
- [ ] Accessory schimbă reguli
- [ ] Upgrade → efect îmbunătățit
- [ ] Items nu se suprapun cu card parts

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-026 — Tutorial / Onboarding

### 1. Identitate
- **Nume:** Tutorial / Onboarding
- **Scop:** Ghidează jucătorul nou
- **Categorii:** feature
- **Dependențe:** SYS-019

### 2. Data
```
Tutorial:
├── stages: Array[TutorialStage] (7 stagii)
├── current_stage: int
├── completed: bool
└── skip_available: bool
```

### 3. Logică
- Primul login → tutorial obligatoriu
- Fiecare stage explică + jucătorul face acțiunea
- Poate fi skinppat
- Rejucabil din Settings

### 4. UI
- Overlay cu săgeți + text
- Highlight pe element
- Buton Skip + progress bar

### 5. Network
- Client-side

### 6. Config
- Force on first login

### 7. Implementation (TypeScript + PixiJS)
```
src/features/tutorial/
├── TutorialManager.ts
├── TutorialStage.ts
├── TutorialOverlay.tscn
└── stages/
```

### 8. Testare
- [ ] Primul login → tutorial pornește
- [ ] Skip → se închide
- [ ] Rejucabil din Settings

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-027 — Settings / Options

### 1. Identitate
- **Nume:** Settings / Options
- **Scop:** Configurarea jocului
- **Categorii:** feature
- **Dependențe:** SYS-019

### 2. Data
```
Settings:
├── audio: { music_volume, sfx_volume }
├── graphics: { quality, resolution, fullscreen, vsync }
├── gameplay: { language, region }
├── account: { player_name, delete_account }
└── controls: { touch_settings }
```

### 3. Logică
- Se salvează local + server
- Se aplică instant
- Reset to Default

### 4. UI
- Tab-uri: Audio, Graphics, Gameplay, Account

### 5. Network
- Account settings pe server
- Restul local

### 6. Config
- Default values

### 7. Implementation (TypeScript + PixiJS)
```
src/features/settings/
├── SettingsManager.ts (Autoload)
└── SettingsUI.tscn
```

### 8. Testare
- [ ] Volumul se schimbă în timp real
- [ ] Fullscreen toggle
- [ ] Persistă între sesiuni

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-028 — Disconnect / Reconnect

### 1. Identitate
- **Nume:** Disconnect / Reconnect
- **Scop:** Gestionează pierderea conexiunii
- **Categorii:** network
- **Dependențe:** SYS-017

### 2. Data
```
Reconnect:
├── max_disconnect_time: int
├── game_paused: bool
├── reconnection_attempts: int
└── last_sync_state: Dictionary
```

### 3. Logică
- Serverul detectează disconnect
- Jocul pauzat X secunde
- La reconnect → ultimul sync state
- Timeout → lose

### 4. UI
- Ecran "Reconnecting..."
- Timer
- Buton Cancel → forfeit

### 5. Network
- Serverul menține starea X secunde
- La reconnect → starea completă

### 6. Config
- Max disconnect time
- Max attempts

### 7. Implementation (TypeScript + PixiJS)
```
src/features/network/
├── ReconnectManager.ts
├── ReconnectUI.tscn
└── ConnectionMonitor.ts
```

### 8. Testare
- [ ] Disconnect → ecran reconnecting
- [ ] Reconectare → continuă
- [ ] Timeout → lose

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-029 — Collection Manager

### 1. Identitate
- **Nume:** Collection Manager
- **Scop:** Vizualizarea părților, cărților, item-ilor
- **Categorii:** ui
- **Dependențe:** SYS-003, SYS-025

### 2. Data
```
Collection:
├── all_parts: Array[PartDefinition]
├── all_items: Array[Item]
├── filters: { race, rarity, type, upgrade }
├── sort: enum
└── search: String
```

### 3. Logică
- Arată tot ce deții
- Filtrare + căutare
- Dezasamblare → dust
- Echipare/dezechipare

### 4. UI
- Grid cu carduri
- Click → detalii
- Butoane: Echipa, Dezasamblează, Upgrade

### 5. Network
- Colecția pe server
- Clientul face request la login

### 6. Config
- Max inventory size

### 7. Implementation (TypeScript + PixiJS)
```
src/features/collection/
├── CollectionManager.ts
├── CollectionUI.tscn
├── CollectionCard.ts
├── CollectionFilters.ts
└── DisassembleUI.ts
```

### 8. Testare
- [ ] Toate părțile afișate
- [ ] Filtrele funcționează
- [ ] Dezasamblare corectă

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-030 — Friend System

### 1. Identitate
- **Nume:** Friend System
- **Scop:** Adăugare prieteni, provocare directă
- **Categorii:** feature
- **Dependențe:** SYS-015, SYS-016

### 2. Data
```
FriendSystem:
├── friends: Array[PlayerProfile]
├── pending_requests: Array[PlayerProfile]
├── blocked: Array[player_id]
└── online_status: Dictionary
```

### 3. Logică
- Cauți jucători după nume
- Trimiți cerere
- Accept/Refuză
- Provocare directă

### 4. UI
- Friends list
- Add Friend
- Buton Challenge

### 5. Network
- Pe server
- WebSocket pentru status

### 6. Config
- Max friends

### 7. Implementation (TypeScript + PixiJS)
```
src/features/social/
├── FriendManager.ts
├── FriendListUI.tscn
├── AddFriendUI.ts
└── ChallengeUI.ts
```

### 8. Testare
- [ ] Cerere → accept → listă
- [ ] Provocare funcționează
- [ ] Blocare funcționează

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-031 — Daily Rewards / Login Streak

### 1. Identitate
- **Nume:** Daily Rewards / Login Streak
- **Scop:** Recompense zilnice pentru login consecutiv
- **Categorii:** feature
- **Dependențe:** SYS-021

### 2. Data
```
DailyRewards:
├── streak: int
├── last_login: DateTime
├── claimed_today: bool
└── rewards: Array[Reward] (7 zile, ciclu)
```

### 3. Logică
- Login → recompensă
- Consecutiv → streak++
- Sari o zi → streak = 0
- Ziua 7 → reward mare + reset

### 4. UI
- Pop-up la primul login
- Arată ziua curentă
- Claim + animație

### 5. Network
- Serverul salvează streak
- Validează claim

### 6. Config
- Rewards per day

### 7. Implementation (TypeScript + PixiJS)
```
src/features/daily/
├── DailyRewardsManager.ts
├── DailyRewardsUI.tscn
└── RewardAnimation.ts
```

### 8. Testare
- [ ] Login → recompensă
- [ ] Streak crește
- [ ] Sari o zi → streak = 0

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-032 — Report System

### 1. Identitate
- **Nume:** Report System
- **Scop:** Raportarea jucătorilor toxici
- **Categorii:** feature
- **Dependențe:** SYS-015

### 2. Data
```
Report:
├── reporter_id, reported_id, match_id
├── reason: enum
├── description: String
├── status: enum
└── timestamp
```

### 3. Logică
- După duel, raportezi adversarul
- Motiv + descriere
- Serverul stochează

### 4. UI
- Buton Report în Results
- Pop-up cu motive

### 5. Network
- Serverul stochează
- Auto-flag la X reporturi

### 6. Config
- Reports per day limit

### 7. Implementation (TypeScript + PixiJS)
```
src/features/moderation/
├── ReportManager.ts
└── ReportUI.tscn
```

### 8. Testare
- [ ] Poți raporta după duel
- [ ] Reportul ajunge pe server

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-033 — Achievement System

### 1. Identitate
- **Nume:** Achievement System
- **Scop:** Obiective pe termen lung cu recompense
- **Categorii:** progression
- **Dependențe:** SYS-015

### 2. Data
```
Achievement:
├── id, name, description
├── category: enum
├── requirement: { type, target }
├── reward: Reward
├── progress, completed
└── hidden: bool
```

### 3. Logică
- Se verifică automat
- La target → achievement + reward
- Unele ascunse
- Lanțuri (N1→N2→N3)

### 4. UI
- Achievement screen
- Animație la deblocare
- Count: "23/50"

### 5. Network
- Serverul salvează și dă reward

### 6. Config
- Lista completă

### 7. Implementation (TypeScript + PixiJS)
```
src/features/achievements/
├── AchievementManager.ts
├── AchievementUI.tscn
├── AchievementCard.ts
├── AchievementPopup.ts
└── data/achievements.json
```

### 8. Testare
- [ ] Progresul crește corect
- [ ] La target → reward
- [ ] Ascunse invizibile

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-034 — Match History

### 1. Identitate
- **Nume:** Match History
- **Scop:** Istoric dueluri + statistici
- **Categorii:** feature
- **Dependențe:** SYS-007, SYS-015

### 2. Data
```
MatchRecord:
├── match_id, timestamp
├── opponent_name, opponent_race
├── result, round_count
├── damage dealt/taken
├── race_used, items_used
├── rating_change
└── battle_replay_id
```

### 3. Logică
- După duel → record
- Istoric 50-100
- Win rate calculat

### 4. UI
- Listă cronologică
- Click → detalii

### 5. Network
- Serverul salvează
- Clientul request paginat

### 6. Config
- Max history entries

### 7. Implementation (TypeScript + PixiJS)
```
src/features/history/
├── MatchHistoryManager.ts
├── MatchHistoryUI.tscn
├── MatchEntry.ts
└── MatchDetailUI.ts
```

### 8. Testare
- [ ] După duel → în istoric
- [ ] Win rate corect

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-035 — Notification System

### 1. Identitate
- **Nume:** Notification System
- **Scop:** Notificări în joc pentru evenimente
- **Categorii:** feature
- **Dependențe:** SYS-015

### 2. Data
```
Notification:
├── id, type: enum { FRIEND, MATCH, TOURNAMENT, DAILY, ACHIEVEMENT, RANK }
├── title, body
├── action_data: Dictionary
├── read, created_at, expires_at
└── icon: String
```

### 3. Logică
- Serverul generează
- Se afișează în joc (toast)
- Expiră

### 4. UI
- Bell icon + badge
- Dropdown
- Click → acțiune

### 5. Network
- Serverul generează
- Clientul polling/WS

### 6. Config
- Max notifications
- Auto-expire

### 7. Implementation (TypeScript + PixiJS)
```
src/features/notifications/
├── NotificationManager.ts (Autoload)
├── NotificationUI.tscn
├── NotificationToast.ts
└── NotificationList.ts
```

### 8. Testare
- [ ] Notificare la friend request
- [ ] Badge corect
- [ ] Click → acțiune

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-036 — Class System

### 1. Identitate
- **Nume:** Class System
- **Scop:** 6 clase care determină items echipabili și bonus pasiv
- **Categorii:** progression
- **Dependențe:** SYS-001 (Resource), SYS-009 (Race), SYS-025 (Items)

### 2. Data
```
ClassDefinition:
├── id: enum { BERSERKER, ASSASSIN, MAGE, TANK, SUPPORT, RANGER }
├── name: String
├── allowed_weapons: Array
├── allowed_armors: Array
├── passive_bonus: Dictionary
├── unlocked: bool
├── respec_cost: int
└── level_requirement: int
```

### 3. Logică
- Rasă = pool de părți. Clasă = items + bonus pasiv.
- Clasa se alege după rasă, înainte de duel.
- Poate fi schimbată între dueluri (cost gold).

| Clasă | Weapon | Armor | Bonus |
|---|---|---|---|
| ⚔️ Berserker | Greatsword | Chainmail | +damage când HP < 50% |
| 🗡️ Assassin | Dagger, Bow | Leather | Primul atac ×2 |
| 🔮 Mage | Staff | Robe | Skill Rectangle ×2 |
| 🛡️ Tank | Sword & Shield | Chainmail | Protejează aliatele |
| 💉 Support | Staff | Robe | Heal 5%/tură |
| 🏹 Ranger | Bow | Leather | Atacă spatele |

### 4. UI
- Class Selection după Race Selection
- Fiecare clasă arată items + bonus
- Respec button în Character Screen

### 5. Network
- Clasa pe server. Validează items echipabile.

### 6. Config
- Respec cost, level requirements, bonus values

### 7. Implementation (TypeScript + PixiJS)
```
src/features/classes/
├── ClassDefinition.ts
├── ClassManager.ts
├── ClassSelectionUI.tscn
└── ClassCard.ts
```

### 8. Testare
- [ ] După rasă → alegi clasă
- [ ] Fiecare clasă are items + bonus diferit
- [ ] Schimbarea clasei costă gold
- [ ] Bonusul se aplică în battle

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-037 — Character Card Pool + Compatibility

### 1. Identitate
- **Nume:** Character Card Pool + Compatibility
- **Scop:** Fiecare caracter are un set propriu de cărți → părțile lor apar în shop. Părțile din cărți diferite pot fi combinate cu bonus/penalty de compatibilitate.
- **Categorii:** card, character
- **Dependențe:** SYS-001 (Resources), SYS-004 (Card Assembly), SYS-009 (Races)

### 2. Data
```
CharacterCardPool:
├── character_id: String
├── owned_cards: Array[CardDefinition] (5-15 cărți per caracter)
│   └── CardDefinition:
│       ├── card_id: String
│       ├── name: String
│       ├── theme: String
│       ├── rarity: enum
│       └── parts: CardParts (6 părți)
│
├── parts_pool: Array[PartDefinition] (toate părțile)

CompatibilityRules:
├── pair_bonuses: Dictionary
│   └── { themeA + themeB: score }
│       Ex: "vampire_bite"+"shadow_magic" → 0.7
│       Ex: "vampire_bite"+"dragon_fire" → 0.2
│       Ex: aceeași carte → 1.0
├── rarity_match: Dictionary
│   └── 0 diff → +10%, 1 diff → 0%, 2+ diff → -15%
└── same_card_bonus: 1.2 (+20%)
```

### 3. Logică

**Card Pool:** Fiecare caracter are 5-15 cărți proprii (vezi [`CHARACTERS_v1.md`](./CHARACTERS_v1.md) pentru cele 10 caractere inițiale). Fiecare carte → 6 părți. Shop-ul trage doar din acest pool. Deblochezi cărți → mai multe părți disponibile.

**Compatibilitate:** Când asamblezi o carte din părți care vin din cărți diferite, sistemul calculează Synergy Score:
- Same Card Bonus: +20% dacă toate 6 părțile sunt din aceeași carte
- Theme Match: cât de bine se potrivesc temele
- Rarity Balance: penalizare la diferență mare de raritate
- Completeness: bonus pentru câte părți din aceeași carte

| Scenariu | Synergy | Efect |
|---|---|---|
| Toate 6 părți din aceeași carte | 100% | ×1.2 |
| 4 din A, 2 din B (teme similare) | 85% | ×1.1 |
| 3 din A, 3 din B (teme diferite) | 50% | ×1.0 |
| Amestec haotic (4+ teme) | 20% | ×0.8 |

### 4. UI
- Card Collection per caracter
- În shop, părțile arată numele cărții sursă
- La asamblare, Synergy Score vizual (verde/galben/roșu)

### 5. Network
- Serverul salvează cărțile deblocate per caracter
- Validează compatibilitatea

### 6. Config
- Cărți inițiale per caracter
- Synergy multipliers
- Rarity mismatch penalties

### 7. Implementation (TypeScript + PixiJS)
```
src/features/character_pool/
├── CharacterCardPool.ts
├── CardDefinition.ts
├── CompatibilityCalculator.ts
├── CardCollectionUI.tscn
├── SynergyIndicator.ts
└── data/characters/
```

### 8. Testare
- [ ] Fiecare caracter → propriile cărți → părți în shop
- [ ] Aceeași carte → bonus
- [ ] Teme similare → bonus mic
- [ ] Teme total diferite → penalty
- [ ] Rarități diferite → penalty
- [ ] Carte nouă deblocată → părți noi

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-13 | Versiune inițială |

---

## SYS-038 — AI Opponent

### 1. Identitate
- **Nume:** AI Opponent
- **Scop:** Adversar controlat de AI care joacă împotriva jucătorului
- **Categorii:** core
- **Dependențe:** SYS-007 (Battle), SYS-009 (Races), Cardinal Engine

### 2. Data
```
P1 — Opponent simplu (vezi CARDINAL_ENGINE.md §11):
├── dna: { aggression, defense, economy, synergy }
├── race: RaceDefinition
├── budget: int (coins per round)
└── scoring_fn: WeightedRandomSelection

P3+ — Opponent complet (vezi CARDINAL_ENGINE.md §3-4):
├── dna: { 10 parametri + flow governor }
├── player_profile: IndexedDB
├── evolution: Genetic Algorithm
└── capabilities: { archaeology, tutor, quest }
```

### 3. Logică
- **P1:** AI-ul folosește WeightedRandomSelection pe 4 parametri ADN. Fără profil de jucător. Fără evoluție. Un opponent random per run.
- **P3:** AI-ul construiește profil jucător + Flow Governor. 10 parametri ADN.
- **P4+:** Genetic Algorithm, Dynamic Archaeology, Tutor, Empty Chair.
- AI-ul nu trișează — respectă aceleași reguli ca jucătorul

### 4. UI
- Numele adversarului + rasa
- Animații care arată că adversarul "se pregătește"

### 5. Network
- — (local)

### 6. Config
- Strategii per dificultate
- Adaptive difficulty curve

### 7. PixiJS
```
src/cardinal/ai/
├── AIOpponent.ts
├── AIStrategy.ts
└── AIDifficulty.ts
```

### 8. Testare
- [ ] AI-ul cumpără părți și asamblează cărți
- [ ] AI-ul plasează cărți pe grid
- [ ] AI-ul face battle
- [ ] Dificultatea se simte diferită per nivel

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-18 | Versiune inițială |

---

## SYS-039 — Offline Save / Load

### 1. Identitate
- **Nume:** Offline Save / Load
- **Scop:** Salvează și încarcă progresul local
- **Categorii:** data
- **Dependențe:** SYS-015 (Player Profile)

### 2. Data
```
SaveData:
├── player_profile: PlayerProfile
├── owned_cards: Array[CardDefinition]
├── progression: { level, xp, professions }
└── settings: Settings
```

### 3. Logică
- Salvare automată după fiecare acțiune importantă
- Backup la fiecare login
- Stocare în IndexedDB (web) / fișier local (Tauri)

### 4. Testare
- [ ] Progresul se salvează
- [ ] La reload, progresul e restaurat
- [ ] Backup funcționează

### 5. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-18 | Versiune inițială |

---

## SYS-040 — Quest Factory (Cardinal)

### 1. Identitate
- **Nume:** Quest Factory
- **Scop:** Generare procedurală de quest-uri cu recompense și penalizări
- **Categorii:** feature
- **Dependențe:** SYS-021 (Rewards), SYS-038 (AI Opponent)

### 2. Data
```
Quest:
├── id, title, description
├── objective: { type, target, current }
├── reward: Reward
├── penalty: { type, value }
├── time_limit: int
└── difficulty: enum
```

### 3. Logică
- Quest-uri generate procedural pe baza progresului
- Dacă nu sunt completate la timp → penalizare
- Zilnice, săptămânale, run-bound
- Cardinal alege tipul pe baza comportamentului jucătorului

### 4. Testare
- [ ] Quest generat → completat → reward
- [ ] Quest necompletat → penalizare
- [ ] Cardinal evită repetiția

### 5. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-18 | Versiune inițială |

---

## SYS-041 — Buff/Debuff System

> Documentație completă: [`BUFF_DEBUFF_SYSTEM.md`](./BUFF_DEBUFF_SYSTEM.md)

### 1. Identitate
- **Nume:** Buff / Debuff System
- **Scop:** Sistem unitar pentru toate efectele temporare din timpul duelului
- **Categorii:** battle, content
- **Dependențe:** SYS-007 (Duel System), SYS-025 (Item System)
- **Blueprint:** Toate buff-urile/debuff-urile folosesc același schelet (vezi documentația dedicată)

### 2. Data
```
StatusEffect:
├── id: String
├── display_name: String
├── type: enum { BUFF, DEBUFF, NEUTRAL }
├── category: enum { ENERGY, ATTACK, DEFENSE, HP, CONTROL, SYNERGY }
├── tags: Array[String] (fire, ice, dark, holy, poison, bleed, ...)
├── target: enum { SELF_CHAR, OPPONENT_CHAR, SELF_CARD, ALLY_CARDS, ALL_CARDS }
├── trigger:
│   ├── type: enum { ON_START, ON_ATTACK, ON_HIT, ON_TIMER, ON_STACK_THRESHOLD, PERMANENT }
│   ├── chance: float (0.0–1.0)
│   └── condition: String (opțional)
├── effect:
│   ├── effect_type: enum (DAMAGE_OVER_TIME, HEAL_OVER_TIME, STAT_MOD, SHIELD, STUN, etc.)
│   ├── base_value: float
│   ├── duration: float (secunde)
│   ├── interval: float (secunde între tick-uri)
│   └── rarity_scaling: Array[float]
├── stacking:
│   ├── mode: enum { UNIQUE, ADDITIVE, MULTIPLICATIVE, THRESHOLD }
│   ├── max_stacks: int
│   └── on_max_stacks: { action: String, value: float }
├── affinities:
│   ├── races: Dictionary { race_id: multiplier }
│   ├── classes: Dictionary { class_id: { stat: modifier } }
│   └── items: Dictionary { item_tag: modifier }
└── visual:
    ├── icon: String
    ├── color: String
    └── particle: String
```

### 3. Logică
- Fiecare carte în duel poate aplica **un efect principal** (din Skill Rectangle)
- Items (Weapon/Armor/Accessory) pot adăuga **efecte secundare**
- Efectele sunt **structuri de date**, nu cod separat per efect
- Stacking rules: Unique (nu se cumulează), Additive (se adună), Multiplicativ (se înmulțesc), Threshold (declanșare la X stack-uri)
- Buff și debuff de același tip pe aceeași țintă → prevalează cel mai puternic
- Toate efectele se scalează cu raritatea și Synergy Score

### 4. Catalog Efecte (7 categorii)

| Categorie | Efecte principale |
|---|---|
| **Energy** | Energy Boost, Energy Leech, Energy Slow, Energy Surge, Overcharge, Drain |
| **Attack** | Haste, Slow, Freeze, Berserk, Lethargy |
| **Damage** | Power, Fragile, Burn, Poison, Bleed, Corrosion, Amplify |
| **Defense** | Barrier, Fortify, Thorns, Vulnerable, Shield Break, Weaken |
| **HP** | Regeneration, Lifesteal, Wound, Siphon, Revitalize, Decay |
| **Control** | Stun, Silence, Taunt, Disarm, Sleep |
| **Synergy** | Empower, Echo, Chain, Curse, Blessing |

### 5. UI
- Icon pe card pentru efectele aplicate
- Barră de status effects lângă HP bar
- Stack counter vizibil (pentru efecte stivuibile)
- Animații particle la aplicare/expirare

### 6. Network
- Serverul calculează și syncronizează toate status effects
- Clientul doar rulează animațiile vizuale

### 7. Config
- Valori implicite per efect în blueprint
- Scaling per raritate
- Stack limits
- Durate implicite

### 8. Testare
- [ ] Burn: 3 damage/sec pentru 6s → scade corect HP
- [ ] Haste: -20% attack interval → atacă mai des
- [ ] Stun: 2s → cardul nu atacă
- [ ] Silence: Skill Rectangle dezactivat
- [ ] Stacking: 3× Poison → 3× damage
- [ ] Threshold: 5× Burn → explode
- [ ] Affinități: Dragonkin face ×3 fire damage
- [ ] Buff vs Debuff: Haste + Slow → câștigă cel mai puternic

### 9. Istoric
| Dată | Schimbare |
|---|---|
| 2026-07-20 | Versiune inițială — blueprint + catalog complet |

---

## Implementation Roadmap

### Faza 0 — Fundația

| Ordine | Sistem | Motiv |
|---|---|---|
| 0.1 | SYS-001 Resource System | Toate datele jocului |
| 0.2 | SYS-019 UI Framework (PixiJS) | Ecrane, butoane, text |
| 0.3 | SYS-002 Game State Machine | Flow-ul jocului |
| 0.4 | SYS-020 Audio System | Muzică + efecte |

### Faza 1 — Nucleul Gameplay

| Ordine | Sistem / Feature | Motiv |
|---|---|---|
│ 1.1 | SYS-005 Arena Slots | Sloturi + subsloturi + snap |
| 1.2 | SYS-003 Part Inventory | Ai părți, le vezi |
| 1.3 | SYS-009 Race Selection | Alegi rasa |
| 1.4 | SYS-004 Card Assembly | Asamblezi o carte |
| 1.5 | SYS-036 Class System | Alegi clasa |

**Notă:** La Faza 1, folosești **date hardcodate de test** (o rasă, o clasă, câteva părți). Nu definești conținut real încă.

### Faza 2 — Loop-ul de Bază

| Ordine | Sistem / Feature | Motiv |
|---|---|---|
| 2.1 | SYS-006 Shop + Buy Phase | Cumperi părți |
│ 2.2 | SYS-007 Duel System | Skill-uri + energy + cooldown |
| 2.3 | SYS-008 Match Manager | Runde, win/lose |
| 2.4 | SYS-038 AI Opponent | Adversar care joacă |
| 2.5 | SYS-021 Results + Rewards | Recompense |

**Milestone — Loop jucabil:** după Faza 2, ai un joc care se joacă de la început până la sfârșit (cu date de test). E momentul să aprobi mecanica înainte să investești în conținut.

### Pasul Interim — Content Foundation

*Acest pas se face ÎNAINTE de a popula caractere, dar numai dacă loop-ul e aprobat.*

| Ordine | Feature | Motiv |
|---|---|---|
| I.1 | **Skill Rectangle Catalog** — toate efectele posibile, scale cu raritatea | Fără skills, nu poți scrie cărți |
| I.2 | **Buff / Debuff Catalog** — toate modificatorii (vulnerability, shield, poison etc.) | Fără buffs, skills sunt goale |
| I.3 | **Character Definitions** — nume, identitate, tematică, ce skills preferă | Fără caractere definite, nu știi cui aparțin cărțile |
| I.4 | Theme Tags — lista completă de teme pentru sinergii | Fără teme, compatibilitatea nu funcționează |

### Faza 3 — Conținut + Varietate

| Ordine | Sistem / Feature | Motiv |
|---|---|---|
| 3.1 | **Character Card Population** — 10 caractere × 5-15 cărți fiecare | Conținutul real al jocului |
| 3.2 | SYS-025 Item System | Weapon, Armor, Accessory |
| 3.3 | SYS-037 Character Card Pool | Cărți per caracter |
| 3.4 | SYS-010 Profession System | Progresie |
| 3.5 | SYS-011 Blueprint System | Crafting |
| 3.6 | SYS-040 Quest Factory | Quest-uri generate |

### Faza 4 — Progresie

| Ordine | Sistem | Motiv |
|---|---|---|
| 4.1 | SYS-022 Infinite Leveling | Level infinit |
| 4.2 | SYS-012 Upgrade (+0 → +10) | Îmbunătățire părți |
| 4.3 | SYS-013 Treire (Durability) | Durabilitate |
| 4.4 | SYS-014 Economy | Gold, materiale |
| 4.5 | SYS-015 Player Profile | Salvare progres |
| 4.6 | SYS-039 Offline Save / Load | Persistență |

### Faza 5 — Retenție + Polish

| Ordine | Sistem | Motiv |
|---|---|---|
| 5.1 | SYS-026 Tutorial | Ghidare jucător nou |
| 5.2 | SYS-027 Settings | Configurare |
| 5.3 | SYS-029 Collection Manager | Vezi colecția |
| 5.4 | SYS-031 Daily Rewards | Login zilnic |
| 5.5 | SYS-033 Achievement System | Realizări |
| 5.6 | SYS-035 Notification System | Notificări |
| 5.7 | SYS-023 Rankings (local) | Leaderboard local |
| 5.8 | SYS-024 Tournament System | Provocări periodice |

### Graful Dependențelor

```
SYS-001
  → SYS-003 → SYS-004
  → SYS-005 → SYS-006 → SYS-007 → SYS-008 → SYS-038
  → SYS-009 → SYS-036
  → SYS-010 → SYS-011
  → SYS-014 → SYS-015 → SYS-039

CONTENT FOUNDATION (după Faza 2):
  Skill Catalog → Buff/Debuff Catalog → Character Definitions → Theme Tags
  → Character Card Population

ÎNAINTE de Faza 3:
  Character Card Population → SYS-037 → SYS-025 → SYS-010 → SYS-011 → SYS-040
```

### Progresia completă (șir logic)

```
Faza 0 — Fundația
  → Faza 1 — Nucleul vizual (date de test)
    → Faza 2 — Loop jucabil (date de test)
      → Aprobare: mecanica e fun? 
        → DA → Content Foundation (skills, buffs, caractere, teme)
          → Faza 3 — Conținut real + varietate
            → Faza 4 — Progresie
              → Faza 5 — Retenție + Polish
        → NU → Revizuiești mecanica, nu conținutul
```

**Primul milestone:** Faza 2 completă = loop jucabil cu date de test.
