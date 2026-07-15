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
│ 7. GODOT (cum se implementează)                             │
│    Scene, scripts, signals, autoloads                       │
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
- **Scop:** Fundația datelor — toate entitățile jocului sunt resurse Godot
- **Categorii:** data, foundation
- **Dependențe:** nimic (e primul)

### 2. Data
```
Godot Resources (.tres / .gd):
├── PartDefinition.gd (base class)
│   ├── FramePart.gd
│   ├── NamePart.gd
│   ├── IconPart.gd
│   ├── AttackJewel.gd
│   ├── DefenseJewel.gd
│   └── SkillRectangle.gd
├── RarityDefinition.gd (Common→Mythic)
├── RaceDefinition.gd (Pyros, Aqua, etc.)
├── BlueprintDefinition.gd (rețete)
└── ProfessionDefinition.gd (arbore profesii)
```

### 3. Logică
- Fiecare parte de carte e o resursă Godot (inherits Resource)
- Părțile sunt stocate în fișiere `.tres` sau `.gd`
- Se pot edita din editor (dacă scriptul e `@tool`)
- Se pot instanția dinamic la runtime

### 4. UI
- — (e invizibil, doar date)

### 5. Network
- Resursele sunt doar pe client. Serverul are propriul model de date.

### 6. Config
- Toate valorile sunt în resurse, nu în cod. Poți balansa fără să rescrii.

### 7. Godot
```
res://data/
├── parts/
│   ├── PartDefinition.gd       ← Base class
│   ├── frames/
│   │   ├── FramePart.gd
│   │   └── *.tres              ← Instanțe
│   ├── jewels/
│   │   ├── AttackJewel.gd
│   │   ├── DefenseJewel.gd
│   │   └── *.tres
│   └── skills/
│       ├── SkillRectangle.gd
│       └── *.tres
├── rarities/
│   └── *.tres
├── races/
│   └── *.tres
└── blueprints/
    └── *.tres
```

### 8. Testare
- [ ] O parte poate fi încărcată din resursă
- [ ] Valorile se pot edita din inspector
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
- State Machine pattern (vezi Godot State Machine)
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

### 7. Godot
```
res://core/game_state_machine/
├── GameStateMachine.gd        ← Autoload
├── states/
│   ├── MenuState.gd
│   ├── MatchmakingState.gd
│   ├── RaceSelectState.gd
│   ├── BuyPhaseState.gd
│   ├── BattlePhaseState.gd
│   ├── ResultsState.gd
│   └── BetweenRoundsState.gd
└── transitions.gd             ← Tabelul tranzițiilor
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

### 7. Godot
```
res://features/inventory/
├── PartInventory.gd
├── InventoryUI.gd
└── CardAssemblyUI.gd
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

## SYS-004 — Card Assembly

### 1. Identitate
- **Nume:** Card Assembly
- **Scop:** Asamblarea cărților din părți individuale
- **Categorii:** card, core mechanic
- **Dependențe:** SYS-001, SYS-003

### 2. Data
```
Card:
├── frame: FramePart
├── name: NamePart
├── icon: IconPart
├── attack_jewel: AttackJewel
├── defense_jewel: DefenseJewel
├── skill: SkillRectangle
├── position: Vector2i (grid)
├── orientation: enum { VERTICAL, HORIZONTAL }
├── energy_cost: int (calculat din părți)
├── damage: int (calculat din attack_jewel)
├── hp: int (calculat din defense_jewel)
└── effect: SkillEffect (din skill_rectangle)
```

### 3. Logică
- O carte e completă când toate cele 6 sloturi sunt umplute
- Poți schimba o parte oricând (dacă ai alta în inventar)
- Valorile cărții (damage, HP, cost) se calculează din suma părților
- Skill Rectangle determină efectul special

### 4. UI
- 6 sloturi vizibile pe ecran
- Drag & drop din inventar în slot
- Preview în timp real: cum arată cartea + stats
- Buton "Place on Grid" când e completă

### 5. Network
- Trimit serverului: "am asamblat cardul X cu părțile Y"
- Serverul validează că ai părțile respective

### 6. Config
- Time limit per assembly
- Poți dezasambla o carte? (da/nu + cost)

### 7. Godot
```
res://features/card_assembly/
├── Card.gd
├── AssemblySlot.gd
├── AssemblyUI.gd
└── CardPreview.gd
```

### 8. Testare
- [ ] Poți asambla o carte cu toate 6 sloturile
- [ ] Stats se calculează corect (damage = attack_jewel.value * rarity_multiplier)
- [ ] Poți înlocui o parte existentă
- [ ] O carte incompletă nu poate fi plasată pe grid

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

---

## SYS-005 — Arena + Grid System

### 1. Identitate
- **Nume:** Arena & Grid
- **Scop:** Gridul pe care se plasează și luptă cărțile
- **Categorii:** battle, arena
- **Dependențe:** SYS-001, SYS-004

### 2. Data
```
Arena:
├── grid_size: Vector2i (ex: 6x6)
├── cells: Array[GridCell]
│   └── GridCell = { occupied: bool, card: Card, position: Vector2i }
├── expansion_level: int (cât spațiu a cumpărat)
├── max_expansions: int
└── expansion_cost: int (crește cu fiecare expansiune)
```

### 3. Logică
- O carte ocupă un număr de celule (1x1? 1x2? 2x2? — NEDECIS)
- Poziție verticală = atac, orizontală = defensiv
- Poți cumpăra spațiu nou (costă coins)
- Expansiunea adaugă rânduri/coloane

### 4. UI
- Grid vizibil, fiecare celulă are chenar
- Cardurile sunt reprezentate ca sprite-uri pe grid
- Zona de expansiune e marcată (blocată până cumperi)

### 5. Network
- Gridul e syncronizat între jucători
- Serverul validează plasarea

### 6. Config
- Grid size initial
- Max expansions
- Cost per expansion

### 7. Godot
```
res://features/arena/
├── Arena.gd
├── GridCell.gd
├── GridUI.gd
└── ExpansionUI.gd
```

### 8. Testare
- [ ] O carte poate fi plasată pe o celulă liberă
- [ ] O carte nu poate fi plasată peste alta
- [ ] Expansiunea adaugă celule noi
- [ ] Poziția verticală vs orizontală se vede diferit
- [ ] Gridul se încadrează pe orice ecran

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

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
- Se generează părți random din pool-ul rasei
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
- Șanse per raritate (Common 60%, Uncommon 25% etc.)
- Max parts in shop

### 7. Godot
```
res://features/shop/
├── ShopManager.gd
├── ShopUI.gd
├── RerollButton.gd
└── CombineUI.gd
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

## SYS-007 — Battle System

### 1. Identitate
- **Nume:** Battle System
- **Scop:** Auto-battle între cărțile ambilor jucători
- **Categorii:** battle, core
- **Dependențe:** SYS-004, SYS-005, SYS-006

### 2. Data
```
Battle:
├── energy_per_turn: int
├── current_energy: int
├── player1_cards: Array[Card] (pe grid)
├── player2_cards: Array[Card] (syncronizat)
├── turn: int
├── battle_log: Array[BattleEvent]
└── winner: enum { PLAYER1, PLAYER2, NONE }
```

### 3. Logică
- Toate cărțile atacă simultan
- Fiecare carte consumă energie pentru a ataca
- Atacul: damage = attack_jewel.value - defense_jewel.value (minim 1)
- Cărțile lovite își pierd HP; când HP=0, sunt distruse
- Când toate cărțile unui jucător sunt distruse, supraviețuitoarele atacă HP-ul jucătorului
- Când HP-ul jucătorului = 0 → rundă pierdută

### 4. UI
- Animații de atac (cărți care se înclină, proiectile)
- Bare de HP vizibile
- Battle log (text, rapid)
- Replay (opțional)

### 5. Network
- **Server-authoritative**: serverul calculează tot
- Clientul primește rezultatul și rulează animațiile
- Ambii jucători văd aceeași bătălie

### 6. Config
- Energy per turn (base)
- Energy cost per card (formulă)
- Damage formula
- Battle speed (1×, 2×, etc.)

### 7. Godot
```
res://features/battle/
├── BattleManager.gd
├── BattleSimulator.gd (pe server)
├── CardAnimator.gd
├── HealthBar.gd
├── BattleEvent.gd
└── BattleReplay.gd
```

### 8. Testare
- [ ] Cărțile atacă simultan
- [ ] Damage calculat corect
- [ ] Cărțile cu HP=0 dispar
- [ ] Când toate cărțile sunt distruse, restul atacă HP-ul
- [ ] HP jucător = 0 → rundă pierdută
- [ ] Bătălia se termină în timp finit (nu infinite loop)

### 9. Istoric
| Dată | Schimbare |
|---|---|
| — | Versiune inițială |

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

### 7. Godot
```
res://features/match/
├── MatchManager.gd
├── RewardsScreen.gd
└── WinLossTracker.gd
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

### 7. Godot
```
res://features/race/
├── RaceSelectionUI.gd
├── RaceCard.gd
└── RaceDefinition.gd (resursă)
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

### 7. Godot
```
res://features/professions/
├── ProfessionTree.gd
├── ProfessionUI.gd
├── ProfessionNode.gd
└── ProfessionDefinition.gd
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

### 7. Godot
```
res://features/blueprints/
├── BlueprintManager.gd
├── BlueprintUI.gd
├── ResearchQueueUI.gd
└── CraftingUI.gd
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

### 7. Godot
```
res://features/upgrade/
├── UpgradeManager.gd
├── UpgradeUI.gd
└── PartCard.gd (with level display)
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

### 7. Godot
```
res://features/durability/
├── DurabilityManager.gd
├── DurabilityIndicator.gd
└── RepairUI.gd
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
- **Scop:** Gestionarea tuturor resurselor și tranzacțiilor
- **Categorii:** economy, foundation
- **Dependențe:** SYS-001

### 2. Data
```
Currency:
├── gold: int (principală)
├── essence: int (specială, pentru blueprint-uri)
├── dust: int (pentru upgrade)
└── gems: int (premium / drops rare)

Transactions:
├── log: Array[Transaction]
│   └── Transaction = { type, amount, source, timestamp, hmac_signature }
└── audit_enabled: bool
```

### 3. Logică
- Gold se câștigă din dueluri, quest-uri
- Essence se câștigă din drops speciali
- Dust se obține din dezasamblare părți
- Gems sunt premium (sau drops foarte rare)
- Fiecare tranzacție e semnată HMAC (anti-cheat)

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

### 7. Godot
```
res://features/economy/
├── CurrencyManager.gd
├── EconomyUI.gd
├── Transaction.gd
└── HmacSigner.gd
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

### 7. Godot
```
res://features/profile/
├── PlayerProfile.gd
├── ProfileUI.gd
└── StatsDisplay.gd
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

### 7. Godot
```
res://features/network/
├── Matchmaking.gd
├── Lobby.gd
├── QueueUI.gd
└── LobbyUI.gd
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

### 7. Godot
```
res://features/network/
├── SyncManager.gd
├── NetworkMessage.gd
├── ConnectionIndicator.gd
└── ReconnectUI.gd
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

### 7. Godot
```
res://features/security/
├── TransactionAudit.gd
├── HmacSigner.gd
└── (restul pe server, nu în Godot)
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
└── theme: Theme (Godot Theme)
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

### 7. Godot
```
res://ui/
├── ScreenManager.gd (Autoload)
├── screens/
│   ├── MainMenu.tscn + .gd
│   ├── Matchmaking.tscn + .gd
│   ├── RaceSelect.tscn + .gd
│   ├── BuyPhase.tscn + .gd
│   ├── Battle.tscn + .gd
│   ├── Results.tscn + .gd
│   └── Profile.tscn + .gd
├── overlays/
│   ├── Settings.tscn + .gd
│   └── ConfirmDialog.tscn + .gd
├── components/
│   ├── Button.gd
│   ├── CardDisplay.gd
│   └── HealthBar.gd
└── theme/
    └── cardweave_theme.tres
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

### 7. Godot
```
res://features/audio/
├── AudioManager.gd (Autoload)
├── MusicPlayer.gd
├── SFXPlayer.gd
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
└── stats: Dictionary (damage dealt, cards destroyed, etc.)
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

### 7. Godot
```
res://features/results/
├── ResultsUI.gd
├── RewardAnimation.gd
└── StatsDisplay.gd
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
| SYS-004 | Card Assembly | SYS-001, SYS-003 | card |
| SYS-005 | Arena + Grid | SYS-001, SYS-004 | battle |
| SYS-006 | Shop + Buy Phase | SYS-001, SYS-003, SYS-005 | economy |
| SYS-007 | Battle System | SYS-004, SYS-005, SYS-006 | battle |
| SYS-008 | Match Manager | SYS-007 | progression |
| SYS-009 | Race Selection | SYS-001 | progression |
| SYS-010 | Profession System | SYS-001, SYS-009 | progression |
| SYS-011 | Blueprint System | SYS-001, SYS-010 | progression |
| SYS-012 | Upgrade System | SYS-001, SYS-003 | progression |
| SYS-013 | Treire (Durability) | SYS-003, SYS-012 | progression |
| SYS-014 | Economy | SYS-001 | economy |
| SYS-015 | Player Profile | SYS-014 | data |
| SYS-016 | Matchmaking + Lobby | SYS-015 | network |
| SYS-017 | Game State Sync | SYS-016 | network |
| SYS-018 | Anti-Cheat | SYS-017 | network |
| SYS-019 | UI Framework | — | ui |
| SYS-020 | Audio System | SYS-019 | audio |
| SYS-021 | Results + Rewards | SYS-008, SYS-014 | progression |

**Total: 21 de sisteme**
