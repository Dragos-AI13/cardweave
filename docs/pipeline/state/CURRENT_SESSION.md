# CURRENT_SESSION

> Focusul sesiunii curente. Se actualizează pe parcurs.

---

## Sesiune: 2026-07-24 — Pivot Character Evolution + Godot Switch

**Obiectiv:** Pivotare completă: Character Evolution înlocuiește card parts (D010), Godot înlocuiește PixiJS (D011). Arhivare doc-uri vechi, rescriere FEATURE_DESIGN, ștergere cod PixiJS.

**Progres:**

- [x] Discuție brainstorming — user propune character evolution, AI confirmă direcția
- [x] Clarificare: subalternii se deblochează pe orizontală (faimă + rang), nu se evoluvează individual
- [x] Clarificare: items craftable → shop → equip pe subalterni; items deblochează skills (craftable)
- [x] Doc-uri vechi arhivate cu SUPERSEDED (7 documente)
- [x] Noul FEATURE_DESIGN.md scris — `docs/pipeline/features/character-evolution/FEATURE_DESIGN.md`
- [x] DESIGN_PIPELINE.md actualizat cu noul feature
- [x] DECISION_LOG.md — D010 + D011 adăugate
- [x] NEXT_ACTIONS.md — resetat pentru noul design
- [x] Codul PixiJS (`app/`) șters
- [x] `game/` — proiect Godot 4.x de inițializat
- [x] G1 — Aprobare Character Evolution design de la Dragoș
- [x] DESIGN_PASS.md scris — P1 scope documentat
- [x] P1 scope ajustat: Round Progression, Visual Feedback, Game Over, Tooltip, Sell, Tier Badge, Coins Indicator
- [x] Structură repo: Godot project mutat în game/lowborn/, .gitignore updatat
- [ ] UI_SPEC + TICKET_INDEX + tickete — următorul pas
