# Workflow — Instrucțiuni pentru Agent

> Acest document conține flow-ul exact pe care îl urmez EU (agentul AI) când lucrez la Shardbound.

---

## 1. Startup — Început de sesiune

**De fiecare dată când încep o sesiune nouă:**

### Pasul 1 — Stare
Citește ACESTE fișiere (în paralel, dacă se poate):
1. `docs/pipeline/PIPELINE.md` — ce features sunt active, ce next action au
2. `docs/pipeline/state/NEXT_ACTIONS.md` — următorul lucru de făcut
3. `docs/pipeline/state/PROJECT_STATUS.md` — statusul general al proiectului
4. `docs/pipeline/state/CURRENT_SESSION.md` — ce s-a lucrat ultima dată

Dacă userul spune „continuăm" sau „hai să lucrăm" — începe de aici.

### Pasul 2 — Verificare reală
Nu te baza doar pe state files. Verifică și realitatea:
- `git log --oneline -5` — ultimele commit-uri
- Există scene `.tscn`? Scripturi `.gd`? (arată implementare reală)
- E PIPELINE.md actualizat cu realitatea?

### Pasul 3 — Raportează
Prezintă un sumar scurt:
- Ce e activ în pipeline acum
- Unde am rămas
- Următorul pas concret (din PIPELINE.md → Next Action)

---

## 2. Execuție — Cum lucrez la un feature

Când userul spune „hai să implementăm feature-ul X" sau pipeline-ul zice că X e gata de următorul pas:

### Flow per feature

```
🎯 [USER]  Vrea feature-ul X
    │
    ▼
📐 GAME DESIGN
    ├── Creez folderul features/<nume>/ (dacă nu există)
    ├── Scriu FEATURE_DESIGN.md (draft)
    ├── Scriu DESIGN_PASS.md (draft cu opțiuni)
    ├── Scriu wireframe dacă e cazul
    ├── Actualizez PIPELINE.md → 🟡 Game Design
    └── Prezint userului, aștept aprobare
    │
    ▼  G1 bifat de user
    │
📋 PRODUCTION
    ├── Citesc designul aprobat
    ├── Sparg în tickete mici (T001, T002...)
    ├── Scriu TICKET_INDEX.md în features/<nume>/tickets/
    ├── Scriu ticket-urile individuale
    ├── Scriu SHARED_IMPLEMENTATION_GUIDE.md dacă e necesar
    ├── Verific G2 (e totul gata?)
    └── Actualizez PIPELINE.md → 🟣 Production
    │
    ▼  G2 bifat automat
    │
⚙️ DEVELOPMENT
    ├── Pentru fiecare ticket:
    │   ├── Implementez
    │   ├── Rulez AI Self-Review (vezi secțiunea 6)
    │   ├── Commit + push
    │   └── Update state files
    ├── Când toate ticket-urile sunt gata: verific G3
    └── Actualizez PIPELINE.md → 🟢 Development
    │
    ▼  G3 bifat automat
    │
🧪 QA
    ├── Verific tehnic bug-uri
    ├── Prezint userului pentru playtest
    ├── Documentez bug-uri în KNOWN_ISSUES.md
    ├── Actualizez DECISION_LOG.md dacă apar decizii
    └── Aștept G4 (aprobare user)
    │
    ▼  G4 bifat de user
    │
🚀 SHIPPED — marchează în PIPELINE.md ca ⚪ Released
    │
    ▼
🧹 Post-Release
    ├── Dacă e pe branch: user aprobă merge → șterg branch-ul
    ├── Actualizez features/README.md
    └── Selectez următorul feature din PIPELINE.md
```

### Reguli de implementare

1. **Un ticket odată** — nu încep ticket-ul următor până cel curent nu e gata + commit + state files update
2. **Nu implementez nimic din afara scope-ului** — dacă ticket-ul zice „creează sistemul de carduri", nu implementez și shop-ul
3. **Commit după fiecare ticket** — mesaj descriptiv: `feat(card-system): add card data model`
4. **State files update după fiecare ticket** — NEXT_ACTIONS.md, CHANGELOG_WORKING.md, CURRENT_SESSION.md
5. **Branch per feature** — `feat/nume-scurt-fara-spatii`

---

## 3. Git Workflow

### Branch strategy

```
main (protejat — doar PR-uri)
  └── game-development (baza de lucru)
        └── feat/card-part-system    ← un branch per feature
        └── feat/grid-battle
        └── fix/xxx                  ← bug-uri critice
```

### Reguli git

| Acțiune | Regulă |
|---------|--------|
| **Branch base** | `game-development` — tot ce nu e pe main |
| **Branch naming** | `feat/<nume-scurt>`, `fix/<nume-scurt>` |
| **Commit format** | `<tip>(<scope>): <mesaj>` — tipuri: feat, fix, docs, refactor, test, chore |
| **Commit frequence** | După fiecare ticket finalizat |
| **Merge** | Doar după G3 bifat + aprobare user |
| **Branch cleanup** | Ștergem branch-ul local și remote după merge |

### Exemple commit

```
feat(card-system): add CardPart resource with frame and jewel fields
docs(card-system): write DESIGN_PASS for part assembly rules
fix(card-system): prevent division by zero in damage calculation
```

---

## 4. State Files Update — Obligatoriu

### După ORICE ticket finalizat:

1. **NEXT_ACTIONS.md** — bifează ticket-ul, adaugă următorul
2. **PROJECT_STATUS.md** — actualizează „Last Session Summary"
3. **CURRENT_SESSION.md** — marchează progresul
4. **CHANGELOG_WORKING.md** — adaugă entry cu Added/Changed/Fixed
5. **PIPELINE.md** — actualizează statusul dacă s-a schimbat departamentul

### După ORICE feature complet (toate ticket-urile gata):

1. Verific G3 — toate ticket-urile bifate
2. Mută feature-ul în QA în PIPELINE.md
3. Prezintă userului sumarul

### După ORICE discuție de design care produce o decizie:

1. Adaugă entry în DECISION_LOG.md
2. Dacă decizia schimbă designul existent, actualizează și DESIGN_PASS.md / FEATURE_DESIGN.md

---

## 5. Cum vorbesc cu tine (user)

Nu te preface că știi ce vrea userul — întreabă:
- „Feature-ul X are DESIGN_PASS.md scris. Vrei să-l citești și să zici dacă e ok?"
- „Ticket-ul T001 e gata. Vrei să verifici înainte să trec la T002?"
- „Am terminat implementarea. Vrei să joci un pic să vezi cum e?"

**Tonul:** Prietenos, direct, română (ca userul). Explic opțiunile, nu prescriu.

---

## 6. AI Self-Review — ÎNAINTE de a zice „gata"

> Înainte de a marca un ticket ca **done**, verific asta:

- [ ] Am recitit codul/scenele înainte de commit?
- [ ] Nu am lăsat comment-uri de debug, `print()`-uri, sau `TODO`-uri?
- [ ] Fișierele noi sunt adăugate în git? (`git status` verificat)
- [ ] Rulează / compilează fără erori?
- [ ] Edge case-urile din ticket sunt acoperite? (null, 0, gol, limită)
- [ ] N-am implementat nimic din afara scope-ului ticket-ului?
- [ ] Mesajul de commit e descriptiv? (`<tip>(<scope>): <mesaj>`)

**După self-review:** commit + push + update state files.

---

## 7. Când ceva nu e clar

1. Verifică PIPELINE.md, state files, și documentația existentă
2. Dacă tot nu e clar — **întreabă**. Nu ghici.
3. Dacă o decizie de design e ambiguă — prezintă opțiunile cu trade-off-uri, nu face alegerea singur
4. Dacă userul zice „nu m-ai înțeles" — oprește-te și cere clarificări
