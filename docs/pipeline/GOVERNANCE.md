# Shardbound Pipeline Governance

## Departamentele

### 🎯 Vision (Game Director) — Tu
**Responsabil:** Decizii creative, direcție, aprobare finală
**Ce produce:** Propuneri de features, decizii de design, feedback pe playtest
**Reguli:**
- Tu decizi ce intră în pipeline
- Tu aprobi designul înainte de producție (G1)
- Tu aprobi release-ul (G4)

### 📐 Game Design — Tu + Eu
**Responsabil:** Transformă viziunea în specificații jucabile
**Ce produce:** FEATURE_DESIGN.md, DESIGN_PASS.md, wireframe-uri, balance tabele
**Cine face ce:**
- **Tu:** Decizii creative („cum funcționează mecanica X?"), aprobare design
- **Eu:** Scriu draft-uri de documente, propun opțiuni, întreb întrebări, fac research

### 📋 Production — Eu
**Responsabil:** Sparge feature-urile în tickete mici, mapează dependențe, estimează
**Ce produce:** TICKET_INDEX.md (tabel cu toate ticket-urile), ticket-uri individuale
**Reguli:**
- Fiecare ticket = 2-5 minute de implementare (un singur concept)
- Ticket-urile au dependențe explicite
- Se scrie SHARED_IMPLEMENTATION_GUIDE.md cu pattern-urile specifice feature-ului

### ⚙️ Development — Eu (agenți AI)
**Responsabil:** Implementează ticketele unul câte unul
**Ce produce:** Cod Godot (scene, scripturi, resurse), teste, git commits
**Reguli:**
- Un ticket odată — fără să implementez 2 ticket-uri simultan
- După fiecare ticket: commit cu mesaj descriptiv + update state files
- Nu implementez nimic din afara scope-ului ticket-ului curent

### 🧪 QA — Tu + Eu
**Responsabil:** Verifică implementarea, găsește bug-uri, confirmă că e fun
**Ce face:**
- **Eu:** Verific codul (bugs tehnici, edge cases), rulez teste automate, scriu bug reports
- **Tu:** Playtest (e fun? e corect? se simte bine?), aprobare finală
**Reguli:**
- QA începe DOAR după ce DEVELOPMENT zice „gata" și toate ticket-urile sunt bifate
- Bug-urile critice blochează release-ul

## Gates (Porți de trecere)

Fiecare gate are un **checklist obligatoriu**. Dacă nu e bifat tot → feature-ul NU trece mai departe.

### 🟡 G1 — Definition of Ready (Game Design → Production)

| # | Check | Verificat de |
|---|-------|-------------|
| 1 | Feature scope clar definit (in scope / out of scope) | Tu |
| 2 | Mecanica de bază documentată în DESIGN_PASS.md | Eu (fișierul există) |
| 3 | Wireframe-uri / mockup-uri (dacă are UI) | Tu (ești mulțumit de ele) |
| 4 | Acceptance criteria scrise („știu că e gata când...") | Tu |
| 5 | Dependențe identificate (depinde de alt feature?) | Tu + Eu |
| 6 | Impact pe alte sisteme evaluat | Tu |
| 7 | **Tu zici „da, e gata de producție"** | Tu |

### 🟢 G2 — Sprint Ready (Production → Development)

| # | Check | Verificat de |
|---|-------|-------------|
| 1 | Toate ticket-urile au acceptance criteria | Eu |
| 2 | Dependențele între ticket-uri sunt mapate | Eu |
| 3 | Fiecare ticket are un singur scope (un concept) | Eu |
| 4 | SHARED_IMPLEMENTATION_GUIDE.md scris dacă e necesar | Eu |
| 5 | Art / asset brief-uri gata (dacă produces assets noi) | Eu |
| 6 | Nicio dependență blocantă nerezolvată | Eu |

### 🟢 G3 — Definition of Done (Development → QA)

| # | Check | Verificat de |
|---|-------|-------------|
| 1 | Toate ticket-urile marcate **done** în TICKET_INDEX.md | Eu |
| 2 | Codul compilează fără erori | Eu |
| 3 | Toate ticket-urile implementate conform AC | Eu |
| 4 | Self-review făcut (am verificat codul înainte de a zice „gata") | Eu |
| 5 | Commit-uri făcute pe branch | Eu |
| 6 | Branch-ul e pe remote | Eu |

### 🟡 G4 — Release Gate (QA → Shipped)

| # | Check | Verificat de |
|---|-------|-------------|
| 1 | Zero bug-uri critice cunoscute | Eu |
| 2 | Bug-urile minore sunt documentate în KNOWN_ISSUES.md | Eu |
| 3 | **Tu ai playtestat și ești mulțumit** | Tu |
| 4 | Nu crapă experiența altor features | Tu |
| 5 | Performance e acceptabil | Eu (verificare rapidă) |
| 6 | **Tu zici „da, lansăm"** | Tu |

## Tipuri de Gates

- **🟢 Automat (Verificat de AI):** Le verific eu. Ex: „toate ticket-urile au AC?", „compilează codul?"
- **🟡 Mixt (Tu aprobi, eu confirm existența):** Ex: „wireframe-ul există (eu) și e ok (tu)", „playtest aprobat (tu)"

## Reguli de mișcare în pipeline

1. **Un feature poate fi într-un singur departament la un moment dat**
2. **Maxim 2 features active simultan:** unul în Game Design (tu lucrezi) și unul în Development (eu implementez)
3. **Dacă un feature e blocat la un gate, nu începem altul în același departament** (evităm multitasking)
4. **Excepție:** bug-uri critice pot sări peste gates direct în Development
5. **Orice decizie de design se scrie în DECISION_LOG.md** — nu se păstrează doar în conversație

## Pipeline States

| Stare | Semnificație |
|-------|-------------|
| 🔵 Roadmap | În plan, neînceput |
| 🟡 Game Design | Se scrie designul |
| 🟣 Production | Se sparge în tickete |
| 🟢 Development | Se implementează |
| 🟠 QA | Se testează |
| ⚪ Released | Shipped |
| 🔴 Blocked | Blocat de ceva (dependență, decizie) |
| ❌ Cancelled | Anulat / amânat pe termen nelimitat |
