# Cardweave — Game Design Document

**Status:** Design phase — viziune completă, offline-first
**Dată:** 2026-07-18
**Gen:** Auto-battler single-player cu card crafting din părți
**Platformă:** Steam (Tauri) + Web (itch.io) — aceeași bază de cod
**Motor:** React + TypeScript + PixiJS
**Model:** Offline-first — 100% local, AI opponent adaptiv

---

## 0. Filosofie

> „Nu găsești cărți gata făcute. **Ți le construiești singur, din părți.**"

Cardweave este un **PvP auto-battler** unde jucătorii își construiesc singuri cărțile din părți (shard-uri) în timpul unui duel. Fiecare carte e unică, fiecare meci e diferit. Stratul de **profesii** și **blueprint-uri** între dueluri oferă progresie profundă și personalizare.

---

## 1. Fluxul Jocului — High Level

```
┌─────────────────────────────────────────────────────────────┐
│                    ÎNTRE DUELURI (persistent)               │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Cercetezi │  │ Craftezi │  │Upgradezi │  │ Înveți   │   │
│  │Blueprint-│  │  părți   │  │ părți +0 │  │ profesii │   │
│  │  uri     │  │ de cărți │  │  → +10   │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  Materialele se obțin din:                                  │
│  • Drops la sfârșit de duel                                 │
│  • Quest-uri / provocări zilnice                            │
│  • Cufere cumpărate cu monede din joc                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     ÎNAINTE DE DUEL                         │
│                                                             │
│  1. Jucătorul alege rasa (sau 2-3 cu profesii avansate)    │
│  2. În funcție de rasă, se determină pool-ul de părți       │
│     disponibile în shop-ul din duel                          │
│  3. DA PLAY — începe run-ul                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   ÎN TIMPUL RUN-ULUI                        │
│                                                             │
│  Un run = 13 win-uri sau 3 lose-uri                        │
│                                                             │
│  RUNDA 1:                                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ BUY PHASE                                            │    │
│  │ • Primești X coins (crește cu runda)                │    │
│  │ • Deschizi shop-ul — vezi părți random din rasa ta  │    │
│  │ • Poți rerola shop-ul (costă coins)                 │    │
│  │ • Cumperi părți individuale → snap direct în Arena     │    │
│  │ • Poți combina 2 părți Common → 1 Uncommon          │    │
│  │ • Completezi cărțile în sloturile Arenei              │    │
│  │ • Când ești gata → END BUY PHASE                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                            │                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ DUEL PHASE (auto-battle)                             │    │
│  │ • Cărțile din Arena Slots se activează pe cooldown  │    │
│  │ • Fiecare parte prezentă își face efectul           │    │
│  │ • Energia globală se regenerează, se consumă la carte│    │
│  │ • Carte completă (6/6) → boost ×1.3                 │    │
│  │ • Shield temporar absoarbe damage                    │    │
│  │ • Se luptă până când HP-ul unui jucător = 0          │    │
│  │ • Câștigătorul primește recompense                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  RUNDA 2 → RUNDA 3 → ... până la 13 win-uri / 3 lose-uri  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Structura Cărții

Fiecare carte e compusă din **părți independente**, fiecare cu raritatea și proprietățile ei.

```
┌──────────────────────────────────┐
│            FRAME                 │ ← Raritatea + aspect vizual
│  ┌────────────────────────────┐ │
│  │         NAME               │ │ ← Nume (parte upgrade-abilă)
│  ├────────────────────────────┤ │
│  │   ICON (character)         │ │ ← Caracterul rasei
│  ├────────────────────────────┤ │
│  │   ATTACK JEWEL             │ │ ← Valoare ofensivă
│  ├────────────────────────────┤ │
│  │   DEFENSE JEWEL            │ │ ← Valoare defensivă
│  ├────────────────────────────┤ │
│  │   SKILL RECTANGLE          │ │ ← Efectul special al cărții
│  └────────────────────────────┘ │
└──────────────────────────────────┘
```

### 2.1 Părțile Cărții

| Parte | Funcție | Poate fi upgrade-uită? | Rarități |
|---|---|---|---|
| **FRAME** | Raritatea vizuală, baza cărții | Da (+0 → +10) | Common→Mythic |
| **NAME** | Numele cărții, poate influența sinergii | Da (+0 → +10) | Common→Mythic |
| **ICON** | Caracterul — determină rasa/elementul | Da (+0 → +10) | Common→Mythic |
| **ATTACK JEWEL** | Damage, power ofensiv | Da (+0 → +10) | Common→Mythic |
| **DEFENSE JEWEL** | HP, blocare, power defensiv | Da (+0 → +10) | Common→Mythic |
| **SKILL RECTANGLE** | Efectul special al cărții | Da (+0 → +10) | Common→Mythic |

Cărțile sunt formate prin **asamblarea** acestor părți. Poți face aceeași carte în multe feluri diferite, cu puteri diferite, în funcție de ce părți folosești.

### 2.2 Rarități

| Raritate | Culoare | Putere relativă | Șansă drop |
|---|---|---|---|
| Common | Alb/Gri | 1× | 60% |
| Uncommon | Verde | 1.5× | 25% |
| Rare | Albastru | 2× | 10% |
| Epic | Violet | 3× | 4% |
| Legendary | Auriu | 5× | 0.9% |
| Mythic | Curcubeu | 8× | 0.1% |

### 2.3 Upgrade-ul Părților (+0 → +10)

- O parte poate fi upgrade-uită în afara duelurilor până la **+10**
- Upgrade-ul **nu schimbă raritatea** — un Attack Jewel Rare +5 rămâne Rare
- +X **mărește puterea** (damage, HP, efect)
- Când o parte ajunge la +10, poate fi **"treită"** — primește un salt de putere la aceeași raritate

---

## 3. Shop-ul în Duel

### 3.1 Reguli de bază

- În fiecare Buy Phase, jucătorul primește **X coins** (crește cu numărul rundei)
- Shop-ul arată **părți random** din **pool-ul caracterului selectat**
- Jucătorul poate **rerola** shop-ul (costă coins, costul crește)
- **Snap:** când cumperi o parte, aceasta merge **direct** într-un subslot liber din Arena
- La finalul Buy Phase, poți **combina** părți

### 3.2 Combinarea Părților în Duel

Similar cu Backpack Battles — combini 2 părți de același tip și aceeași raritate pentru a produce o parte de raritate superioară:

```
Attack Jewel (Common) + Attack Jewel (Common) 
→ Attack Jewel (Uncommon) cu putere mai mare
```

**Reguli:**
- Se combină DOAR în timpul Buy Phase
- Se combină DOAR părți de același tip (Jewel + Jewel, Frame + Frame etc.)
- Se pierd ambele părți originale
- Partea rezultată are același +X (se păstrează upgrade-ul celui mai slab)

### 3.3 Pool-ul pe Rasă

- Fiecare rasă are un set exclusiv de părți disponibile
- La început de duel, jucătorul alege **o singură rasă**
- Profesiile avansate permit **2 sau 3 rase simultan**
- Cu cât mai multe rase, cu atât pool-ul e mai mare și mai variat, dar mai puțin focusat

---

## 4. Arena — Sloturi pentru Cărți

### 4.1 Structură

- Arena are **5 sloturi** pentru cărți (deblocabile până la 8)
- Fiecare slot conține **6 subsloturi**: Frame, Name, Icon, Attack Jewel, Defense Jewel, Skill Rectangle
- Cărțile nu se așază pe un grid — stau în sloturi

### 4.2 Snap Mechanic

- Cumperi o parte din shop → **snap direct** într-un subslot liber
- Nu există inventar de părți — totul e direct în sloturi
- Poți muta părți între sloturi

### 4.3 Starea Cărții

| Stare | Ce face în battle |
|---|---|
| **Gol (0/6)** | Inactiv |
| **Parțial (1–5/6)** | Fiecare parte prezentă își face efectul |
| **Complet (6/6)** | Toate efectele + boost (×1.3) |

### 4.4 Spațiul Extensibil

- Primele 5 sloturi sunt disponibile din start
- Sloturile 6+ se cumpără în Buy Phase
- Costul crește cu câte ai deja

---

## 5. Duelul — Battle Phase

### 5.1 Character HP

```
Character HP = BaseHP (din caracter)
```

- **HP** e determinat de caracter — nu mai există bonus HP din cărți
- Tot damage-ul merge direct la caracter
- **Shield** = temporar, generat de Defense Jewel la activarea cărții
- La HP = 0 → rundă pierdută
- HP-ul se resetează la începutul fiecărei bătălii

### 5.2 Energy System (Global)

- Energia e o resursă **globală**
- Se **regenerează continuu** în timp real (ex: +3/s)
- Are un **cap** (ex: 50)
- Fiecare activare de carte **consumă energie**
- Dacă nu e suficientă, activarea se **amână**

### 5.3 Card Activation Loop

- Fiecare carte din Arena Slots se activează automat pe **cooldown propriu**
- **Cooldown** = secunde între activări (ex: 0.5s–3.0s)
- La activare, **fiecare parte prezentă** își face efectul:
  - Attack Jewel → damage
  - Defense Jewel → shield
  - Skill Rectangle → efect special (Burn, etc.)
- **Carte completă (6/6)** → toate efectele primesc boost (×1.3)
- **Carte incompletă (1–5/6)** → doar părțile prezente funcționează

### 5.4 Shield

- Generat de Defense Jewel la activarea cărții
- Se consumă primul la orice damage
- Expiră la final de rundă

### 5.5 Sfârșitul Bătăliei

- HP ≤ 0 → pierzi
- HP simultan 0 → DRAW
- Time cap → tie-break după % HP

### 5.6 UI Duel

```
┌──────────────────────────────────────────────┐
│  Ignis                     Titanus           │
│  HP ████████ 88/100        HP ██████ 70/130 │
│  Shield ██░ 12             Shield ██░ 8     │
│  Energy 35/55 +3/s         Energy 28/50     │
│                                              │
│  ARENA SLOTS:                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │Scorch│ │Ember │ │Dragon│ │ Gol  │       │
│  │Claw  │ │Shield│ │Brth  │ │      │       │
│  │3/6   │ │2/6   │ │6/6✅│ │      │       │
│  │⏱0.6s │ │⏱1.2s│ │⏱1.8s│ │      │       │
│  │⚡3e  │ │⚡2e  │ │⚡5e  │ │      │       │
│  └──────┘ └──────┘ └──────┘ └──────┘       │
│                                              │
│  › Scorch Claw → 13 dmg + Burn              │
│  › Ember Shield → +8 Shield                 │
└──────────────────────────────────────────────┘
```

---

## 6. Rasele

### 6.1 Concept

- Fiecare rasă are un **element-părinte**
- Fiecare rasă are un **set exclusiv de părți** (Frame, Name, Icon, Jewels, Skills)
- Când jucătorul alege o rasă înainte de duel, shop-ul arată **doar părți din acea rasă**
- Profesiile pot debloca **2 sau 3 rase simultan**

### 6.2 Rasele (v2 — Redesign) + Clase Asociate

Rasa determină **pool-ul de părți** din shop și **pasivul rasial**. Clasa determină **ce items poți echipa** și **bonusul activ**.

| # | Rasă | Identitate | Stil de joc | Clase recomandate |
|---|---|---|---|---|
| 1 | 🐉 **Dragonkin** | Creaturi dragonice, mândre, puternice | Aggro, damage brut, atacuri în zonă | Berserker, Tank |
| 2 | 🧛 **Vampire** | Vampiri nobili, sângeroși, manipulatori | Life steal, control, resurse din dușmani | Assassin, Mage, Berserker |
| 3 | 🤖 **Construct** | Automate antice, precise, rezistente | Tank, defensiv, sinergii de echipă | Tank, Support |
| 4 | 🌿 **Fae** | Spirite ale naturii, jucăușe, imprevizibile | Heal, buff, control al terenului | Mage, Support, Ranger |
| 5 | 👁️ **Eldritch** | Ființe cosmice, de neînțeles, putere brută | Random, debuff, haos controlat | Mage, Assassin |
| 6 | ⚔️ **Knight** | Oameni căliți în luptă, onoare și disciplină | Balanced, versatil, sinergii de arme | Berserker, Tank, Support |
| 7 | 🌑 **Void** | Umbre, neant, putere interzisă | Assassin, burst, stealth | Assassin, Ranger |
| 8 | 🐺 **Lycan** | Bestii sălbatice, primale, de neoprit | Rush, fury, scaling pe măsură ce primesc damage | Berserker, Assassin |
| 9 | ☀️ **Celestial** | Ființe ale luminii, pure, divine | Support, aura, heal în zonă | Support, Mage |
| 10 | 💀 **Necro** | Morți vii, copleșitori, nesfârșiți | Summon, debuff, outnumber | Mage, Assassin |

### 6.3 Progresia Raselor

- La început, jucătorul are acces doar la o rasă (Human / Neutru)
- Prin **profesii**, deblochează rase noi
- Fiecare rasă are propriul **arbore de blueprints** de cercetat
- Fiecare rasă are **caractere proprii** (Icon-uri) care influențează sinergiile

---

## 7. Profesiile

### 7.1 Concept

Profesiile sunt un sistem **profund, elaborat** care controlează:
- Ce **blueprint-uri** poți cerceta
- Ce **rase** poți combina în duel
- Ce **părți** poți crafting
- **Bonusuri pasive** (energie, spațiu în arenă etc.)

### 7.2 Structură Propusă — Sistem Hibrid

```
                    ┌── Blade Forging (EDGE / Attack Jewel)
                    │
        ┌── Forging ─┼── Jewel Cutting (Jewels)
        │           │
        │           └── Frame Crafting (Frame)
        │
        │           ┌── Pyros Lore → deblochează rasa Pyros
        │           │
RACIAL ─┼── Element ─┼── Aqua Lore → deblochează rasa Aqua
LORE    │   Lore    │
        │           ├── Terra Lore → deblochează rasa Terra
        │           └── ... (câte o profesie per rasă)
        │
        │           ┌── Energy Mastery → +energie per rundă
        └── Combat ─┼── Tactician → bonusuri de poziționare
                    │
                    └── Veteran → părți durează mai mult
```

### 7.3 Ce Deblochează Fiecare Profesie

| Profesie | Level 1 | Level 5 | Level 10 |
|---|---|---|---|
| Forging (general) | Poți combina 2 Common → 1 Uncommon (doar Attack Jewel) | Orice parte Common → Uncommon | Poți face Rare din Uncommon |
| Pyros Lore | Poți juca rasa Pyros | Poți combina Pyros + 1 altă rasă | Deblochezi blueprint-uri Pyros exclusive |
| Energy Mastery | +1 energie/rundă | +3 energie/rundă | Energia se regenerează 50% între runde |
| Veteran | Părțile rezistă cu 1 duel mai mult | Părțile rezistă cu 3 dueluri mai mult | Poți repara părți „treite" |

---

## 8. Blueprint-urile

### 8.1 Concept

Un **blueprint** e o rețetă care îți permite să creezi o parte de carte dintr-o rasă specifică. Ce meserie ai îți dictează ce fel de blueprint-uri poți stăpâni și transforma în părți de cărți.

### 8.2 Structură

```
Blueprint „Sabia de Foc" (Pyros, Attack Jewel Rare)
  Profesie necesară: Pyros Lore level 3 + Forging level 5
  Materiale necesare:
    • 3x Attack Jewel Common (Pyros)
    • 2x Essence of Fire (material, din dueluri)
    • 500 gold
  Rezultat: Attack Jewel Rare (Pyros) — damage 25-35
```

### 8.3 Cum se Obțin

| Sursă | Descriere |
|---|---|
| **Shop între dueluri** | Cumperi cu gold |
| **Cercetare** | Investești timp + materiale să deblochezi blueprint-ul |
| **Drops** | La sfârșit de duel, șansă să primești un blueprint |
| **Quest-uri** | Provocări zilnice/săptămânale |
| **Cufere** | Cumperi cu monede din joc |

---

## 9. Economia Generală

### 9.1 Monede

| Monedă | Cum se obține | La ce folosește |
|---|---|---|
| **Gold** | Drops din dueluri, quest-uri | Cumpărat părți, blueprint-uri, reroluri |
| **Essence** | Drops speciali, crafting | Material pentru blueprint-uri |
| **Dust** | Dezasamblare părți | Upgrade +0 → +10 |
| **Gems** | Premium (sau drops rare) | Cufere speciale, skin-uri |

### 9.2 Ciclul Economic

```
DUEL → câștigi Gold + Essence + (poate) Blueprint
  ↓
ÎNTRE DUELURI:
  • Cumperi blueprint-uri din shop
  • Cercetezi blueprint-uri (consumă Essence)
  • Craftezi părți din blueprint-uri (consumă materiale)
  • Upgradezi părți (+0 → +10, consumă Dust)
  • Înveți profesii (consumă Gold + timp)
  ↓
ÎNAINTE DE DUEL:
  • Alegi rasa (în funcție de profesii)
  • Intri în duel cu pool-ul tău de părți disponibile
  ↓
ÎN DUEL:
  • Cumperi părți (din pool-ul rasei)
  • Combini părți (2×Common → 1×Uncommon)
  • Asamblezi cărți pe grid
  ↓
BATTLE → câștigi recompense
```

---

## 10. Sistemul de Security (Fără Web3)

Pentru marketplace/trading viitor:

| Măsură | Descriere |
|---|---|
| **HMAC-signing** | Fiecare parte are o semnătură criptografică la creare |
| **Audit DB** | Toate tranzacțiile înregistrate într-o bază append-only |
| **Server authoritative** | Serverul validează fiecare tranzacție |
| **2FA** | Obligatoriu pentru trading de părți Rare+ |
| **Fraud detection** | Pattern detection automat |
| **Cold storage** | Cheile de signing în HSM/KMS |

---

## 11. Întrebări Deschise (de Discutat)

### 11.1 Grid-ul
- [ ] Dimensiunea totală a grid-ului? (6×6? 7×7? 9×6? Altceva?)
- [ ] O carte ocupă fix 9 pătrățele (3×3) sau poate varia?
- [ ] Se poate roti cartea între Vertical și Orizontal în timpul Buy Phase?

### 11.2 Atacul
- [ ] Cum atacă o carte în poziție verticală? (Front? Row? Random?)
- [ ] Cum funcționează poziția orizontală exact?
- [ ] Vrem Speed/Initiative system sau atac simultan pur?
- [ ] Cum interacționează Skill Rectangle-ul cu țintirea?

### 11.3 Energia
- [ ] Se regenerează complet per rundă sau e pool fix?
- [ ] Cum se calculează consumul de energie per carte?
- [ ] Cum scalează energia cu profesii?

### 11.4 Treirea (Part Durability)
- [ ] După câte dueluri se „trezește" o parte?
- [ ] Ce se întâmplă exact când se trezește? (dispare? revine la +0? devine Veteran?)
- [ ] Poate fi reparată?
- [ ] Attack Jewel vs Defense Jewel — aceeași durabilitate?

### 11.5 Profesiile
- [ ] Câte profesii în total? (10? 20?)
- [ ] Nivel maxim per profesie? (5? 10? Nelimitat?)
- [ ] Cum se învață o profesie? (Gold? Timp? Quest-uri?)
- [ ] Se poate respec/reseta arborele de profesii?

### 11.6 Blueprint-urile
- [ ] Câte blueprint-uri per rasă? (10? 50?)
- [ ] Blueprint-urile se consumă la crafting sau rămân?
- [ ] Pot fi tranzacționate între jucători?

### 11.7 Rasele
- [ ] Câte rase la lansare? (4? 6? 10?)
- [ ] Fiecare rasă are același număr de părți?
- [ ] Există părți neutre (care apar la orice rasă)?

### 11.8 Partea NAME
- [ ] Ce influențează NAME-ul? (sinergii? putere? doar cosmetic?)
- [ ] Cum se generează numele? (din combinația de părți? ales de jucător?)

### 11.9 PvP Flow
- [ ] Matchmaking pe rating? Pe level? Random?
- [ ] Vrem și mod casual (fără risc) și ranked?
- [ ] Se poate face „challenge un prieten" direct?

### 11.10 Combinațiile între părți
- [ ] Doar în duel sau și între dueluri?
- [ ] Doar același tip (Jewel+Jewel) sau și între tipuri diferite?

### 11.11 Monede și Economie
- [ ] Gems — doar cosmétique sau și funcțional?
- [ ] Cât gold per rundă în duel?
- [ ] Există inflation protection?

---

## 12. Roadmap Propusă

| Fază | Conținut | Durată |
|---|---|---|
| **P0 — Core Design** | Document complet, răspuns la toate întrebările deschise | ACUM |
| **P1 — Prototype** | Grid-ul, o singură carte cu Attack Jewel + Defense Jewel, auto-battle de bază | 1-2 săptămâni |
| **P2 — Card Assembly** | Toate părțile, asamblare carte, Buy Phase cu shop + combinare | 1-2 săptămâni |
| **P3 — Rase + Shop** | 2-3 rase, shop pe rasă, alegere rasă înainte de duel | 1 săptămână |
| **P4 — Run Loop** | 13 win / 3 lose, coins per rundă, rerol, recompense | 1 săptămână |
| **P5 — Profesii** | Sistemul de profesii (arbore), 5-10 profesii de bază | 2 săptămâni |
| **P6 — Blueprint-uri** | Cercetare, crafting, materiale | 2 săptămâni |
| **P7 — Upgrade + Treire** | +0 → +10, durabilitate | 1 săptămână |
| **P8 — Polish** | Balance, UI final, efecte vizuale, sunet | 2-3 luni |
| **P9 — Early Access** | Steam, matchmaking, ranking | — |

---

## 13. Moștenire din Tower Run

Cardweave preia **8 sisteme** din Tower Run (adaptate) și lasă **3** în urmă.

### Ce trece în Cardweave

| Sistem Tower Run | Devine în Cardweave |
|---|---|
| 🔥 6 elemente | 6 rase (Pyros, Aqua, Sylph, Terra, Arcanum, Human) |
| ⭐ Rarități (Common→Mythic) | Identic |
| 🃏 Card Skills (11 tipuri) | Skill Rectangle în structura cărții |
| 👥 NPC-uri (Blacksmith, Guild etc.) | Maeștri de profesii |
| 📜 Quest-uri cu penalizări | Provocări săptămânale |
| 📖 Element Knowledge (5 level-uri) | Racial Lore în profesii |
| 🟡 Gold | Moneda principală |
| ⛏️ Materiale | Materiale pentru blueprint-uri |

### Ce rămâne în Tower Run

| Sistem | Motiv |
|---|---|
| Hub (6 clădiri) | Redesign complet pentru Cardweave — nu copiem |
| Character Collection (187) | Prea mult — Cardweave are ~5-10 caractere per rasă |
| Procedural Map + Noduri | PvP nu are hartă de explorat |
| NPC alive flavor / Living Cortex | Prea devreme — poate după launch |
| Momentum / Synergy | Mecanici specifice Tower Run |
| Aegis, Alacrity, Overcharge | Prea legate de Tower Run |
| Minioni | Nu există în Cardweave |
| Duel turn-based | Înlocuit cu auto-battle |

---

## 14. Clasele Caracterelor

Clasele sunt un sistem separat de rase. Rasa determină pool-ul de părți din shop. Clasa determină ce items poți echipa și bonusul pasiv activ.

| Clasă | Weapon | Armor | Bonus pasiv |
|---|---|---|---|
| ⚔️ Berserker | Greatsword | Chainmail | +damage la HP scăzut |
| 🗡️ Assassin | Dagger, Bow | Leather | Primul atac ×2 |
| 🔮 Mage | Staff | Robe | Skill Rectangle ×2 |
| 🛡️ Tank | Sword & Shield | Chainmail | Protejează cărțile alăturate |
| 💉 Support | Staff | Robe | Heal + buff permanent |
| 🏹 Ranger | Bow | Leather | Atacă spatele, ignoră tank |

Vezi SYS-036 — Class System în Systems Catalog pentru detalii complete.

---

## 15. Character Card Pool + Compatibility

Fiecare caracter are un **set propriu de cărți** (5-15), nu un pool generic per rasă. Cărțile se sparg în părți. Shop-ul din duel trage părți **doar din card pool-ul caracterului ales**.

Părțile din cărți diferite pot fi combinate cu **bonus/penalty de compatibilitate**:
- Aceeași carte → +20% stats
- Teme similare → +10%
- Teme diferite → neutru
- Amestec haotic → -20%
- Diferență de raritate → penalizare

Items se echipează înainte de duel, nu se cumpără din shop.

Vezi SYS-037 — Character Card Pool + Compatibility în Systems Catalog.

> Tower Run rămâne un proiect separat — nu îl abandonăm, dar focusul acum e pe Cardweave. Când Cardweave e lansat și stabil, poate reveni ca mod single-player.
