# Development Constitution — Cardweave

> Regulile fundamentale de development pentru un joc **offline-first**.
> Zero server, zero infrastructură. Totul e local.

---

## 1. Arhitectura Generală

```
┌──────────────────────────────────────────────────────┐
│                    CARDWEAVE                          │
│                                                       │
│  ┌────────────────────────────────────────────┐      │
│  │              TAURI (desktop)                 │      │
│  │         WebView / Browser (web)             │      │
│  ├────────────────────────────────────────────┤      │
│  │          REACT APP (UI layer)                │      │
│  │  Menus, Shop, Assembly, Crafting, HUD       │      │
│  ├────────────────────────────────────────────┤      │
│  │          PIXIJS (game rendering)             │      │
│  │  Grid, cards, battle animations, VFX        │      │
│  ├────────────────────────────────────────────┤      │
│  │          GAME ENGINE (TypeScript)            │      │
│  │  BattleSimulator, AI, Quest Factory,        │      │
│  │  Progression, Economy, Save/Load            │      │
│  ├────────────────────────────────────────────┤      │
│  │          STORAGE (IndexedDB / SQLite)        │      │
│  │  Player profile, collection, settings       │      │
│  └────────────────────────────────────────────┘      │
│                                                       │
│  FĂRĂ server. FĂRĂ backend. Totul pe client.         │
└──────────────────────────────────────────────────────┘
```

### Principii Fundamentale

| Principiu | Explicație |
|-----------|------------|
| **Totul local** | Jocul funcționează 100% fără internet |
| **Zero server** | Fără Rust, fără PostgreSQL, fără VPS |
| **Datele sunt ale jucătorului** | Save local, portabil, backup manual |
| **AI înlocuiește PvP** | Opponent adaptiv, nu matchmaking |
| **Single-player first** | Orice sistem e gândit pentru un singur jucător |

---

## 2. Save Game & Data Integrity

Singurul "server" e **mașina jucătorului**. Datele sunt stocate local. Nu putem împiedica un jucător să-și modifice save-ul, dar putem face să nu merite efortul.

### 2.1 Save File Structure

```
App Data Directory /
├── saves/
│   ├── autosave.cws        ← Save automat (la fiecare rundă)
│   ├── slot_01.cws         ← Save manual (5 sloturi)
│   ├── slot_02.cws
│   ├── ...
│   └── slot_05.cws
├── profile.cwp             ← Player profile (statistici, achievements)
├── collections.cwc          ← Colecția de părți și cărți
├── settings.cwcfg           ← Setări joc
└── replays/
    └── *.cwrep              ← Replay-uri salvate
```

### 2.2 Save Integrity

| Măsură | Detaliu |
|--------|---------|
| **Checksum** | Fiecare save file are un CRC32/SHA256 al conținutului. La load, se verifică. |
| **Corruption detection** | Dacă checksum-ul nu coincide → save corupt → backup recovery |
| **Version stamp** | `saveVersion: number` în fiecare save. La upgrade, migrare automată. |
| **Lazy validation** | Nu blocăm jucătorul dacă modifică save-ul. E jocul lui, joacă cum vrea. Dar achievements și leaderboard local se dezactivează dacă detectăm tampering. |

**FILOSOFIE:** E single-player. Dacă jucătorul vrea să trișeze, se trișează singur. Noi facem jocul suficient de bun încât să NU VREA să trișeze.

### 2.3 Save Corruption Recovery

```
La load:
  1. Citește .cws file
  2. Verifică checksum
  3. Dacă checksum OK → load normal
  4. Dacă checksum fail → caută .cws.bak (backup automat din urmă)
  5. Dacă nici backup nu e valid → notifică jucătorul, oferă sloturile剩下的
```

---

## 3. Battle System — Deterministic

### 3.1 Principii

```
Același seed + aceleași snapshot-uri (grid + cărți) = același rezultat
MEREU. PE ORICE MAȘINĂ. ORICÂND.
```

### 3.2 BattleSimulator

```typescript
class BattleSimulator {
  private rng: SeededRNG;
  private player: BattleState;
  private opponent: BattleState;

  constructor(seed: number, playerSnapshot: Snapshot, opponentSnapshot: Snapshot) {
    this.rng = new SeededRNG(seed);
    this.player = this.buildState(playerSnapshot);
    this.opponent = this.buildState(opponentSnapshot);
  }

  run(): BattleResult {
    // 1. Calculează damage simultan
    // 2. Aplică efecte
    // 3. Verifică condiții de win/lose
    // 4. Returnează BattleResult + BattleEvent[]
  }
}
```

Seed-ul e derivat din: `runId + roundNumber + playerProfile.id` (consistent).

### 3.3 Replay

```typescript
interface BattleResult {
  winner: 'player' | 'opponent';
  playerRemainingHP: number;
  opponentRemainingHP: number;
  events: BattleEvent[];
  seed: number;
}
```

BattleResult e suficient să reconstruiască bătălia frame cu frame. Replay-urile sunt stocate local și pot fi re-vizionate oricând.

---

## 4. AI Opponent — Adaptiv

*(placeholder — se va detalia într-un design doc separat)*

```
- 20+ strategii de bază
- Se adaptează la stilul jucătorului
- Dificultate dinamică (1-10)
- Face greșeli credibile la dificultăți mai mici
- Boss fights la dificultate maximă
```

---

## 5. Codul — Reguli Stricte

### 5.1 TypeScript

| Regula | Detaliu |
|--------|---------|
| `strict: true` în tsconfig | Fără excepții |
| Fără `any` | Folosește `unknown` + type guards |
| Fără `as` type casting | Folosește zod pentru validare |
| Fără `// @ts-ignore` | Niciodată |
| Fără `console.log` | În producție e eroare de build |
| Toate funcțiile publice au JSDoc | Ce face, ce primește, ce returnează |

### 5.2 Rust (Tauri backend)

| Regula | Detaliu |
|--------|---------|
| `deny(unsafe_code)` | Zero unsafe |
| Fără `.unwrap()` | Folosește pattern matching sau `?` |
| Comenzi specifice | Fără `read_file` generic — fiecare comandă face un singur lucru |
| Scope minim | Comanda returnează doar ce trebuie UI-ului |

### 5.3 General

- Fiecare funcție care atinge save/load e testată
- Fără cod mort, fără TODO-uri, fără commented-out code
- Log-urile nu conțin date personale

---

## 6. Branch Strategy & Git

### 6.1 Branch-uri

```
main (protejat) ──── Doar din PR-uri cu review
  │
  ├── docs/*          ← Documentație
  │
  └── feat/*          ← Feature-uri
       │
       ├── feat/card-assembly-t001
       ├── fix/battle-sim-bug
       └── refactor/ai-engine
```

### 6.2 Protecții

| Branch | Protecție |
|--------|-----------|
| `main` | Nimeni nu face push direct. Doar PR cu review. CI must pass. |
| `feat/*` | Fără protecții specifice, dar merged doar cu PR |

### 6.3 Commit Format

```
<type>(<scope>): <descriere>

tipuri: feat, fix, docs, style, refactor, perf, test, chore
scope: grid, battle, ai, shop, ui, save, etc.

Exemple:
  feat(grid): add 12x8 grid rendering with cell types
  feat(ai): add Counter strategy that exploits player weakness
  fix(battle): prevent division by zero in damage calc
  test(battle): add 500 grid combinations validation test
```

---

## 7. PR Rules & Review

### 7.1 PR Template

```markdown
## Ce face acest PR

## Checklist
- [ ] Rulează local
- [ ] Teste unitare adăugate
- [ ] Fără `any`/`as`/`@ts-ignore`
- [ ] Fără secrete în cod
- [ ] Save integrity păstrată (dacă modifică date salvate)
- [ ] Battle determinism păstrat (dacă modifică battle)

## Screenshots (dacă e UI)
```

### 7.2 Reviewer Checklist

1. **Logic review** — face ce zice ticket-ul? Edge cases acoperite?
2. **Code review** — tipare, nume, structură, fără cod mort?
3. **Test review** — teste suficiente? Battle determinism păstrat?

---

## 8. Testing

### 8.1 Battle Tests

```
Test[deterministic_same_input] = același seed → același rezultat (de 100 de ori)
Test[grid_valid_3x3_vs_empty] = carte 3×3 vs nimic → win
Test[grid_invalid_overlap] = cărți suprapuse → eroare validare
Test[battle_simultaneous_attack] = ambele cărți lovesc simultan
Test[battle_edge_hp_zero] = carte cu HP=0 → nu mai atacă
Test[battle_player_hp_zero] = jucător cu HP=0 → rundă pierdută
```

### 8.2 AI Tests

```
Test[ai_basic_decision] = AI-ul cumpără o parte când are destui coins
Test[ai_no_negative_coins] = AI-ul nu cumpără ce nu-și permite
Test[ai_strategy_variety] = 10 run-uri cu același AI → strategii diferite
Test[ai_difficulty_scaling] = AI dificultate 10 e mai tare decât dificultate 1
Test[ai_adaptation] = AI-ul își schimbă strategia după ce pierde de 3 ori la rând
Test[ai_credible_mistakes] = AI-ul face greșeli la dificultate scăzută
```

### 8.3 Save/Load Tests

```
Test[save_write_and_read] = salvează → încarcă → aceeași stare
Test[save_corruption_detection] = modifică save file manual → checksum fail
Test[save_backup_recovery] = corupt → backup automat → recovery OK
Test[save_version_migration] = save vechi → migrare la versiune nouă
```

### 8.4 Performance Tests

```
Test[arena_5_slots] = 5 sloturi + 6 subsloturi fiecare → <16ms render
Test[battle_5_cards_vs_5] = 5 cărți vs 5 → <100ms calcul
Test[ai_decision_50ms] = AI ia decizie în <50ms
Test[save_100kb] = save 100KB → <500ms load
```

### 8.5 Automatizare

```
GitHub Actions:
  ├── on push → lint + type check + test
  ├── on PR → lint + type check + test + build
  └── release → full test suite + build
```

---

## 9. Resursele Jocului — Date Locale

### 9.1 Stocare

| Ce | Unde | Format |
|----|------|--------|
| Save games | `AppData/saves/*.cws` | JSON comprimat + checksum |
| Player profile | `AppData/profile.cwp` | JSON |
| Collection | `AppData/collections.cwc` | JSON comprimat |
| Settings | `AppData/settings.cwcfg` | JSON |
| Replays | `AppData/replays/*.cwrep` | JSON (battle events) |
| Cache/assets | `AppData/cache/` | PNG, sprite sheets |

### 9.2 Transparență

Toate fișierele de save sunt JSON. Jucătorul le poate deschide, edita, backup-ui, partaja. Facem jocul **player-friendly** — nu luptăm împotriva jucătorului.

---

## 10. Dependințe & Tooling

| Categorie | Ce folosim | Motiv |
|-----------|------------|-------|
| State management | Zustand | Simplu, tipat, performant |
| Form validation | Zod | Runtime type checking |
| Game rendering | PixiJS 8 | Grid, cards, battle animations |
| Desktop wrapper | Tauri 2 | Cross-platform, lightweight |
| Storage | idb (IndexedDB wrapper) | Save/load fișiere |
| Audio | Howler.js | Sound effects, music |
| Testing | Vitest | Rapid, compatibil Vite |
| Linting (TS) | ESLint + Prettier | Consistent |
| CI/CD | GitHub Actions | Build + test la fiecare PR |

---

*Document actualizat: 2026-07-18*
*Direcție: Offline-first*
