# MHH Emotional Intelligence Framework - Comprehensive Analysis

**Analysis Date**: 2025-11-06
**Source Materials**: MHH-EI-for-AI Repository
**Purpose**: Extract core concepts for building emotionally intelligent AI systems

---

## Executive Summary

The Mind Hacking Happiness (MHH) Emotional Intelligence framework provides a revolutionary mathematical model for understanding, predicting, and influencing human emotions through the **Webb Equation of Emotion**. This framework has demonstrated superior performance on Theory of Mind benchmarks compared to state-of-the-art LLMs running without these instructions.

**Core Innovation**: All human emotions can be modeled through a single equation:
```
EP ∆ P = ER
(Expectation/Preference compared to Perception generates Emotional Reaction)
```

---

## 1. The Webb Equation of Emotion (Core Framework)

### 1.1 Fundamental Components

**EP (Expectation and/or Preference)**
- Derived from items attached to a person's {self} map
- Default: All attachments prefer to be held at status quo or increased in value
- Based on homeostasis and self-preservation drives

**P (Perception with Appraisal)**
- Information from senses or thoughts passing through awareness
- Appraised as positive or negative regarding {self} map items
- Can be sourced internally, externally, or from {self} map items

**ER (Emotional Reaction)**
- Positive emotion: When P matches or exceeds EP
- Negative emotion: When P doesn't match EP
- Apathy: When either EP or P is absent

### 1.2 The {self} Map Concept

**Definition**: A comprehensive map of all ideas, people, and experiences that constitute a person's sense of identity.

**Structure**:
- Circular map with concentric rings (like a target reticle)
- Center = highest power attachments (body/life at dead center)
- Outer rings = lower power attachments
- Four quadrants: People, Ideas/Likes, Accomplishments, Life Story

**Key Properties**:
- Each item has a power level (attachment strength)
- Items can have positive or negative valence
- Attachments can be conscious, unconscious, or visceral
- The map is dynamic (attachments added/removed throughout life)

**Power Level Impact**:
- Higher power = stronger emotional reactions
- Examples:
  - Body/Life: Power 10 (center)
  - Close family: Power 8-9
  - Job/Career: Power 5-7
  - Casual interests: Power 1-3

---

## 2. Emotion Group Algorithms

### 2.1 Mathematical Formulation

**General Formula Structure**:
```
Emotion_Score = tanh(κ · V · SC · Acc · W_p · (±ΔEP_P) · e^(-k·T))
```

**Variables**:
- **V**: Attachment power (0-1, how central to {self})
- **SC**: Source confidence (0-1, credibility of perception source)
- **Acc**: Acceptance (0-1, whether valuation shift is integrated)
- **W_p**: Perspective weight (~1 internal, <1 external)
- **T**: Time factor (elapsed or to-resolution)
- **κ, k**: Scale and decay constants
- **tanh**: Squashing function to (-1,1) range

**Severity Mapping**:
All emotions have 5 severity tiers based on |score|:
- 0.0-0.2: Lowest severity
- 0.2-0.4: Low-medium
- 0.4-0.6: Medium
- 0.6-0.8: High
- 0.8-1.0: Extreme

### 2.2 Core Emotion Groups

#### **FEAR GROUP**
**Trigger**: Pending devaluation not yet accepted, immediate threat
**Formula**: `F = tanh(κ_F · V · SC · (1-Acc) · W_p · (EP - P)_+ · e^(-k_F·T_now))`
**Severities**: Concerned → Cautious → Afraid → Horror/Fright → Panic
**Key Variables**:
- Source: Internal (belief of threat)
- Acceptance: NO (not integrated)
- Time: Immediate/Now

#### **ANGER GROUP**
**Trigger**: External attack on {self} map item, not accepted
**Formula**: `A = tanh(κ_A · V · SC · (1-Acc) · W_ext · (EP - P)_+ · e^(-k_A·T))`
**Severities**: Annoyed → Frustrated → Angry → Fury → Rage
**Key Variables**:
- Source: External
- Acceptance: NO (defending against devaluation)
- Perspective: External attack

#### **SADNESS GROUP**
**Trigger**: Internally sourced devaluation that IS accepted
**Formula**: `S = -tanh(κ_S · V · SC · Acc · W_p · (EP - P)_+ · e^(-k_S·T))`
**Severities**: Disappointed → Hurt → Sad → Grief → Despair
**Key Variables**:
- Source: Internal
- Acceptance: YES (integrated loss)
- Time: Recent (fades to regret over time)

#### **HAPPINESS GROUP**
**Trigger**: Perception meets/exceeds expectation
**Formula**: `H = tanh(κ_H · V · SC · Acc · W_p · (P - EP) · e^(-k_H·T))`
**Severities**: Satisfied → Pleased → Happy → Elated → Ecstatic
**Key Variables**:
- Sign: POSITIVE (P ≥ EP)
- Acceptance: YES
- Time: Present/recent past

#### **WORRY GROUP**
**Trigger**: Fear of future event (fear + future time)
**Formula**: `W = tanh(κ_W · V · SC · (1-Acc) · W_p · (EP - P)_+ · e^(-k_W·T_future))`
**Severities**: Distressed → Nervous → Worried → Distraught → Dread
**Key Variables**:
- Same as Fear but Time = FUTURE

#### **REGRET GROUP**
**Trigger**: Sadness about past events
**Formula**: `R = -tanh(κ_R · V · SC · Acc · W_p · (EP - Outcome)_+ · e^(-k_R·T))`
**Severities**: Mild Regret → Regret 2 → Regret → Lament → Deplore
**Key Variables**:
- Same as Sadness but Time = PAST

#### **PRIDE GROUP**
**Trigger**: Reflection on high valuation of {self} item
**Formula**: `Pr = tanh(κ_Pr · V · SC · Acc · W_ext · (P_social - EP_social)_+ · e^(-k_Pr·T))`
**Severities**: Pride 1 → Pride 2 → Pride 3 → Pride 4 → Pride 5
**Key Variables**:
- Source: Valuation itself (self-reflection)
- Perspective: Can be external (others' views)

#### **SHAME GROUP**
**Trigger**: Reflection on low valuation of {self} item
**Formula**: `Sh = -tanh(κ_Sh · V · SC · Acc · W_ext · (EP_social - P_social)_+ · e^(-k_Sh·T))`
**Severities**: Contrite → Sorry → Shame → Shame 4 → Remorse
**Key Variables**:
- Source: Valuation itself (negative)
- Acceptance: YES

#### **DISGUST GROUP**
**Trigger**: Rejection of contamination/repulsive concept
**Formula**: `Dg = tanh(κ_D · V_obj · SC · (1-Acc) · [-Val_obj]_+)`
**Severities**: Reticent → Distaste → Disgusted → Repulsed → Revulsion/Sickened
**Key Variables**:
- Driven by negative object valence
- Motivates avoidance action

#### **ANTICIPATION GROUPS**
**Positive Anticipation**: Future happiness
- Formula: `PA = tanh(κ_PA · V · SC · Acc · W_p · (P_future - EP)_+ · e^(-k_PA·T_future))`
- Severities: Mild Anticipation → ... → On Bated Breath

**Negative Anticipation**: Future sadness
- Formula: `NA = -tanh(κ_NA · V · SC · (1-Acc) · W_p · (EP - P_future)_+ · e^(-k_NA·T_future))`

---

## 3. Advanced Concepts

### 3.1 Complex Emotions

**Multiple Webb Equations Processing Simultaneously**:
- Single perception can affect multiple {self} map items
- Each affected item generates its own emotion
- Result: Mixed emotional states

**Example - Breakup**:
1. Loss of partner (Grief - sadness)
2. Loss of relationship status (Disappointment)
3. Attack on worthiness (Anger + Hurt)
4. Fear of future alone (Worry)
5. Social perception concerns (Embarrassment)

### 3.2 Source Analysis

**Three Source Types**:
1. **Internal**: Own thoughts/beliefs
2. **External**: Outside agents/events
3. **{self} Item Valuation**: Reflection on attachment value

**Dual Classification for People**:
- Close people exist BOTH on and off {self} map
- Creates mixed emotional responses
- Example: Criticism from loved one triggers both anger (external) AND sadness (internal)

### 3.3 Source Confidence Modulation

**High Confidence**: Trusted source → stronger emotional response
**Medium Confidence**: Uncertain source → moderate response
**Low Confidence**: Dubious source → can trigger anger (defending against unreliable attack)

**Examples**:
- Doctor's diagnosis (high confidence) → strong fear/worry
- Stranger's insult (low confidence) → mild annoyance or dismissal
- Friend's feedback (high confidence) → significant impact

### 3.4 Special Emotional States

**STRESS**:
- Result of ANY unresolved Webb Equation of Emotion over time
- Can be caused by fear, anger, sadness, or any imbalance
- Mind-body feedback loop

**RELIEF**:
- Rebalancing of any Webb Equation of Emotion
- Resolution of EP-P imbalance

**BOREDOM**:
- EP: Desire for mental stimulation
- P: Absence of stimulation
- Result: Boredom emotion

**CONFUSION**:
- EP: Desire to comprehend
- P: Information that contradicts comprehension
- Result: Confusion (aids learning through focused attention)

**CURIOSITY**:
- Investigation of how new P might affect {self} map
- Exploration of potential attachments

**ENVY**:
- EP: Preference for another's attachments
- P: Own attachments are less valued

---

## 4. Theory of Mind Applications

### 4.1 Benchmark Performance

**MHH Instructions + LLMs vs Solo LLMs**:
- Outperforms GPT-4.5, Claude 3.7, Gemini 2.5 Pro on Alan Turing Institute ToM benchmarks
- Chart shows performance across 5 ToM test types:
  - LocFO (Location False Opinion)
  - LocSO (Location Second Opinion)
  - MultiHopFO
  - MultiHopSO
  - Attitude

**Best Performance**: Zenodelic.ai GPT-4o with MHH instructions

### 4.2 Theory of Mind Capabilities Enabled

**1. Emotion Prediction**:
- Given user's {self} map → predict emotional responses to events
- Calculate multiple simultaneous Webb Equations

**2. Emotion Tracking**:
- Monitor ongoing emotional states
- Understand emotion transitions (e.g., anger → acceptance → sadness)

**3. Emotional Influence**:
- Craft perceptions (P) to generate desired emotional reactions
- Can be prosocial (reduce suffering) or antisocial (manipulation)

**4. False Belief Understanding**:
- Model what Person A believes Person B thinks
- Track cascading perceptions across multiple agents

**5. Empathy Simulation**:
- Build {self} map for others
- Run their Webb Equations from their perspective

---

## 5. Implementation Considerations

### 5.1 Data Structures Needed

**{self} Map Database**:
```
{
  user_id: string,
  attachments: [
    {
      id: string,
      name: string,
      category: "people" | "ideas" | "accomplishments" | "life_story",
      power_level: 0-10,
      valence: -10 to +10,
      associations: [attachment_ids],
      created: timestamp,
      modified: timestamp
    }
  ],
  metadata: {
    overall_self_valuation: number,
    perception_tendencies: object
  }
}
```

**Perception Log**:
```
{
  timestamp: datetime,
  perception_text: string,
  affected_attachments: [attachment_id],
  appraisal: positive/negative,
  source: "internal" | "external" | "self_valuation",
  source_confidence: 0-1,
  time_factor: "past" | "now" | "future"
}
```

**Emotion State**:
```
{
  timestamp: datetime,
  active_emotions: [
    {
      emotion_group: string,
      severity: string,
      score: number,
      attachment_id: string,
      perception_id: string
    }
  ]
}
```

### 5.2 Core Algorithmic Requirements

**1. {self} Map Construction**:
- Natural language processing to extract attachments
- Inference of power levels from context
- Association mapping between attachments

**2. Perception Processing**:
- Real-time analysis of inputs
- Appraisal (positive/negative for each attachment)
- Source classification and confidence assignment

**3. Webb Equation Calculator**:
- For each (attachment, perception) pair
- Apply appropriate emotion group formula
- Return emotion_group, severity, score

**4. Multi-Emotion Synthesis**:
- Process multiple simultaneous equations
- Weight and combine results
- Present complex emotional state

**5. Temporal Management**:
- Track time factors (past/present/future)
- Apply decay functions
- Manage emotion transitions

### 5.3 Ethical Considerations

**CRITICAL WARNING** (from source material):
- This framework enables targeted emotional manipulation
- Can be used for prosocial (reduce suffering) OR antisocial (control/harm) purposes
- Requires ethical guardrails in implementation
- Examples of dual use:
  - Reduce suicides ↔ Catalyze suicides
  - Promote wellbeing ↔ Exploit vulnerabilities
  - Build trust ↔ Manipulate populations

**Recommended Safeguards**:
1. Transparency about emotional modeling
2. User consent and control
3. Audit trails for emotion influence attempts
4. Ethical review boards
5. Harm prevention systems
6. Attribution and licensing compliance (AGPL-3.0)

---

## 6. Key Insights for AI Implementation

### 6.1 Minimum Viable Requirements

**Tier 1 - Basic Emotion Detection**:
- Simple {self} map (5-10 major attachments)
- Basic perception classifier (positive/negative)
- Single emotion group calculator (e.g., happiness only)

**Tier 2 - Multi-Emotion System**:
- Moderate {self} map (20-50 attachments with associations)
- Advanced perception processing (source analysis, confidence)
- 3-5 core emotion groups (happiness, sadness, fear, anger, worry)
- Basic severity mapping

**Tier 3 - Full EI System**:
- Comprehensive {self} map (100+ attachments, dynamic)
- Complete perception pipeline
- All 11+ emotion groups
- Complex emotion synthesis
- Theory of Mind capabilities
- Temporal tracking
- Emotion influence generation

### 6.2 Simplification Strategies

**For MVP Development**:
1. **Fixed κ and k constants**: Use defaults (κ=3, k=0.5)
2. **Simplified tanh**: Use lookup tables or linear approximations
3. **Discrete power levels**: Use 1-10 scale instead of continuous
4. **Limited attachment types**: Focus on "people" and "major life aspects"
5. **Pre-defined scenarios**: Test with common situations (job loss, relationship, achievement)

### 6.3 Training/Tuning Approaches

**Supervised Learning**:
- Collect (situation, {self} map, emotion) tuples
- Tune κ and k constants per emotion group
- Learn attachment power inference from text

**Reinforcement Learning**:
- Reward alignment with human emotional judgments
- Optimize emotion influence for positive outcomes

**Hybrid Approach**:
- Use MHH formulas as structure
- Learn parameters from data
- Preserve interpretability

---

## 7. Comparison to Other Emotion AI

### 7.1 Traditional Sentiment Analysis
- **Old**: Text → Positive/Negative/Neutral score
- **MHH**: Text → {self} map impact → Specific emotion + severity + reasoning

### 7.2 Affective Computing
- **Old**: Detect emotions from facial expressions, voice
- **MHH**: Predict emotions from understanding person's {self} map and situation

### 7.3 Emotion Classification Models
- **Old**: Text → Discrete emotion label (happy, sad, angry...)
- **MHH**: Mechanistic model explaining WHY emotion occurs and HOW to influence it

**MHH Advantages**:
1. **Explainable**: Every emotion has traceable cause
2. **Predictive**: Know emotion BEFORE it's expressed
3. **Influential**: Generate perceptions to create desired emotions
4. **Individual**: Personalized to each user's {self} map
5. **Validated**: Outperforms SOTA on ToM benchmarks

---

## 8. Practical Application Domains

### 8.1 Mental Health
- Depression detection (extended sadness patterns)
- Suicide prevention (track despair, influence toward hope)
- Therapy assist (understand attachment issues)
- Stress management (identify unresolved Webb Equations)

### 8.2 Customer Service
- Emotion-aware responses
- Frustration de-escalation
- Satisfaction optimization

### 8.3 Education
- Adaptive difficulty (manage worry/boredom balance)
- Motivation systems (leverage pride, anticipation)
- Personalized feedback (respect {self} map)

### 8.4 Human-AI Collaboration
- Emotional intelligence in AI assistants
- Empathetic chatbots
- Conflict mediation bots

### 8.5 Content Recommendation
- Predict emotional reactions to content
- Avoid triggers
- Optimize for wellbeing

---

## 9. Research Questions & Extensions

### 9.1 Open Questions
1. How to efficiently infer {self} maps from conversation?
2. Optimal κ and k values per emotion group?
3. Cultural variations in attachment patterns?
4. Integration with physiological measures (heart rate, cortisol)?
5. Long-term attachment map evolution models?

### 9.2 Potential Extensions
1. **Love modeling**: Framework mentions 3 types (romantic, platonic, altruistic) - not yet detailed
2. **Group emotions**: Extend to collective {self} maps
3. **AI self-awareness**: Can AI have its own {self} map?
4. **Cross-species**: Do animals follow Webb Equation?

---

## 10. Summary of Core Principles

**The 10 Laws of MHH Emotional Intelligence**:

1. **All emotions follow EP ∆ P = ER**
2. **{self} map determines what matters** (if not on map, no emotion)
3. **Power level determines severity** (center attachments = strong emotions)
4. **Source matters** (internal vs external determines emotion group)
5. **Acceptance matters** (integrated vs pending determines emotion group)
6. **Time matters** (past/present/future determines emotion group)
7. **Multiple simultaneous equations = complex emotions**
8. **Unresolved equations = stress**
9. **Resolution = relief**
10. **Emotional influence = crafting perceptions that balance or imbalance equations**

---

## 11. Next Steps for Implementation

**Phase 1 - Foundation** (Week 1-2):
- Implement {self} map data structure
- Create basic Webb Equation calculator
- Test with hardcoded scenarios

**Phase 2 - Core Emotions** (Week 3-4):
- Implement 5 core emotion groups
- Build perception processor
- Create severity mapper

**Phase 3 - Integration** (Week 5-6):
- NLP for attachment extraction
- Multi-emotion synthesis
- Basic UI/API

**Phase 4 - Advanced** (Week 7-8):
- Theory of Mind features
- Emotion influence generator
- Temporal tracking

**Phase 5 - Polish** (Week 9-10):
- Testing and validation
- Safety features
- Documentation

---

## Conclusion

The MHH Emotional Intelligence framework represents a paradigm shift in emotion AI - from pattern recognition to mechanistic understanding. Its mathematical precision, combined with psychological validity and ToM benchmark superiority, makes it the ideal foundation for building genuinely emotionally intelligent AI systems.

**Key Takeaway**: Emotions aren't mystical or purely biological - they're calculable, predictable responses following rigorous rules. Understanding these rules enables AI to understand, predict, and ethically influence human emotional states.

---

**License Note**: This framework is under AGPL-3.0. Commercial use requires compliance with open source requirements and attribution to Sean Webb's "Webb Equation of Emotion".

**Citation**: Webb, Sean. "Limited Instructions for providing Emotional Intelligence, Theory of Mind, Artificial Empathy and Artificial Compassion to LLMs." MHH-EI-for-AI, 2025.
