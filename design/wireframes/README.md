# Wireframes Oficiale — Cardweave

> Wireframe-uri aprobate, gata de implementare.
> Odată ce un wireframe e mutat aici, designul e considerat final.
> Se lucrează în `design/mockups/` și se promovează aici după aprobare.

---

## Index

| # | Screen | File | Status | Data aprobare |
|---|--------|------|--------|---------------|
| 1 | **Main Menu** | `main-menu.excalidraw` | ✅ Aprobat | 2026-07-22 |

---

## Cum se folosesc

1. Deschide fișierul `.excalidraw` pe [excalidraw.com](https://excalidraw.com)
2. Folosește layout-ul și proporțiile ca referință în cod
3. Culorile și fonturile sunt orientative — vezi design system-ul final în `Documentation/tech/TECH_STACK.md`

---

## Screens

### 1. Main Menu

**Fișier:** `main-menu.excalidraw`
**Link:** https://excalidraw.com/#json=pECltdr-NdsErA3vsjv3X,qJTCJlvAtYxOtPTB9lZiGA

Layout:
- Panou stânga: brand + logo CARDWEAVE auriu + 3 butoane (Joacă, Colecție, Setări) cu taste rapide + footer
- Panou dreapta: card personaj Ignis cu portrot, stats (HP, Energie, Atac) și indicator Arena Slots
- Fundal închis, vibe fantasy/offline-first

**Referințe în doc:**
- Character: Ignis (Dragonkin Mage) — vezi `Documentation/mechanics/CHARACTERS_v1.md`
- Arena Slots: 5 sloturi, 6 subsloturi — vezi `Documentation/mechanics/SYSTEM_FINAL_CONFIRMARE.md`
- Tech stack: PixiJS pur + Tauri — vezi `Documentation/tech/TECH_STACK.md`
