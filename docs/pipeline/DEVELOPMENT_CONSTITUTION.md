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

### 3.5 Idempotency & Race Condition Prevention

Fiecare acțiune care modifică resurse trebuie să fie **idempotentă**. Fără idempotency, un request trimis de 2 ori (din greșeală sau intenționat) poate duce la double-spend.

```sql
CREATE TABLE action_idempotency (
  idempotency_key UUID NOT NULL,
  player_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (player_id, idempotency_key)
);
```

#### Reguli

| Regula | Explicație | Sancțiune |
|--------|------------|-----------|
| Fiecare request are `Idempotency-Key` header | UUID v4 generat de client | Bug critic |
| `UNIQUE(player_id, idempotency_key)` | Aceeași cheie de 2 ori → al doilea e ignorat | Bug critic |
| `SELECT ... FOR UPDATE` înainte de tranzacție | Blochează rândul, previne race condition | Bug critic |
| Idempotency key expiră după 24h | Se face cleanup automat | Standard |

#### Flow

```
1. Clientul generează un UUID pentru acțiune: "cumpără partea X cu 3 coins"
2. Clientul trimite POST /buy-part cu header Idempotency-Key: uuid
3. Serverul: BEGIN TRANSACTION
4. Serverul: SELECT 1 FROM action_idempotency WHERE player_id=X AND idempotency_key=Y FOR UPDATE
5.   Dacă există și processed=true → return previous result (nu re-execută)
6.   Dacă nu există → INSERT idempotency_key + procesează acțiunea
7.   UPDATE player_resources ... WHERE gold >= cost → dacă 0 rows => rollback
8.   INSERT INTO audit_log ...
9.   UPDATE action_idempotency SET processed=true
10. COMMIT
```

### 3.6 Replay Attack Protection

Un snapshot END BUY interceptat nu trebuie să poată fi retrimis.

```typescript
interface GhostSnapshot {
  // ... (câmpurile existente)
  nonce: number;                    // Număr secvențial per rundă (crește cu 1)
  serverTimestamp: number;          // Server time la care a fost cerut snapshot-ul
  roundId: string;                  // ID-ul rundei curente (de la server)
}
```

| Măsură | Detaliu |
|--------|---------|
| **Nonce** | Fiecare END BUY are un număr secvențial per rundă. Serverul verifică: `nonce > last_nonce`. |
| **UNIQUE(rundă, nonce)** | Același snapshot nu poate fi trimis de 2 ori. |
| **Server timestamp** | Snapshot-urile mai vechi de **60 secunde** sunt respinse automat. |
| **Round ID** | Snapshot-ul e legat de o rundă specifică. Nu poate fi folosit în altă rundă. |
| **HMAC peste nonce+timestamp** | Clientul nu poate modifica nonce-ul sau timestamp-ul fără să invalideze semnătura. |

### 3.7 Bot / Automation Protection

Cel mai periculos cheat la un card game nu e modificarea codului — e un **bot** care citește ecranul și calculează mutarea optimă. În ghost battles, un bot poate face screenshot la shop, simula 10.000 de variante, și alege cea mai bună cumpărătură.

| Măsură | Detaliu | Impact bot |
|--------|---------|------------|
| **Minimum turn timer** | 5 secunde înainte de END BUY (chiar dacă ai terminat) | Încetinește bot-ul, nu poate face 50 de runde/minut |
| **Shop seed parțial** | Serverul generează conținutul shop-ului. Clientul vede doar ce e acum, nu ce urmează. | Bot-ul nu poate planifica optim pe mai multe runde |
| **Click timing analysis** | Serverul loghează timestamp-ul fiecărei acțiuni. Dacă toate click-urile sunt la interval fix (ex: la exact 500ms) → flagged | Detectează automatizare |
| **Mouse path analysis** | Serverul primește pozițiile mouse-ului (sampled la fiecare 100ms). Mișcare în linie dreaptă între puncte fixe → bot. | Discriminează oameni de scripturi |
| **CAPTCHA ocazional** | După 5 runde consecutive fără eroare umană → CAPTCHA | Enervant dar eficient |

**Regula:** Jucătorii reali fac greșeli, ezitări, mișcări întâmplătoare. Bots nu. Folosește asta.

### 3.8 Snapshot Pool Poisoning

Un cheater cu 100 de conturi poate inunda pool-ul de snapshot-uri cu griduri slabe/gol, permițând conturilor bune să câștige ușor și să facă rating boost.

| Măsură | Detaliu |
|--------|---------|
| **Minimum snapshot quality** | Trebuie să ai cel puțin 1 carte pe grid. Snapshot-urile goale sunt respinse. |
| **Per-player cooldown** | Maxim 1 snapshot activ per jucător în pool la un moment dat. |
| **Snapshot expiry** | Snapshot-urile expiră după **5 minute** (șterse din pool). |
| **Matchmaking delay** | Snapshot-ul intră într-un pool și e pereche cu altul intrat cu 5-60 secunde înainte/după. Nu instant. |
| **Minimum pool size** | Dacă pool-ul are < 10 snapshot-uri, perechea e făcută cu AI (nu cu alt jucător). |

### 3.9 Rating / Win Trading Protection

La pool-uri mici, 2 jucători care se coordonează pot intra în matchmaking simultan și face win trading.

| Măsură | Detaliu |
|--------|---------|
| **Matchmaking delay** | Snapshot-ul așteaptă minim 5 secunde + random(0-30s) înainte de match |
| **ELO/K-factor ajustabil** | La pool < 50 snapshot-uri, K-factor = 10 (jumătate din normal). |
| **Streak decay** | Dacă un jucător are 5+ win-uri consecutive, câștigă mai puțin rating per win. |
| **Opponent diversity** | Serverul evită să facă pereche aceiași 2 jucători de 3+ ori la rând. |

### 3.10 Fraud Detection Patterns (Server)

Ce monitorizăm automat:

- **Win streak anormal** → 20+ win-uri consecutive fără pierdere → flagged
- **Tranzacții imposibile** → Aceeași parte vândută de 2 ori → flagged
- **Timing suspect** → Buy phase completă în 0.5 secunde → flagged
- **Grid imposibil** → Cărți suprapuse, cărți în afara gridului, etc.
- **Multiple accounts** → Același IP, același device → flagged
- **Click timing robotic** → Toate click-urile la interval fix (ex: exact 500ms) → flagged
- **Shop solver pattern** → Aceeași comandă de cumpărare în aceeași ordine de 100 de ori → flagged
- **Zero error rate** → 50+ runde consecutive fără undo/reezi → suspicious
- **Mouse movement linear** → Mouse în linie dreaptă între puncte fixe (fără curbe) → flagged

### 3.11 Ce facem cu Cheater-ii

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
- [ ] Fără float în valori economice (BIGINT everywhere)
- [ ] Idempotency key pe toate acțiunile care modifică resurse
- [ ] Nonce + timestamp pe snapshot-uri ghost battle
- [ ] Teste de securitate pentru edge cases
- [ ] CI audit: npm audit / cargo audit

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
Test[security_idempotency_key_reuse] = același idempotency key de 2 ori → al 2-lea ignorat
Test[security_race_condition] = 2 request-uri simultane de buy → doar 1 procesat
Test[security_double_spend] = același coin cheltuit de 2 ori → a 2-a tranzacție fail
Test[security_forged_snapshot] = snapshot END BUY falsificat → eroare + flag
Test[security_snapshot_replay] = snapshot interceptat retrimis → respins (nonce)
Test[security_snapshot_expired] = snapshot mai vechi de 60s → respins
Test[security_empty_grid_snapshot] = snapshot fără cărți → respins (minimum quality)
Test[security_negative_coins] = trimite snapshot cu coins negativi → eroare
Test[security_float_gold] = încearcă să trimiți gold = 1.5 → eroare de tip
Test[security_bigint_overflow] = încearcă gold = 9999999999999 → eroare
Test[security_tauri_invoke_generic] = încearcă invoke('read_file', ...) → nu există comanda
Test[security_offline_sync] = încearcă să sincronizezi offline progress → respins
Test[security_bot_click_timing] = click-uri la interval fix → flagged
Test[security_win_trading] = 2 conturi fac win trading → flagged + rating adjusted
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
  ├── security audit (npm audit + cargo audit + cargo deny)
  ├── numeric integrity (no float in economy, no client-side gold)
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

### 10.1 Tipuri Numerice

| Regulă | Detaliu | Sancțiune |
|--------|---------|-----------|
| **Toate monedele sunt integer** | Gold, dust, essence, gems, coins = `BIGINT` în PostgreSQL, `i64`/`u64` în Rust, `bigint` în TypeScript | Bug critic |
| **FĂRĂ float în bani** | 0.1 + 0.2 != 0.3 în float64. Folosește integer (ex: 100 = 1.00 unități, cu 2 zecimale implicite). | Bug critic |
| **Fără `NaN` sau `Infinity`** | Orice operație care produce NaN sau Infinity într-un calcul financiar = rollback + alertă | Bug critic |
| **Overflow protection** | PostgreSQL `BIGINT` acceptă ±9.2 miliarde. Dacă o tranzacție face overflow → rollback + alertă | Bug critic |

### 10.2 Manipulare Atomică

```sql
-- ORICE modificare de resurse se face cu optimistic lock + SELECT FOR UPDATE
BEGIN;

-- 1. Blochează rândul (previne race condition)
SELECT current_gold, current_dust
FROM player_resources
WHERE player_id = :player_id
FOR UPDATE;

-- 2. Verifică soldul
-- (soldul e deja garantat >= cost pentru că avem lock)

-- 3. Execută tranzacția atomic
UPDATE player_resources
SET gold = gold - :cost,
    dust = dust + :reward,
    updated_at = NOW()
WHERE player_id = :player_id
  AND gold >= :cost
RETURNING *;

-- 4. Dacă affect_rows = 0 → rollback (jucătorul n-are destui bani)
-- (indiferent ce zice clientul)

-- 5. Scrie în audit_log în ACEEAȘI tranzacție
INSERT INTO audit_log (player_id, action_type, action_data)
VALUES (:player_id, :action_type, :action_data::jsonb);

COMMIT;
```

| Regulă | Detaliu |
|--------|---------|
| Fără `SET gold = :new_value` | Doar operații atomice relative (`gold = gold - cost`) |
| Fără citire în client și scriere în server | Serverul citește singur, nu crede clientul |
| Audit log în aceeași tranzacție | Dacă audit_log fail, toată tranzacția fail |
| `SELECT FOR UPDATE` | Blochează rândul până la COMMIT/ROLLBACK |
| Row-level locking | Fără table-level locks (nu blocăm toți jucătorii) |

### 10.3 Schema PostgreSQL

```sql
CREATE TABLE player_resources (
  player_id UUID PRIMARY KEY,
  gold BIGINT NOT NULL DEFAULT 0 CHECK (gold >= 0),
  dust BIGINT NOT NULL DEFAULT 0 CHECK (dust >= 0),
  essence BIGINT NOT NULL DEFAULT 0 CHECK (essence >= 0),
  gems BIGINT NOT NULL DEFAULT 0 CHECK (gems >= 0),
  -- Coins sunt per-run, nu persistente
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1   -- Optimistic lock version
);

-- Nu există coloane cu tip FLOAT, DOUBLE PRECISION, sau REAL
-- Nu există coloane cu tip NUMERIC fără scară fixă
```

### 10.4 Frontend (TypeScript)

```typescript
// Clientul NU are variabile economice globale
// Clientul afișează doar ce primește de la server

// BAD ❌
const gold = 100;  // Clientul nu decide cât gold are

// GOOD ✅
// Serverul trimite { gold: 100 } și clientul doar afișează
const gold = serverState.gold;  // Single source of truth
```

### 10.5 Verificări Automate

```bash
# CI check: fără tipuri float în scheme economice
grep -rn "FLOAT\|DOUBLE\|REAL\|NUMERIC" migrations/ --include="*.sql"
# Ar trebui să nu găsească nimic în tabelele de resurse

# CI check: fără client-side gold variables
grep -rn "let gold\|const gold\|var gold" src/client/ --include="*.ts"
# Ar trebui să nu existe variabile gold pe client

---

## 11. Supply Chain Security

### 11.1 Dependency Pinning

| Regulă | Detaliu | Sancțiune |
|--------|---------|-----------|
| Versiuni EXACTE | `react@19.0.0`, nu `react@^19.0.0` | Bug în CI |
| `package-lock.json` în git | Blochează arborele de dependințe | Bug în CI |
| `Cargo.lock` în git | Idem pentru Rust | Bug în CI |
| Fără `*` range | Niciodată `react@*` sau `\"*\"` | Bug în CI |

### 11.2 Dependency Auditing

```yaml
# .github/workflows/security-audit.yml
on: [push, pull_request]
jobs:
  audit-js:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --audit-level=high
      - run: npx socket-dev@latest scan --all   # Comportament suspect

  audit-rust:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: cargo audit                       # Known vulnerabilities
      - run: cargo deny check licenses         # Licențe interzise
```

### 11.3 Reguli de Licențiere

| Licență | Status | Exemple |
|---------|--------|---------|
| MIT, Apache 2.0, BSD | ✅ Permisă | react, serde, tokio |
| GPL v2/v3 | ❌ INTERZIS | Orice librărie GPL în client |
| LGPL | ⚠️ Permis (cu dynamic linking) | PixiJS (LGPL) |
| AGPL | ❌ INTERZIS | Nu se poate în joc comercial |
| Unlicensed / Unknown | ❌ INTERZIS | Trebuie review manual |

### 11.4 Verificări CI

```bash
# Rulează la fiecare PR
cargo deny check licenses
cargo audit
npm audit --audit-level=high

# Rulează nightly (poate dura)
npx socket-dev@latest scan --all

# Fără dependințe noi neaprobate
# (dacă adaugi o librărie nouă, trebuie review manual)
```

---

## 12. Tauri IPC Security

Tauri leagă frontend-ul web de sistemul de operare prin comenzi Rust. Un atac XSS sau un cheater cu DevTools poate apela orice comandă Tauri expusă.

### 12.1 Reguli

| Regulă | Detaliu | Sancțiune |
|--------|---------|-----------|
| **Scope minim** | Fiecare comandă Rust face EXACT ce trebuie, nimic extra | Bug critic |
| **Fără comenzi generice** | `invoke('read_file', { path })` e INTERZIS. Doar `invoke('load_save_game')`. | Bug critic |
| **Validare origin** | Fiecare comandă verifică că provine din aplicația noastră | Bug critic |
| **Fără acces la HMAC key** | Cheia HMAC e doar pe server, nu în Tauri | Bug critic |
| **Comanda returnează minim** | Nu returna întregul state DB — doar ce trebuie UI-ului | Bug critic |

### 12.2 Pattern Corect

```rust
// BAD ❌ — comandă generică, poate citi orice fișier
#[tauri::command]
fn read_file(path: String) -> Result<String> {
    std::fs::read_to_string(path)
}

// GOOD ✅ — comandă specifică, face un singur lucru
#[tauri::command]
fn load_save_game(app_handle: tauri::AppHandle) -> Result<SaveGame> {
    let app_dir = app_handle.path_resolver().app_data_dir();
    let save_path = app_dir.join("savegame.json");

    // Doar din directorul de save, nu din /etc/passwd
    if save_path.starts_with(&app_dir) {
        Ok(serde_json::from_str(&std::fs::read_to_string(save_path)?)?)
    } else {
        Err("Invalid path".into())
    }
}
```

### 12.3 Permissions (Tauri v2)

```json5
// src-tauri/capabilities/default.json
{
  "identifier": "default",
  "windows": ["main"],
  "permissions": [
    // DOAR comenzi specifice, nu "*"
    "core:event:default",
    {
      "identifier": "shell:allow-open",
      "allow": [{ "url": "https://steamcommunity.com/**" }]
    }
  ]
}
```

### 12.4 Regula Generală

> **Dacă ai nevoie de o comandă Tauri, gândește-te de 2 ori.**
> Majoritatea operațiilor ar trebui să meargă prin API-ul serverului, nu prin Tauri IPC.
> Tauri IPC e doar pentru: save/load local, steam API, system window.

---

## 13. Offline ↔ Online Sync

### 13.1 Regula Fundamentală

> **Progresul OFFLINE și progresul ONLINE sunt SEPARATE. Nu se sincronizează.**

### 13.2 De ce

- Serverul **nu poate valida** ce s-a întâmplat offline (resurse, bătălii, etc.)
- Dacă offline progress s-ar sincroniza, un cheater ar putea modifica JSON-ul local și să importe resurse infinite
- Singura excepție: iteme cosmetic (skin-uri, efecte) care nu au valoare economică

### 13.3 Modele Acceptate

#### Model A: Offline = Tutorial / Sandbox (RECOMANDAT)

```
Offline:
  - Joci ORICE, cât vrei
  - Resursele sunt locale (IndexedDB / SQLite)
  - Fără ranked, fără progresie permanentă
  - Poți testa cărți, combinații, strategii

Online:
  - Cont propriu pe server
  - Resurse pe server (BIGINT)
  - Ranked + progresie permanentă
  - Ghost battles cu alți jucători
```

#### Model B: Offline = Doar AI Practice

```
Offline:
  - Joci doar împotriva AI-ului
  - Fără cumpărături, fără progresie
  - Grid presetat, cărți presetate
  - Pur și simplu testezi mecanica

Online:
  - Tot ce e în GDD
```

### 13.4 Implementare

```typescript
// Local save (offline)
interface LocalSave {
  mode: 'offline' | 'online';
  playerId?: string;           // Doar dacă e online
  resources: { gold: bigint; dust: bigint; /* etc. */ };
  parts: PartData[];
  progress: { wins: number; losses: number; };
  lastSaved: number;
}

// La pornirea jocului:
// Dacă ești în modul offline → încarcă din IndexedDB
// Dacă ești în modul online → autentifică-te la server
// NU se face merge între cele 2 stări
```

### 13.5 Verificări CI

```bash
# CI check: fără cod care sincronizează offline → online
grep -rn "syncOffline\|mergeLocal\|uploadProgress" src/ --include="*.ts"
# Dacă există → e bug critic, trebuie revizuit
```

---

## 14. Integritatea Numerelor — Reguli Transversale

Această secțiune se aplică peste tot — client, server, DB, API.

### 14.1 Reguli Generale

| Regula | Unde se aplică | Sancțiune |
|--------|----------------|-----------|
| **Fără float în economie** | Gold, dust, essence, gems, coins, prețuri | Bug critic |
| **Fără `NaN` sau `Infinity`** | Orice calcul numeric | Bug critic |
| **Fără overflow silențios** | Toate operațiile verifică limitele | Bug critic |
| **Fără negative în resurse** | `CHECK (gold >= 0)` în DB, `>= 0` în validări | Bug critic |
| **Fără client-side resource vars** | TypeScript: `const gold = serverState.gold` | Bug critic |

### 14.2 Validare Automată în CI

```yaml
# .github/workflows/numeric-integrity.yml
name: Numeric Integrity
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check for float types in economic tables
        run: |
          if grep -rn "FLOAT\|DOUBLE\|REAL\|NUMERIC" migrations/ --include="*.sql"; then
            echo "❌ Float types found in economic tables!"
            exit 1
          fi
      - name: Check for client-side gold variables
        run: |
          if grep -rn "let gold\|const gold\|var gold" src/client/src/ --include="*.ts" --include="*.tsx"; then
            echo "❌ Client-side gold variable found!"
            exit 1
          fi
      - name: Check for offline→online sync code
        run: |
          if grep -rn "syncOffline\|mergeLocal\|uploadLocalProgress" src/ --include="*.ts"; then
            echo "❌ Offline→online sync code found!"
            exit 1
          fi
```

## 15. Dependințe & Tooling
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
