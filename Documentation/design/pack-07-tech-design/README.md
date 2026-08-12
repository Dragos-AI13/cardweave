# Pack 07 — Tech Design

**Status:** 📝 Neînceput
**Scop:** Arhitectura tehnică finală a jocului în Godot — reflectă EXACT ce am decis în
pachetele 00-06. Se lucrează ultimul ca să nu proiectăm tehnic pentru sisteme care nu există.

## Ce conține

- **Arhitectura Godot** — scene, autoloads (GameManager, EventBus, SaveLoad, CardinalAI, CraftingSystem)
- **Sistemul de date** — Resources (.tres): CardPartData (rasă/rol/esență), RecipeData,
  ProfessionData, SkillTreeData, MaterialData, EnemyData, EventData
- **Card scene** — structura scenei de card, 3 sloturi de părți, asamblarea procedurală
- **Save system** — format, ce se salvează (colecție, meserii, progresie), portabilitate
- **Random/seed** — cum se generează run-urile (seed procedural), reproductibilitate
- **AI Cardinal** — integrarea în combat (din CARDINAL_ENGINE.md)
- **Export** — desktop (Steam) + web (itch.io), platforme, Steam Deck
- **Scope v1** — ce intră tehnic în v1 (features), ce se amână
- **Riscuri tehnice** — performanță, complexitate, dependențe

## Întrebări-cheie

- Cât de data-driven e totul (Resources vs. cod hardcodat)?
- Save: un singur fișier sau mai multe (profil + colecție + run curent)?
- Seed: fiecare run are seed afișat (comunitate, speedrun)?
- Ce tooling Godot folosim (C# vs GDScript — decizie de confirmat)?

## Exit criteria (pachetul e gata când)

- [ ] Arhitectura + sistemul de date documentate
- [ ] Save system definit (ce, unde, cum)
- [ ] Scope v1 + riscuri tehnice listate
- [ ] Documente produse și aprobate

## Documente planificate

- `TECH_DESIGN.md` (arhitectură, date, save, seed, export, scope)
