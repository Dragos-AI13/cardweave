# DEV_PIPELINE.md — Handoff pentru Instanța PC

> Acest document e citit de instanța Hermes de pe PC la începutul fiecărei sesiuni de development.
> Conține features-urile care au trecut de G2 și sunt gata de implementat.

---

## Cum funcționează handoff-ul

1. **Design** e gata (`documentation` branch, G2 bifat)
2. PC-ul face `git pull origin documentation`
3. PC-ul citește `DEV_PIPELINE.md` să vadă ce e de făcut
4. PC-ul alege primul ticket din `features/<feature>/tickets/TICKET_INDEX.md`
5. PC-ul scrie cod pe `game-development`, branch `feat/<feature>-<ticket>`

---

## Features gata de development

| # | Feature | Link Design | Tickete | Status Dev |
|---|---|---|---|---|
| — | Niciunul încă | — | — | — |

---

## Când un feature e gata

- Codul e pe `game-development`
- Ticket-urile sunt marcate ✅ în TICKET_INDEX.md
- Userul testează
- După aprobare → merge pe `main`
