# Pack 02 — Card System + Crafting

**Status:** 📝 Neînceput
**Scop:** Cel mai mare și mai complex pachet — sistemul care face jocul UNIC: cărți compuse
din 3 părți + meserii cu progresie MMORPG. Se lucrează după Combat (știm ce produce crafting-ul).

## Ce conține

- **Structura cărții detaliată** — Rasă + Rol + Esență: ce face fiecare parte, valori, exemple
- **Rarități** — Common → Legendary: ce schimbă, cum se obțin, curbe de putere
- **Upgrade de parte** — +0 → +10: costuri, materiale, ce crește
- **Dezasamblare** — ce returnează, raportul de pierdere, economia circulară
- **Meseriile** — Fierar (roluri), Alchimist (esențe), Vrăjitor de rune (upgrade), Bucătar (consumabile):
  - Skill tree per meserie (noduri active/pasive, specializări)
  - Niveluri, XP, deblocări
  - Materiale (tipuri + rarități) și cum se obțin
  - Rețete — cunoscute vs. de descoperit, experimentare
  - Calitate la crafting (crit craft), influența skill tree-ului
- **Atelierele** — cum arată crafting-ul în run vs. hub persistent
- **Scala de conținut** — 10×10×10 = 1.000 combinații, subsetul de v1

## Întrebări-cheie

- Care meserie intră în v1 și care se amână?
- Cât de deep e skill tree-ul (câte noduri pe meserie la lansare)?
- Rețetele de descoperit: random sau ghidate (indici)?
- Ce materiale sunt „rare" și cât de rare (economie)?

## Exit criteria (pachetul e gata când)

- [ ] Structura cărții + rarități + upgrade definite complet
- [ ] Toate meseriile din v1 au skill tree + materiale + rețete definite
- [ ] Economia circulară (dezasamblare) cu numere concrete
- [ ] Documente produse și aprobate

## Documente planificate

- `CARD_STRUCTURE.md` (3 părți, rarități, upgrade, dezasamblare)
- `PROFESSIONS.md` (skill tree per meserie)
- `MATERIALS_RECIPES.md` (materiale, rețete, calitate)
