# GOVERNANCE.md — Regulile Jocului

> Acest document definește cum operăm în proiectul Cardweave.
> **Offline-first** — totul e client-side, zero server.

---

## Echipe

| Rol | Responsabil | Output |
|-----|-------------|--------|
| 🎨 Design | Eu (Hermes) + tu | Specs, wireframe, tickete |
| ⚙️ Development | Eu (Hermes) + tu | Cod PixiJS + TypeScript + Tauri |

Nu mai există dual pipeline (VPS + PC). Totul se face pe aceeași mașină.

---

## Gate-uri

| Gate | Când se aplică | Cine verifică | Criterii |
|------|----------------|---------------|----------|
| **G1 — Definition of Ready** | La final de Game Design | Tu | Feature clar? Testabil? Complete? |
| **G2 — Sprint Ready** | La final de Spec Finalization | Tu | DESIGN_PASS complet? Tickete clare? |
| **G3 — Done** | După implementare | Tu + Hermes | Codul face ce zice spec-ul? Rulează? Teste? |

---

## Branch Strategy

```
main (stabil) — doar din PR-uri cu review
  └── feat/<feature>-<ticket> — un feature per ticket
```

## RACI

| Activitate | Tu | Hermes |
|------------|-----|--------|
| Vision | ✅ Zici | — |
| Game Design | ✅ Aprobi | ✅ Scriu |
| Spec Finalization | — | ✅ Scriu |
| Development | ✅ Verifici | ✅ Scrie cod |
| Playtest | ✅ Testezi | — |
