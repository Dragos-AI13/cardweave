# Cardweave — Design Pipeline

> Pipeline-ul de **design** — ce fac eu (agentul pe VPS) împreună cu tine.
> Instanța de pe PC are propriul pipeline de development.

---

## Filosofie

```
🎨 DESIGN (VPS) → specificații + tickete
   ↓ handoff
⚙️ DEV (PC) → cod (Rust sau Godot — TBD)
```

**Noi doi** facem doar design aici. Push pe `documentation`.
Instanța de pe PC scrie codul. Push pe `game-development`.

---

## Cum funcționează

```
🎯 Vision (tu)
   │  "Vreau feature-ul X"
   ▼
📐 Game Design (tu + eu)
   │  Scriem FEATURE_DESIGN.md + UI_WIREFRAME.md
   │  ■ G1 — Definition of Ready
   ▼
📋 Spec Finalization (eu)
   │  Scriu DESIGN_PASS.md (mecanica finală, formule, edge cases)
   │  Creez ticket-urile în docs/pipeline/features/<feature>/tickets/
   │  ■ G2 — Sprint Ready → HANDFOFF
   ▼
📦 HANDFOFF — commit pe documentation
   │  Feature complet: spec + wireframe + DESIGN_PASS + tickete
   │  Instanța de pe PC preia de aici
```

---

## Structură

```
docs/pipeline/
├── README.md               ← Ești aici
├── DESIGN_PIPELINE.md      ← Ce features sunt active în design
├── DEV_PIPELINE.md         ← Handoff — ce vede instanța de pe PC
├── GOVERNANCE.md           ← Reguli: gate-uri, responsabilități
├── WORKFLOW.md             ← Flow-ul pe care îl urmez eu (agentul VPS)
│
├── templates/              ← Șabloane pentru design
│
├── state/                  ← Starea proiectului
│
└── features/               ← Feature-uri în design
    └── <feature-name>/
        ├── FEATURE_DESIGN.md
        ├── DESIGN_PASS.md
        ├── UI_WIREFRAME.md
        └── tickets/         ← Ticket-urile pentru PC
```

---

## Branch-uri

| Branch | Ce conține | Cine scrie |
|---|---|---|
| `main` | Stabil, playtested | Merge din game-development |
| `documentation` | Doar design docs | Eu (VPS) + tu |
| `game-development` | Cod | Instanța PC |
| `feat/*` | Feature branch-uri | Instanța PC |
