# Pack 01 — Combat System

**Status:** 📝 Neînceput
**Scop:** Inima jocului — lupta turn-based. Fun-ul trăiește sau moare aici. Toate celelalte
sisteme (crafting, run, meta) produc input pentru luptă, deci combat-ul se definește PRIMUL
după fundație.

## Ce conține

- **Turn flow** — pașii unei ture: trage cărți → energie → joacă → efecte → sfârșit de tură
- **Energie** — câtă pe tură, cum crește, costuri pe carte
- **Mâna** — câte cărți, cum se trage, discard, limite
- **Target** — unu-la-unu, mai mulți inamici, focus/tank, ordinea de atac
- **Status effects v1** — burn, shield, stun, taunt, poison etc. — care intră și cum funcționează
- **Sinergii între părți** — cum interacționează Rasă × Rol × Esență în luptă (combo-uri de bază)
- **Adversarul (AI Cardinal)** — cum se comportă, adaptivitate, dificultate
- **Balansare de bază** — formule de damage/shield, curbe de dificultate, exemple numerice
- **Momentul „wow"** — unde e explozia de satisfacție în fiecare luptă

## Întrebări-cheie

- Câtă energie pe tură și câte cărți în mână (ritmul de decizie)?
- Câți inamici simultan în v1 — unul (șef-style) sau grupuri?
- Care status effects sunt esențiale în v1 și care se amână?
- Cum arată sinergia de bază care face jucătorul să zică „wow, ce combo"?

## Exit criteria (pachetul e gata când)

- [ ] Turn flow + energie + mână definite numeric
- [ ] Status effects v1 listați cu efecte exacte
- [ ] Sinergiile de bază dintre părți definite
- [ ] Balansare de bază cu exemple numerice concrete
- [ ] Documente produse și aprobate

## Documente planificate

- `COMBAT.md` (turn flow, energie, target, status effects)
- `SYNERGIES.md` (combinații Rasă × Rol × Esență)
- `BALANCE.md` (formule + numere)
