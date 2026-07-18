# WORKFLOW.md — Instrucțiuni pentru Agent

> Flow-ul de development pentru Cardweave. Offline-first.

---

## 1. Startup

**De fiecare dată când încep o sesiune nouă:**

1. Citește:
   - `docs/pipeline/DESIGN_PIPELINE.md` — ce e activ
   - `docs/pipeline/state/NEXT_ACTIONS.md` — următorul pas
   - `docs/pipeline/state/CURRENT_SESSION.md` — progres curent

2. Verifică:
   - `git log --oneline -3` — ultimele commit-uri
   - Am branch-ul corect? (main sau feat/*)

3. Raportează sumar scurt.

---

## 2. Execuție

### Flow per feature

```
PASUL 1 — Game Design (G1)
├── Scriu FEATURE_DESIGN.md
├── Discut cu tine, ajustez
├── Când e clar → G1 bifat

PASUL 2 — Spec Finalization (G2)
├── Scriu DESIGN_PASS.md
├── Sparg în tickete
├── Când e complet → G2 bifat

PASUL 3 — Development
├── Un ticket odată
├── Testez
├── Self-review
├── Commit + push
├── Actualizez state files

PASUL 4 — Done
├── Prezint
├── Aștept G3 (aprobarea ta)
```

---

## 3. State Files Update (obligatoriu după fiecare ticket)

1. **NEXT_ACTIONS.md** — bifează ticket-ul, promovează următorul
2. **PROJECT_STATUS.md** — actualizează
3. **CURRENT_SESSION.md** — actualizează progresul
4. **CHANGELOG_WORKING.md** — adaugă entry

---

## 4. Template-uri

| Document | Când |
|----------|------|
| FEATURE_DESIGN.md | Game Design phase |
| DESIGN_PASS.md | Spec Finalization phase |
| UI_WIREFRAME.md | Când feature-ul are UI |
| TICKET.md | Când creez un ticket |
| TICKET_INDEX.md | Când listezi ticket-urile |
