# GOVERNANCE.md — Regulile Jocului

> Acest document definește cum operăm în proiectul Cardweave.
> Două departamente: **Design** (VPS) și **Development** (PC).

---

## Departamente

| Departament | Responsabil | Locație | Branch | Output |
|---|---|---|---|---|
| 🎨 Design | Eu (agent VPS) + tu | VPS | `documentation` | Specs, wireframe, tickete |
| ⚙️ Development | Instanța PC + tu | PC | `game-development` | Cod (Rust sau Godot — TBD) |

---

## Gate-uri

| Gate | Când se aplică | Cine verifică | Criterii |
|---|---|---|---|
| **G1 — Definition of Ready** | La final de Game Design | Tu | Feature clar? Testabil? Complete? |
| **G2 — Sprint Ready (Handoff)** | La final de Spec Finalization | Tu + DEV.md | DESIGN_PASS complet? Tickete clare? |
| **G3 — Sprint Ready (Dev)** | Înainte de cod | Instanța PC | Ticket-ul e clar? Depedențele gata? |
| **G4 — Definition of Done** | După implementare | Tu + PC | Codul face ce zice spec-ul? Rulează? |

---

## Reguli pentru Design (VPS)

- Nu scriem cod aici. Doar design.
- Push pe `documentation`, niciodată pe `main` sau `game-development`
- Fiecare feature are: FEATURE_DESIGN + DESIGN_PASS + wireframe + tickete
- După G2, facem commit și notificăm

## Reguli pentru Development (PC)

- Nu începe un feature înainte de G2
- Citește DEV_PIPELINE.md la fiecare start de sesiune
- Un ticket = un commit (sau mai mulți, dar logici)
- După G4, merge pe `game-development`

---

## Branch Strategy

```
main (stabil)
  └── game-development (cod în lucru)
       └── feat/card-part-system-t001 (feature + ticket)
documentation (design)
```

---

## RACI

| Activitate | Tu | Design (VPS) | Dev (PC) |
|---|---|---|---|
| Vision | ✅ Zici | — | — |
| Game Design | ✅ Aprobi | ✅ Scriu | — |
| Spec Finalization | — | ✅ Scriu | — |
| Handoff | — | ✅ Notific | ✅ Preia |
| Development | ✅ Verifici | — | ✅ Scrie cod |
| Playtest | ✅ Testezi | — | — |
