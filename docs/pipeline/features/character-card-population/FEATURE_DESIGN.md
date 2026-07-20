# Feature: Character Card Population

**ID:** FEATURE-CARDS-001
**Status:** 💡 Backlog (nu începe până nu e Faza 2 completă)
**Gate:** G1 după ce loop-ul jucabil (Faza 2) e aprobat

---

## 1. Context

După ce sistemele de bază funcționează (grid, assembly, shop, battle, AI opponent), e timpul să populăm jocul cu conținut real. Fiecare caracter are nevoie de cărțile sale unice.

---

## 2. Când se activează acest feature

- [x] SYS-001 → SYS-008 implementate și funcționale
- [x] Loop-ul de bază (shop → assembly → battle → rewards) e jucabil
- [x] Mecanica de bază e aprobată (e fun)
- [ ] **Abia atunci începe popularea caracterelor**

---

## 3. Ce trebuie făcut

Pentru fiecare caracter:

| Pas | Ce |
|---|---|
| 1 | Stabilești identitatea caracterului (nume, personalitate, rol) |
| 2 | Alegi 5-15 cărți care definesc stilul lui |
| 3 | Pentru fiecare carte: definești toate 6 părțile (valori, rarități, skill) |
| 4 | Calculezi sinergiile interne (cărțile din același caracter) |
| 5 | Creezi temele (theme_tags) pentru compatibilitate |
| 6 | Populezi datele în sistem (JSON / TypeScript) |

---

## 4. Template — definire carte

```
Caracter: [Nume]
Rasă: [Dragonkin / Vampire / ...]
Clasă: [Berserker / Assassin / ...]

Cartea 1: „[Nume Carte]"
├── Frame: [raritate]
├── Name: „[Nume]"
├── Icon: [character_id]
├── Attack Jewel: +[valoare] damage, cost [n] energie
├── Defense Jewel: +[valoare] HP, cost [n] energie
├── Skill: [tip efect] — [descriere]
├── Theme: [theme_tag]
└── Rarity: [Common → Mythic]
```

---

## 5. Estimare

| Task | Efort |
|---|---|
| 1 caracter complet (~10 cărți) | ~2-4 ore de design |
| 10 caractere complete | ~20-40 ore |
| Balansare inițială | ~5-10 ore |

---

## 6. Dependențe

- Toate sistemele din Faza 0-2
- SYS-037 Character Card Pool (ca să știm unde se duc datele)

---

## 7. Istoric

| Dată | Schimbare |
|---|---|
| 2026-07-18 | Creat |
