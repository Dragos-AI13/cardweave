# Current Session

**Dată:** 2026-08-12
**Context:** Pivot Lowborn v3 — clean slate.

## Ce s-a întâmplat

1. **Decizie de direcție:** auto-battler single-player (v2) → **card game roguelike turn-based** (v3).
   Motiv: piața auto-battler saturată (59+ jocuri "backpack" pe Steam); deckbuilder-urile
   au istoric de hit-uri (Balatro, Slay the Spire).
2. **Revival concept Cardweave v1:** cărți compuse din părți + profesii — fuzionat cu
   Character Evolution din v2.
3. **Model ales:** carte = 3 părți (Rasă + Rol + Esență). Crafting tip MMORPG
   (skill tree, materiale rare, rețete, dezasamblare).
4. **Clean slate:** șters proiectul Godot (`game/`), documentația veche superseded,
   feature-uri vechi. Păstrat: constitution, templates, pipeline, CARDINAL_ENGINE.
5. **GDD v3 aprobat:** `docs/design/GDD.md`.

## Starea repo-ului

- Branch `main`, working tree curat după commit-ul de clean slate
- Proiectul Godot NU există — se creează la primul feature (prototip)
- Documentație: `docs/design/` (GDD) + `docs/pipeline/` (workflow) + `Documentation/systems/cardinal/`
