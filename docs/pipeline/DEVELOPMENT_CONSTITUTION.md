# Development Constitution — Cardweave

> Regulile fundamentale de development. **Security first, server-authoritative, zero shortcuts.**
> Acest document e biblic — orice instanță Hermes sau developer uman îl urmează.

---

## 1. Arhitectura Generală — Granița Inviolabilă

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT (Tauri)                        │
│  React UI + PixiJS Game                                  │
│  │                                                        │
│  │  ● Afișează stare (primite de la server)              │
│  │  ● Trimite acțiuni la server                          │
│  │  ● Rulează BattleSimulator DOAR pentru preview        │
│  │  ● NU deține stări financiare (gold, dust etc.)       │
│  └──────┬─────────────────────────────────────────────┘
│         │ WebSocket / REST
│         ▼
│  ┌──────────────────────────────────────────────────────────┐
│  │                  SERVER (Rust + Axum)                     │
│  │                                                           │
│  │  ● Validează ORICE acțiune primită                       │
│  │  ● Este singura sursă de adevăr (source of truth)        │
│  │  ● Rulează BattleSimulator (versiunea autoritară)        │
│  │  ● Gestionează resurse, economie, progresie              │
│  │  ● Semnează criptografic părțile de cărți (HMAC)        │
│  └──────────┬────────────────────────────────────────────┘
│             │
│             ▼
│  ┌──────────────────────────────────────────────────────────┐
│  │              PostgreSQL + Redis                           │
│  │  ● Date persistente (jucători, părți, istoric)          │
│  │  ● Audit log append-only                                │
│  │  ● Matchmaking queue (Redis)                            │
│  └──────────────────────────────────────────────────────────┘
```

### Regula de Aur

> **Serverul decide TOT. Clientul e doar un terminal grafic.**
> Dacă clientul zice X și serverul zice Y, Y câștigă. Mereu.

### Date Flow

```
Acțiune UI → Action Factory → Serializare → Server
                                                    │
                          ┌─────────────────────────┤
                          │ Validare (server-side)   │
                          │ ├─ Jucătorul există?     │
                          │ ├─ Are dreptul?          │
                          │ ├─ Acțiunea e validă?    │
                          │ └─ Resursele sunt OK?    │
                          └─────────┬───────────────┘
                                    │
                          ┌─────────▼───────────────┐
                          │ Execuție (server-side)   │
                          │ ├─ Actualizează DB      │
                          │ ├─ Scrie în audit_log   │
                          │ └─ Returnează stare     │
                          └─────────────────────────┘
                                    │
                                    ▼
Client → Deserializare → State Store → Re-render UI
```

---

## 2. Server-Authoritative — Totul

### 2.1 Reguli Generale

| Regula | Explicație | Sancțiune |
|--------|------------|-----------|
| Serverul validează ORICE intrare | Fiecare endpoint verifică datele înainte de procesare | Bug critic |
| Clientul nu decide niciodată rezultatul | Serverul calculează damage, resurse, outcome | Bug critic |
| Clientul nu stochează valori economice | Gold, dust, essence, gems = doar pe server | Bug critic |
| Nicio tranzacție fără audit log | Orice modificare de resurse se înregistrează | Bug critic |

### 2.2 Validare pe Strat

```
Frontend (UX) → Validare UI (user feedback rapid)
    ↑ Nu e de încredere, e doar pentru UX
    ↓
Backend (Security) → Validare DUBLĂ cu aceleași reguli
    ↑ ASTA contează. Dacă backend-ul respinge, frontend-ul a mințit.
```

**Exemplu — cumpărare parte:**
```
1. Userul face click "Cumpără"
2. Frontend: verifică rapid (ai destui coins?) → show spinner
3. Backend: verifică DIN NOU (ai destui coins? partea există? e în shop? e runda ta?)
4. Backend: execută tranzacția SAU returnează eroare
5. Frontend: actualizează UI cu răspunsul serverului
```

---

## 3. Anti-Cheat & Security

### 3.1 HMAC Signing pentru Părți

Fiecare parte de carte e semnată criptografic la creare:

```typescript
// Server-side: la crearea unei părți
function signPart(part: PartData, secretKey: Buffer): string {
  const data = `${part.id}:${part.ownerId}:${part.rarity}:${part.level}:${part.type}`;
  return HMAC_SHA256(secretKey, data).toString('hex');
}

// Server-side: la validare
function verifyPart(part: PartDataWithSignature, secretKey: Buffer): boolean {
  const expectedSig = signPart(part, secretKey);
  return timingSafeEqual(expectedSig, part.signature);
}
```

| Set | Detaliu |
|-----|---------|
| **Cine semnează** | Serverul, la creare (drop, craft, cumpărare din shop) |
| **Ce se semnează** | `id + ownerId + rarity + level + type` |
| **Algoritm** | HMAC-SHA256 |
| **Cheia secretă** | Environment variable pe server, rotită periodic |
| **Verificare** | La fiecare tranzacție care implică partea respectivă |

### 3.2 Ghost Battles — Snapshot Validation

La END BUY PHASE, clientul trimite un snapshot complet al gridului + inventarului:

```typescript
interface GhostSnapshot {
  playerId: string;
  round: number;
  grid: GridCell[][];        // 12×8, fiecare celulă cu ce conține
  cards: CardSnapshot[];      // Cărțile plasate pe grid
  inventory: PartRef[];       // Părțile rămase nefolosite
  coins: number;              // Monedele rămase
  signature: string;          // HMAC al întregului snapshot
}
```

Serverul:
1. Validează snapshot-ul (grid valid? cărți valide? coins corecti?)
2. Calculează battle-ul
3. Returnează rezultatul + replay

**Protecție:** Dacă snapshot-ul e invalid → rundă pierdută automat (sau ban temporary).

### 3.3 Audit Log Append-Only

```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  player_id UUID NOT NULL,
  action_type TEXT NOT NULL,       -- 'buy_part', 'upgrade', 'craft', 'end_buy', etc.
  action_data JSONB NOT NULL,       -- detaliile acțiunii
  server_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  session_id UUID
);

-- Triggers: nimeni nu poate UPDATE sau DELETE din audit_log
-- Doar INSERT. Perioadă.
```

Toate tranzacțiile economice, toate acțiunile de joc, toate login-urile — în audit_log.

### 3.4 Rate Limiting

| Endpoint | Limită | Consecință |
|----------|--------|------------|
| Buy action | 30/minut | Temp ban 5 min |
| End Buy Phase | 10/minut | Temp ban 5 min |
| Login | 5/minut | Temp ban 15 min |
| Matchmaking | 20/minut | Temp ban 5 min |
| Reroll shop | 50/minut | Temp ban 5 min |

### 3.5 Fraud Detection Patterns (Server)

Ce monitorizăm automat:

- **Win streak anormal** → 20+ win-uri consecutive fără pierdere → flagged
- **Tranzacții imposibile** → Aceeași parte vândută de 2 ori → flagged
- **Timing suspect** → Buy phase completă în 0.5 secunde → flagged
- **Grid imposibil** → Cărți suprapuse, cărți în afara gridului, etc.
- **Multiple accounts** → Același IP, același device → flagged

### 3.6 Ce facem cu Cheater-ii

| Nivel | Acțiune | Automat? |
|-------|---------|----------|
| **Warning** | Notificare "comportament suspect" | Da |
| **Temp Ban** | 24h / 7d / 30d | Da, după 3+ flagged events |
| **Permanent Ban** | Ban cont + forfeit toate resursele | Manual (review) |
| **Shadowban** | Doar cu alți cheateri (honey pot) | Automat |

---

## 4. Battle System — Deterministic

### 4.1 Principii

```
Același seed + aceleași snapshot-uri (grid + cărți) = același rezultat
MEREU. PESTE TOT. ORICÂND.
```

### 4.2 BattleSimulator

```typescript
class BattleSimulator {
  private rng: SeededRNG;
  private player1: BattleState;
  private player2: BattleState;

  constructor(seed: number, snapshot1: GhostSnapshot, snapshot2: GhostSnapshot) {
    this.rng = new SeededRNG(seed);       // Seed de la server
    this.player1 = this.buildState(snapshot1);
    this.player2 = this.buildState(snapshot2);
  }

  run(): BattleResult {
    // 1. Calculează damage simultan
    // 2. Aplică efecte
    // 3. Verifică condiții de win/lose
    // 4. Returnează BattleResult + BattleEvent[]
  }
}
```

**Seed-ul** e ales de server la matchmaking. Clientul primește seed-ul O DATĂ CU rezultatul (să poată verifica).

### 4.3 Replay

BattleResult conține suficientă informație să reconstruiești bătălia frame cu frame:

```typescript
interface BattleResult {
  winner: PlayerId;
  player1RemainingHP: number;
  player2RemainingHP: number;
  events: BattleEvent[];
  hash: string;                    // SHA256(JSON.stringify(events))
  seed: number;                    // Seed-ul folosit (pentru verificare)
}
```

Clientul poate recalcula bătălia cu același seed + snapshots și verifica hash-ul. Dacă nu coincide → serverul a trișat (nu se întâmplă, dar jucătorul poate verifica).

### 4.4 Implementare Duală

```
TypeScript (client):
  - Rulează battle DOAR pentru preview offline
  - NU e de încredere pentru ranked
  - Poate reproduce bătălia din seed + snapshots

Rust/WASM (server):
  - Aceeași logică, compilată din TypeScript în WASM
  - Rulează battle-ul autoritar
  - Serverul poate folosi și o rescriere în Rust pentru performanță
```

---

## 5. Codul — Reguli Stricte

### 5.1 TypeScript

| Regula | Detaliu |
|--------|---------|
| `strict: true` în tsconfig | Fără excepții |
| Fără `any` | Folosește `unknown` + type guards |
| Fără `as` type casting | Folosește zod sau io-ts pentru validare |
| Fără `// @ts-ignore` | Niciodată |
| Fără `console.log` | În producție e eroare de build |
| Toate funcțiile publice au JSDoc | Ce face, ce primește, ce returnează |

### 5.2 Rust

| Regula | Detaliu |
|--------|---------|
| `deny(unsafe_code)` | Zero unsafe în producție |
| Fără `.unwrap()` | Folosește pattern matching sau `?` |
| Fără `.expect()` | Mesaje de eroare descriptive în `anyhow` |
| `clippy` pedantic | `#![warn(clippy::pedantic)]` |
| Toate funcțiile publice au doc | `///` cu exemple |

### 5.3 General

- Fiecare funcție care atinge bani/resurse e **audit-logged**
- Fiecare input e validat la granița de sistem (nu în interior)
- Fără cod mort, fără TODO-uri, fără commented-out code
- Fără token-uri, URL-uri, sau secrete în cod (environments variables)
- Log-urile nu conțin date personale (GDPR-ready)

---

## 6. Branch Strategy & Git

### 6.1 Branch-uri

```
main (protejat) ──── Doar din PR-uri cu review
  │
  ├── docs/xxx       ← Documentație (merge direct pe main)
  │
  └── game-development (protejat) ──── Bază de lucru
        │
        ├── feat/card-assembly-t001    ← Un feature per ticket
        ├── fix/battle-sim-bug         ← Bug fix-uri
        └── security/hmac-rotation     ← Security patches
```

### 6.2 Protecții

| Branch | Protecție |
|--------|-----------|
| `main` | Nimeni nu face push direct. Doar PR cu review. CI must pass. |
| `game-development` | Nimeni nu face push direct (exceptii: hotfix aprobat). CI must pass. |
| `feat/*` | Fără protecții specifice, dar merged doar cu PR |

### 6.3 Commit Format

```
<type>(<scope>): <descriere>

tipuri: feat, fix, docs, style, refactor, perf, test, security, chore, ci
scope: ce sistem modifică (grid, battle, shop, auth, etc.)

Exemple:
  feat(grid): add 12x8 grid rendering with cell types
  fix(battle): prevent division by zero in damage calc
  security(auth): add rate limiting to login endpoint
  test(battle): add 500 grid combinations validation test
```

---

## 7. PR Rules & Review

### 7.1 PR Template (obligatoriu)

```markdown
## Ce face acest PR

## Security Checklist
- [ ] Toate inputurile sunt validate pe server
- [ ] Nu există `any`/`as`/`@ts-ignore`
- [ ] Funcțiile care ating resurse au audit log
- [ ] Rate limiting adăugat (dacă e endpoint nou)
- [ ] Fără secrete în cod
- [ ] Teste pentru edge cases

## Testare
- [ ] Rulează local
- [ ] Teste unitare adăugate
- [ ] Teste de securitate (dacă e cazul)

## Screenshots (dacă e UI)
```

### 7.2 Reviewer Checklist

1. **Security review** — input validation, server-authoritative, audit log?
2. **Logic review** — face ce zice ticket-ul? Edge cases acoperite?
3. **Code review** — tipare, nume, structură, fără cod mort?
4. **Test review** — teste suficiente? Teste de securitate?

---

## 8. Testing

### 8.1 Battle Tests

```
Test[grid_valid_3x3_vs_empty] = carte 3×3 vs nimic → win
Test[grid_invalid_overlap] = cărți suprapuse → eroare validare
Test[grid_4x4_blocked_cells] = carte 4×4 pe celule blocate → eroare
Test[battle_simultaneous_attack] = ambele cărți lovesc simultan
Test[battle_deterministic] = același seed → același rezultat (de 100 de ori)
Test[battle_massive_scale] = 10 cărți vs 10 cărți → timeout-safe
Test[battle_edge_hp_zero] = carte cu HP=0 → nu mai atacă
Test[battle_player_hp_zero] = jucător cu HP=0 → rundă pierdută
```

### 8.2 Security Tests

```
Test[security_negative_gold] = trimite -100 gold → respins
Test[security_string_injection] = trimite cod în câmp numeric → respins
Test[security_part_forgery] = încearcă să folosești o parte falsificată → respins
Test[security_other_player_grid] = trimite gridul altui jucător → respins
Test[security_rate_limit_exceeded] = 100 request-uri/sec → rate limited
Test[security_replay_attack] = aceeași comandă trimisă de 2 ori → respins a 2-a oară
```

### 8.3 Validation Tests

```
Test[validation_grid_allowed_types] = 5 tipuri de celule acceptate, altele nu
Test[validation_card_placement] = carte 3×3 încape complet pe celule deblocate?
Test[validation_energy_spend] = carte consumă mai multă energie decât ai → respins
Test[validation_shop_buy] = partea e în shop? Ai destui coins? E runda ta?
Test[validation_upgrade] = partea e a ta? Ai destul dust? Nivel valid?
```

### 8.4 Automatizare

```
GitHub Actions:
  ├── on push → lint + type check + test
  ├── on PR → lint + type check + test + security audit
  ├── nightly → fuzz testing (random input pe endpoint-uri)
  └── release → full test suite + build + deploy
```

---

## 9. Deployment & Operations

### 9.1 CI/CD Pipeline

```
Push / PR → GitHub Actions
  ├── lint (ESLint + clippy + prettier)
  ├── type check (tsc strict)
  ├── test (unit + integration + security)
  ├── build (client + server)
  └── deploy (auto pe staging, manual pe production)
```

### 9.2 Database Migrations

- Migrations se fac doar prin fișiere SQL versionate
- Rollback-ul e obligatoriu (fiecare `up.sql` are `down.sql`)
- Migrations se rulează automat la deploy
- Backup automat înainte de orice migration pe production

### 9.3 Incident Response

| Severitate | Răspuns | Timp |
|------------|---------|------|
| 🔴 Critic (date leak / cheat exploit) | Oprire server, hotfix, announce | < 1h |
| 🟡 Major (bug financiar) | Disable feature, hotfix | < 4h |
| 🟢 Minor (UI bug) | Ticket, next release | < 1 săptămână |

### 9.4 Rollback Plan

1. `git revert` commit-ul problematic
2. Re-deploy versiunea anterioară
3. Run migration rollback dacă e cazul
4. Verify health check
5. Post-mortem în 24h

---

## 10. Resurse Economice — Manipulare

```sql
-- ORICE modificare de resurse se face cu optimistic lock
UPDATE player_resources
SET gold = gold - :cost,
    updated_at = NOW()
WHERE player_id = :player_id
  AND gold >= :cost
RETURNING *;

-- Dacă affect_rows = 0 → jucătorul n-are destui bani
-- (indiferent ce zice clientul)
```

- Fără `SET gold = :new_value` — doar operații atomice relative
- Fără citire în client și scriere în server — serverul decide singur
- Toate tranzacțiile economice se scriu în `audit_log` în ACEEAȘI tranzacție SQL

---

## 11. Dependințe & Tooling

| Categorie | Ce folosim | Motiv |
|-----------|------------|-------|
| State management | Zustand | Simplu, tipat, performant |
| Form validation | Zod | Runtime type checking, tipuri TypeScript |
| HTTP client | TanStack Query | Caching, retry, optimistic updates |
| API server | Axum | Performant, ergonomic, Rust |
| ORM | SQLx | Compile-time query checking |
| Testing (TS) | Vitest | Rapid, compatibil Vite |
| Testing (Rust) | built-in `#[test]` | Standard |
| Linting (TS) | ESLint + Prettier | Consistent |
| Linting (Rust) | Clippy | Pedantic mode |
| Security audit (TS) | Socket.dev | Dependency scanning |
| Security audit (Rust) | `cargo audit` | Known vulnerabilities |

---

*Document creat: 2026-07-18*
*Status: ✅ Activat — toate instanțele Hermes îl respectă*
*Modificări doar prin PR pe branch-ul documentation*
