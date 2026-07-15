# WORKFLOW.md — Instrucțiuni pentru Agent (VPS)

<<<<<<< HEAD
> Acest document conține flow-ul exact pe care îl urmez EU (agentul AI) când lucrez la Cardweave.
=======
> Acest document conține flow-ul exact pe care îl urmez EU (agentul AI pe VPS) când fac design pentru Cardweave.
>>>>>>> afe344e (docs: restructure pipeline - design (VPS) + dev (PC))

---

## 1. Startup — Început de sesiune

**De fiecare dată când încep o sesiune nouă:**

### Pasul 1 — Stare
Citește ACESTE fișiere (în paralel):
1. `docs/pipeline/DESIGN_PIPELINE.md` — ce features sunt active în design
2. `docs/pipeline/state/NEXT_ACTIONS.md` — următorul lucru de făcut
3. `docs/pipeline/state/CURRENT_SESSION.md` — ce s-a lucrat ultima dată
4. `docs/pipeline/state/DECISION_LOG.md` — deciziile de design luate

### Pasul 2 — Verificare reală
- `git log --oneline -3` — ultimele commit-uri
- E DESIGN_PIPELINE.md actualizat?

### Pasul 3 — Raportează
Prezintă un sumar: ce e activ, unde am rămas, următorul pas.

---

## 2. Execuție — Cum lucrez la un feature

Când userul spune „hai să facem feature-ul X":

### Flow per feature

```
PASUL 0 — Backlog → Roadmap
├── Adaug feature-ul în DESIGN_PIPELINE.md ca 🔵 Roadmap
├── Mut folderul features/<feature>/ din draft în activ
└── Aștept „dă-i drumul" de la user

PASUL 1 — Game Design (G1)
├── Scriu FEATURE_DESIGN.md
│   ├── Context, High-Level, In Scope, Out of Scope
│   ├── Core Mechanics
│   ├── User Flow
│   ├── Balance / Valori Inițiale
│   ├── Acceptance Criteria
│   └── Întrebări Deschise
├── Discut cu userul, ajustez
├── Când e clar → G1 bifat
└── DESING_PIPELINE.md → 🟡 Game Design

PASUL 2 — Spec Finalization (G2)
├── Scriu DESIGN_PASS.md
│   ├── Formule exacte, scaling, edge cases
│   ├── Diagramă de flow (dacă e cazul)
│   └── Răspuns la toate întrebările deschise
├── Creez UI_WIREFRAME.md (dacă e cazul)
├── Sparg feature-ul în tickete
│   ├── Fiecare ticket = o unitate implementabilă independent
│   ├── Priorități (P1, P2, P3)
│   └── TICKET_INDEX.md + ticket-uri individuale
├── Când e complet → G2 bifat → HANDFOFF
└── DESING_PIPELINE.md → 🟢 Handoff Gata

PASUL 3 — Handoff
├── Commit + push pe documentation
├── Actualizez DEV_PIPELINE.md (ce e gata de implementat)
├── Actualizez NEXT_ACTIONS.md
└── Notific: „Feature-ul X e gata de development"
```

---

## 3. Ce NU fac

- ❌ Nu scriu cod Rust
- ❌ Nu fac commit pe `game-development` sau `main`
- ❌ Nu modific fișiere din `src/`
- ❌ Nu încep un feature fără G1 bifat

---

## 4. Template-uri pe care le folosesc

| Document | Când |
|---|---|
| FEATURE_DESIGN.md | Game Design phase |
| DESIGN_PASS.md | Spec Finalization phase |
| UI_WIREFRAME.md | Când feature-ul are UI |
| TICKET.md | Când creez un ticket |
| TICKET_INDEX.md | Când listezi ticket-urile unui feature |
