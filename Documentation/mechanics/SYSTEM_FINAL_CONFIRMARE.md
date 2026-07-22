# Cardweave — Sistemul Final (confirmare)

> Tot ce am decis despre cărți, arena slots, părți, battle.
> Scris să verific că am înțeles corect.

---

## 1. Arena = Sloturi pentru Cărți

În loc de grid 6×6 sau skill bar linear, ai o **Arenă cu sloturi** — fiecare slot ține o carte.

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
│ └──────────┘ └──────────┘ └──────────┘ └────────┘ └──────┘ │
│                                                               │
│  Click pe Slot → vezi subsloturile                            │
└───────────────────────────────────────────────────────────────┘
```

- **5 sloturi** (poate mai multe, deblocabile)
- Fiecare slot = o carte
- O carte = 6 subsloturi (Frame, Name, Icon, Attack Jewel, Defense Jewel, Skill Rectangle)

---

## 2. Părțile Cărții — 6 Subsloturi

```
┌─────────────────────────────────────────────┐
│  SLOT 1: Scorch Claw                        │
│                                             │
│  ┌──────────┐  Frame     🟢 Common          │
│  │          │  Name      🟢 "Scorch Claw"   │
│  │   CARTE  │  Icon      ⬜ gol             │
│  │          │  Attack    🟢 Jewel dmg 8-12  │
│  │  3/6     │  Defense   ⬜ gol             │
│  │          │  Skill     🟢 Rectangle Burn  │
│  └──────────┘                               │
│                                             │
│  ⬜ = subslot gol — poți snap o parte       │
│  🟢 = parte ocupată — activă în battle      │
└─────────────────────────────────────────────┘
```

**Cele 6 părți:**

| Parte | Ce face |
|---|---|
| **Frame** | Raritatea vizuală a cărții + bonus pasiv |
| **Name** | Numele + temă + sinergie cu alte nume |
| **Icon** | Caracterul + bonus rasial |
| **Attack Jewel** | Damage la opponent |
| **Defense Jewel** | Shield pentru caracter |
| **Skill Rectangle** | Efect special (Burn, Bleed, Stun, etc.) |

---

## 3. Cum Cumperi și Plasezi Părți

1. **Shop** → vezi părți disponibile din pool-ul caracterului tău
2. **Cumperi o parte** → click, plătești coins
3. **Snap** → partea se duce DIRECT într-un subslot gol
   - Dacă ai mai multe sloturi goale, alegi tu unde
   - Poți muta o parte din slot în slot (costă? NEDECIS)

**Nu există inventar de părți.** Partea pe care o cumperi ajunge instant într-un slot din arenă. Zero stocare, zero „n-am ce face cu asta".

---

## 4. Fiecare Parte E Activă în Battle

**Regula de aur:** Orice parte pusă într-un subslot e activă în battle, indiferent dacă cartea e completă sau nu.

### Cum Funcționează o Carte în Battle

O carte are un **singur cooldown**. Când cooldown-ul ajunge la 0 și e suficientă energie **→ cartea se activează**.

La activare, **fiecare parte prezentă** își face efectul:

| Partea prezentă | Ce face la activare |
|---|---|
| **Attack Jewel** | X damage la opponent |
| **Defense Jewel** | Y shield la caracterul tău |
| **Skill Rectangle** | Aplică efectul (Burn, Bleed, Stun, etc.) |
| **Frame** | Bonus pasiv (ex: +5% damage la această carte) |
| **Name** | Bonus de sinergie (dacă match cu alt nume) |
| **Icon** | Bonus rasial (ex: +10% Burn damage) |

### Exemplu — Aceeași Carte, Diferite Stadii

```
Slot: Scorch Claw

Stadiu 1 — Doar Attack Jewel (1/6)
  La cooldown: 10 damage → gata, funcționează

Stadiu 2 — Attack Jewel + Skill Rectangle (2/6)
  La cooldown: 10 damage + Burn 3/s, 4s

Stadiu 3 — Attack Jewel + Skill Rect + Frame (3/6)
  La cooldown: 10 damage + Burn 3/s + Frame bonus

Stadiu 6 — TOATE 6 părțile
  La cooldown: 15 damage (boost) + Shield 8 (boost) + Burn 5/s + Frame + Name + Icon
```

**Fiecare parte adăugată = carte mai puternică.** Nu există momentul „acum am terminat cartea, începe să funcționeze" — funcționează din secunda 1.

---

## 5. Boost la Carte Completă (6/6)

Când toate 6 subsloturile sunt ocupate:

- Toate efectele primesc un **multiplicator** (ex: ×1.3)
- Cartea **deblochează puterea maximă** — poate apărea un efect bonus sau un unic
- Cartea e considerată **mastered** — poate fi upgrade-uită cu rune

**Înainte de completare:** 3 părți → face 3 efecte la putere normală.
**După completare:** aceleași 3 efecte + încă 3 + boost la toate.

---

## 6. Raritatea pe Carte (Nu pe Părți)

**Părțile nu au raritate.** Sunt doar tip (Attack Jewel, Defense Jewel, etc.) + temă (fire, ice, etc.).

**Raritatea e pe CARTE** și se urcă prin rețete:

```
Scorch Claw (raritate: Common)
  ↑ Upgrade la Uncommon:
    • 1× Rune of Fire
    • 3× Essence
    • 200 gold
  Rezultat: +20% damage, +1s Burn durată

  ↑ Upgrade la Rare:
    • 2× Rune of Fire
    • 1× Catalyst
    • 5× Essence
    • 500 gold
  Rezultat: Skill Rectangle se activează de 2 ori
```

**Rune/Items de upgrade:**

| Item | Efect |
|---|---|
| **Rune elementală** | Necesară pentru upgrade (foc, apă, umbră, etc.) |
| **Catalyst** | Amplifică runa — necesar la rarități înalte |
| **Essence** | Material de bază — din drops |
| **Unique item** | Deblochează efectul ascuns al cărții la Legendary/Mythic |

**Fiecare carte poate urca** Common → Uncommon → Rare → Epic → Legendary → Mythic.

---

## 7. Battle — Cum Se Luptă

```
În Battle Phase:
  Timer rulează în timp real.
  
  Energy += regen_rate × delta
  
  Pentru fiecare carte din Arena Slots:
    Dacă are minim o parte:
      cooldown_timer -= delta
      Dacă cooldown_timer ≤ 0 AND energy ≥ energy_cost:
        activează cartea
        energy -= energy_cost
        cooldown_timer = cooldown
        pentru fiecare parte prezentă:
          execută efectul părții
        dacă carte completă (6/6):
          toate efectele × boost_multiplier

  Damage scade shield-ul opponentului, apoi HP-ul.
  Cine ajunge la HP ≤ 0 → pierde.
```

### UI în Battle

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

---

## 8. Rezumat — Cum Funcționează Totul

| Pas | Ce se întâmplă |
|---|---|
| **Înainte de duel** | Alegi caracterul (Ignis, Noctis, etc.) |
| **Buy Phase (Runda 1)** | Vezi părți în shop → cumperi una → snap direct în subslot gol |
| **Buy Phase (Runda 2)** | Mai cumperi părți → completezi cărțile sau începi altele noi |
| **Oricând** | Poți muta părți între sloturi |
| **Battle Phase** | Fiecare carte cu ≥1 parte se activează pe cooldown |
| **Parte singură** | Face efectul ei (damage, shield, burn) |
| **Carte completă (6/6)** | Toate efectele primesc boost |
| **Între dueluri** | Upgradezi raritatea cărților cu rune |
| **Scop** | 13 win-uri sau 3 lose-uri |

---

**Am înțeles corect totul?**

Dacă da, pe baza asta rescriu SYS-005 (Arena Slots), SYS-004 (Card Assembly → devine snap system), și actualizez restul documentației.
