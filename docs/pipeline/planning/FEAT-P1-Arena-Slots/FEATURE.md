# FEATURE.md — FEAT-P1: Arena Slots Prototype

**ID:** FEAT-P1
**Status:** planning
**Data:** 2026-07-22
**Departament:** Development
**Model:** Offline-first

---

## 1. Context

Cardweave e un auto-battler single-player unde jucătorul își construiește cărțile din părți. Designul final folosește **Arena Slots** (5 sloturi, 6 subsloturi per carte) cu snap mechanic direct din shop.

P1 e primul prototip funcțional — cel mai mic cerc care poate rula: Main Menu → Buy Phase (shop + snap) → Battle Phase (auto-battle + energy) → AI opponent.

## 2. Scop

Să avem un loop jucabil cap-la-cap: jucătorul deschide jocul, vede meniul, intră într-un duel, cumpără părți, le plasează în sloturi, se bate cu AI-ul, vede rezultatul.

## 3. In Scope

- [x] Main Menu cu titlu + buton Joacă + caracter Ignis
- [x] Arena cu 5 sloturi vizuale, fiecare cu 6 subsloturi
- [x] Shop cu Attack Jewel + Defense Jewel de vânzare
- [x] Snap mechanic: click parte → click slot → partea apare
- [x] Auto-battle: cărțile se activează pe cooldown
- [x] Energy globală: bară, regen, consum la activare
- [x] Character HP + Shield generat de Defense Jewel
- [x] AI opponent simplu (Cardinal P1: 4 parametri ADN)
- [x] Boost ×1.3 la carte completă (6/6)
- [x] Results screen: Win/Lose, coins primite

## 4. Out of Scope (P2+)

- [ ] Skill Rectangle effects (Burn, Bleed, Stun)
- [ ] Buff/Debuff system
- [ ] Frame/Name/Icon effects (doar decorative în P1)
- [ ] Mutat părți între sloturi
- [ ] Sloturi 6+ deblocabile
- [ ] Battle log
- [ ] Speed control (1×/2×/3×)
- [ ] Run loop (13 win / 3 lose)
- [ ] Sound și muzică

## 5. Acceptanță

- [ ] Jocul pornește și arată Main Menu cu CARDWEAVE + Ignis + buton Joacă
- [ ] Click Joacă → intrare în Buy Phase cu 5 sloturi goale + shop
- [ ] Poți cumpăra o parte din shop → snap în slot → apare vizual
- [ ] Când ești gata, treci la Battle Phase
- [ ] Battle: cărțile se activează automat, energy scade, damage se aplică
- [ ] Când un character ajunge la 0 HP → Results screen
- [ ] AI opponent cumpără și atacă (nu stă pasiv)

## 6. Dependințe

| Depinde de | Pentru |
|---|---|
| SYS-005 — Arena Slots System | Sloturi, subsloturi, snap |
| SYS-007 — Duel System | Auto-battle, energy, damage |
| SYS-006 — Shop + Buy Phase | Shop, coins, rerol |
| SYS-038 — AI Opponent | Cardinal P1 |
| Cardinal Engine §11 | Roadmap P1 |

## 7. Impact Securitate

**None.** Joc offline-first, single-player, zero rețea.

## 8. Arhitectură

Vezi DESIGN_PASS.md pentru detalii complete.
Stack: PixiJS pur (TypeScript) + Tauri 2 + Vite.
Fără framework UI. Fără server. Fără baze de date.

## 9. Ticket-uri

| # | Nume | Depinde de | Efort |
|---|------|-----------|-------|
| T001 | Main Menu Scene | — | 1-2h |
| T002 | Arena Layout + 5 Sloturi | T001 | 2-3h |
| T003 | Shop + Snap Mechanic | T002 | 2-3h |
| T004 | Auto-Battle Loop | T003 | 3-4h |
| T005 | AI Opponent (Cardinal P1) | T004 | 2-3h |

Vezi `TICKET_INDEX.md` și `tickets/` pentru detalii per ticket.
