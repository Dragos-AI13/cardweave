# DECISION_LOG.md

> Jurnalul deciziilor de design și arhitectură. Se adaugă în SUS.
> Fiecare decizie e datată, motivată și semnată (AI / User).

---

## D001 — Pipeline Structure

**Data:** 2026-07-13
**Decizie:** Adoptăm pipeline cu 6 departamente (Vision → Game Design → Production → Development → QA → Release) și 4 gates (G1–G4).

**Motiv:** Necesităm un sistem formal care să prevină săritul peste etape și să ofere vizibilitate clară asupra progresului fiecărui feature.

**Sursa:** Discuție din 2026-07-13, user + AI

---

## D002 — Features locuiesc în `docs/pipeline/features/`

**Data:** 2026-07-13
**Decizie:** Fiecare feature are un folder dedicat `docs/pipeline/features/<nume-feature>/` cu FEATURE_DESIGN.md, DESIGN_PASS.md, și `tickets/` pentru ticket-uri.

**Motiv:** Separare clară între template-uri (reutilizabile) și feature-uri (instanțe). Ușor de găsit și navigat.

**Sursa:** AI, post-analiză pipeline

---

## D003 — Git workflow: branch per feature, merge pe `game-development`

**Data:** 2026-07-13
**Decizie:** Lucrăm pe branch-ul `game-development` ca bază. Fiecare feature are branch `feat/<nume>`. După G3 bifat, userul aprobă merge-ul.

**Motiv:** Separare clară între main (stabil), game-development (work in progress), și feature branches (izolare).

**Sursa:** AI, bazat pe pattern-ul din godot orchestrator

---

## D004 — Primul feature: Card Part System

**Data:** 2026-07-13
**Decizie:** Primul feature care intră în pipeline este **Card Part System** — fundația mecanicii de carduri.

**Motiv:** Tot ce construim după (assembly, shop, upgrade) depinde de sistemul de părți ale cărților.

**Sursa:** Discuție — user a fost de acord cu propunerea AI

---

## D005 — Dual Pipeline: Design + Development

**Data:** 2026-07-13
**Decizie:** Separăm pipeline-ul în două: DESIGN_PIPELINE.md (VPS) și DEV_PIPELINE.md (PC). Designul se face pe VPS, codul pe PC.

**Motiv:** Userul face design cu mine (VPS) și development cu o instanță locală Hermes pe PC. Era nevoie de un handoff clar între cele două.

**Sursa:** Discuție design pipeline
