# Development Plan — Lowborn

**Status:** ✅ Aprobat — 2026-08-12
**Principiu fundamental:** Fiecare fază se defalchează COMPLET (cerințe, sub-task-uri,
criterii de acceptare) înainte de execuție. Design-ul fiecărei faze trebuie bine pus
la punct înainte să trecem mai departe. Nicio fază nu se „sare" sau se face pe jumătate.

---

## 1. Principiul de Lucru — Defalcare Completă Per Fază

```
FAZĂ → DEFALCARE COMPLETĂ (ce presupune, cerințe, sub-task-uri, exit criteria)
     → EXECUȚIE COMPLETĂ (design bine pus la punct înainte de cod)
     → VALIDARE (exit criteria bifate)
     → FAZA URMĂTOARE (aceeași metodă, în corelare cu cerințele ei)
```

- Fiecare fază are **exit criteria** clare — faza e gata DOAR când toate sunt bifate
- Design-ul precede codul în orice fază (documente discutate și aprobate în chat înainte de scriere)
- O fază nu începe până ce faza anterioară nu e validată complet
- Cerințele fiecărei faze se raportează la GDD (`docs/design/GDD.md`) — orice abatere se decide explicit

---

## 2. Fazele

| Fază | Ce facem | Exit criteria | Durată estimată |
|------|----------|---------------|-----------------|
| **1. Design complet** | Design Pillars + toate secțiunile GDD detaliate (vezi §4) | Toate secțiunile aprobate în chat + documentate; GDD v3 final | 1 săptămână |
| **2. Prototip rapid** | Godot: mână de cărți + energie + 1 luptă + cărți 3 părți. Placeholder-uri, ZERO artă finală | Core loop se simte fun; 30-sec loop validat de jucător | 1-2 săptămâni |
| **3. Vertical slice** | 1 run scurt complet: hartă → lupte → atelier → 1 șef + artă ComfyUI reală | Un run jucabil cap-coadă, vizual prezentabil, viziunea completă demonstrată | 3-4 săptămâni |
| **4. Production** | Conținut complet: sisteme + cărți + conținut; playtest constant | Feature-freeze; tot contentul din planul v1 implementat | 2-3 luni |
| **5. Polish + Beta** | Balance, artă finală, audio, Steam Deck, accesibilitate | Beta public; feedback procesat; zero bug-uri critice | 1 lună |
| **6. Launch** | Steam page cu demo + wishlist campaign (începută DEVREME, paralel cu 4-5) | Lansare + post-launch plan | paralel cu 4-5 |

### Regula de aur

- **Prototipul** testează FUN-ul (nu arta)
- **Vertical slice-ul** testează VIZIUNEA completă
- **Production** e doar execuție
- Dacă fun-ul nu iese la prototip, pivotăm devreme — când e ieftin

---

## 3. Tooling (Decizia D014 — Varianta B)

| Aspect | Decizie |
|--------|---------|
| Documentație | În repo — markdown versionat (sursa unică de adevăr) |
| Ticket-uri | În repo — templates existente (TICKET, DESIGN_PASS, FEATURE_DESIGN) + GitHub Issues |
| Board vizual | **GitHub Projects** pe repo — coloane: Todo / In Progress / Done |
| Status | State files în `docs/pipeline/state/` (CURRENT_SESSION, NEXT_ACTIONS, PROJECT_STATUS) |
| Backup | Repo-ul e deja pe GitHub (remote) — push după fiecare sesiune |

De ce Varianta B: zero cost, versionat cu codul, offline-first (respectă constitution),
fără lock-in, fără duplicare de documente. GitHub Projects oferă kanban-ul vizual fără tool extern.

---

## 4. Ordinea de Detaliere a Designului (Faza 1)

Secțiunile GDD se detaliază în această ordine, fiecare discutată și aprobată în chat:

1. **Design Pillars** — 3-5 principii care ghidează toate deciziile (fundația)
2. **Combat detaliat** — energie, status effects, sinergii între părți, dificultate
3. **Meseriile detaliat** — skill tree per meserie, materiale + rarități, rețete, legătura cu run-ul
4. **Run structure** — harta, nodurile, evenimente, șefi, relics/artefacte roguelike
5. **Meta-progresie** — character evolution concret, colecția de cărți, hub persistent
6. **Content plan v1** — câte rase/roluri/esențe, monștri, șefi, evenimente la lansare
7. **UI/UX** — mâna de cărți, atelierul, inventarul — fluxul pe ecran
8. **Art & audio pipeline** — ce generăm în ComfyUI, cum asamblăm în Godot
9. **Scope + business** — ce intră în v1, preț, Steam page, demo

---

## 5. Cum se lucrează o Fază (checklist)

- [ ] Faza e defalcată complet: cerințe, sub-task-uri, exit criteria — documentate
- [ ] Design-ul fazei e discutat în chat și aprobat (nu scriem documente din start)
- [ ] Documentația e scrisă în repo (docs/design/ sau docs/pipeline/)
- [ ] Ticket-urile sunt create (GitHub Issues + Projects) pentru sub-task-uri
- [ ] Execuție completă, cu validare la final
- [ ] Exit criteria bifate, status actualizat (state files), commit + push
- [ ] Decizii importante → DECISION_LOG.md
