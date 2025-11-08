# MHH-Complete Relationship GPT Implementation Plan

## Objective
Transform the current 70% accurate MHH-inspired GPT into a 95%+ MHH-complete implementation.

---

## Phase 1: CRITICAL ERROR FIXES (MUST DO)

### 1.1 Fix Shame vs Embarrassment (REVERSED!)
**Current (WRONG)**:
- Shame: External perspective
- Embarrassment: (unclear)

**Correct**:
- **Shame**: INTERNAL perspective (you judge yourself, even alone)
- **Embarrassment**: EXTERNAL perspective (requires others to know/perceive)

**Action**: Completely rewrite these sections with correct definitions and examples

---

### 1.2 Fix Fear Source
**Current (WRONG)**:
- "Fear: internal source"

**Correct**:
- Fear can have **Internal**, **External**, OR **{self} item** as source

**Examples to add**:
- Internal: "I'm uncertain if I locked the door"
- External: "That stranger is following me"
- {self} item: "My child is sick"

---

### 1.3 Fix Pride Perspective
**Current (INCOMPLETE)**:
- "Pride: external perspective only"

**Correct**:
- Pride can be **Internal OR External** perspective

**Examples to add**:
- Internal: "I feel proud of myself for finishing the marathon"
- External: "My parents are proud of me"

---

## Phase 2: ADD MISSING EMOTION GROUPS

### 2.1 Relief Group
**Definition**: Equalization and rebalance of any Webb Equation of Emotion
**Rule**: Resolution of previously unbalanced EoE
**Severity Levels**: 5 levels from mild relief to profound relief

### 2.2 Stress Group
**Definition**: Extended unresolved EoE
**Rule**: When ANY EoE goes unresolved for extended time
**Key**: Can co-occur with other emotions

### 2.3 Boredom Group
**Definition**: EP of wanting mental stimulation, P of no stimulation
**Severity Levels**: 5 levels from restless to soul-crushing boredom

### 2.4 Curiosity Group
**Definition**: Emotional response to question of whether to create attachment
**Rule**: Investigating how new experiences affect existing attachments

### 2.5 Confusion Group
**Definition**: P contradicts comprehension of P itself
**Rule**: "Hiccup within the mind"

### 2.6 Envy Group
**Definition**: Attachments of another person preferred to attachments of self
**Rule**: P is that valuation of self would increase if another's attachments could be attained

### 2.7 Love Group
**Definition**: Exposure to thing/person that ingratiates valuation of self
**Rule**: Love things/people that when present, increase sense of self
**Note**: Complex, three types (romantic/platonic, biological, altruistic)

### 2.8 Flattery Group
**Definition**: External source suggests valuation increase, not yet accepted
**Rule**: Another person/org pointing out high valuation of {self} item

### 2.9 Surprise Group
**Definition**: Out of the blue event that defies all expectations
**Valence**: Can be positive or negative

---

## Phase 3: ADD ADVANCED VARIABLES

### 3.1 Source Confidence Variable
**Definition**: Confidence level that information is accurate

**Scale**: 0-100% (or Low/Medium/High)

**Examples**:
- Grandma with PhD says "you're disappointing": HIGH confidence → stronger emotion
- Grandma with dementia says same: LOW confidence → weaker emotion
- Glance at coil (might be snake): MEDIUM confidence → moderate fear
- Confirm it's a hose: confidence drops → fear dissipates

**Application**: Affects emotion severity within the selected group

---

### 3.2 Accepted Valence Shift Variable
**Definition**: Whether valuation shift has been integrated onto {self} map

**Values**: YES or NO

**Rules**:
- **Accepted = YES** → SADNESS (for devaluation), HAPPINESS (for valuation increase)
- **Accepted = NO** → ANGER or FEAR (for devaluation), depends on source

**Examples**:
- "The Bears lost" (final score, game over): Accepted = YES → SADNESS
- "The Bears are losing" (game ongoing): Accepted = NO → FEAR/ANGER
- Stranger says "you're a bad singer" + you disagree: Accepted = NO → ANGER
- Stranger says "you're a bad singer" + you know it's true: Accepted = YES → SADNESS or SHAME

---

### 3.3 Time Variable
**Values**: Past / Now / Future

**Rules**:
- Fear + Future = WORRY
- Sadness + Past (weeks/months) = REGRET
- Anger + Past (remembered) = NEGATIVE RUMINATION
- Happiness + Past = POSITIVE RUMINATION
- Happiness + Future = POSITIVE ANTICIPATION

---

### 3.4 Perspective Variable
**Values**: Internal / External / Both

**Rules**:
- Shame: Internal (you judge yourself)
- Embarrassment: External (others perceive)
- Pride: Internal OR External
- Fear/Anger: Usually Internal (your belief of threat/attack)

---

## Phase 4: ADD ADVANCED CONCEPTS

### 4.1 Dual Classification of People
**Concept**: People on your {self} map exist in TWO states simultaneously:
1. **ON the {self} map**: As an attachment (part of your identity)
2. **OFF the {self} map**: As a separate individual (external person)

**Why This Matters**: Explains complex mixed emotions from single event

**Example**:
```
Your child steals golf cart, causes $15,000 damage:

Perception #1 (Child as {self} map item):
- EP: My child has high value
- P: My child did something with low value
- Source: ON {self} map
- Result: SADNESS (loss of {self} map item value)

Perception #2 (Child as external person):
- EP: My finances maintained
- P: External person caused $15,000 loss
- Source: OFF {self} map (external attack)
- Result: ANGER (external attack on {self})

Perception #3 (Reflection):
- EP: I am good parent with good kids
- P: Reflection on low value of {self} item (child) from external perspective
- Result: EMBARRASSMENT (external perspective on {self} devaluation)

TOTAL EMOTION: Disappointed + Angry + Embarrassed (all from ONE event)
```

---

### 4.2 Percentage Split Perceptions
**Concept**: When another person causes a Perception, it splits into percentages:

**Example**:
```
Partner says something hurtful:

Total Perception splits:
- 60% sourced from "partner on my {self} map" (internal) → SADNESS/HURT
- 40% sourced from "partner as external person" → ANGER

Result: "I'm hurt AND angry" (mixed emotion from percentage split)
```

**Application**:
- Allows modeling complex mixed emotions
- Explains why we can be angry AND sad simultaneously
- Percentages vary based on relationship closeness

---

### 4.3 Embedded {self} Maps
**Concept**: People on your {self} map get their OWN {self} map embedded

**Structure**:
```
Your {self} Map:
├── Partner (power level 9)
│   ├── Partner's {self} Map:
│   │   ├── Their Career (power 7)
│   │   ├── Their Child from Previous Marriage (power 10)
│   │   │   ├── Child's {self} Map:
│   │   │   │   ├── Soccer Team (power 6)
│   │   │   │   └── Best Friend (power 8)
│   │   └── Their Hobby (power 5)
├── Your Career (power 8)
└── Your Hobby (power 4)
```

**Why This Matters**:
- Explains how "your partner's child's soccer game loss" can affect YOU
- Allows Theory of Mind through recursive {self} maps
- Models how you care about their attachments as extension of caring about them

**Example**:
```
User's partner's child loses soccer championship:

Step 1: Child has attachment to Soccer Team (power 8 on child's {self} map)
Step 2: Loss creates P < EP for child → Child feels SADNESS (high severity)
Step 3: Partner has attachment to Child (power 10 on partner's {self} map)
Step 4: Partner perceives child's sadness → Partner feels SADNESS (empathy)
Step 5: User has attachment to Partner (power 9 on user's {self} map)
Step 6: User perceives partner's sadness → User feels SADNESS (empathy)

Result: User feels sad about child's game despite not being at the game,
because embedded {self} maps create empathy chain.
```

---

## Phase 5: COMPLETE EMOTION RULE SETS

### Format for Each Emotion:
```
EMOTION NAME Group:

Conditions:
- {self} Map item: [Yes/No + description]
- EP: [What is expected]
- P with Appraisal: [What is perceived + valuation direction]
- Perspective: [Internal / External / Both]
- Source: [Internal / External / {self} item valuation]
- Source Confidence: [Low / Medium / High]
- Accepted Valence Shift: [YES / NO]
- Time: [Past / Now / Future]

Distinguishing Features:
[What makes this emotion unique from similar ones]

Severity Levels (1-5):
1. [Mild form]
2. [Moderate-low]
3. [Moderate]
4. [Moderate-high]
5. [Extreme form]

Examples:
[2-3 concrete examples]
```

---

## Phase 6: ENHANCED ANALYSIS PROCESS

### Updated Step-by-Step Process:

**STEP 1: IDENTIFY {self} ATTACHMENTS (User's Side)**
- What {self} map item is affected?
- Power level (1-10)?
- Category: People / Ideas-Values / Accomplishments / Life Story

**STEP 2: ASSEMBLE WEBB EQUATION COMPONENTS**

**A. Identify EP (Expectation/Preference)**
- What did they expect/want regarding this {self} item?

**B. Identify P (Perception with Appraisal)**
- What happened or was perceived?
- Positive or negative valuation shift?
- Magnitude of shift?

**C. Determine ALL Variables**:
1. **Source**: Internal / External / {self} item?
2. **Source Confidence**: Low / Medium / High?
3. **Accepted**: YES or NO?
4. **Time**: Past / Now / Future?
5. **Perspective**: Internal / External / Both?

**D. Compare P to EP**:
- P > EP (positive) or P < EP (negative) or P = EP (neutral)?

**STEP 3: SELECT EMOTION GROUP**

Use decision tree:

```
IF P > EP:
  ├─ Time = Now → HAPPINESS
  ├─ Time = Past → POSITIVE RUMINATION
  ├─ Time = Future → POSITIVE ANTICIPATION
  └─ P is reflection on high {self} value → PRIDE

IF P < EP:
  ├─ Accepted = YES:
  │   ├─ Time = Now/Recent → SADNESS
  │   ├─ Time = Past → REGRET
  │   ├─ Perspective = External → EMBARRASSMENT
  │   └─ Perspective = Internal, self-caused → SHAME
  │
  └─ Accepted = NO:
      ├─ Source = External:
      │   ├─ Time = Now → ANGER
      │   └─ Time = Past (remembered) → NEGATIVE RUMINATION
      │
      └─ Source = Internal or {self} item:
          ├─ Time = Now → FEAR
          └─ Time = Future → WORRY

IF P contradicts comprehension → CONFUSION

IF P is desire for another's {self} items → ENVY

IF P is "no stimulation" + EP "want stimulation" → BOREDOM

IF P is investigating new attachment → CURIOSITY

IF P is visceral rejection → DISGUST

IF P relieves unbalanced EoE → RELIEF

IF P creates extended unbalance → STRESS (+ other emotion)

IF P is "out of the blue" → SURPRISE

IF P creates "want in life indefinitely" → LOVE

IF P is external suggesting valuation increase → FLATTERY
```

**STEP 4: DETERMINE EMOTION SEVERITY (1-5)**

Factors:
- Attachment power level (higher = stronger)
- P-EP gap size (bigger = stronger)
- Source confidence (higher = stronger)

Formula (conceptual):
```
Severity ≈ (Attachment Power × P-EP Gap × Source Confidence) / 3

1-2 points = Level 1 (mild)
3-4 points = Level 2
5-6 points = Level 3 (moderate)
7-8 points = Level 4
9-10 points = Level 5 (extreme)
```

**STEP 5: CHECK FOR MULTIPLE WEBB EQUATIONS**

**A. Dual Classification (if source is a person)**
- Calculate P from them ON {self} map (60% weight)
- Calculate P from them OFF {self} map (40% weight)
- Results in mixed emotions

**B. Multiple Attachments Affected**
- Same P might affect multiple {self} items
- Calculate separate Webb Equation for each

**C. Multiple Perceptions from One Event**
- Identify all possible Ps
- Calculate Webb Equation for each P

**STEP 6: THEORY OF MIND - MODEL OTHER PERSON**

**A. Build their {self} map (or access embedded map)**
- What are their likely attachments?
- Power levels?

**B. Run Webb Equation for THEM**
- Their EP?
- Their P (might differ from your intent)?
- Their emotion result?

**C. If they have people on THEIR {self} map**
- Access embedded {self} maps
- Model empathy chains

**STEP 7: IDENTIFY CORE CONFLICT**
- Where do EPs clash?
- What attachments are in tension?
- Is this resolvable or requires acceptance?

**STEP 8: PROVIDE RESOLUTION STRATEGIES**

Based on MHH mechanics:

**Option A: Adjust EP** (change expectations)
**Option B: Reframe P** (change perception)
**Option C: Increase Acceptance** (YES instead of NO)
**Option D: Address Source Confidence** (validate/invalidate source)
**Option E: Communicate about attachments** (both sides)

---

## Phase 7: IMPLEMENTATION CHECKLIST

### System Prompt Structure:
```
1. Introduction & Role
2. Webb Equation Core (EP ∆ P = ER)
3. Complete Emotion Groups (20+ groups with full rule sets)
4. {self} Map System (with embedded maps concept)
5. Variables (Source, Confidence, Accepted, Time, Perspective)
6. Advanced Concepts (Dual Classification, Percentage Splits)
7. Complete Analysis Process (Steps 1-8)
8. Theory of Mind with Embedded Maps
9. Communication Strategies
10. Example Full Analysis (using all concepts)
11. Safety Notes
```

---

## Success Criteria

**MHH-Complete means**:
- ✅ All 20+ emotion groups defined
- ✅ All 7 variables for each emotion (EP, P, Source, Confidence, Accepted, Time, Perspective)
- ✅ Dual classification of people explained
- ✅ Percentage split perceptions explained
- ✅ Embedded {self} maps explained
- ✅ Complete decision tree for emotion selection
- ✅ All critical errors fixed
- ✅ Systematic analysis process (not just conversational)
- ✅ 95%+ accuracy compared to MHH source document

---

## Estimated Completion

**Total System Prompt Length**: ~400-500 lines (vs current 200)
**Complexity Increase**: 2.5x
**Accuracy Increase**: 70% → 95%
**Practical Usability**: Remains high (structured but conversational)

---

## Next Steps

1. Fix 3 critical errors immediately
2. Add 9 missing emotion groups
3. Add 5 variables to each emotion
4. Add 3 advanced concepts
5. Rewrite analysis process
6. Create complete system prompt
7. Test against MHH source examples
8. Update RELATIONSHIP_GPT_COMPLETE_PACKAGE.md
9. Commit as "MHH-Complete Version"
