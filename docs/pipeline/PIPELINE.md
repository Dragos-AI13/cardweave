# Pipeline — Shardbound

> Tabelul viu — arată stadiul fiecărui feature. Se actualizează după fiecare gate sau ticket finalizat.

---

## Legendă

| Stare | Meaning |
|-------|---------|
| 🔵 Roadmap | În plan, neînceput |
| 🟡 Game Design | Se scrie designul |
| 🟣 Production | Se sparge în tickete |
| 🟢 Development | Se implementează |
| 🟠 QA | Se testează |
| ⚪ Released | Shipped |
| 🔴 Blocked | Blocat de ceva |
| ❌ Cancelled | Amânat pe termen nelimitat |

---

## Features active

| Feature | Folder | Faza GDD | Dept | Gate | Next Action |
|---------|--------|----------|------|------|-------------|
| *(nimic activ — alege din Roadmap)* | | | | | |

---

## Features în plan (Roadmap)

| Feature | Folder | Faza GDD | Prioritizare | Next Action |
|---------|--------|----------|-------------|-------------|
| Card Part System | `features/card-part-system/` | P1 | 🔴 High | **Alege-mă!** Primul feature, fundația jocului |
| Grid + Auto-Battle | *(necreat)* | P1 | 🔴 High | Așteaptă Card Part System |
| Card Assembly | *(necreat)* | P2 | 🟡 High | Așteaptă Card Part System |
| Buy Phase | *(necreat)* | P2 | 🟡 High | Așteaptă Card Part System |
| Rase | *(necreat)* | P3 | 🟢 Medium | Așteaptă features P1-P2 |
| Run Loop | *(necreat)* | P4 | 🟢 Medium | Așteaptă features P1-P2 |
| Professions | *(necreat)* | P5 | 🔵 Low | — |
| Blueprints | *(necreat)* | P6 | 🔵 Low | — |
| Upgrade + Tier | *(necreat)* | P7 | 🔵 Low | — |
| Polish | *(necreat)* | P8 | 🔵 Low | — |
| Early Access | *(necreat)* | P9 | 🔵 Low | — |

---

## Cum se mută un feature prin pipeline

1. Când începem un feature → se mută din Roadmap în Game Design, se creează folderul în `features/`
2. După G1 bifat → se mută în Production
3. După G2 bifat → se mută în Development
4. După G3 bifat → se mută în QA
5. După G4 bifat → se mută în Released

**Format actualizare:** `| Feature | features/nume/ | P1 | 🟡 Game Design | 🟡 G1 | Scrie FEATURE_DESIGN.md |`
