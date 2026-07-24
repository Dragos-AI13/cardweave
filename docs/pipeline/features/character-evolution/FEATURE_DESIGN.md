# FEATURE_DESIGN.md — Character Evolution + Subordinates System

**Feature:** Character Evolution
**Status:** 🟠 Spec Finalization (G1 aprobat ✅)
**Data:** 2026-07-24
**Departament:** Game Design → Production
**Superseeds:** Arena Slots (card parts), Card Part System, Character Card Population (arhivate)

---

## 1. Context

Lowborn își schimbă direcția fundamental. În loc de **card crafting din părți** (Frame/Name/Icon/Attack Jewel/Defense Jewel/Skill Rectangle), jocul devine un **auto-battler cu character evolution**.

Jucătorul își alege un personaj principal (ex: Țăran) care evoluează pe un **skill tree** (branching paths, gen PoE-lite). Personajul cumpără **subalterni** din shop, îi echipează cu **items** și **skills** (craftable), și îi trimite în arenă să se bată automat.

**Ce se păstrează din arhitectura veche (adaptat pentru Godot):**
- ✅ StateMachine (MENU → BUY → BATTLE → RESULTS)
- ✅ Arena cu 5 sloturi
- ✅ Auto-battle loop (cooldown, damage, HP)
- ✅ Shop + coins + AI opponent
- ✅ Offline-first (D008)

**Ce se înlocuiește:**
- 🔄 PixiJS + Tauri + Vite → **Godot 4.x / GDScript** (D011)
- 🔄 6 card parts per slot → Subalterni cu stats + items
- 🔄 Card assembly + synergy → Item/skill crafting + equip
- 🔄 Card pool per caracter → Subordinate tiers (orizontal, pe fame)
- 🔄 Rune upgrade system → Character skill tree (evolution paths)

---

## 2. High-Level Description

```
Jucătorul își alege un personaj (ex: Țăran).
  → Personajul crește în level, câștigă faimă, alege căi de evoluție.
  → În Buy Phase, cumpără subalterni din shop (left panel).
  → Cumpără/craftează items + skills (right panel).
  → Echipează subalternii cu items/skills.
  → În Battle Phase, subalternii se bat automat reciproc.
  → Dacă o tabără rămâne fără subalterni, atacă personajul principal.
  → Câștigătorul primește recompense (XP, coins, fame, materiale).
```

---

## 3. Core Mechanics

### 3.1 Main Character

Personajul principal e alegerea inițială a jucătorului. Are:

| Proprietate | Descriere |
|-------------|-----------|
| **Rasă** | Determină skill tree-ul disponibil (ex: Human → 3-4 căi) |
| **Nume** | Generat sau ales de jucător |
| **Level** | Crește prin XP din bătălii |
| **Fame** | Crește prin victorii + achievements → deblochează subalterni mai rari în shop |
| **HP** | Viața personajului. Dacă ajunge la 0 în battle → pierzi |
| **Skill Tree** | Branching paths care definesc evoluția (ex: Warrior, Mage, Rogue, Merchant) |
| **Items craftate** | Rămân în inventarul jucătorului între run-uri |

**Skill Tree (P1 — simplu):**

În P1, skill tree-ul nu e un PoE gigant. E un set de **branching paths** cu 2-3 noduri per cale:

```
                   ┌── Războinic ──┐
                   │   (ATK boost)  │
                   │   Lv3 → Lv6   │
                  ┌┘               └┐
Țăran (Lv1) ─────┤                  ├── Comandant (Lv8)
                  └┐               ┌┘   (ATK + DEF boost)
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

Fiecare nod oferă:
- **Stat boost** (HP, ATK, DEF)
- **Fame boost** (câștigi mai multă faimă per victorie)
- **Shop unlock** (subalterni sau items deblocați)
- **Abilitate pasivă** (ex: -1 sec la cooldown, +10% shield)

**Decizie importantă:** Căile sunt **handcrafted** în P1, nu generate procedural. Procedural generation (80%) vine în P2+.

### 3.2 Fame System

| Mecanic | Detaliu |
|---------|---------|
| **Cum crește** | +X per victorie, bonus per evolution node de fame, bonus per tier de subaltern |
| **Ce deblochează** | Tiers de subalterni în shop (Tier 1 → 2 → 3 → 4 etc.) |
| **Scade?** | Da, ușor, la înfrângere (jucătorul nu pierde progres, dar încetinește) |
| **Resetare** | Jucătorul poate oricând să înceapă de la 0 cu un personaj basic nou |

**Exemplu tiers:**

| Fame | Tier | Subalterni disponibili |
|------|------|----------------------|
| 0-50 | T1 | Câine, Pisică, Copil, Alt Țăran |
| 51-150 | T2 | Mercenar, Arcaș, Scutier |
| 151-300 | T3 | Cavaler, Mage Apprentice, Scout |
| 301-500 | T4 | Paladin, Archmage, Assassin |
| 500+ | T5 | Dragon Knight, Shadow Lord, Seraphim |

**Subalternii nu se evoluvează individual.** Ei sunt deblocați **pe orizontală** — cu cât ai mai multă faimă, cu atât ai acces la subalterni mai puternici în shop. Fiecare tier înlocuiește pe cel anterior (sau se adaugă ca opțiuni suplimentare).

### 3.3 Subordinates (Shop Left)

| Proprietate | Descriere |
|-------------|-----------|
| **Stats de bază** | HP, ATK, DEF (variază per tier) |
| **Sloturi** | Ocupă un slot din arenă (max 5) |
| **Items** | Pot fi echipați cu items (craftați de jucător) |
| **Skills** | Pot fi echipați cu skills (deblocați de items, craftați) |
| **Auto-attack** | Atacă automat în Battle Phase |
| **Nu se evoluvează** | Sunt deblocați pe orizontală (faimă + rang), nu cresc individual |

**Subaltern stats exemplu (P1 placeholder):**

| Nume | Tier | HP | ATK | DEF | Cost |
|------|------|----|-----|-----|------|
| Câine | T1 | 20 | 5 | 2 | 3 coins |
| Pisică | T1 | 15 | 7 | 1 | 2 coins |
| Copil | T1 | 12 | 3 | 3 | 1 coin |
| Țăran | T1 | 25 | 4 | 4 | 4 coins |
| Mercenar | T2 | 35 | 8 | 5 | 7 coins |
| Arcaș | T2 | 28 | 10 | 3 | 6 coins |
| Cavaler | T3 | 50 | 12 | 10 | 12 coins |
| Mage App | T3 | 30 | 15 | 4 | 10 coins |

### 3.4 Items & Skills (Shop Right)

**Items:**

- Se **craftuiesc** de jucător (din materiale obținute în bătălii)
- După ce sunt craftate, **apar în shop** unde pot fi cumpărate
- Se echipează pe subalterni
- Fiecare item **deblochează skills** specifice

**Skills:**

- Sunt **deblocate de items** (dacă ai itemul X, poți crafta skill-ul Y)
- Se craftuiesc separat
- Apar în shop după ce sunt craftate
- Se echipează pe subalterni (alături de items)

**Exemplu item→skill chain:**

```
1. Craftezi "Sabie de Fier" (item)
   → Apare în shop
   → Poți echipa pe orice subaltern

2. Sabia deblochează "Taie" (skill)
   → Poți crafta skill-ul "Taie"
   → Apare în shop
   → Poți echipa pe subaltern

3. Subalternul echipat cu Sabie + Taie face:
   Attack = base_ATK + Sabie_bonus
   La atac: aplică efectul "Taie" (damage bonus)
```

**Tipuri de items (P1):**

| Tip | Efect | Exemplu |
|-----|-------|---------|
| Arme | +ATK | Sabie, Arc, Bazookă |
| Armuri | +DEF / +HP | Scut, Vestă, Coif |
| Accesorii | Efect special | Potion (heal), Amulet (fame bonus), Bag (coins bonus) |

### 3.5 Arena

| Proprietate | Valoare |
|-------------|---------|
| **Sloturi** | 5 (deblocabile până la 8 în P2+) |
| **Per slot** | 1 subaltern |
| **Vizual** | Slotul arată subalternul + items echipate |
| **Subaltern mort** | Slotul devine gol — poți cumpăra altul în următoarea Buy Phase |

### 3.6 Battle Phase

```
În Battle Phase:
  - Fiecare subaltern viu are un cooldown individual
  - Când cooldown = 0, alege o țintă (inamic cu cele mai puține HP)
    - ATACĂ: damage = base_ATK + item_bonus
    - Aplică skill effect dacă are skill echipat
    - Damage number animat + tween sprite spre target
    - HP bar se actualizează vizual
  - Subalternii atacă automat și reciproc
  - Când o echipă rămâne FĂRĂ subalterni vii:
    - Subalternii rămași atacă PERSONAJUL PRINCIPAL
    - Personajul principal are propriile HP și poate fi omorât
  - Când personajul principal ajunge la 0 HP → RUN LOST (Game Over)
    - Pierzi progresul personajului (level, fame, skill tree)
    - Păstrezi items craftate (inventar persistent)
```

**Clarificare run vs round:**
- **O rundă** = o iterație BUY → BATTLE → RESULTS. Poți juca mai multe runde în același run.
- **Un run** = începe când alegi un personaj, se termină când personajul principal moare sau faci restart.
- Când personajul principal moare → Game Over screen → poți începe un run nou (cu același personaj sau altul).
- Items craftate rămân între run-uri. Coins, XP, fame, level se resetează la run nou.

### 3.7 Round Progression (P1)

AI-ul și dificultatea escaladează cu numărul rondei:

| Round | AI Coins | AI Subalterni | Note |
|-------|----------|---------------|------|
| 1-3 | 12-18 | T1 (2-3 bucăți) | Ușor, intro |
| 4-6 | 20-30 | T1-T2 (3-4 bucăți) | Mediu |
| 7-9 | 30-45 | T2-T3 (4-5 bucăți) | Dificil |
| 10+ | 45+ | T3+ (5 bucăți, items) | Capăt de run |

AI-ul cheltuiește toți banii pe subalterni și items înainte de battle. Dacă jucătorul pierde runda dar personajul nu moare, poate continua (pierde doar faimă). Dacă personajul moare → Game Over.

### 3.8 Restart

Jucătorul poate oricând:
- Să **înceapă de la 0** cu un personaj basic nou
- Să păstreze items craftate (rămân în inventarul persistent)
- Să piardă coins, XP, level, fame, skill tree progress
- Să vadă un **Game Over screen** când personajul moare, cu stats run-ului

---

## 4. P1 Scope — Minimum Viable Loop

### In Scope (P1)

- [x] **Main Menu** — titlu, buton Joacă, selecție personaj (Țăran default)
- [x] **1 rasă jucabilă** — Human (Țăran ca personaj starter)
- [x] **Skill tree** — 4 paths (Războinic, Magician, Negustor, Haiduc), 2-3 noduri fiecare
- [x] **Level system** — XP per victorie, level-up = alege nod
- [x] **Fame system** — Crește la victorie, deblochează tier-uri de subalterni
- [x] **Subalterni în shop** — 3 tier-uri (T1 peasant-tier, T2 warrior-tier, T3 elite-tier)
- [x] **Items** — 3-4 items de bază (Sabie, Scut, Potion, Amulet), toate craftable
- [x] **Skills** — Fiecare item deblochează 1 skill craftable
- [x] **Arena** — 5 sloturi, click to assign
- [x] **Auto-battle** — Subalterni atacă automat pe cooldown
- [x] **Visual feedback în battle** — damage numbers, tween sprite, HP bar update
- [x] **Main character vulnerability** — Când nu mai ai subalterni, ești atacat direct
- [x] **AI opponent** — Alege subalterni + items din același shop pool, budget per round
- [x] **Round Progression** — AI budget + dificultate escaladează cu round number
- [x] **Game Over screen** — Când personajul moare, stats run-ului, restart
- [x] **Results screen** — Win/Lose, XP, coins, fame, material drops
- [x] **Tooltip pe subalterni/items** — Vezi stats înainte să cumperi
- [x] **Sell subaltern** — Vinde un subaltern înapoi (50% din cost)
- [x] **Coins indicator persistent** — În UI, vizibil în orice fază
- [x] **Tier badge pe subalterni** — T1/T2/T3 în shop și în arenă
- [x] **Restart** — Jucătorul poate începe de la 0 cu un personaj nou

### Out of Scope (P2+)

- [ ] Procedural generation of evolution paths (80%) — P3
- [ ] Multiple races (Dragonkin, Vampire, Lycan, etc.) — P2
- [ ] Full PoE-style skill tree (150+ nodes) — P3
- [ ] 8 arena sloturi — P2
- [ ] Item/skill crafting recipes complexe — P2
- [ ] Multi-item synergy pe subaltern — P2
- [ ] Battle log — P2
- [ ] Speed control (1×/2×/3×) — P3
- [ ] Sound — P8

---

## 5. User Flow (P1)

```
MAIN MENU → click "Joacă"
  │
  ▼
HUB (gateway principal)
  ├── Portret + Stats (level, fame, coins, round)
  ├── ⚔️ Duel → alege caracter → BUY PHASE
  ├── 🔧 Crafting → materiale + blueprints + bench-uri
  ├── 🏋️ Training → profesii + mastery + deblocări
  └── 🌳 Subalterns Tree → branch-uri + noduri
  │
  ▼ (click Duel → OK)
BUY PHASE:
  ├── Persistent: Coins indicator sus-dreapta, Round counter
  ├── Shop Left: Subalterni (T1-T3, în funcție de faimă)
  │     ├── Tooltip la hover: stats, tier badge, cost
  │     └── Right-click: Sell (50% refund)
  ├── Shop Right: Items (ex: Sabie, Scut) + Skills (ex: Taie, Păzește)
  │     (items/skills apar DOAR dacă le-ai craftat anterior)
  ├── Cumperi subalterni + items + skills
  ├── Echipezi items + skills pe subalterni
  └── Click "Gata de Luptă"
  │
  ▼
BATTLE PHASE:
  ├── Player (stânga) vs AI (dreapta)
  ├── Subalternii se bat automat (cooldown per unit)
  │     ├── Damage numbers animate pe target
  │     ├── HP bar scade vizual
  │     ├── Subaltern mort → dispare cu efect
  │     └── Cooldown circle se rotește
  ├── Mor toți subalternii tăi? Inamicul atacă PE TINE
  └── Personaj principal mort → GAME OVER
  │
  ├── Win → RESULTS
  └── Lose (personaj viu) → RESULTS
  │
  ▼
RESULTS:
  ├── Win: +XP (+50), +Coins (10+3×round), +Fame (+20), +Materiale (1-3)
  ├── Lose (personaj viu): +XP (+15), -Fame (-5)
  ├── Level up? → Deschide SUBALTERNS TREE → alege nod
  └── Butoane: "Next Round" → BUY PHASE  /  "Hub" → HUB

GAME OVER (personaj mort):
  ├── "Run Over" banner
  ├── Stats run-ului: rounduri supraviețuite, subalterni cumparați, win/loss ratio
  ├── Items craftate: rămân în inventar
  ├── Buton "New Run" → DUEL POPUP (coins reset)
  └── Buton "Main Menu" → MENU

HUB NAVIGATION:
  ├── Hub → ⚔️ Duel → Duel Popup (alege caracter) → BUY PHASE
  ├── Hub → 🔧 Crafting → Crafting Screen → (back) Hub
  ├── Hub → 🏋️ Training → Training Screen → (back) Hub
  └── Hub → 🌳 Subalterns Tree → Tree Screen → (back) Hub
```

---

### 6. Arhitectură (Godot 4.x)

**Stack actual:** Godot 4.x (GDScript) — D011 înlocuiește PixiJS pur (TypeScript) + Tauri + Vite.

Pattern-urile arhitecturale (StateMachine, EventBus, scene lifecycle) se păstrează — rescrise în GDScript ca Autoloads (singletons).

---

## 7. Dependințe

| Sistem | Pentru | Când |
|--------|--------|------|
| **SYS-005 — Arena Slots** | Sloturi fizice pentru subalterni | P1 |
| **SYS-007 — Duel System** | Auto-battle, damage, cooldown | P1 |
| **SYS-006 — Shop + Buy Phase** | Shop, coins | P1 |
| **SYS-NOU — Subordinate System** | Definiții, stats, tier-ui | P1 |
| **SYS-NOU — Item/Skill Crafting** | Crafting + shop population | P1 |
| **SYS-NOU — Skill Tree** | Evolution paths, nodes | P1 |
| **SYS-NOU — Fame System** | Fame tracking + tier unlocks | P1 |
| **SYS-038 — AI Opponent** | Cardinal P1 adaptat | P1 |

---

## 8. Balance / Valori Inițiale (P1)

| Parametru | Valoare | Note |
|-----------|---------|------|
| Arena sloturi | 5 | Fix în P1 |
| Coins inițiale (run) | 10 | La începutul fiecărui run |
| Coins per win | 10 + 3 × round_number | Crește pe măsură ce înaintezi |
| Fame per win | +20 | Bonus din skill tree poate adăuga |
| Fame per lose | -5 | Nu scade sub 0 |
| Level per XP | 100 × level | Când ajungi la XP, level-up |
| XP per win | +50 | |
| XP per lose | +15 | Doar dacă personajul supraviețuiește |
| Material drops per win | 1-3 | Random din setul disponibil |
| Subaltern max per run | Nelimitat (dar doar 5 pe arenă) | Poți cumpăra și înlocui |
| Sell refund | 50% | Din costul original |
| Cooldown per subaltern | 1.5-3.0s | Variază pe tier (T1 lent, T3 rapid) |
| Main Character HP | 100 | Bază, modificabil din skill tree |
| Main Character ATK | 10 | Damage când atacă direct |
| Fără energy în P1 | — | Doar cooldown per subaltern |
| AI coins (round 1) | 12 | Escaladează cu Round Progression |
| AI coins (round 5) | 25 | |
| AI coins (round 10+) | 50+ | Capăt de dificultate |

---

## 9. Acceptance Criteria (P1)

- [ ] Main Menu: titlu joc + buton "Joacă" vizibil
- [ ] Main Menu: selecție personaj (Țăran default, altele blocate/gri)
- [ ] Jucătorul poate alege un personaj (Țăran) din Main Menu
- [ ] Buy Phase: coins indicator + round counter vizibile în UI
- [ ] Buy Phase: shop arată 2 paneluri (subalterni stânga, items/skills dreapta)
- [ ] Poți cumpăra un subaltern → apare într-un slot liber din arenă
- [ ] Poți cumpăra un item/skill → îl poți echipa pe un subaltern
- [ ] Poți vinde un subaltern (50% refund) din right-click
- [ ] Tooltip hover pe subaltern: stats, tier badge, cost
- [ ] Subalternii au tier badge vizibil (T1/T2/T3)
- [ ] Subalternii în arena atacă automat în Battle Phase
- [ ] Battle Phase: damage numbers animate, HP bar scade vizual
- [ ] Când o tabără rămâne fără subalterni → atacă personajul principal
- [ ] Personaj principal mort → Game Over screen cu stats
- [ ] Game Over: buton "New Run" (coins reset, items păstrate) + "Main Menu"
- [ ] Results: XP, coins, fame, materiale afișate corect
- [ ] Fame crește la victorie → deblochează subalterni mai buni
- [ ] Round Progression: AI devine mai greu cu fiecare rundă
- [ ] Level-up → alegi un nod în skill tree → primești boost
- [ ] Poți restarta oricând cu un personaj nou (items rămân)

---

## 10. Istoric

| Dată | Schimbare |
|------|-----------|
| 2026-07-24 | Creat — înlocuiește Arena Slots (card parts), Card Part System, Character Card Population |
