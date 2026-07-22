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
- ❌ Nu e un sistem de dificultate care doar "înmultște HP-ul"

### 1.2 Ce ESTE Cardinal

- ✅ E un **sistem procedural generativ** — creează conținut din reguli de bază
- ✅ **Nu știe să joace** — știe să **CREEZE jocul care să te facă să joci**
- ✅ Fiecare decizie a ta **influențează** ce urmează
- ✅ Tratează jocul ca pe un **dialog între tine și sistem**
- ✅ Combină 7 capabilități care **nu există în niciun joc comercial**

### 1.3 Regulile Fundamentale

```
1. Un jucător fericit = progres + provocare + varietate + recompensă
2. Dacă ceva e prea ușor → devine mai greu (sau se schimbă complet)
3. Dacă ceva e prea greu → devine mai accesibil (sau primești ajutor)
4. Dacă jucătorul repetă același lucru → i se oferă ALTCEVA
5. Dacă jucătorul e curios → e recompensat pentru explorare
6. Oponentul nu e un inamic — e o **oglindă** a progresului tău
7. Niciodată să nu spui "nu" — spune "da, dar..."
8. Sistemul nu trișează — respectă aceleași reguli ca jucătorul
```

---

## 2. Componentele Cardinal

```
┌────────────────────────────────────────────────────────────────────┐
│                         CARDINAL ENGINE                             │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    PLAYER ANALYZER                           │    │
│  │  • Înregistrează ORICE acțiune                             │    │
│  │  • Construiește profil multidimensional                    │    │
│  │  • Identifică pattern-uri, slăbiciuni, puncte tari         │    │
│  │  • Scorează skill per categorie (1-100)                    │    │
│  │  • Algoritmi: EMA, Bayesian, Markov Chain, Cluster         │    │
│  └──────────┬─────────────────────────────────────────────────┘    │
│             │                                                       │
│  ┌──────────▼─────────────────────────────────────────────────┐    │
│  │                 OPPONENT FORGE                               │    │
│  │  • Generează oponenți cu ADN procedural                    │    │
│  │  • Fiecare oponent = un set de 8+ parametri                │    │
│  │  • Oponenții MUTĂ când sunt învinși (Genetic Algorithm)    │    │
│  │  • Se adaptează la stilul tău (Counter, Mirror, Random)    │    │
│  │  • Strategy Emergence — strategii care se nasc, nu se scriu│    │
│  │  • The Empty Chair — opponentul care nu există             │    │
│  └──────────┬─────────────────────────────────────────────────┘    │
│             │                                                       │
│  ┌──────────▼─────────────────────────────────────────────────┐    │
│  │                  QUEST WEAVER                               │    │
│  │  • Construiește quest-uri din părți atomice                │    │
│  │  • Obiectiv + restricție + recompensă = quest              │    │
│  │  • Recompensele sunt calculate, nu random                  │    │
│  │  • Quest-urile sunt unice per jucător                      │    │
│  │  • Quest Emergence — nu există 2 quest-uri la fel          │    │
│  │  • Pity timer — dacă n-ai primit ceva, vei primi           │    │
│  └──────────┬─────────────────────────────────────────────────┘    │
│             │                                                       │
│  ┌──────────▼─────────────────────────────────────────────────┐    │
│  │                  FLOW GOVERNOR                              │    │
│  │  • Menține jucătorul în "zona de flow"                    │    │
│  │  • Dacă win rate > 70% → crește dificultatea              │    │
│  │  • Dacă win rate < 30% → scade dificultatea               │    │
│  │  • Algoritmi: Easing Functions, Simulated Annealing       │    │
│  │  • Mirror Progression — jocul reflectă nivelul tău        │    │
│  └──────────┬─────────────────────────────────────────────────┘    │
│             │                                                       │
│  ┌──────────▼─────────────────────────────────────────────────┐    │
│  │               REWARD CALCULATOR                             │    │
│  │  • Nu dă random — dă ce LIPSEȘTE jucătorului               │    │
│  │  • Completează colecția, nu o umflă cu duplicate           │    │
│  │  • Încurajează explorarea (bonus pentru ce e nou)          │    │
│  │  • Consolează la pierdere (dă ceva util)                   │    │
│  │  • Weighted Randomized Selection pentru varietate          │    │
│  └──────────┬─────────────────────────────────────────────────┘    │
│             │                                                       │
│  ┌──────────▼─────────────────────────────────────────────────┐    │
│  │              NARRATIVE LOOM                                 │    │
│  │  • Generează evenimente narative emergente                 │    │
│  │  • Povestea ta e UNICĂ — bazată pe ce ai făcut             │    │
│  │  • Personaje apar și dispar în funcție de acțiuni          │    │
│  │  • Fără dialog scriptat — totul e generat                  │    │
│  └──────────┬─────────────────────────────────────────────────┘    │
│             │                                                       │
│  ┌──────────▼─────────────────────────────────────────────────┐    │
│  │                 THE TUTOR                                   │    │
│  │  • Apare DOAR când greșești                                │    │
│  │  • Dispare când joci bine                                  │    │
│  │  • Nu e un tutorial — e un "coach" invizibil               │    │
│  │  • Se adaptează: dacă nu vrei hint-uri, tace               │    │
│  │  • Dynamic Archaeology — îți arată pattern-uri              │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3. ADN-ul — Inima Sistemului

### 3.1 Ce e ADN-ul

ADN-ul e un set de parametri care definește COMPORTAMENTUL oricărei entități din joc. Orice oponent, orice quest, orice recompensă, orice provocare — toate pornesc de la ADN.

```typescript
interface DNA {
  // Parametri fundamentali
  economy: number;       // 0-1: cât de important e să economisești
  aggression: number;    // 0-1: cât de agresiv e
  defense: number;       // 0-1: cât de defensiv e
  synergy: number;       // 0-1: cât de mult caută sinergii
  risk: number;          // 0-1: cât risc își asumă
  creativity: number;    // 0-1: cât de experimental e

  // Parametri avansați
  patience: number;      // 0-1: cât de mult așteaptă momentul potrivit
  adaptability: number;  // 0-1: cât de repede își schimbă strategia
  greed: number;         // 0-1: cât de lacom e (ia ce e mai scump mereu?)
  consistency: number;   // 0-1: cât de consistent e între runde
}

// Din 10 parametri cu 10 valori fiecare → 10^10 combinații posibile
// Cu alte cuvinte: 10 MILIARDE de oponenți posibili
// Niciun jucător nu va vedea vreodată același oponent de 2 ori
```

### 3.2 ADN Universal

Același ADN e folosit PESTE TOT:

```
• Un Oponent     = ADN → Scoring Engine → Comportament în Buy Phase
• Un Quest       = ADN-ul jucătorului → Obiectiv + Restricție + Recompensă
• O Recompensă   = ADN-ul jucătorului → Ce LIPSEȘTE → Item
• O Provocare    = ADN-ul jucătorului inversat → Ce nu face
• Un Eveniment   = ADN jucător + ADN oponent + Context → Poveste
```

### 3.3 Mutații ADN (Genetic Algorithm)

Când un oponent e învins, ADN-ul lui MUTĂ — folosind un algoritm genetic simplu dar puternic:

```typescript
class OpponentDNA {
  genes: DNA;
  generation: number = 1;
  winCount: number = 0;
  lossCount: number = 0;

  // Crossover — combină 2 ADN-uri pentru a crea unul nou
  crossover(other: OpponentDNA): OpponentDNA {
    const child = new OpponentDNA();
    for (const gene of Object.keys(this.genes)) {
      // 50% din fiecare părinte, plus șansă de mutație
      const source = Math.random() > 0.5 ? this.genes : other.genes;
      child.genes[gene] = source[gene] + this.mutate(gene);
    }
    child.generation = Math.max(this.generation, other.generation) + 1;
    return child;
  }

  // Mutație — șansa ca o genă să se schimbe
  private mutate(gene: string, rate: number = 0.15): number {
    if (Math.random() < rate) {
      // Mutație: schimbare aleatoare ±0.2
      return (Math.random() - 0.5) * 0.4;
    }
    return 0;
  }

  // Evoluție direcționată — tinde să contracareze jucătorul
  evolve(playerDNA: DNA, defeated: boolean): void {
    if (defeated) {
      // A pierdut → muta spre contrarul jucătorului
      for (const gene of Object.keys(this.genes)) {
        const target = clamp(1 - playerDNA[gene], 0.1, 0.9);
        this.genes[gene] = lerp(this.genes[gene], target, 0.2);
      }
    } else {
      // A câștigat → își întărește propriul ADN + mutație ușoară
      for (const gene of Object.keys(this.genes)) {
        this.genes[gene] = clamp(this.genes[gene] + (Math.random() - 0.5) * 0.1);
      }
    }
    this.generation++;
  }
}
```

**Rezultat:** Un oponent care a pierdut de 10 ori e complet diferit de original. A învățat din înfrângeri. A evoluat.

### 3.4 Strategy Emergence

Oponentul **nu are strategii hardcodate**. Are ADN. Engine-ul derivează comportamentul din ADN:

```typescript
// Nu există "if (strategy === 'aggressive')" 
// Nu există 20 de clase de strategii predefinite
// Există doar: ADN → Scoring → Acțiune

function scoreAction(part: Part, arena: Arena, dna: DNA): number {
  let score = 0;

  // Attack Jewel e mai valoros pentru un opponent agresiv
  if (part.type === 'attack_jewel') {
    score += 10 * dna.aggression;
  }

  // Defense Jewel e mai valoros pentru un opponent defensiv
  if (part.type === 'defense_jewel') {
    score += 10 * dna.defense;
  }

  // Economisește dacă e econom
  score -= part.cost * (1 - dna.economy) * 2;

  // Riscuri mari dacă risk e mare
  if (part.rarity === 'rare' && dna.risk > 0.7) {
    score += 5;
  }

  // Creeativitate: alege părți pe care nu le-a mai folosit
  if (dna.creativity > 0.6 && !this.seenBefore(part)) {
    score += 3;
  }

  return score;
}
```

**10 parametri, fiecare cu scoring diferit = strategii infinite. Nicio linie de cod nu spune "fă X". Spune "cântărește opțiunile după ADN".**

---

## 4. Cele 7 Capabilități Unique

### 4.1 Strategy Emergence — Strategii care se nasc, nu se scriu

**Problema pe care o rezolvă:** În orice joc, AI-ul are strategii scrise manual de development. Sunt previzibile, limitate și identice pentru toți jucătorii.

**Cum funcționează:** Nu există strategii. Există ADN. Engine-ul evaluează fiecare acțiune posibilă în timp real pe baza a 10+ parametri. ADN-ul + contextul = comportamentul. Nu se scrie "ce face", se scrie "cum cântărește opțiunile".

```typescript
// Traditional: 20 de strategii hardcodate
// Cardinal: 10 parametri × 10 valori = 10^10 combinații = INFINIT strategii posibile

const action = actions
  .map(a => ({ action: a, score: scoringEngine.evaluate(a, state, dna) }))
  .sort((a, b) => b.score - a.score)[0];
```

**Nimeni n-a făcut asta în jocuri comerciale.** Toate jocurile folosesc FSM, Behavior Trees, sau Utility AI cu greutăți fixe. Noi generăm comportamentul din ADN.

### 4.2 Opponent Evolution — Oponenți care evoluează ca specii

**Problema pe care o rezolvă:** În orice joc, același boss fight e identic de fiecare dată. Oponentul nu învață, nu se adaptează, nu evoluează.

**Cum funcționează:** Când învingi un oponent, ADN-ul lui MUTĂ. Data viitoare când îl întâlnești, nu mai e același. Folosește un Genetic Algorithm (GA) cu crossover + mutație + selecție naturală.

```
Generația 1: The Shadow (economy: 0.7, aggro: 0.3, defense: 0.4)
  → Jucătorul îl învinge

Generația 2: The Shadow (economy: 0.5, aggro: 0.6, defense: 0.4)
  → Jucătorul îl învinge din nou

Generația 5: The Shadow (economy: 0.3, aggro: 0.8, defense: 0.7)
  → The Shadow e acum complet diferit. A învățat.
  → Acum contracarează stilul agresiv al jucătorului

Generația 10: The Shadow (economy: 0.4, aggro: 0.6, defense: 0.8, patience: 0.9)
  → Acum așteaptă, nu mai atacă prima. Te obosește.
  → Jucătorul: "Ăsta e același oponent? Serios?"
```

**Nimeni n-a făcut asta într-un joc comercial.** Există doar în research papers (genetic algorithms for game AI). Noi îl aducem într-un joc real.

### 4.3 Mirror Progression — Oglinda jucătorului

**Problema pe care o rezolvă:** Dificultatea e o setare manuală (Easy/Medium/Hard). Nu reflectă nivelul tău real.

**Cum funcționează:** Oponenții evoluează O DATĂ CU TINE. Nu există dificultate presetată — există o dificultate care se CALCULEAZĂ pe baza profilului tău.

```
Jucătorul la nivel 1:
  → Oponenți cu ADN apropiat (economy: 0.3, aggression: 0.4)
  → Strategii simple
  → Destul spațiu să greșești

Jucătorul descoperă Defense Jewel +3:
  → Săptămâna următoare, toți oponenții au Defense Jewel +3
  → Nu doar că au, dar știu să îl contracareze
  → Mirror Progression: "Dacă tu ai învățat, și ei au învățat"

Jucătorul la nivel 50:
  → Oponenți care cunosc toate trucurile tale
  → Fiecare mutare e contracarată
  → Singurul mod să câștigi: să INOVEZI
```

Flow Governor monitorizează win rate-ul și ajustează cu easing functions (nu brusc, ci lin):

```typescript
function adjustDifficulty(profile: PlayerProfile, currentDNA: DNA): DNA {
  const winRate = profile.recentWinRate(20); // ultimele 20 de jocuri
  const targetDifficulty = winRate > 0.7 
    ? 1.2  // mai greu
    : winRate < 0.3 
      ? 0.8  // mai ușor
      : 1.0; // menține

  // Easing: nu sare brusc, ci se ajustează lin
  const easeFactor = 0.3;
  for (const gene of Object.keys(currentDNA)) {
    currentDNA[gene] = lerp(
      currentDNA[gene],
      clamp(currentDNA[gene] * targetDifficulty, 0.1, 0.9),
      easeFactor
    );
  }

  return currentDNA;
}
```

### 4.4 Dynamic Archaeology — Jocul îți "sapă" în trecut

**Problema pe care o rezolvă:** Niciun joc nu analizează deciziile tale ca să-ți arate pattern-uri pe care tu nu le vezi.

**Cum funcționează:** Cardinal analizează sute de decizii și descoperă corelații între acțiunile tale și rezultate:

```typescript
class PlayerArcheologist {
  private actionHistory: Action[] = [];

  analyze(): PlayerInsight[] {
    const insights: PlayerInsight[] = [];

    // Caută corelații între acțiuni și win/lose
    // "Când faci X în runda 3, pierzi în runda 7"
    const patterns = this.findCorrelations();

    for (const pattern of patterns) {
      if (pattern.significance > 0.8) {
        insights.push({
          type: 'hidden_pattern',
          title: `De ce pierzi în runda 6`,
          description: `Am observat că atunci când alegi ${pattern.cause}, 
            ai șanse cu 40% mai mici să câștigi. 
            Ai făcut asta de 23 de ori. Coincidență?`,
          significance: pattern.significance,
        });
      }
    }

    return insights;
  }
}
```

**Nimeni n-a făcut asta.** Niciun joc nu face data mining pe deciziile tale ca să-ți arate conexiuni pe care nu le vezi.

### 4.5 Quest Emergence — Quest-uri care se nasc, nu se scriu

**Problema pe care o rezolvă:** Radiant quest-urile sunt random ("du-te la locul X, ia obiectul Y"). Nu au legătură cu tine.

**Cum funcționează:** Quest-urile sunt CONSTRUITE din părți atomice, pe baza profilului tău:

```typescript
class QuestBuilder {
  // Părți atomice de quest
  objectives = {
    placement: ['place_X_cards', 'fill_X_cells', 'use_X_part_type'],
    combat: ['win_X_rounds', 'survive_X_attacks', 'deal_X_damage'],
    economy: ['spend_X_coins', 'save_X_coins', 'buy_X_parts'],
    restriction: ['without_X', 'using_only_X', 'under_X_coins'],
    exploration: ['try_race_X', 'use_part_X', 'build_card_type_X'],
  };

  build(profile: PlayerProfile): Quest {
    // Pasul 1: Detectează slăbiciunea
    const weakness = profile.identifyWeakness();

    // Pasul 2: Alege obiectiv care s-o corecteze
    const objective = this.pickCorrectiveObjective(weakness);

    // Pasul 3: Calculează dificultatea pe baza skill-ului
    const targetValue = this.calculateTarget(profile.skillFor(objective));

    // Pasul 4: Alege recompensa — ce LIPSEȘTE jucătorului
    const reward = this.findMissingItem(profile.collection, objective);

    // Pasul 5: Generează titlu + descriere
    const title = this.generateTitle(objective, targetValue);
    const desc = this.generateDescription(objective, profile);

    return { title, description: desc, objective, reward, difficulty };
  }
}

// EXEMPLU: Jucătorul nu folosește Aqua de 2 săptămâni
// → Quest: "Câștigă 3 runde alegând rasa Aqua"
// → Recompensă: Aqua Attack Jewel Uncommon (ce i-a lipsit)
// → Oponent: defensiv (să testeze adaptabilitatea)
```

**Nimeni n-a făcut asta.** Quest-urile care corectează slăbiciunile și oferă exact ce lipsește — nu random.

### 4.6 The Tutor — AI-ul te învață să joci mai bine

**Problema pe care o rezolvă:** Tutorialele sunt la început sau deloc. Nu există un sistem care să te învețe DOAR CÂND AI NEVOIE.

**Cum funcționează:** Cardinal are un mod "Tutor" care:
- Apare DOAR când greșești
- Dispare când joci bine
- Se adaptează preferințelor tale (vrei hint-uri sau nu)

```typescript
class Tutor {
  private playerPreferences: { hintsEnabled: boolean };

  // Detectează greșeli comune
  detectMistake(action: Action, state: GameState): Mistake | null {
    // 1. A cumpărat ceva ce nu avea nevoie?
    if (state.coins > 15 && action.type === 'buy' && action.cost > 10) {
      return {
        type: 'overbuy',
        severity: 3,
        hint: 'Ai destui coins, dar poate ar fi mai bine să aștepți...',
      };
    }

    // 2. A plasat o carte prost?
    if (action.type === 'place' && state.arena.getSlotStatus(action.pos) === 'empty') {
      return {
        type: 'bad_position',
        severity: 5,
        hint: 'Celula aia e Neutră. Ai una Ofensivă liberă la (3,4).',
      };
    }

    return null;
  }

  shouldIntervene(mistake: Mistake, profile: PlayerProfile): boolean {
    // Doar dacă: e a 3-a oară când face aceeași greșeală
    return profile.mistakeCount(mistake.type) >= 3
      && this.playerPreferences.hintsEnabled;
  }
}
```

**Ce face The Tutor special:**
- Nu e un tutorial. E un "coach" care dispare când nu ai nevoie
- Dacă jucătorul nu vrea hint-uri → tace. Dar oponentul va face aceeași greșeală data viitoare, ca jucătorul să poată învăța din observație
- Dynamic Archaeology se activează: "Știai că de 23 de ori ai făcut X și apoi ai pierdut?"

**Nimeni n-a făcut asta.** Niciun joc nu are un tutor care apare doar când greșești și dispare când joci bine.

### 4.7 The Empty Chair — Un oponent care nu există

**Problema pe care o rezolvă:** Toți oponenții au nume, fețe, backstory. Devin prea familiari, prea "personaje".

**Cum funcționează:** Uneori, joci împotriva "nimănui". Un opponent generat care e doar un nume de sistem și un ADN. Fără față, fără backstory. Un "player phantom" — fantoma unui jucător care ar fi putut exista.

```
Unknown Player #47
ADN: economy: 0.6, aggro: 0.5, defense: 0.4, ...
Generații: 7 (a supraviețuit 7 iterații înainte să ajungă la tine)
Nume generat de sistem: "Umbra cu casca spartă"
Fără portret
Fără istoric
Doar un număr și un ADN.

Dar joacă bine. Foarte bine.
Cine știe câți jucători a întâlnit înainte să ajungă la tine?
Câte generații a supraviețuit?
Câte strategii a învățat?
```

**The Empty Chair** e un concept psihologic — știi că cineva ar trebui să fie acolo, dar nu e nimeni. Creează o senzație stranie.

**Implementare:**
- Uneori, oponentul nu are nume propriu — doar "Unknown Player #" + un număr
- Portretul e o siluetă, nu un personaj desenat
- Textul de pre-battle e minimalist: "Ready."
- După battle, dispare fără urmă
- Niciun backstory, niciun dialog, nicio explicație

**Nimeni n-a făcut asta.** E un concept complet nou în gaming.

---

## 5. Algoritmii

| Algoritm | Unde se aplică | Complexitate | De ce |
|----------|----------------|-------------|-------|
| **Weighted Randomized Selection** | Scoring acțiuni Buy Phase | O(n) | Mai rapid decât sortare completă, adaugă varietate naturală |
| **Genetic Algorithm (GA)** | Mutații ADN + evoluție oponenți | O(p × g) | Permite evoluție naturală, crossover între oponenți |
| **Exponential Moving Average (EMA)** | Profilul jucătorului | O(1) | Accent pe decizii recente, uită încet trecutul îndepărtat |
| **Bayesian Probability** | Predicția alegerii următoare | O(n) | Ghicește ce va face jucătorul cu date incomplete |
| **K-Means Clustering** | Clasificarea stilurilor de joc | O(n × k) | Identifică automat stilul jucătorului (aggro/defensiv/etc) |
| **Light Monte Carlo** | Simulare rapidă variante cumpărare | O(m × s) | Testează câteva variante, nu milioane |
| **Easing Functions (lerp, smoothstep)** | Tranziție lină dificultate | O(1) | Dificultatea nu sare brusc, se ajustează treptat |
| **Markov Chain** | Predicția secvenței de acțiuni | O(n × s) | "După ce cumpără Attack Jewel, urmează de obicei..." |
| **Simulated Annealing** | Găsirea celui mai bun opponent | O(n × t) | Găsește optimul fără să încerce toate combinațiile |
| **Hash-based Determinism** | Reproducerea aceleiași decizii | O(1) | Același ADN + același context = aceeași decizie. Testabil. |
| **Correlation Analysis** | Dynamic Archaeology | O(n²) | Găsește corelații între acțiuni și rezultate |
| **Pity Timer / Weighted Distribution** | Reward Calculator | O(log n) | Asigură că jucătorul primește varietate, nu doar duplicate |

### Detalii Algoritmi Cheie

#### Weighted Randomized Selection (pentru acțiuni în Buy Phase)

```typescript
// În loc să alegi mereu acțiunea cu scorul maxim (previzibil),
// alegi random dintre top N, ponderat de scor (natural, variat)

function weightedChoose<T>(actions: ScoredAction<T>[], temperature: number): T {
  // temperatura = cât randomness vrei (0 = mereu cea mai bună, 1 = complet random)
  const weights = actions.map(a => Math.exp(a.score / temperature));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;

  for (let i = 0; i < actions.length; i++) {
    r -= weights[i];
    if (r <= 0) return actions[i].action;
  }

  return actions[actions.length - 1].action;
}
```

#### Light Monte Carlo (pentru Buy Phase)

```typescript
function simulatePurchase(shop: Shop, coins: number, dna: DNA): Purchase[] {
  const SIMULATIONS = 50;  // Nu milioane, ci 50

  let bestScore = -Infinity;
  let bestPurchase: Purchase[] = [];

  for (let i = 0; i < SIMULATIONS; i++) {
    // Alege random N itemi din shop
    const candidate = pickRandomItems(shop, coins);
    // Evaluează combinația pe baza ADN-ului
    const score = candidate.reduce((s, item) => s + scoreItem(item, dna), 0);

    if (score > bestScore) {
      bestScore = score;
      bestPurchase = candidate;
    }
  }

  return bestPurchase;
}
```

---

## 6. Profilul Jucătorului — Model de Date

```typescript
interface PlayerProfile {
  // Meta
  id: string;
  createdAt: number;
  totalPlayTime: number;
  totalRuns: number;

  // Skill-uri per categorie (EMA)
  skills: {
    economy: number;        // 0-100
    positioning: number;
    synergy: number;
    adaptability: number;
    defense: number;
    aggression: number;
  };

  // Istoric condensat (nu toate run-urile, ci summary)
  recentRuns: RunningWindow[];  // ultimele 50 de run-uri
  favoriteRaces: Map<RaceId, number>;
  favoriteParts: Map<PartId, number>;

  // Pattern-uri descoperite de Dynamic Archaeology
  patterns: PlayerPattern[];
  weaknesses: Weakness[];
  strengths: Strength[];

  // ADN-ul jucătorului (derivat din comportament)
  dna: DNA;

  // Stare curentă
  currentStreak: number;
  lastSession: number;

  // Tutor preferences
  hintsEnabled: boolean;
  tutorLevel: 'none' | 'subtle' | 'direct';
}
```

Profilul e salvat în IndexedDB și încărcat la fiecare pornire. Ocupă ~100KB după 100 de ore de joc.

---

## 7. Cum Arată pentru Jucător

### 7.1 La Început

```
Run 1: Joci împotriva unui oponent generat cu ADN random
  → Câștigi sau pierzi

Cardinal (The Tutor - silent):
  "E prea devreme să știu ceva. Dar am început să observ."

  → Player Analyzer: "economy: 0.4, aggression: 0.7, defense: 0.2"
  → Quest Weaver: nimic încă (prea devreme)
  → Opponent Forge: opponent random
```

### 7.2 După 5 Run-uri

```
Cardinal (The Tutor - appears):
  "Am observat că nu folosești Defense Jewel aproape deloc.
   E ok. Dar poate ai vrea să încerci măcar o dată?"

  → Quest: "Folosește un Defense Jewel în această rundă"
  → Oponent: ADN cu attack ridicat (să vadă de ce are nevoie de Defense)
  → Recompensă: Defense Jewel Uncommon
```

### 7.3 După 50 de Ore

```
Cardinal (Dynamic Archaeology):
  "Știai că ai pierdut de 23 de ori în runda 6 după ce ai cumpărat
   Attack Jewel în runda 3? E un pattern pe care nu l-ai văzut.
   Acum că ți-am spus, să vedem dacă-l poți sparge."

  → Oponent: Shadow v7 (economic: 0.4, aggro: 0.8, defense: 0.7)
  → The Shadow a evoluat de 7 generații
  → Acum știe exact cum să te bată în runda 6
```

### 7.4 După 100 de Ore — Boss Fight

```
Cardinal (The Empty Chair):
  "Am adunat destule date despre tine.
   Acum e timpul să joci împotriva... ta."

  → Oponent: Mirror Match (ADN-ul tău, clonat)
  → Fără nume, fără portret
  → Joacă EXACT ca tine
  → Singurul mod să-l învingi: să fii MAI BUN decât tine
```

### 7.5 Ce Simte Jucătorul

```
"E ca și cum jocul mă cunoaște. Nu simt că joc împotriva unui
script. Oponentul pare că știe ce am de gând. Când câștig prea
mult, devine mai greu. Când pierd, primesc ajutor. Și quest-urile
sunt exact ce am nevoie să învăț. E ca un antrenor personal.

Dar uneori... uneori joc împotriva cuiva care nu are față.
Doar un număr. Și mă întreb: cine e? A mai jucat cineva
împotriva lui? Câte generații are?

E înfricoșător și fascinant în același timp."
```

---

## 8. Frontiere Tehnice

| Componentă | Tehnică | De ce |
|------------|---------|-------|
| Profil jucător | IndexedDB (Dexie.js) + JSON | 100MB+ per jucător e ok local |
| AI decizii Buy Phase | TypeScript pe main thread | < 5ms per decizie |
| Genetic Algorithm | Web Worker (offload) | Doar când faci mutații pe populații > 100 |
| Dynamic Archaeology | Web Worker + requestIdleCallback | Analiza nu trebuie să fie instantă |
| Generare conținut | TypeScript procedural | Instant, determinist, testabil |
| Narativ | Template + variabile + context | Fără LLM, dar flexibil |
| Grafică | PixiJS 8 + custom shaders | 60fps, orice efect |
| Save/Load | Tauri FS + JSON comprimat | Portabil, verificabil |

### Performanță

| Operație | Limită | Tehnică |
|----------|--------|---------|
| Decizie AI Buy Phase | < 50ms | Weighted Selection |
| Mutație ADN | < 10ms | GA cu populații mici (10-50) |
| Quest generation | < 5ms | Template matching |
| Player analysis | < 100ms | EMA + window sliding |
| Dynamic Archaeology | < 500ms (o dată la N runde) | Web Worker |
| Save serialization | < 100ms | JSON + compresie |
| Load | < 200ms | JSON + index |

---

## 9. Matricea Capabilităților

| Capabilitate | Algoritm(i) | Componentă | Unicitate |
|-------------|-------------|-----------|-----------|
| **Strategy Emergence** | Weighted Randomized Selection | Opponent Forge | Nu există în niciun joc comercial |
| **Opponent Evolution** | Genetic Algorithm (crossover + mutation) | Opponent Forge | Doar în research papers |
| **Mirror Progression** | Easing Functions, Simulated Annealing | Flow Governor | Superficial în Left 4 Dead (doar spawn-uri, nu AI) |
| **Dynamic Archaeology** | Correlation Analysis, K-Means | Player Analyzer + Tutor | Nu există în niciun joc |
| **Quest Emergence** | Weighted Distribution, Pity Timer | Quest Weaver | Radiant quests sunt random, nu adaptive |
| **The Tutor** | Bayesian, Markov Chain, pattern matching | The Tutor | Nu există în niciun joc |
| **The Empty Chair** | Procedural generation + psychological design | Opponent Forge + Narrative Loom | Nu există în niciun joc |

---

## 10. Întrebări Deschise (de Discutat)

### 10.1 ADN și Parametri
- 10 parametri e suficient sau vrem mai mulți?
- ADN-ul poate fi afișat jucătorului? (transparent vs mysterious)
- Vrem ca ADN-ul să fie "descoperibil" în joc (ex: un item care arată ADN-ul oponentului)?

### 10.2 Evoluție și Mutații
- Câte generații poate atinge un oponent?
- Există un "reset" (dacă jucătorul nu mai joacă o săptămână)?
- Oponenții pot face crossover între ei?
- Vrem "legendary opponents" care au supraviețuit 50+ generații?

### 10.3 Tutor
- Cât de "direct" să fie? Hint subtil sau explicație completă?
- Jucătorul poate dezactiva complet Tutorul?
- Tutorul apare și când jucătorul face o mutare bună? (reforțare pozitivă)

### 10.4 Empty Chair
- Cât de des apare? (5% din run-uri? 1%?)
- Are vreun impact narativ sau e doar atmosferă?
- Poate jucătorul să "investigheze" Empty Chair (să afle mai multe)?

### 10.5 Dynamic Archaeology
- Insight-urile sunt date automat sau trebuie "descoperite"?
- Vrei și insight-uri pozitive ("Ești foarte bun la X") sau doar corrective?
- Insight-urile pot fi partajate (screenshot, share)?

### 10.6 Flow Governor
- Jucătorul poate alege manual dificultatea sau e complet automat?
- Cât de repede se ajustează? (după 1 run? 5 run-uri?)
- Există momente în care sistemul "se oprește" (dă pace jucătorului)?

### 10.7 Quest-uri
- Quest-urile sunt în timp real sau se dau la începutul run-ului?
- Câte quest-uri active simultan? (3? 5? infinite?)
- Quest-urile expiră? (după N run-uri?)
- Poți refuza un quest fără penalizare?

---

*Document actualizat: 2026-07-18*
*Status: Discuție — nimic nu e final. Toate ideile sunt pe masă.*


## 11. Roadmap — Cardinal pe Faze

Cardinal e un sistem masiv. Îl împărțim pe faze ca să avem un prototip funcțional cât mai repede.

### P1 (Prototype) — ⚡ Minimum Viable Opponent

```
┌─────────────────────────────────────────────────────────────┐
│                    CARDINAL P1                               │
│                                                             │
│  Ce include:                                                 │
│  • 4 parametri ADN (aggression, defense, economy, synergy)  │
│  • WeightedRandomSelection pentru cumpărături               │
│  • Fără Genetic Algorithm (oponentul nu evoluează)          │
│  • Fără profil de jucător persistent                       │
│  • Un singur oponent random per run                        │
│                                                             │
│  Implementare: ~200-300 linii TypeScript, un singur fișier  │
│  `src/cardinal/OpponentAI.ts` + `src/cardinal/DNA.ts`      │
│                                                             │
│  Suficient pentru:                                          │
│  • P1 — să ai un opponent care cumpără și atacă             │
│  • P2 — să simulezi un duel corect                          │
└─────────────────────────────────────────────────────────────┘
```

### P2 (Card Assembly) — Basic Scoring

Adăugăm:
- Scoring mai avansat (ține cont de sloturi libere, sinergii)
- Opponentul reacționează la ce face jucătorul (dacă jucătorul cumpără Attack Jewel, opponentul cumpără Defense)
- Tot fără GA, fără profil persistent

### P3 (Rase + AI) — Profil Jucător + ADN complet

- Profil jucător în IndexedDB (ultimele 20 run-uri)
- 10 parametri ADN complet
- Flow Governor (ajustează dificultatea pe baza win rate-ului)
- Opponentul se adaptează ușor la stilul jucătorului

### P4+ (Conținut) — Cardinal Complet

- Genetic Algorithm (evoluție opponent)
- Dynamic Archaeology
- Quest Emergence
- The Tutor
- The Empty Chair
- Narrative Loom

Vezi secțiunile 4.1-4.7 pentru detaliile complete ale capabilităților din P4+.
