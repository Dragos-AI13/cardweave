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

---

## D006 — Tech Stack Final

**Data:** 2026-07-18
**Decizie:** Adoptăm stack-ul web-first: **React + TypeScript + PixiJS** (client), **Tauri 2** (desktop), **Rust + Axum** (server), **PostgreSQL + Redis** (date). Se renunță la Godot 4 și Rust+wgpu+egui.

**Motiv:** Cardweave e 90% UI — HTML/CSS e cel mai bun sistem UI din lume. PixiJS face grid + battle animations. Rust server pentru PvP ghost battles. Aceeași bază de cod pentru Steam, Web și Mobile. Ciclu de dezvoltare mult mai rapid decât orice game engine.

**Sursa:** Analiză completă tech stack (2026-07-18) — user + AI

---

## D007 — Game Model: Ghost Battles + Offline

**Data:** 2026-07-18
**Decizie:** Jocul funcționează în 2 moduri: **Offline** (AI adversar, progres local) și **Online Ghost Battles** (snapshot PvP asincron, server-authoritative). Live PvP (Arena) rămâne ca opțiune viitoare.

**Motiv:** Ghost battles (Backpack Battles model) oferă anti-cheat natural (serverul validează snapshot-ul atomic înainte de battle). Offline-ul permite joc fără internet. Server-authoritative înseamnă zero cheat posibil — serverul decide tot.

**Sursa:** Discuție securitate + arhitectură (2026-07-18) — user + AI

---

## D008 — Offline-First

**Data:** 2026-07-18
**Decizie:** Cardweave devine un joc **offline-first complet**. Zero server, zero PostgreSQL, zero ghost battles. Jocul e 100% local, cu AI opponent adaptiv și sisteme procedurale (quests, rewards, narrative) generate dinamic pe client.

**Motiv:** Analiza a arătat că un auto-battler single-player nu are nevoie de online ca să fie extraordinar. Fără server: zero costuri, zero cheat, zero downtime, zero DevOps. AI-ul poate oferi aceeași varietate și provocare ca un opponent uman, fără complexitatea și riscurile unui sistem PvP.

**Implicații:**
- Se elimină: Rust server, PostgreSQL, Redis, ghost battles, matchmaking, trading
- Se păstrează: React + PixiJS + Tauri (desktop, Steam, web)
- Sistemele anti-cheat server-side devin irelevante — jocul e single-player
- Focusul se mută pe: AI opponent adaptiv + quest factory + reward system
- Arhitectura e mai simplă, mai rapid de dezvoltat, zero infrastructură

**Sursa:** Discuție arhitectură (2026-07-18) — user + AI
