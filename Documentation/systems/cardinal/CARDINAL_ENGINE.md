# Cardinal Engine — Cardweave

> **Nu e un AI care "gândește". E un sistem care CREEZĂ jocul în jurul tău, în timp real, pe baza a CUM joci.**

Cardinal nu e un opponent. E motorul care generează oponenți, quest-uri, recompense, provocări, evenimente și poveste — **dinamice, adaptate jucătorului, fără template-uri predefinite.**

---

## 1. Filosofie

### 1.1 Ce NU e Cardinal

- ❌ Nu e un LLM (nu "gândește" ca un om)
- ❌ Nu are strategii hardcodate
- ❌ Nu are quest-uri predefinite
- ❌ Nu are dialog scriptat
- ❌ Nu e un boss fight cu pattern-uri fixe

### 1.2 Ce ESTE Cardinal

- ✅ E un **sistem procedural generativ** — creează conținut din reguli de bază
- ✅ **Nu știe să joace** — știe să **CREEZE jocul care să te facă să joci**
- ✅ Fiecare decizie a ta **influențează** ce urmează
- ✅ Tratează jocul ca pe un **dialog între tine și sistem**

### 1.3 Regulile Fundamentale

```
1. Un jucător fericit = progres + provocare + varietate + recompensă
2. Dacă ceva e prea ușor → devine mai greu (sau se schimbă complet)
3. Dacă ceva e prea greu → devine mai accesibil (sau primești ajutor)
4. Dacă jucătorul repetă același lucru → i se oferă ALTCEVA
5. Dacă jucătorul e curios → e recompensat pentru explorare
6. Oponentul nu e un inamic — e un **oglindă** a progresului tău
7. Niciodată să nu spui "nu" — spune "da, dar..."
```

---

## 2. Componentele Cardinal

```
┌────────────────────────────────────────────────────────────────┐
│                        CARDINAL ENGINE                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   PLAYER ANALYZER                       │    │
│  │  • Înregistrează ORICE acțiune                         │    │
│  │  • Construiește profil multidimensional                │    │
│  │  • Identifică pattern-uri, slăbiciuni, puncte tari     │    │
│  │  • Scorează skill per categorie (1-100)                │    │
│  └──────────┬─────────────────────────────────────────────┘    │
│             │                                                  │
│             ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                 OPPONENT FORGE                           │    │
│  │  • Generează oponenți cu ADN procedural                │    │
│  │  • Fiecare oponent = un set de parametri (economy,     │    │
│  │    aggression, defense, synergy, risk, creativity)     │    │
│  │  • Oponenții MUTĂ când sunt învinși                   │    │
│  │  • Se adaptează la stilul tău                         │    │
│  └──────────┬─────────────────────────────────────────────┘    │
│             │                                                  │
│             ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                  QUEST WEAVER                           │    │
│  │  • Construiește quest-uri din părți atomice            │    │
│  │  • Obiectiv + restricție + recompensă = quest          │    │
│  │  • Recompensele sunt calculate, nu random              │    │
│  │  • Quest-urile sunt unice per jucător                  │    │
│  └──────────┬─────────────────────────────────────────────┘    │
│             │                                                  │
│             ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                FLOW GOVERNOR                            │    │
│  │  • Menține jucătorul în "zona de flow"                │    │
│  │  • Dacă win rate > 70% → crește dificultatea          │    │
│  │  • Dacă win rate < 30% → scade dificultatea           │    │
│  │  • Balance între provocare și distracție              │    │
│  └──────────┬─────────────────────────────────────────────┘    │
│             │                                                  │
│             ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              REWARD CALCULATOR                          │    │
│  │  • Nu dă random — dă ce LIPSEȘTE jucătorului           │    │
│  │  • Completează colecția, nu o umflă cu duplicate       │    │
│  │  • Încurajează explorarea (bonus pentru ce e nou)      │    │
│  │  • Consolează la pierdere (dă ceva util)               │    │
│  └──────────┬─────────────────────────────────────────────┘    │
│             │                                                  │
│             ▼                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              NARRATIVE LOOM                             │    │
│  │  • Generează evenimente narative emergente            │    │
│  │  • Povestea ta e UNICĂ — bazată pe ce ai făcut        │    │
│  │  • Personaje apar și dispar în funcție de acțiuni     │    │
│  │  • Fără dialog scriptat — totul e generat             │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 3. ADN-ul — Inima Sistemului

### 3.1 Ce e ADN-ul

ADN-ul e un set de parametri care definește COMPORTAMENTUL oricărei entități din joc:

```typescript
interface DNA {
  economy: number;       // 0-1: cât de important e să economisești
  aggression: number;    // 0-1: cât de agresiv e
  defense: number;       // 0-1: cât de defensiv e
  synergy: number;       // 0-1: cât de mult caută sinergii
  risk: number;          // 0-1: cât risc își asumă
  creativity: number;    // 0-1: cât de experimental e
  patience: number;      // 0-1: cât de mult așteaptă momentul potrivit
  adaptability: number;  // 0-1: cât de repede își schimbă strategia
}
```

### 3.2 Ce poți face cu ADN-ul

```
• Un Oponent = un set de ADN
• Un Quest = un obiectiv care reflectă un dezechilibru în ADN-ul jucătorului
• O Recompensă = ce completează ADN-ul (ce lipsește)
• O Provocare = ce contrazice ADN-ul (ce nu faci de obicei)
• Un Eveniment = ADN-ul jucătorului + ADN-ul oponentului + context
```

### 3.3 Mutații ADN

Când învingi un oponent, ADN-ul lui MUTĂ:

```typescript
function mutateDNA(dna: DNA, playerDNA: DNA, defeated: boolean): DNA {
  const mutationRate = 0.2;
  const newDNA = { ...dna };

  for (const gene of Object.keys(newDNA)) {
    // Dacă a fost învins, mutația e direcționată SĂ CONTRAREZE
    if (defeated) {
      // Tinde spre valorile opuse ale jucătorului
      const target = 1 - playerDNA[gene];
      newDNA[gene] = lerp(newDNA[gene], target, mutationRate);
    } else {
      // Dacă a învins, își întărește propriul ADN
      newDNA[gene] = clamp(newDNA[gene] + random(-0.1, 0.1));
    }
  }

  return newDNA;
}
```

**Rezultat:** Un oponent care a pierdut de 5 ori e complet diferit de cel original. A "învățat" din înfrângeri.

---

## 4. Cum Arată pentru Jucător

### 4.1 La Început

```
Run 1: Joci împotriva unui oponent generat cu ADN random
  → Câștigi sau pierzi

Cardinal:
  "Ah, e agresiv. Preferă Attack Jewel. Nu folosește Defense.
   Ignoră rasa Aqua complet."

  → Generează un quest: "Folosește un Defense Jewel +3"
  → Următorul oponent: ADN cu defense ridicată (să-l forțeze să învețe)
```

### 4.2 După 10 Ore

```
Cardinal:
  "Am văzut peste 200 de decizii. Știu:
   - Strategia ta principală (aggro)
   - Slăbiciunile tale (defense, Aqua)
   - Preferințele tale (Pyros, Attack Jewel)
   - Ritmul tău (cumperi repede, nu rerolezi mult)
   
   Acum pot să:
   - Ghicesc ce vei face în runda 3
   - Să creez oponenți care exact să te provoace
   - Să-ți dau quest-uri care să te faci mai bun"
```

### 4.3 După 50 de Ore

```
Cardinal:
  "L-am învins pe The Architect de 10 ori.
   Acum e The Architect v11. E de nerecunoscut.
   
   A observat că joci mereu la fel în prima rundă.
   Acum știe exact să te contracareze.
   
   Dar ți-am pregătit și ceva nou...
   Un oponent care joacă EXACT ca tine.
   Să vedem cum te descurci cu tine însuți."
```

### 4.4 Ce Simte Jucătorul

```
"E ca și cum jocul mă cunoaște. Nu simt că joc împotriva unui
script. Oponentul pare că știe ce am de gând. Când câștig prea
mult, devine mai greu. Când pierd, primesc ajutor. Și quest-urile
sunt exact ce am nevoie să învăț. E ca un antrenor personal."

— Experiența dorită
```

---

## 5. Ce Face Ca Sistemul Să Fie Unic

### 5.1 Oponenți care evoluează (Evolving Archetypes)

```
  Generația 1: The Shadow (economy: 0.7, aggro: 0.3)
  Generația 5: The Shadow (economy: 0.5, aggro: 0.6)
  Generația 10: The Shadow (economy: 0.3, aggro: 0.8, defense: 0.7)
  
  După 10 înfrângeri, The Shadow e complet diferit.
  A învățat. S-a adaptat. E mai periculos.
```

### 5.2 Mirror Progression

```
  Jucătorul descoperă Defense Jewel +3
  → Săptămâna următoare, toți oponenții au Defense Jewel +3
  
  Jucătorul învață sinergia Pyros + Aqua
  → Următorul oponent știe să contracareze sinergia asta
```

### 5.3 Dynamic Campaign — Povestea Ta

```
  Jucător agresiv → "Războinicul care a cucerit arena"
  Jucător defensiv → "Strategul care a construit ziduri"
  Jucător explorator → "Colectorul care a descoperit secretele"
  
  Fiecare jucător are o POVESTE UNICĂ.
  Nu există 2 playthrough-uri la fel.
```

### 5.4 Cardinal Feedback Loop

```
  Jocul te cunoaște mai bine decât te cunoști tu.
  
  "Pierzi de obicei în runda 5-7. Ai tendința să economisești
   prea mult. Nu folosești niciodată Aqua.
   
   → Quest: câștigă o rundă cu un Defense Jewel
   → Oponent: face burst în runda 6
   → Recompensă: Defence Jewel Uncommon"
```

---

## 6. Frontiere Tehnice

| Componentă | Tehnică propusă | De ce |
|------------|-----------------|-------|
| Profil jucător | IndexedDB + JSON comprimat | 100MB+ per jucător e ok local |
| AI decizii | TypeScript direct pe main thread | < 50ms per decizie, nu merită worker |
| Genetic algorithms | Web Worker (offloading) | Pentru mutații populații mari |
| Generare conținut | TypeScript procedural | Instant, determinist |
| Narativ | Template + variabile + context | Generat dinamic, nu LLM |
| Grafică | PixiJS + custom shaders | 60fps, orice efect |

---

## 7. Întrebări Deschise (de Discutat)

### 7.1 ADN și Personalitate
- Câți parametri în ADN? 8 e suficient sau vrem mai mulți?
- ADN-ul poate fi afișat jucătorului? (transparent vs mysterious)
- Cum numim oponenții? Generat procedural sau manual?

### 7.2 Mutații și Evoluție
- Câte generații înainte să devină prea greu?
- Există un "plafon" de dificultate?
- Jucătorul poate "salva" un oponent pe care l-a învins?

### 7.3 Quest-uri
- Quest-urile sunt în timp real sau se dau la începutul run-ului?
- Câte quest-uri active simultan? (3? 5? infinite?)
- Quest-urile au deadlines (timp real sau run-uri)?

### 7.4 Recompense
- Recompensele trebuie să fie predictibile sau surpriză?
- Cât de mult poate influența Cardinal recompensele?
- Există "pity timer" (dacă n-ai primit o parte Rare de mult)?

### 7.5 Narativ
- E suficient text generat sau vrei și artă/portrete?
- Personajele au nume generate sau fixe?
- Vrei un "arc narativ" sau e complet deschis?

### 7.6 Flow Governor
- Cât de agresiv ajustăm dificultatea?
- Jucătorul poate alege manual dificultatea?
- Există "boss fights" programate?

---

*Document creat: 2026-07-18*
*Status: Discuție — nimic nu e final*
