# TICKET_INDEX.md — Șablon Ticket Breakdown

> Folosește acest template în faza de Production.
> Lista completă de tickete pentru un feature.

---

## Feature: [Nume Feature]

**Feature File:** [FEATURE_DESIGN.md](../FEATURE_DESIGN.md)
**Status:** Planning / In Progress / Complete

---

## Ticket-uri

| ID | Nume | Scope | Depinde de | Status |
|----|------|-------|-----------|--------|
| T001 | [Nume scurt] | O singură responsabilitate | — | ready |
| T002 | [Nume scurt] | O singură responsabilitate | T001 | ready |
| T003 | [Nume scurt] | O singură responsabilitate | T001 | ready |

---

## Dependențe Graf

```
T001 ──▶ T002 ──▶ T003
               └──▶ T004
```

---

## Verification Checklist (G2)

- [ ] Toate ticket-urile au acceptance criteria
- [ ] Dependențe mapate corect
- [ ] Fiecare ticket are un singur scope
- [ ] Ticket-urile sunt ordonate corect (niciunul nu blochează unul anterior)

---

## Istoric

| Dată | Schimbare |
|------|-----------|
| YYYY-MM-DD | TICKET_INDEX.md creat |
