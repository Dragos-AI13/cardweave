# Cardweave — Design Pipeline

> Pipeline-ul de design pentru Cardweave.
> **Offline-first** — totul e client-side.

---

## Filosofie

```
🎯 Vision (tu)
   │  "Vreau feature-ul X"
   ▼
📐 Game Design (tu + eu)
   │  Scriem FEATURE_DESIGN.md + UI_WIREFRAME.md
   │  ■ G1 — Definition of Ready
   ▼
📋 Spec Finalization (eu)
   │  Scriu DESIGN_PASS.md + tickete
   │  ■ G2 — Sprint Ready
   ▼
⚙️ Development (eu)
   │  Implementez
   │  ■ G3 — Done
```

---

## Structură

```
docs/pipeline/
├── README.md               ← Ești aici
├── DESIGN_PIPELINE.md      ← Ce features sunt active
├── GOVERNANCE.md           ← Reguli
├── WORKFLOW.md             ← Flow-ul de design
├── DEVELOPMENT_CONSTITUTION.md ← Reguli de development
│
├── templates/              ← Șabloane
├── state/                  ← Starea proiectului
└── features/               ← Feature-uri
```

---

## Tech Stack (D006 + D008)

| Componentă | Tehnologie |
|------------|-----------|
| UI | React + TypeScript + Vite |
| Game rendering | PixiJS 8 |
| Desktop | Tauri 2 |
| Storage | IndexedDB |
| AI | TypeScript (adaptiv) |
| Model | Offline-first (D008) |
