# UI_WIREFRAME.md — Șablon Wireframe

> Folosește când un feature include elemente UI (ecrane, butoane, meniuri, HUD).

---

## Feature: [Nume Feature]

---

## 1. Ecrane

### 1.1 [Nume Ecran]

**Descriere:** Ce vede jucătorul pe acest ecran.

**Layout (textual):**
```
┌──────────────────────────────┐
│  [TITLE]                     │
│                              │
│  ┌──────┐  ┌──────┐         │
│  │  A   │  │  B   │         │
│  └──────┘  └──────┘         │
│                              │
│  [BUTTON]                    │
└──────────────────────────────┘
```

**Elemente:**
| Element | Tip | Acțiune |
|---------|-----|---------|
| A | Panel | Click → ... |
| B | Buton | Click → ... |

**Stări:**
- Default: ...
- Hover: ...
- Click: ...
- Disabled: ...

### 1.2 [Nume Ecran 2]
...

---

## 2. Flow între Ecrane

```
Ecran1 → (click buton X) → Ecran2
Ecran2 → (click back) → Ecran1
```

---

## 3. Animații / Tranziții

- Ecran1 → Ecran2: fade / slide / instant
- Buton hover: scale 1.05
- ...

---

## 4. Variații

- Mobile layout (dacă e diferit)
- Low-res mode
- Accessibility (font mai mare, contrast)
