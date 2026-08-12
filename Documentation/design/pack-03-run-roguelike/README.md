# Pack 03 — Run & Roguelike

**Status:** 📝 Neînceput
**Scop:** Structura unei partide — harta, nodurile, evenimentele, șefii și elementele roguelike
care fac fiecare run diferit. Depinde de Combat (01) și Crafting (02) — știm ce dăm ca recompensă.

## Ce conține

- **Harta** — layout (ramuri, alegeri), lungimea run-ului, dificultate progresivă
- **Nodurile** — Luptă, Eveniment, Atelier, Piață, Șef: ce oferă fiecare, frecvențe
- **Luptele** — adversari, elitelor, curba de dificultate pe parcursul run-ului
- **Evenimente** — decizii narative, risc/recompensă, meserii speciale
- **Recompense** — materiale, părți de cărți (alegere 1 din 3), monede, consumabile
- **Relics / artefacte** — obiecte pasive care modifică jocul (ca la Slay the Spire) — dacă intră în v1
- **Șefii** — câți, teme, mecanici unice, recompense
- **Roguelike elements** — permadeath în run, variație între run-uri (seed, aleator), meta-unlock-uri
- **Durata** — țintă de 45-60 min per run, pacing

## Întrebări-cheie

- Câte noduri are un run tipic și câți șefi?
- Relics intră în v1 sau le amânăm (scope control)?
- Evenimentele narative — cât de multe și cât de adânci în v1?
- Cum asigurăm variație între run-uri fără sute de conținut?

## Exit criteria (pachetul e gata când)

- [ ] Harta + nodurile + recompensele definite
- [ ] Adversarii și șefii v1 listați (concept + mecanici)
- [ ] Roguelike elements + variație definite
- [ ] Documente produse și aprobate

## Documente planificate

- `RUN_STRUCTURE.md` (hartă, noduri, durată)
- `EVENTS.md` (evenimente + decizii)
- `BOSSES.md` (șefi + mecanici)
