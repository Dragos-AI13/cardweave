# Lowborn — Design Pipeline

> Pipeline-ul de design pentru Lowborn.
> **Offline-first** — totul e client-side.
> **Engine:** Godot 4.x (GDScript)

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
🛠️ Development (eu)
   │  Implementez ticketele în Godot
   │  ■ G3 — Feature Complete
   ▼
🧪 QA & Review (tu + eu)
   │  Testezi, ajustăm
   │  ■ G4 — Release Ready
   ▼
🚀 Release (tu)
   │  Mergi pe main, distribui
```

---

## Features Pipeline

Vezi `features/` pentru designurile active.

| ID | Feature | Status | G1 | G2 | Next Action |
|----|---------|--------|----|----|-------------|
| CE-P1 | Character Evolution Prototype | 🟡 Game Design | ❌ | ❌ | Așteaptă G1 |

---

## State Files

| Fișier | Conținut |
|--------|----------|
| `state/DECISION_LOG.md` | Toate deciziile de design și arhitectură |
| `state/CURRENT_SESSION.md` | Focusul sesiunii curente |
| `state/NEXT_ACTIONS.md` | Ordinea de execuție |
| `state/PROJECT_STATUS.md` | Statusul general al proiectului |
| `state/CHANGELOG_WORKING.md` | Jurnal de lucru |
| `state/KNOWN_ISSUES.md` | Bug-uri și probleme cunoscute |

---

## Gate-uri

| Gate | Cine | Ce înseamnă |
|------|------|-------------|
| **G1** | Tu | Design review — FEATURE_DESIGN aprobat |
| **G2** | Tu | Planning review — tickete + wireframe aprobate |
| **G3** | Eu | Feature implementat, testat, funcțional |
| **G4** | Tu | Release approval — gata de lansat |

---

## Template-uri

| Template | Folosit pentru |
|----------|----------------|
| `templates/FEATURE_DESIGN.md` | Feature design |
| `templates/DESIGN_PASS.md` | Design pass (arhitectură) |
| `templates/UI_WIREFRAME.md` | Wireframe-uri |
| `templates/TICKET.md` | Ticket-uri individuale |
| `templates/TICKET_INDEX.md` | Index ticket-uri per feature |
