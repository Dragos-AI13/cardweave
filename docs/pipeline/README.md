# Cardweave Pipeline — Sistemul nostru de producție

> Un pipeline formal de game development pentru solo dev + AI, inspirat din studiourile AAA dar adaptat pentru un singur om și un agent AI.

## Filosofie

```text
Nu scriem cod până nu știm EXACT ce construim.
Nu trecem la următorul pas până nu bifăm toate condițiile.
Totul e în fișiere — nu în discuții pierdute.
```

## Cum funcționează

Un feature călătorește prin **4 departamente** și trece prin **4 gates**:

```
🎯 Vision (tu) 
    │  "Vreau feature-ul X"
    ▼
📐 Game Design (tu + eu) 
    │  Scriem specificația, mecanica, wireframe-uri
    │  ■ G1 — Definition of Ready
    ▼
📋 Production (eu) 
    │  Sparg feature-ul în tickete, mapez dependențe
    │  ■ G2 — Sprint Ready
    ▼
⚙️ Development (eu) 
    │  Implementez ticketele unul câte unul
    │  ■ G3 — Definition of Done
    ▼
🧪 QA (tu + eu) 
    │  Testăm, playtestăm, raportăm bug-uri
    │  ■ G4 — Release Gate
    ▼
🚀 Shipped! ✅
```

## Structura fișierelor

```
docs/pipeline/
├── README.md                ← Ești aici
├── PIPELINE.md              ← Tabelul viu — ce feature, în ce stadiu
├── GOVERNANCE.md            ← Regulile: departamente, gates, responsabilități
├── WORKFLOW.md              ← Flow-ul pe care îl urmez EU (agentul)
│
├── templates/               ← Șabloane pentru fiecare departament
│   ├── FEATURE_DESIGN.md    ← Game Design: specificație feature
│   ├── DESIGN_PASS.md       ← Game Design: mecanici detaliate
│   ├── UI_WIREFRAME.md      ← Game Design: wireframe-uri
│   ├── TICKET_INDEX.md      ← Production: ticket breakdown
│   └── TICKET.md            ← Production: ticket individual
│
└── state/                   ← Starea curentă a proiectului
    ├── NEXT_ACTIONS.md       ← Ordinea de execuție
    ├── PROJECT_STATUS.md     ← Statusul general
    ├── CURRENT_SESSION.md    ← Focusul sesiunii curente
    └── CHANGELOG_WORKING.md  ← Ce s-a făcut în sesiune
```

## Reguli de aur

1. **PIPELINE.md e sursa de adevăr** — dacă nu e în pipeline, nu există
2. **State files se actualizează după ORICE ticket finalizat**
3. **Niciun feature nu sare peste gates** — nu treci la cod înainte de G1 bifat
4. **Tu deții gates-urile creative** (G1, G4) — eu le verific pe cele tehnice (G2, G3)
5. **Un feature odată** — nu lucrăm la 3 features în același timp. Maxim unul în Game Design și unul în Development paralel.
