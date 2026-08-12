# Decision Log

## D013 — Pivot Lowborn v3: Card Game Roguelike (2026-08-12)

**Decizie:** Auto-battler single-player (v2) → card game roguelike turn-based cu
card crafting din 3 părți + meserii MMORPG.

**Context:**
- Analiză de piață (aug 2026): auto-battler/inventory saturat — 59+ jocuri "backpack" pe Steam;
  deckbuilder-urile turn-based au mega-hit-uri (Balatro 5M+, Slay the Spire 5M+)
- Crafting-ul profund se simte în turn-based (fiecare carte = decizie conștientă)
- GDD-ul v1 (Cardweave, card crafting din părți) era deja exact direcția — fuzionat cu
  Character Evolution din v2

**Consecințe:**
- Clean slate: șters proiectul Godot v2, documentația superseded, feature-uri vechi
- GDD v3 în `docs/design/GDD.md`
- Se păstrează: AI Cardinal, Character Evolution, arhitectura Godot offline-first

**Alternativă respinsă:** continuarea pe auto-battler cu hook (risc comercial pe gen saturat).

---

## D014 — Tooling: Varianta B + Defalcare Completă Per Fază (2026-08-12)

**Decizie:**
1. Documentație + ticket-uri rămân ÎN REPO (markdown versionat, templates existente),
   iar **GitHub Projects** oferă board-ul vizual (Todo / In Progress / Done).
   Fără tool extern (Linear/Notion) — zero cost, offline-first, zero lock-in, zero duplicare.
2. **Principiu de lucru:** fiecare fază de development se defalchează COMPLET
   (cerințe, sub-task-uri, exit criteria) înainte de execuție; design-ul fiecărei faze
   e bine pus la punct înainte să trecem mai departe; nicio fază nu se sare.

**Consecințe:**
- `Documentation/design/DEVELOPMENT_PLAN.md` — planul de development cu fazele, exit criteria și checklist
- Pachetele de design: `Documentation/design/pack-00` → `pack-08` (structurate, README per pachet)
- Faza 1 (Design complet) începe cu Pack 00 — Design Pillars
