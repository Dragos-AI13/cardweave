# T001 — Main Menu Scene

**Feature:** FEAT-P1-Arena-Slots
**Status:** ready
**Depends on:** —
**Blocks:** T002
**Guide:** [DESIGN_PASS.md](../DESIGN_PASS.md), [UI_SPEC.md](../UI_SPEC.md)

---

## Business goal

Primul ecran pe care îl vede jucătorul. Trebuie să arate bine, să transmită vibe-ul jocului și să aibă un buton "Joacă" care funcționează.

## Scope

### In
- [ ] Inițializare proiect Tauri + Vite + PixiJS
- [ ] GameEngine cu state machine (MENU → BUY → BATTLE → RESULTS)
- [ ] EventBus simplu
- [ ] MenuScene cu fundal + titlu + buton Joacă + caracter Ignis
- [ ] Tranziție MENU → BUY_PHASE la click pe Joacă

### Out
- Butoanele Colectie + Setări (doar decorative în P1 — nu duc nicăieri)
- Animații complexe (fade out simplu e suficient)
- Sunet

## Fișiere

| Acțiune | Fișier |
|---------|--------|
| CREATE | `package.json` |
| CREATE | `tsconfig.json` |
| CREATE | `vite.config.ts` |
| CREATE | `index.html` |
| CREATE | `src/main.ts` |
| CREATE | `src/engine/GameEngine.ts` |
| CREATE | `src/engine/StateMachine.ts` |
| CREATE | `src/engine/EventBus.ts` |
| CREATE | `src/engine/config.ts` |
| CREATE | `src/scenes/MenuScene.ts` |
| CREATE | `src/data/characters.ts` |

## Pași implementare

1. **Inițializare proiect:**
   ```bash
   mkdir cardweave-p1 && cd cardweave-p1
   npm init -y
   npm install pixi.js@8 typescript vite
   npx tsc --init
   ```
2. **Config:** `vite.config.ts`, `tsconfig.json`, `index.html` — template minimal
3. **Configurări joc:** `src/engine/config.ts` — canvas 1280×720, culori, defaults
4. **EventBus:** `src/engine/EventBus.ts` — `on()`, `emit()`, `off()`
5. **StateMachine:** `src/engine/StateMachine.ts` — stări, tranziții, `enter/update/exit`
6. **GameEngine:** `src/engine/GameEngine.ts` — init PixiJS app + SM + eventBus + main loop
7. **Date caracter:** `src/data/characters.ts` — Ignis (HP 90, Energy +5, Atk 12)
8. **MenuScene:** `src/scenes/MenuScene.ts` — tot layout-ul din UI_SPEC
9. **Main entry:** `src/main.ts` — creează GameEngine, pornește
10. **Verifică:** `npm run dev` → vezi Main Menu în browser

## Acceptanță

- [ ] `npm run dev` → browser → se vede canvasul cu Main Menu
- [ ] Titlul "CARDWEAVE" e vizibil auriu
- [ ] Butonul "> JOACA" e vizibil și evidențiat
- [ ] Portretul lui Ignis e vizibil (cerc violet)
- [ ] Click "Joacă" → console.log("START_GAME") sau tranziție la starea următoare
- [ ] Fără erori în consola browserului

## Verificare

```bash
npm run dev
# Deschide browser la http://localhost:5173
# Verifică vizual: titlu, buton, caracter
# Click Joacă
# Verifică consola
```
