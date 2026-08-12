# Lowborn — Game Design Document (v3)

**Status:** ✅ Aprobat — 2026-08-12 (revival card crafting)
**Gen:** Card game roguelike — turn-based deckbuilder single-player
**Motor:** Godot 4.x (GDScript) | **Platformă:** Steam (desktop) + Web (itch.io)
**Model:** Offline-first — 100% local, AI opponent adaptiv (Cardinal)
**Direcție:** Card Crafting + Professions (revival concept Cardweave v1, fuzionat cu Character Evolution)

---

## 0. Filosofie

> „Nu găsești cărți gata făcute. Ți le forjezi singur, din părți."

Lowborn este un deckbuilder roguelike unde **fiecare carte e construită de jucător** din 3 părți:
rasă, rol și esență. Părțile se obțin prin **meserii cu progresie MMORPG** — skill tree,
materiale rare, rețete de descoperit, dezasamblare. Între run-uri, personajul evoluează din
țăran în legendă, iar cariera lui se vede în fiecare carte din pachet.

---

## 1. Istoric — de ce această direcție

| Etapă | Data | Direcție | Verdict |
|-------|------|----------|---------|
| Cardweave v1 | 2026-07-18 | Card crafting din 6 părți + profesii, auto-battler (PixiJS) | Concept excelent, execuție înlocuită |
| Lowborn v2 | 2026-07-24 | Character Evolution + Subordinates, auto-battler (Godot) | Progresie bună, gen saturat |
| **Lowborn v3** | **2026-08-12** | **Card crafting din 3 părți + meserii MMORPG, turn-based (Godot)** | **Curent** |

**Decizie de piață (aug 2026):** auto-battler-ul single-player e saturat (59+ jocuri
"backpack" pe Steam). Deckbuilder-urile turn-based au istoric de mega-hit-uri (Balatro 5M+,
Slay the Spire 5M+). Crafting-ul profund se simte în turn-based: fiecare carte crafteită
e o decizie conștientă în fiecare rundă.

**Ce păstrăm din v2:** Character Evolution (țăran → legendă), AI Cardinal (opponent adaptiv),
subalternii (devin părți de cărți), arhitectura Godot offline-first.

---

## 2. Core Loop (30 de secunde)

```
Trage cărți → Decizie (joacă / combină / dezasamblează) → Explozie de efecte → Recompensă → Repetă
```

Fiecare rundă are 3 straturi de decizie:
1. **Ce joc?** — alegerea tactică (ce carte lovește acum)
2. **Ce combin?** — alegerea strategică (2 cărți slabe → 1 mai bună)
3. **Ce dezasamblez?** — alegerea economică (materiale pentru atelier)

---

## 3. Structura Cărții — 3 Părți

Fiecare carte = 3 părți independente, fiecare cu raritate și proprietăți proprii:

```
┌──────────────────────────────┐
│  [RASĂ]      Goblin          │ ← identitatea + bonus rasial
│  [ROL]       Războinic       │ ← puterea de bază (dmg/shield/efect)
│  [ESENȚĂ]    Viteaz          │ ← modificatorul (afix, poate fi gol)
│                              │
│  8 DMG · Taunt · +2 Shield   │ ← totalul calculat din părți
└──────────────────────────────┘
```

| Parte | Funcție | Produsă de |
|-------|---------|------------|
| **Rasă** | Identitate, bonus rasial, sinergii între rase | Bestiar / evenimente |
| **Rol** | Puterea de bază — attack, defense, efect special | Meserii de arme (Fierar) |
| **Esență** | Modificator — element, afix, condiție (poate fi gol) | Meserii de esențe (Alchimist) |

**Proprietăți:**
- Fiecare parte are raritate: Common → Uncommon → Rare → Epic → Legendary
- O carte cu 3/3 părți primește bonus de completitudine (×1.3 putere)
- Părțile se pot dezasambla individual (economie circulară)
- Upgrade de parte: +0 → +10 cu materiale (scara MMORPG)

**Exemple de carte:**
- `[Goblin] + [Războinic] + [Viteaz]` = 8 DMG, Taunt, +2 Shield
- `[Om] + [Vrăjitor] + [Ardere]` = 6 DMG + Burn (dot)
- `[Trol] + [Gardian] + [∅]` = 4 DMG, 12 Shield (esență goală = mai ieftină)

**Scală de conținut:** 10 rase × 10 roluri × 10 esențe = 1.000 combinații de cărți,
cu doar 30 de asset-uri de artă (modulară, generată cu ComfyUI).

---

## 4. Meseriile — Crafting MMORPG

Meseriile sunt coloana vertebrală a progresiei. Fiecare meserie are skill tree propriu,
niveluri, rețete de descoperit și materiale rare.

### Meseriile de bază

| Meserie | Produce | Mecanica specifică |
|---------|---------|--------------------|
| **Fierar** | Roluri (arme, armuri) | Forjare cu calitate: material + rețetă → parte; crit la forjă |
| **Alchimist** | Esențe (afixe, elemente) | Preparare cu ingrediente; combinații secrete de descoperit |
| **Vrăjitor de rune** | Upgrade-uri de parte (+0 → +10) | Inscriere rune pe părți; rune rare din dezasamblare |
| **Bucătar** | Consumabile (potion-uri pentru run) | Provizii din ingrediente; buff-uri temporare |

### Sisteme MMORPG incluse

- **Skill tree per meserie** — noduri active/pasive, specializări (ex: Fierar → Arme Grele / Armuri)
- **Materiale rare** — Common → Legendary; drop din lupte, quest-uri, dezasamblare
- **Rețete de descoperit** — unele cunoscute, altele se descoperă prin experimentare
- **Dezasamblare** — orice parte/carte poate fi descompusă în materiale (nimic nu se pierde)
- **Calitate la crafting** — rezultate cu bonus (crit craft), influențate de skill tree
- **Economie circulară** — materiale → părți → cărți → (câștig) sau → dezasamblare → materiale

---

## 5. Run-ul — Turn-based Roguelike

O partidă = ~45-60 min. Hartă cu noduri (stil Slay the Spire), lupte turn-based cu energie.

### Harta

```
START → [Luptă] → [Eveniment] → [Atelier] → [Piață] → [Luptă] → ... → [ȘEF]
```

| Nod | Ce oferă |
|-----|----------|
| **Luptă** | Materiale + alegere 1 din 3 părți de carte |
| **Eveniment** | Decizii narative, risc/recompensă, meserii speciale |
| **Atelier** | Crafting: combină părți, cercetează rețete, dezasamblează |
| **Piață** | Cumperi părți/materiale cu monede |
| **Șef** | Recompensă mare + materiale rare, progresul carierei |

### Lupta turn-based

- Mână de cărți + energie pe tură (regenerare standard)
- Cărțile jucate consumă energie; efectele se rezolvă imediat (dmg, shield, dot, debuff)
- Adversarul e controlat de **AI Cardinal** (adaptiv, vezi §7)
- Combinații în luptă: 2 cărți din mână → 1 mai puternică (costă acțiune, economie de slot)

---

## 6. Meta-Progresia — Între Run-uri (persistent)

- **Character Evolution** — țăranul evoluează cu fiecare run; viața lui e firul narativ
- **Meseriile persistă** — niveluri, skill tree, rețete descoperite rămân între run-uri
- **Materialele persistă** — colecție persistentă (economia pe termen lung)
- **Cărțile din colecție** — părți/cărți păstrate între run-uri (bază pentru deck-uri noi)
- **Obiective pe termen lung** — rețete legendare, specializări de meserie, transformări de personaj

---

## 7. AI Cardinal

Opponent adaptiv (din `Documentation/systems/cardinal/CARDINAL_ENGINE.md`):
- Se adaptează la stilul jucătorului (agresiv/defensiv/combo)
- Scalează dificultatea pe flow (nu frustrare)
- Fără server: totul local, seed procedural

---

## 8. Tehnologie & Art Pipeline

| Strat | Tehnologie | Detalii |
|-------|------------|---------|
| Motor | Godot 4.x (GDScript) | Scene Control + 2D, autoloads (GameManager, EventBus, SaveLoad, CardinalAI, CraftingSystem) |
| Date | Resources (.tres) | CardPartData (rasă/rol/esență), RecipeData, ProfessionData, SkillTreeData |
| Save | Local, portabil | Fișier de save JSON/Resource |
| Art | **ComfyUI (pipeline modular)** | 30 asset-uri de bază → 1.000 combinații; frame-uri per raritate; asamblare procedurală în Godot |

**Principiu:** zero asset-uri desenate individual — artă modulară generată + asamblată.

---

## 9. Non-Goals (YAGNI — explicit)

- Fără multiplayer / PvP (offline-first, AI înlocuiește)
- Fără server, fără backend
- Fără animații 3D / fizică complexă
- Fără crafting „open-world" — meseriile sunt în ateliere din run + hub persistent
- Fără DLC/season pass la lansare
