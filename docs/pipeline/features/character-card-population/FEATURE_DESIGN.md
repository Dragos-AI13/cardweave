# Feature: Character Card Population

**ID:** FEATURE-CARDS-001
**Status:** 💡 Backlog
**Gate:** Se activează după ce skills, buffs/debuffs și caracterele sunt definite

---

## 1. Context

După ce sistemele de bază funcționează (grid, assembly, shop, battle, AI opponent) și după ce avem definițiile complete ale skills, buffs/debuffs și caracterelor, începem să populăm fiecare caracter cu cărțile sale unice.

---

## 2. Când se activează acest feature

- [ ] Skill Rectangle Catalog — complet (toate efectele posibile, cum scalează)
- [ ] Buff/Debuff Catalog — complet
- [ ] Caracterele — definite (nume, identitate, teme preferate)
- [ ] SYS-001 → SYS-008 implementate și funcționale
- [ ] Loop-ul de bază (shop → assembly → battle → rewards) jucabil și aprobat

**Abia atunci începe popularea cărților.**

---

## 3. Dependențe complete

```
Skills + Buffs/Debuffs Catalog (acum)
  → Caractere definite (nume, identitate, tematică)
    → Caractere populate cu cărți (acest feature)
      → Balansare și testare
```

---

## 4. Ce trebuie făcut

Pentru fiecare caracter:

| Pas | Ce |
|---|---|
| 1 | Stabilești identitatea caracterului (nume, personalitate, rol) |
| 2 | Alegi 5-15 cărți care definesc stilul lui |
| 3 | Pentru fiecare carte: definești toate 6 părțile (valori, rarități, skill) |
| 4 | Skill-urile sunt din Catalog (nu inventezi altele noi aici) |
| 5 | Calculezi sinergiile interne |
| 6 | Populezi datele în sistem (JSON / TypeScript) |

**Notă:** La pasul 3, nu inventezi skill-uri noi — folosești doar ce e în Skill Rectangle Catalog. Dacă ai nevoie de un skill nou, adaugi mai întâi în catalog, apoi îl folosești la cărți.

---

## 5. Template — definire carte

```
Caracter: [Nume]
Rasă: [rasă]
Clasă: [clasă]

Cartea 1: „[Nume Carte]"
├── Frame: [raritate]
├── Name: „[Nume]"
├── Icon: [character_id]
├── Attack Jewel: +[valoare] damage, cost [n] energie
├── Defense Jewel: +[valoare] HP, cost [n] energie
├── Skill: [SKILL_ID din catalog] — [parametri]
├── Theme: [theme_tag]
└── Rarity: [Common → Mythic]
```

---

## 6. Estimare

| Task | Efort |
|---|---|
| 1 caracter complet (~10 cărți) | ~2-4 ore |
| 10 caractere complete | ~20-40 ore |
| Balansare | ~5-10 ore |

---

## 7. Istoric

| Dată | Schimbare |
|---|---|
| 2026-07-18 | Creat |
| 2026-07-18 | Adăugate dependențe de Skills Catalog + Caractere |
