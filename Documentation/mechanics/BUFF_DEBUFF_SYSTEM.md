# Cardweave — Buff & Debuff System

> Blueprint complet pentru crearea oricărui buff sau debuff în Cardweave.
> Sistem adaptat la mecanica de duel: energy, attack speed, card HP, shield.
> Fiecare buff/debuff e construit pe același schelet — consistență și extensibilitate.

---

## 1. Filosofie

**Nu copiem Backpack Battles/Backpack Brawl.** În acele jocuri, buff-urile sunt legate de **iteme fizice** poziționate într-un backpack. În Cardweave, buff-urile sunt **caracteristice cărților** — vin din:

| Sursă | Exemple |
|---|---|
| **Rasă** | Dragonkin = fire damage over time, Vampire = lifesteal |
| **Clasă** | Mage = spell amp, Tank = thorns, Support = ally heal |
| **Raritate** | Cărțile mai rare au efecte mai puternice sau unice |
| **Items** | Weapon/Armor/Accessory modifică comportamentul cărții |
| **Skill Rectangle** | Efectul activ al cărții (stun, shield, buff ally) |
| **Combinații** | Synergy Score influențează puterea efectelor |

Fiecare carte în luptă **nu e doar un pachet de stats** — e o **sursă de efecte** care se aplică caracterului sau opponentului.

---

## 2. Buff/Debuff Blueprint — Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│                     BUFF / DEBUFF                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  I. IDENTITATE                                              │
│     • Nume unic                                                │
│     • Display name (în UI)                                   │
│     • Tip: [buff | debuff | neutral]                         │
│     • Categorie: [energy | attack | defense | hp | control | synergy] │
│     • Taguri: [fire, ice, dark, holy, poison, bleed, ...]   │
│                                                             │
│  II. ȚINTĂ                                                  │
│     • Cine primește efectul?                                │
│       [self_character | opponent_character | self_card | ally_cards | all_cards] │
│     • Arie: [single | row | column | all]                   │
│                                                             │
│  III. DECLANȘATOR                                           │
│     • Când se aplică?                                       │
│       [on_start | on_attack | on_hit | on_timer | on_stack_threshold | 
│        on_card_placed | on_energy_empty | on_energy_full | permanent] │
│     • % șansă (dacă nu e garantat)                          │
│     • Condiții: [if_energy > X, if_hp < Y%, if_shield_active]│
│                                                             │
│  IV. EFECT                                                  │
│     • Ce face? (vezi secțiunea 3 — EFECTE)                 │
│     • Valoare de bază (scalabilă cu raritate + Synergy)    │
│     • Durată: [instant | timed_seconds | per_stack | until_next_round | permanent] │
│                                                             │
│  V. STACKING                                                │
│     • Cum se cumulează?                                     │
│       [unique | additive | multiplicative | threshold]      │
│     • Limita maximă de stack-uri (dacă e cazul)             │
│     • Ce se întâmplă la stack overflow?                     │
│                                                             │
│  VI. RARITATE & SCALING                                     │
│     • Valoare per raritate (Common→Mythic)                  │
│     • Scaling cu Synergy Score? (da/nu + formula)           │
│     • Scaling cu +X (upgrade-uri)?                          │
│                                                             │
│  VII. AFINITĂȚI                                             │
│     • Rase care au acces la acest efect (sau bonus)         │
│     • Clase care beneficiază mai mult                       │
│     • Items care amplifică efectul                          │
│                                                             │
│  VIII. VIZUAL                                               │
│     • Icon / culoare                                        │
│     • Particle effect                                       │
│     • Sunet                                                 │
│     • Animatie pe card/character bar                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Catalogul Efectelor

### 3.1 Energy

| Efect | Tip | Ce face | Exemple carduri |
|---|---|---|---|
| **Energy Boost** | Buff | +X energy instant | Celestial start bonus |
| **Energy Leech** | Debuff | Fură X energie la atac | Vampire skill |
| **Energy Slow** | Debuff | Redu regen opponent cu X% | Necro curse |
| **Energy Surge** | Buff | +X% regen pentru Ys | Mage buff |
| **Overcharge** | Buff | Depășești capul de energie (până la 2×) | Rare+ Mage |
| **Drain** | Debuff | -X regen opponent, tu +X/2 | Eldritch |

### 3.2 Attack Speed

| Efect | Tip | Ce face | Exemple |
|---|---|---|---|
| **Haste** | Buff | -X% attack interval | Assassin, Ranger |
| **Slow** | Debuff | +X% attack interval | Knight, Eldritch |
| **Freeze** | Debuff | Attack timer pauză Ys | Dragonkin (ice) |
| **Berserk** | Buff | +X% attack speed per Y% HP lipsă | Berserker, Lycan |
| **Lethargy** | Debuff | Attack interval +X%, scade cu fiecare atac | Void curse |

### 3.3 Damage

| Efect | Tip | Ce face | Exemple |
|---|---|---|---|
| **Power** | Buff | +X damage per attack (flat) | Knight, Celestial |
| **Fragile** | Debuff | Opponent primește +X% damage | Necro, Eldritch |
| **Burn** | Debuff | X damage/sec pentru Ys (stackabil) | Dragonkin, Pyromancer |
| **Poison** | Debuff | X damage la fiecare atac al tău (stack) | Vampire, Fae |
| **Bleed** | Debuff | X damage când opponentul atacă | Lycan, Assassin |
| **Corrosion** | Debuff | Opponentul pierde X% din shield la primire | Construct |
| **Amplify** | Buff | Următorul atac face 2× damage | Mage |

### 3.4 Defense / Shield

| Efect | Tip | Ce face | Exemple |
|---|---|---|---|
| **Barrier** | Buff | +X shield instant | Tank, Support |
| **Fortify** | Buff | -X% damage primit pentru Ys | Knight, Construct |
| **Thorns** | Buff | X% damage reflectat la atacator | Tank, Necro |
| **Vulnerable** | Debuff | Opponentul primește cu X% mai mult damage | Assassin |
| **Shield Break** | Debuff | Opponentul pierde X shield | Void, Berserker |
| **Weaken** | Debuff | Atacurile opponentului fac -X damage | Fae curse |

### 3.5 HP / Healing

| Efect | Tip | Ce face | Exemple |
|---|---|---|---|
| **Regeneration** | Buff | +X HP/sec pentru Ys | Celestial, Fae |
| **Lifesteal** | Buff | X% din damage → heal | Vampire, Berserker |
| **Wound** | Debuff | -X% healing primit | Necro, Assassin |
| **Siphon** | Debuff | Fură X HP la fiecare atac al tău | Vampire |
| **Revitalize** | Buff | Heal instant X% din missing HP | Support, Celestial |
| **Decay** | Debuff | -X max HP temporar (se reface la final) | Eldritch, Necro |

### 3.6 Control

| Efect | Tip | Ce face | Exemple |
|---|---|---|---|
| **Stun** | Debuff | Cardul nu atacă Ys | Knight, Dragonkin |
| **Silence** | Debuff | Skill Rectangle dezactivat Ys | Void, Eldritch |
| **Taunt** | Debuff | Forțează opponentul să atace această carte | Tank |
| **Disarm** | Debuff | Attack damage redus la 0 pentru Ys | Construct |
| **Sleep** | Debuff | Cardul nu atacă până nu primește damage | Fae |

### 3.7 Synergy & Special

| Efect | Tip | Ce face | Exemple |
|---|---|---|---|
| **Empower** | Buff | +X% la toate efectele pentru Ys | Mage, Celestial |
| **Echo** | Buff | Când ataci, aplici același efect pe o carte random | Fae |
| **Chain** | Buff | Atacul lovește și o carte adiacentă | Berserker |
| **Curse** | Debuff | Opponentul pierde Synergy Score temporar | Eldritch |
| **Blessing** | Buff | +X% Synergy efectiv | Support |

---

## 4. Reguli de Sistem

### 4.1 Cine poate aplica ce

| Efect | Disponibil | Rase principale | Clase principale | Items |
|---|---|---|---|---|
| Burn | Toate, bonus Dragonkin | Dragonkin, Knight (fire) | Mage, Berserker | Weapon Fire |
| Poison | Fae, Vampire, Necro | Fae, Vampire | Assassin, Ranger | Weapon Poison |
| Bleed | Lycan, Assassin | Lycan, Void | Assassin, Berserker | Weapon Sharp |
| Freeze/Slow | Dragonkin (ice), Mage | Dragonkin, Celestial | Mage, Support | Weapon Ice |
| Haste | Ranger, Assassin | Fae, Lycan | Ranger, Assassin | Boots |
| Shield | Construct, Celestial | Construct, Knight | Tank, Support | Armor |
| Lifesteal | Vampire, Berserker | Vampire, Lycan | Berserker, Assassin | Weapon Blood |
| Stun | Knight, Dragonkin | Dragonkin, Knight | Tank, Berserker | Weapon Heavy |
| Silence | Void, Eldritch | Void, Eldritch | Mage, Assassin | Accessory |
| Regen | Celestial, Fae | Celestial, Fae | Support, Mage | Armor Holy |
| Thorns | Necro, Construct | Necro, Construct | Tank | Armor Spiked |
| Energy Leech | Vampire, Eldritch | Vampire, Eldritch | Mage, Assassin | Accessory |

### 4.2 Raritate & Scaling

```
Valoare efect = valoare_bază × multiplier_raritate × (1 + synergy_bonus)
```

| Raritate | multiplier_raritate |
|---|---|
| Common | 0.5× |
| Uncommon | 0.75× |
| Rare | 1.0× |
| Epic | 1.5× |
| Legendary | 2.0× |
| Mythic | 3.0× |

**Synergy bonus**: `+X%` unde X = Synergy Score × 0.1 (ex: Synergy 80 → +8%)

### 4.3 Stivuire (Stacking)

| Regulă | Comportament | Exemple |
|---|---|---|
| **Unique** | Nu se cumulează, doar refresh de durată | Haste, Stun |
| **Additive** | Se adună stack-urile, fiecare cu valoarea lui | Burn, Poison |
| **Multiplicative** | Se înmulțesc valorile (rar) | Amplify, Vulnerable |
| **Threshold** | Efectul se declanșează când se atinge un număr de stack-uri | Freeze (la 10 stack-uri → stun 1s) |

### 4.4 Dimensiuni Temporale

```
instant → se aplică și dispare imediat (damage, heal instant)
timed  → durează X secunde (Haste 4s, Burn 6s)
stack  → durează cât timp cardul e pe grid (permanent pe durata bătăliei)
round  → expiră la final de rundă
```

---

## 5. Exemple Complete de Buffs/Debuffs

### 5.1 Dragonkin — Burn

```
┌─────────────────────────────────────────────┐
│  NUME: Burn                                 │
│  TIP: debuff                                │
│  CATEGORIE: damage                          │
│  TAG: fire                                  │
│                                              │
│  ȚINTĂ: opponent_character                  │
│  APLICAT DE: card cu Attack Jewel fire      │
│                                              │
│  DECLANȘATOR: on_hit (60% șansă)            │
│                                              │
│  EFECT: 3 damage/sec × raritate (6s)        │
│  Common: 1.5/s | Rare: 3/s | Mythic: 9/s   │
│                                              │
│  STACKING: additive, max 5 stack-uri        │
│  La 5 stack-uri → EXPLODE: 20 damage instant│
│                                              │
│  RASE: Dragonkin (triple damage), Knight (½)│
│  CLASE: Mage (+20% durată), Berserker (+1 stack cap) │
│  ITEMS: Weapon Fire (+1 stack per atac)     │
│                                              │
│  VIZUAL: 🔥 pe enemy HP bar + particule     │
└─────────────────────────────────────────────┘
```

### 5.2 Vampire — Lifesteal

```
┌─────────────────────────────────────────────┐
│  NUME: Lifesteal                             │
│  TIP: buff                                   │
│  CATEGORIE: hp                               │
│  TAG: blood                                  │
│                                              │
│  ȚINTĂ: self_character                       │
│  APLICAT DE: card Vampire + Skill Rectangle │
│                                              │
│  DECLANȘATOR: permanent (cât e pe grid)      │
│                                              │
│  EFECT: X% din damage → heal                │
│  Common: 10% | Rare: 20% | Mythic: 40%      │
│                                              │
│  STACKING: unique (nu se cumulează)          │
│                                              │
│  RASE: Vampire (×2 efect), Lycan (×0.5)     │
│  CLASE: Assassin (+50% pe crit), Berserker (funcție de HP lipsă) │
│  ITEMS: Weapon Blood (+10%), Armor Blood (+5%) │
│                                              │
│  VIZUAL: 🩸 glow pe card + heal number popup │
└─────────────────────────────────────────────┘
```

### 5.3 Void — Silence

```
┌─────────────────────────────────────────────┐
│  NUME: Silence                               │
│  TIP: debuff                                 │
│  CATEGORIE: control                          │
│  TAG: dark                                   │
│                                              │
│  ȚINTĂ: opponent_character                   │
│  APLICAT DE: card Void + Skill Rectangle     │
│                                              │
│  DECLANȘATOR: on_attack (30% șansă)          │
│                                              │
│  EFECT: O carte random oponentă              │
│  → Skill Rectangle dezactivat pentru 3s      │
│  (scalabil cu raritate: +1s per rarity tier) │
│                                              │
│  STACKING: additive pe aceeași carte         │
│  (max 5s silence total per card)             │
│                                              │
│  RASE: Void (×2 durată), Eldritch (+1 carte)│
│  CLASE: Mage (aplică pe 2 cărți random),     │
│         Assassin (prioritizează cea mai      │
│         puternică carte)                     │
│  ITEMS: Accessory Dark (+1s)                │
│                                              │
│  VIZUAL: 🔇 icon pe card + shimmer negru    │
└─────────────────────────────────────────────┘
```

### 5.4 Celestial — Regeneration

```
┌─────────────────────────────────────────────┐
│  NUME: Regeneration                          │
│  TIP: buff                                   │
│  CATEGORIE: hp                               │
│  TAG: holy                                   │
│                                              │
│  ȚINTĂ: self_character                       │
│  APLICAT DE: card Celestial pe grid          │
│                                              │
│  DECLANȘATOR: permanent (pasiv)              │
│                                              │
│  EFECT: +X HP/s recovers                     │
│  Common: 1/s | Rare: 3/s | Mythic: 8/s      │
│                                              │
│  STACKING: additive (dacă ai 2 cărți         │
│  Celestial cu Regen, se adună)              │
│                                              │
│  RASE: Celestial (×2), Fae (×1.5)           │
│  CLASE: Support (heal și ally),             │
│         Tank (×1.5 când HP < 30%)           │
│  ITEMS: Armor Holy (+1/s), Amulet (+0.5/s)  │
│                                              │
│  VIZUAL: ☀️ glow pe caracter + +XX float   │
└─────────────────────────────────────────────┘
```

### 5.5 Construct — Fortify

```
┌─────────────────────────────────────────────┐
│  NUME: Fortify                               │
│  TIP: buff                                   │
│  CATEGORIE: defense                          │
│  TAG: earth, metal                           │
│                                              │
│  ȚINTĂ: self_character                       │
│  APLICAT DE: card Construct în orientare     │
│  orizontală                                  │
│                                              │
│  DECLANȘATOR: on_hit (când primești damage)  │
│                                              │
│  EFECT: -X% damage primit pentru 4s         │
│  Common: -10% | Rare: -20% | Mythic: -40%   │
│                                              │
│  STACKING: unique (refresh durată)           │
│                                              │
│  RASE: Construct (×2), Knight (+1s durată)  │
│  CLASE: Tank (+5% per 10% HP lipsă),        │
│         Support (aplică și pe ally)          │
│  ITEMS: Armor Metal (+5%), Shield (+10%)    │
│                                              │
│  VIZUAL: 🛡️ glow pe caracter + shimmer     │
└─────────────────────────────────────────────┘
```

---

## 6. Generare Random de Efecte pe Carte

Când o carte e asamblată în Buy Phase, Skill Rectangle-ul poate genera un efect random (sau din listă restrânsă pe baza rasei/clasei):

```
1. Determină pool-ul de efecte (bazat pe rasă + clasă)
2. Alege random un efect din pool
3. Calculează valoarea (bazată pe raritatea Skill Rectangle-ului)
4. Aplică scaling-ul (Synergy Score, +X upgrade)
5. Asignează efectul cărții
```

**Pool weight per rasă:**

| Rasă | Efecte principale | Efecte secundare | Efecte rare |
|---|---|---|---|
| Dragonkin | Burn, Power | Stun, Haste | Freeze |
| Vampire | Lifesteal, Siphon | Poison, Energy Leech | Bleed |
| Construct | Barrier, Fortify | Thorns, Shield Break | Weaken |
| Fae | Regen, Poison | Echo, Sleep | Haste |
| Eldritch | Energy Leech, Decay | Silence, Curse | Amplify |
| Knight | Power, Barrier | Haste, Fortify | Taunt |
| Void | Silence, Drain | Bleed, Fragile | Curse |
| Lycan | Bleed, Berserk | Haste, Lifesteal | Chain |
| Celestial | Regen, Barrier | Blessing, Power | Revitalize |
| Necro | Decay, Thorns | Wound, Poison | Drain |

**Pool weight per clasă:**

| Clasă | Efecte principale | Efecte secundare |
|---|---|---|
| Berserker | Berserk, Power, Bleed | Chain, Lifesteal |
| Assassin | Haste, Bleed, Poison | Silence, Energy Leech |
| Mage | Burn, Amplify, Freeze | Empower, Echo |
| Tank | Barrier, Fortify, Thorns | Taunt, Shield Break |
| Support | Regen, Barrier, Blessing | Revitalize, Fortify |
| Ranger | Haste, Poison, Bleed | Slow, Burn |

---

## 7. Implementare Date

Buful/Debuff-ul e structură de date, nu cod separat pentru fiecare efect.

```json
{
  "id": "burn",
  "display_name": "Burn",
  "type": "debuff",
  "category": "damage",
  "tags": ["fire"],
  "target": "opponent_character",
  "trigger": {
    "type": "on_hit",
    "chance": 0.6,
    "condition": null
  },
  "effect": {
    "type": "damage_over_time",
    "base_value": 3,
    "duration": 6,
    "interval": 1,
    "rarity_scaling": [0.5, 0.75, 1.0, 1.5, 2.0, 3.0]
  },
  "stacking": {
    "mode": "additive",
    "max_stacks": 5,
    "on_max_stacks": {
      "action": "explode",
      "value": 20,
      "clears_stacks": true
    }
  },
  "affinities": {
    "races": { "dragonkin": 3.0, "knight": 0.5 },
    "classes": { "mage": { "duration_mult": 1.2 }, "berserker": { "stack_cap_plus": 1 } },
    "items": { "weapon_fire": { "extra_stacks_per_attack": 1 } }
  },
  "visual": {
    "icon": "🔥",
    "color": "#FF4500",
    "particle": "fire"
  }
}
```

---

## 8. Reguli de Aur

1. **Un efect pe card** (Skill Rectangle-ul dă un singur efect)
2. **Items pot adăuga efecte suplimentare** (Weapon = efect ofensiv, Armor = efect defensiv, Accessory = efect special)
3. **Același efect nu se cumulează de la aceeași sursă** (dar se cumulează de la surse diferite)
4. **Debuff-urile au prioritate: Control > Damage > Stats**
5. **Buffs și debuffs de același tip se anulează** (ex: Haste + Slow pe aceeași țintă → rămâne doar cel mai puternic)
6. **Synergy Score influențează TOATE efectele** (nu doar stats)
7. **Raritatea determină puterea efectului** — o carte Common nu face stun de 3s

---

## 9. Istoric

| Dată | Schimbare |
|---|---|
| 2026-07-20 | Versiune inițială — blueprint complet cu catalog de efecte, afinități, scaling, exemple per rasă/clasă |
