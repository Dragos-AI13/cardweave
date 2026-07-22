# Character Design System — Propunere

> Bazat pe review-ul întregii documentații existente și analiza sistemelor de caracter din alte jocuri auto-battler/card builder.

---

## 1. Problema Curentă

| Ce avem | Ce lipsește |
|---|---|
| 10 rase abstracte | Niciun caracter cu nume |
| 6 clase cu bonusuri generice | Nicio personalitate sau backstory |
| Card Pool (SYS-037) cu `character_id` dar fără caractere | Niciun caracter definit concret |
| Skill-uri și efecte (SYS-041) | Fără atribuire la caractere specifice |
| Items per rasă | Fără preferințe per caracter |

**Pe scurt:** avem scheletul unui sistem de caractere, dar zero conținut. E ca și cum am avea un motor de joc fără niciun level.

---

## 2. Propunere — Arhitectură pe 3 Niveluri

```
┌─────────────────────────────────────────────────────────────┐
│                    CARACTER (persistent)                    │
│  • Deblocabil prin profesii                                 │
│  • Are nume, lore, personalitate                            │
│  • Are un Card Pool propriu (5-15 cărți unice)              │
│  • Are item preferences (Weapon/Armor/Accessory preferate)  │
│  • Are buff/debuff affinități (ce efecte face mai bine)    │
│  • Are sinergii cu alte caractere                           │
└───────────────────────┬─────────────────────────────────────┘
                        │ alege înainte de duel
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  CARD POOL (în duel)                        │
│  • 5-15 cărți din care se trage shop-ul                    │
│  • Fiecare carte = 6 părți (Frame, Name, Icon, Attack,     │
│    Defense, Skill)                                          │
│  • Fiecare carte are temă, raritate, sinergii              │
│  • Poți combina părți din cărți diferite (Synergy)         │
└───────────────────────┬─────────────────────────────────────┘
                        │ în timpul duelului
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              CĂRȚI ASAMBLATE (pe grid)                     │
│  • Cărțile construite din părți în Buy Phase               │
│  • Au stats (damage, HP) din părți                         │
│  • Au efect (Skill Rectangle) din părți                    │
│  • Sunt influențate de items echipați                    │
│  • Atacă automat în Battle Phase                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Blueprint de Caracter

```
┌─────────────────────────────────────────────────────────────┐
│                    CHARACTER BLUEPRINT                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  I. IDENTITATE                                              │
│     Nume: [ales cu grijă, memorabil]                       │
│     Titlu: [ex: „Stăpânul Focului", „Umbra din Umbre"]     │
│     Rasă: [Dragonkin | Vampire | Construct | ...]          │
│     Clasă implicită: [clasa recomandată]                   │
│     Raritate de bază: [Common → Mythic — cât de rar e]    │
│     Ordine deblocare: [1=primul, 10=ultimul]               │
│                                                             │
│  II. LORE                                                   │
│     Scurtă descriere (1-3 propoziții)                      │
│     Personalitate: [3 trăsături]                           │
│     Motto: [o frază care îl definește]                     │
│     Motivație: [ce vrea caracterul]                        │
│     Conflict: [cea mai mare slăbiciune]                   │
│                                                             │
│  III. STATS DE BAZĂ                                         │
│     Base HP: [câtă viață are caracterul]                   │
│     Energy Cap Bonus: [+X față de default]                 │
│     Energy Regen Bonus: [+X/s față de default]             │
│     Attack Speed Bonus: [%]                                │
│                                                             │
│  IV. CARD POOL (5-15 cărți unice)                          │
│     [Cartea 1] → 6 părți → apar în shop                   │
│     [Cartea 2] → 6 părți                                   │
│     ...                                                     │
│                                                             │
│  V. ITEM AFFINITIES                                         │
│     Weapon preferată: [ce tip] + efect bonus               │
│     Armor preferată: [ce tip] + efect bonus                │
│     Accessory preferat: [ce tip] + efect bonus             │
│                                                             │
│  VI. BUFF/DEBUFF SPECIALIZĂRI                               │
│     Efect principal: [ce efect face cel mai bine]          │
│     Efect secundar: [al doilea efect]                      │
│     Efect pe care-l face rău: [efect slab la el]          │
│                                                             │
│  VII. SINERGII                                              │
│     Cu personaje din aceeași rasă: [bonus]                │
│     Cu personaje din aceeași clasă: [bonus]               │
│     Rivalități: [+damage vs]                               │
│     Prietenii: [+bonus când sunt împreună]                │
│                                                             │
│  VIII. DEBLOCARE                                            │
│     Profesie necesară: [nume + nivel]                      │
│     Gold cost:                                              │
│     Materiale necesare:                                     │
│     Quest opțional:                                         │
│                                                             │
│  IX. VIZUAL                                                 │
│     Culoare dominantă:                                      │
│     Element vizual (ce reprezintă):                         │
│     Icon concept:                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Cum Se Generează Card Pool-ul Unui Caracter

Fiecare caracter are 5-15 cărți în pool-ul său. Fiecare carte e o combinație de **temă** + **raritate** + **efect**.

### Reguli de generare a Card Pool-ului:

```
1. Alege o temă principală (coerentă cu caracterul)
2. Alege 5-15 subteme (variante ale temei)
3. Fiecare subtemă → o carte cu 6 părți
4. Distribuie raritățile (majoritar Common/Uncommon, câteva Rare+, una Epic+)
5. Atribuie efecte (Skill Rectangle) din catalogul SYS-041
6. Definește sinergiile între cărțile aceluiași caracter
```

### Exemplu — Caracter ipotetic:

```
Caracter: „Ignis, Stăpânul Focului" (Dragonkin, Mage)
Tema: Fire & Destruction
Card Pool:
├── 🔥 Carte 1: „Flame Burst" (Common) — attack jewel fire, skill=burn
├── 🔥 Carte 2: „Ember Shield" (Common) — defense jewel, skill=barrier
├── 🔥 Carte 3: „Dragon Breath" (Uncommon) — attack high, skill=burn+slow
├── 🔥 Carte 4: „Scorching Wind" (Uncommon) — attack med, skill=haste
├── 🔥 Carte 5: „Inferno" (Rare) — attack high, skill=explode burn stacks
├── 🔥 Carte 6: „Volcanic Core" (Rare) — defense, skill=energy surge
├── 🔥 Carte 7: „Phoenix Tears" (Epic) — skill=revitalize+regen
└── 🔥 Carte 8: „Apocalypse" (Legendary) — skill=burn all + chain damage
```

### Mărimea Card Pool-ului:

| Tip caracter | Nr cărți | Motiv |
|---|---|---|
| Starter (primul caracter) | 8-10 | Suficientă varietate, ușor de învățat |
| Mid (deblocabil mai târziu) | 10-12 | Mai multă complexitate |
| Endgame (rar) | 12-15 | Maximă varietate și sinergii |

---

## 5. Cum Se Conectează cu Sistemele Existente

| Sistem existent | Cum se leagă de Character Design |
|---|---|
| **SYS-009 — Race Selection** | Caracterul aparține unei rase → pool-ul e subset al rasei |
| **SYS-036 — Class System** | Caracterul are o clasă implicită + poate lua și altele |
| **SYS-037 — Card Pool + Compatibility** | **Aici e inima** — Card Pool-ul caracterului e inputul pentru compatibility |
| **SYS-025 — Item System** | Caracterul are item preferences + item passives |
| **SYS-041 — Buff/Debuff** | Caracterul are affinități per efect |
| **SYS-007 — Duel System** | Caracterul contribuie cu base HP, energy bonus |
| **SYS-010 — Profession System** | Caracterul se deblochează prin profesii |
| **SYS-011 — Blueprint System** | Fiecare caracter are blueprint-uri exclusive de crafting |

---

## 6. Matricea Caractere (10 rase × 6 clase = 60 posibile)

| Rasă | Berserker | Assassin | Mage | Tank | Support | Ranger |
|---|---|---|---|---|---|---|
| 🐉 **Dragonkin** | Ignis | — | **Ignis** | — | - | — |
| 🧛 **Vampire** | — | **Noctis** | — | — | — | — |
| 🤖 **Construct** | — | — | — | **Titanus** | — | — |
| 🌿 **Fae** | — | — | — | — | **Lumina** | — |
| 👁️ **Eldritch** | — | — | **Zaros** | — | — | — |
| ⚔️ **Knight** | — | — | — | — | — | **Aric** |
| 🌑 **Void** | — | **Shade** | — | — | — | — |
| 🐺 **Lycan** | **Fenris** | — | — | — | — | — |
| ☀️ **Celestial** | — | — | **Auriel** | — | — | — |
| 💀 **Necro** | — | — | **Mortis** | — | — | — |

> **Propun:** Nu umplem toată matricea acum. Facem **1 caracter pe rasă** (10 caractere inițiale) — fiecare cu un card pool complet. Restul le facem când avem nevoie.

---

## 7. Scurtă Analiză — Ce Au Alte Jocuri

| Joc | Sistem caractere | Diferența față de Cardweave |
|---|---|---|
| **Slay the Spire** | 4 caractere, fiecare cu card pool propriu | Cardweave = carduri construite din părți, nu găsite gata făcute |
| **Backpack Battles** | Clase cu item pool diferit | Cardweave = caractere cu identitate, nu doar clase funcționale |
| **Legends of Runeterra** | Campioni cu abilități unice | Cardweave = caracterele definesc un ECOSYSTEM de cărți, nu doar o abilitate |
| **Monster Train** | 5 clanuri cu cărți proprii | Cardweave = caractere + clase combinabile (hibrid) |
| **Hearthstone** | Eroi cu power pasiv | Cardweave = mai profund, caracterul influențează tot shop-ul |

**Poziționarea Cardweave:** Un caracter Cardweave e mai aproape de conceptul de **clan din Monster Train** (defilează un întreg pool) dar cu **identitatea unui campion LoR**.

---

## 8. Propunere — Următorii Pași

Dacă ești de acord cu direcția, următorii pași ar fi:

1. **Aprobi blueprint-ul de mai sus** (sau îl modificăm)
2. **Definim primul caracter** — sugestia mea: **Ignis (Dragonkin Mage)** ca proof of concept complet
3. **Testăm blueprint-ul pe el** — umplem toate câmpurile, definim card pool-ul, sinergiile
4. **Ajustăm template-ul** după ce vedem ce lipsește
5. **Populăm 10 caractere** (unul per rasă)

Care e părerea ta?

---

*Document bazat pe review-ul complet al documentației Cardweave.*
*Sisteme consultate: SYS-007, SYS-009, SYS-010, SYS-025, SYS-036, SYS-037, SYS-041 + GDD.*
