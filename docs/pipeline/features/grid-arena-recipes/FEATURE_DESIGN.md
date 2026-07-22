# Grid Arena + Cell System + Recipes

**Feature:** Grid Arena & Cell System & Card Recipes
**Status:** 🟡 Game Design (pre-G1)
**Data:** 2026-07-14
**Departament:** Game Design → Production

---

## 0. Filosofie

> Arena nu e doar o suprafață unde pui cărți. E un **al doilea strat de build**.
> Fiecare pătrățel contează. Fiecare poziție e o decizie.

Inspirația principală e Backpack Battles — nu prin clonare, ci prin **extinderea conceptului**:
- În BB, aranjezi itemi 1×1, 1×2, 2×2 într-un grid și poziționarea creează sinergii
- La Cardweave, **blocurile sunt mai mari** (cărți 3×3, 4×4, 2×2) și **terenul însuși are proprietăți**
- Adăugăm și **Recipes**: combini cărți complete între dueluri pentru a crea unele mai puternice

---

## 1. Gridul — Dimensiuni și Structură

### 1.1 Specificații

| Proprietate | Valoare |
|-------------|---------|
| **Dimensiune** | 12 coloane × 8 rânduri |
| **Total celule** | 96 |
| **Celule inițiale** | ~12-16 (suficient pentru 1-2 cărți mici) |
| **Restul** | Blocate — se deblochează prin cumpărare |

### 1.2 De ce 12×8?

- Suficient spațiu pentru **6-10 cărți** (dimensiuni mixte) + cell items 1×1
- Asimetric (nu pătrat) — forțează decizii de orientare
- Scaling natural: începi cu un colț mic și crești pe măsură ce run-ul avansează
- Ocupă rezonabil pe ecran (poți face zoom în Buy Phase)
- Compatibil cu rezoluții 16:9 și 16:10 fără scroll

### 1.3 Vizual

```
┌──────────────────────────────────────┐
│  Arena 12×8                          │
│                                      │
│  ████████░░░░░░░░░░░░░░░░░░░░░░     │  █ = celulă deblocată
│  ████████░░░░░░░░░░░░░░░░░░░░░░     │  ░ = celulă blocată
│  ████████░░░░░░░░░░░░░░░░░░░░░░     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │  Jucătorul începe
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │  cu 3×3 sau 4×4 în
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │  colțul stânga-sus.
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░     │
└──────────────────────────────────────┘
```

### 1.4 Expansiunea Gridului

- Fiecare celulă nouă se cumpără și se **atașează la gridul existent**
- Regula: o celulă nouă trebuie să fie **adiacentă** (inclusiv diagonal) cu o celulă deja deblocată
- Poți cumpăra celule în **orice direcție** — nu există o formă fixă
- **Costul crește** cu cât ai mai multe celule deblocate: `cost_bază × (1 + celule_total / 10)`

---

## 2. Card Sizes — Dimensiuni Variabile

### 2.1 Dimensiunile Cărților

O carte nu e doar 3×3. Dimensiunea e determinată de **Frame** și eventual de **Jewels**:

| Dimensiune | Amprentă | Câte astfel de cărți încap în 96 celule | Stil |
|------------|----------|----------------------------------------|------|
| **1×1** | 🔲 | 96 | Item-uri mici: pietre, buff-uri, capcane, consumabile |
| **2×2** | 🟦 | 24 | Cărți mici, rapide, efect redus |
| **3×3** | 🟧 | ~10-11 | Carte standard, echilibrată |
| **4×4** | 🟥 | 6 | Boss cards — puternice dar greu de încăput |

### 2.2 Cum se Determină Dimensiunea

| Factor | Efect |
|--------|-------|
| **Tipul Frame-ului** | Frame-ul principal determină dimensiunea de bază |
| **Combinația de Jewels** | Un Attack Jewel + Defense Jewel poate face o carte mai mare |
| **Raritatea** | Cărțile mai rare pot avea dimensiuni mai mari (Legendary 3×3 implicit) |
| **Skill Rectangle** | Unele skill-uri cer o dimensiune minimă (ex: "AOE 3×3" cere 4×4) |

**Propunere inițială (simplă):**
- **Common → Rare**: 2×2 sau 3×3 (player alege la asamblare)
- **Epic+**: 3×3 sau 4×4
- **1×1**: itemi speciali, nu cărți propriu-zise (buffs, capcane, amplificatoare)

### 2.3 Trade-off-urile Dimensiunii

| Dimensiune | Statistici | Flexibilitate | Cost energie |
|------------|-----------|---------------|--------------|
| 1×1 | 0.5× putere | Maximă | 0.3× |
| 2×2 | 0.7× putere | Mare | 0.5× |
| 3×3 | 1.0× putere | Medie | 1.0× |
| 4×4 | 1.5× putere | Mică | 1.8× |

**Decizie strategică:** O carte 4×4 e puternică dar:
- Ocupă 16 celule din grid
- Greu de înconjurat cu celule de tip bun
- Consumă multă energie
→ Alternativa: 4 cărți 2×2 = mai flexibile, acoperă mai mult teren

---

## 3. Tipuri de Celule

### 3.1 Setul de Bază (5 tipuri)

| Tip | Efect per celulă sub carte | Culoare | Vizual |
|-----|---------------------------|---------|--------|
| ⚪ **Neutru** | Fără bonus | Gri | `░░` |
| 🔴 **Ofensiv** | +5% ATK la Attack Jewel | Roșu slab | `▓▓` |
| 🔵 **Defensiv** | +5% DEF la Defense Jewel | Albastru slab | `▓▓` |
| 🟢 **Energie** | -3% cost energie per celulă | Verde slab | `▓▓` |
| 🟣 **Sinergie** | +8% putere Skill Rectangle | Violet slab | `▓▓` |

### 3.2 Cum Funcționează Bonusurile pe Cărți

Când o carte e plasată pe grid, se calculează **bonusul total** pe baza celulelor pe care stă.

**Formulă:**
```
ATK_final = ATK_bază × (1 + 0.05 × nr_celule_ofensive_sub_carte)
DEF_final = DEF_bază × (1 + 0.05 × nr_celule_defensive_sub_carte)
cost_energie = cost_bază × (1 - 0.03 × nr_celule_energie_sub_carte)
skill_power = power_bază × (1 + 0.08 × nr_celule_sinergie_sub_carte)
```

**Exemplu — o carte 3×3 plasată pe:**
- 4 celule Ofensive → +20% ATK
- 3 celule Defensive → +15% DEF
- 2 celule Energie → -6% cost energie

→ Carte cu ATK 20 → 24, DEF 15 → 17, cost 10 energie → 9.4

### 3.3 Celule 1×1 (Itemi de Grid)

Pe lângă tipurile de celule, poți plasa **itemi 1×1** direct pe celule (separat de cărți):

| Item | Efect | Raritate |
|------|-------|----------|
| 💎 **Piatră de Putere** | +10% ATK cărții de deasupra (se adună cu tipul celulei) | Uncommon |
| 🛡️ **Scut de Pământ** | +10% DEF cărții de deasupra | Uncommon |
| ⚡ **Cristal de Mana** | Restaurează 1 energie per tură | Rare |
| 🔥 **Capcană de Foc** | La fiecare atac al cărții, +2 damage bonus | Rare |
| 💫 **Amplificator** | Dublează efectul celulei de sub el | Epic |

Itemii de grid se cumpără **în Buy Phase** (ca și celulele sau părțile de cărți) și se plasează **sub** o carte, nu în locul ei.

---

## 4. Economia Celulelor

### 4.1 Cumpărarea de Celule Noi

| Context | Costă | Monedă |
|---------|-------|--------|
| **În run (Buy Phase)** | `4 + nr_celule_cumpărate_în_run` coins | Coins |
| **Între run-uri (persistent)** | `50 + nr_celule_total × 10` gold | Gold |

### 4.2 Upgrade Celule (+0 → +10)

Același sistem ca la părțile de carte. Fiecare nivel +X adaugă +1% la efect:

| Nivel | Efect Ofensiv | Efect Defensiv | Cost Dust |
|-------|--------------|---------------|-----------|
| +0 | +5% | +5% | — |
| +1 | +6% | +6% | 10 |
| +2 | +7% | +7% | 25 |
| +3 | +8% | +8% | 50 |
| +5 | +10% | +10% | 150 |
| +10 | +15% | +15% | 1000 |

### 4.3 Schimbarea Tipului unei Celule

| Acțiune | Cost |
|---------|------|
| Schimbat tip (ex: Ofensiv → Defensiv) | 25 Essence |
| Reset la Neutru | 5 Essence |

### 4.4 Sink-uri Economice (de ce merge cu sistemele existente)

| Ce poate face jucătorul între run-uri | Costă | Sistem existent |
|----------------------------------------|-------|-----------------|
| Cumpără celulă nouă | Gold | ✅ Deja în GDD |
| Upgrade celulă +X | Dust | ✅ Deja în GDD pentru părți |
| Schimbă tip celulă | Essence | ✅ Deja în GDD |
| Cumpără item de grid | Gold/Coins | ✅ Extindere naturală |

**Nu introducem nicio monedă nouă.**

---

## 5. Recipes — Combinarea Cărților Complete

### 5.1 Concept

În BB combini itemi individuali. La Cardweave mergem mai departe:
combini **cărți complete** (asamblate din părți) pentru a crea una nouă, mai puternică.

### 5.2 Când și Unde

- **Între dueluri** (nu în run)
- În UI-ul de **Crafting Station** (secțiune separată din meniul persistent)
- Accesibil din ecranul dintre run-uri

### 5.3 Reguli de Bază

| Regulă | Detaliu |
|--------|---------|
| **Câte surse?** | 2 cărți (unele rețete rare cer 3) |
| **Ce se întâmplă cu sursele?** | Dispar. Se consumă în proces. |
| **Ce primești?** | O carte nouă, cu părți moștenite din ambele surse |
| **Raritatea rezultatului** | Cel puțin cât max dintre surse (poate fi mai mare) |
| **Părțile rezultatului** | Ia cele mai bune părți din fiecare sursă |
| **Dimensiunea** | Determinată de rețetă (de obicei mai mare) |

### 5.4 Exemplu

```
⚔️ „Sabie de Foc" (3×3, Pyros, Common)
   Frame: Common (+0)
   Attack Jewel: Common (+2) → ATK 18
   Defense Jewel: None
   Skill: „Flame Slash" — 8 damage

🛡️ „Scut de Foc" (2×2, Pyros, Common)
   Frame: Common (+1)
   Attack Jewel: None
   Defense Jewel: Common (+0) → DEF 12
   Skill: „Flame Barrier" — 3 block

→ Rețetă: „Sabie Arzătoare" (3×3, Pyros, Uncommon)
   Frame: Common (+1) ← păstrează cel mai bun Frame
   Attack Jewel: Common (+2) ← păstrează Attack Jewel din Sabie
   Defense Jewel: Common (+0) ← moștenește Defense Jewel din Scut
   Skill: „Flame Slash + Barrier" — 12 damage + 2 block
```

### 5.5 Categorii de Rețete

| Categorie | Descriere | Exemplu |
|-----------|-----------|---------|
| **Fusion** | Două cărți de același element → una mai puternică | Sabie + Scut → Sabie Arzătoare |
| **Cross-element** | Cărți din elemente diferite → efect hibrid | Golem de Foc + Scut de Gheață → Golem Înghețat |
| **Ascension** | 2× aceeași carte → versiune upgraded | 2× Spark (3×3) → Spark+ (4×4) |
| **Special** | Rețete unice, cu cărți specifice | „The Eternal Flame" = Pyros Legendary + Aqua Epic + ... |

### 5.6 Descoperirea Rețetelor

| Metodă | Descriere |
|--------|-----------|
| **Cunoscute din start** | 5-10 rețete de bază (Fusion simple) |
| **Descoperire automată** | Când ai ambele cărți sursă în inventar, rețeta apare |
| **Blueprint-uri** | Cercetezi blueprint-ul → deblochezi rețeta |
| **Profesii** | Forging level 5 → vezi toate rețetele posibile din inventar |
| **Explorare** | Unele rețete sunt secrete — le descoperi încercând combinații |

### 5.7 Conexiunea cu Profesiile

| Profesie | Ce deblochează în sistemul de Recipes |
|----------|---------------------------------------|
| **Forging (general)** | Fusion recipes (același element), level 5+ → poți vedea preview |
| **Element Lore (Pyros etc.)** | Cross-element recipes care implică acel element |
| **Veteran** | Poți refolosi o parte dintr-o carte sursă în loc s-o pierzi |
| **Tactician** | Grid-related recipes (combini cărți care erau plasate adiacent) |

---

## 6. Fluxul Complet pentru Jucător

### 6.1 În Run — Buy Phase

```
RUNDA 3 — AI 15 COINS:
┌──────────────────────────────────────────────────┐
│ Shop:                                            │
│ ① Attack Jewel (Common) — 3 coins              │
│ ② CELULĂ OFENSIVĂ — 5 coins                   │
│ ③ ITEM 1×1: Piatră de Putere — 4 coins        │
│ ④ Carte Spark 2×2 (pre-asamblată) — 6 coins   │
│                                                  │
│ Gridul tău acum: 20 celule deblocate            │
│ Ai o carte 3×3 (ATK 15) + 2 celule Ofensive     │
│                                                  │
│ Ce faci?                                        │
│ a) Cumperi celula → o pui lângă grid           │
│ b) Cumperi Piatra de Putere → o pui sub carte  │
│ c) Cumperi Spark 2×2 → o plasezi in alta parte │
│                                                  │
│ Tu alegi (b): cumperi Piatra, o pui sub cartea  │
│ ta 3×3. Acum cartea are +10% ATK de la piatră  │
│ + 10% ATK de la 2 celule Ofensive = +20% ATK.  │
└──────────────────────────────────────────────────┘
```

### 6.2 Între Run-uri — Crafting Station

```
DUPĂ DUEL — AI CÂȘTIGAT 2 RUN-URI LA RÂND:
┌──────────────────────────────────────────────────┐
│ Inventar:                                        │
│ • Sabie de Foc (3×3, Common)                    │
│ • Scut de Foc (2×2, Common)                     │
│ • 2× Attack Jewel (Common, nefolosite)          │
│ • 150 Gold, 45 Dust, 20 Essence                 │
│                                                  │
│ 🔔 Rețetă descoperită: Sabie + Scut →           │
│    Sabie Arzătoare (Uncommon)                   │
│                                                  │
│ Vrei să combini?                                 │
│ [YES] → Sabie + Scut dispar                     │
│       → Primești Sabie Arzătoare (3×3, UC)     │
│       → ATK 18 + DEF 12 + Skill „Flame Slash"  │
│                                                  │
│ Ai și 45 Dust — poți upgrade o celulă +0→+2   │
│ pe care-o ai în grid (cost: 35 Dust)            │
│                                                  │
│ [UPGRADE] → Celula Ofensivă +0 → +2            │
│           → Acum dă +7% în loc de +5%           │
└──────────────────────────────────────────────────┘
```

---

## 7. Implementare — Ordinea Etapei

### P1 — Fundația Gridului

| # | Task | Departament |
|---|------|-------------|
| 1 | Grid 12×8 — structura de date (matrice 12×8) | Dev |
| 2 | Celule blocate / deblocate — stare + cost | Dev |
| 3 | Plasare cărți 3×3 pe grid (validare suprapunere) | Dev |
| 4 | Celule Neutre default | Dev |
| 5 | Cumpărat celule în Buy Phase (UI + logică) | Dev + Design |
| 6 | Expansiune adiacentă | Dev |

### P2 — Tipuri de Celule + Upgrade

| # | Task | Departament |
|---|------|-------------|
| 7 | 5 tipuri de celule (Offensive, Defensive, Energie, Sinergie, Neutru) | Dev |
| 8 | Calcul bonus per carte (formula) | Dev |
| 9 | UI — culoare + simbol per tip | Design |
| 10 | Upgrade celule (+0 → +10) cu Dust | Dev |
| 11 | Schimbat tip celulă cu Essence | Dev |
| 12 | Itemi 1×1 pe celule | Dev |

### P3 — Variable Card Sizes

| # | Task | Departament |
|---|------|-------------|
| 13 | Card size 2×2 — validare plasare | Dev |
| 14 | Card size 4×4 — validare plasare | Dev |
| 15 | Card size 1×1 — itemi de grid | Dev |
| 16 | Trade-off balans (statistici per size) | Design |
| 17 | UI — ghost preview la plasare | Dev + Design |

### P4 — Recipes

| # | Task | Departament |
|---|------|-------------|
| 18 | Recipies DB — structură date | Dev |
| 19 | UI — Crafting Station | Dev + Design |
| 20 | Fusion logic (păstrare părți, calcul rezultat) | Dev |
| 21 | Descoperire automată rețete | Dev |
| 22 | Blueprint-uri pentru rețete | Dev + Design |
| 23 | Profesii — integrare cu recipes | Dev |

---

## 8. Concluzie — De ce Acest Design

**TL;DR:** Am luat ce e bun în Backpack Battles (grid strategy, poziționare care contează, combinații)
și l-am extins într-o direcție care **nu se suprapune** cu BB ci o completează:

### Diferențele față de Backpack Battles

| BB | Cardweave |
|----|-----------|
| Grid 4×4 sau extins la 6×8 | Grid **12×8** (96 celule) |
| Item 1×1, 1×2, 2×2 | Cărți **2×2, 3×3, 4×4 + itemi 1×1** |
| Backpack-ul e un "container" pasiv | **Terenul are proprietăți** (5 tipuri de celule) |
| Combini itemi în timpul rundei | Combini **cărți complete între dueluri** (Recipes) |
| Progresie = mai mult spațiu | Progresie = **spațiu + tipuri + upgrade celule** |
| O singură monedă în run | Coins (run) + Gold/Dust/Essence (persistent) |

### Ce face acest sistem special

1. **Poziționarea contează dublu** — nu doar ce carte pui, ci pe ce teren
2. **Strategie pe două niveluri** — micro (ce părți alegi) + macro (cum dezvolți arena)
3. **Progresie persistentă tangibilă** — celulele rămân upgrade-ate între run-uri
4. **Endless replayability** — rețetele de combinat cărți creează un "collectathon"
5. **Sink economic sănătos** — ai mereu ce face cu resursele (inclusiv când nu ești în run)

### Ce urmează

După aprobarea acestui design (G1), trecem în Production:
- Spargem în tickete individuale
- Prioritizăm P1 — Grid 12×8 fundamental
- Implementăm primul ticket

---

**Document creat:** 2026-07-14
**Autor:** Hermes Agent (brainstorm cu Dragoș)
**Status:** Așteaptă G1 — aprobare user
