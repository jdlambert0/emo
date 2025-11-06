# MHH Emotional Intelligence - Medium Complexity Project

**Project Name**: EmpathAI - Conversational Emotional Intelligence Assistant
**Complexity**: Medium (Intermediate)
**Time to Build**: 4-6 weeks with AI assistance
**Target Users**: Individuals + Professionals (therapists, coaches, HR)
**Core Concept**: Full Webb Equation implementation with all emotion groups, Theory of Mind, and emotional influence

---

## Project Overview

**What It Does**:
EmpathAI is an advanced emotional intelligence chatbot that:
- Builds comprehensive {self} maps through natural conversation
- Tracks all 11 emotion groups with precise Webb Equation calculations
- Predicts emotional reactions before they occur (Theory of Mind)
- Suggests interventions to rebalance emotions
- Models multiple people's emotional states simultaneously
- Provides deep emotional insights and therapeutic value

**Why It's Medium Complexity**:
- Full Webb Equation with all mathematical formulas
- All 11 emotion groups with severity levels
- Real NLP (using LLM APIs)
- Database for persistent storage
- Multi-user support
- Theory of Mind reasoning
- Emotion influence generation

**Why It's Valuable**:
- Professional-grade emotional intelligence
- Research/clinical applications
- Demonstrates full MHH framework
- Can scale to commercial product
- Real therapeutic/coaching value

---

## Core Features

### Feature 1: Conversational {self} Map Builder
**User Experience**: Natural conversation, not questionnaire
**AI Action**: Extract attachments, infer power levels, discover associations

**Example Conversation**:
```
AI: "Hi! I'm EmpathAI. To understand your emotions better, tell me about
     what matters most to you in life."

User: "Well, I'm really focused on my career right now. I'm a software engineer
       and I just started at a new company. I'm also married with two kids."

AI: "Thanks for sharing! I've identified these attachments:
     • Career/Software Engineering (Power: 8/10 - you said 'really focused')
     • New Company (Power: 7/10 - current priority)
     • Marriage (Power: 9/10 - close relationship)
     • Children (Power: 10/10 - highest attachment)

     Tell me more about your relationship with your spouse?"

User: "We've been married for 10 years. She's my best friend but we've been
       arguing more lately about work-life balance..."

AI: "I'm updating your {self} map:
     • Spouse (Power: 9/10, Association: Marriage, Children)
     • Work-Life Balance (Power: 6/10, negative valence currently)
     • Conflict with Spouse (Active concern)

     This suggests you might be experiencing:
     - Worry (about relationship stability)
     - Sadness (relationship not meeting expectations)
     - Possibly anger (if feeling attacked) or shame (if feeling inadequate)

     Is that resonating with how you've been feeling?"
```

**Technical Implementation**:
- Use LLM (GPT-4, Claude) to extract structured data from conversation
- Prompt engineering to identify:
  - Attachments (nouns that matter to person)
  - Power levels (linguistic markers: "really", "most important", "love")
  - Valence (positive/negative framing)
  - Associations (co-mentioned concepts)
- Store in structured database

### Feature 2: Real-Time Emotion Analysis
**User Experience**: User describes situation, gets instant multi-emotion analysis
**AI Action**: Full Webb Equation calculation for all relevant emotion groups

**Example**:
```
User: "My boss called me into her office and said the project I've been
       leading for 6 months is being cancelled. She said it's not my fault,
       just budget cuts, but I feel terrible."

AI: "Let me analyze your emotional state using the Webb Equation:

EMOTION ANALYSIS (Multiple Simultaneous Equations):

1. SADNESS - Grief Level (Score: 0.72)
   Attachment: Project Leadership (Power: 8/10)
   Webb Equation: EP ∆ P = ER
   • EP: Want project to succeed = 8
   • P: Project cancelled = -7 (accepted)
   • Source: Internal (your work devalued)
   • Acceptance: HIGH (you accept it's cancelled)
   • Formula: S = -tanh(3 · 0.8 · 0.9 · 1.0 · 0.9 · 5 · e^-0)
   • Result: GRIEF (high sadness)

   Why: You invested 6 months (created attachment), now lost (accepted devaluation).

2. WORRY - Nervous Level (Score: 0.38)
   Attachment: Career Standing (Power: 7/10)
   Webb Equation:
   • EP: Want career to advance = 7
   • P: Boss said "not your fault" = confidence unclear
   • Source: External (boss's perception matters)
   • Acceptance: LOW (uncertain if this affects your standing)
   • Time: FUTURE (what happens next?)
   • Formula: W = tanh(3 · 0.7 · 0.5 · 0.5 · 0.9 · 2 · e^-0.1)
   • Result: NERVOUS (moderate worry)

   Why: Uncertain about future career implications.

3. ANGER - Frustrated Level (Score: 0.28)
   Attachment: Your Effort (Power: 6/10)
   Webb Equation:
   • EP: Want effort to be rewarded = 6
   • P: 6 months wasted = -5 (external decision)
   • Source: EXTERNAL (budget cuts attacked your work)
   • Acceptance: LOW (part of you wants to fight it)
   • Formula: A = tanh(3 · 0.6 · 0.6 · 0.4 · 0.8 · 4 · e^-0)
   • Result: FRUSTRATED (mild anger)

   Why: External force (company) devalued your effort without your control.

PRIMARY EMOTION: Grief (Sadness group)
SECONDARY EMOTIONS: Nervous (Worry), Frustrated (Anger)

WEBB EQUATION INSIGHT:
Your emotions are logical! The sadness dominates because you've accepted
the loss (integrated devaluation). The worry exists because the future
impact is uncertain. The anger is mild because you semi-accept the
external reason (budget cuts) but still feel the unjustness.

Would you like suggestions for emotional rebalancing?"
```

**Technical Implementation**:
- For each user input, identify affected attachments
- For each attachment, run Webb Equation for relevant emotion groups
- Use actual mathematical formulas from MHH PDF:
  ```python
  import math

  def calculate_emotion(attachment, perception, source, acceptance, time):
      V = attachment.power / 10  # Normalize to 0-1
      SC = perception.confidence
      Acc = acceptance
      W_p = 1.0 if source == "internal" else 0.7
      EP = attachment.expectation_level
      P = perception.value
      T = time_since_event

      # Try each emotion group
      emotions = []

      # Happiness
      if P > EP:
          kappa_H = 3.0
          k_H = 0.5
          H = math.tanh(kappa_H * V * SC * Acc * W_p * (P - EP) * math.exp(-k_H * T))
          if H > 0.2:
              emotions.append({
                  'group': 'Happiness',
                  'severity': map_severity_happiness(H),
                  'score': H
              })

      # Sadness (if negative and accepted)
      if P < EP and Acc > 0.5:
          kappa_S = 3.0
          k_S = 0.5
          S = -math.tanh(kappa_S * V * SC * Acc * W_p * (EP - P) * math.exp(-k_S * T))
          if abs(S) > 0.2:
              emotions.append({
                  'group': 'Sadness',
                  'severity': map_severity_sadness(abs(S)),
                  'score': S
              })

      # Fear (if negative, not accepted, immediate)
      if P < EP and Acc < 0.5 and time == "now":
          kappa_F = 3.0
          k_F = 0.5
          F = math.tanh(kappa_F * V * SC * (1-Acc) * W_p * (EP - P) * math.exp(-k_F * 0))
          if F > 0.2:
              emotions.append({
                  'group': 'Fear',
                  'severity': map_severity_fear(F),
                  'score': F
              })

      # Worry (if negative, not accepted, future)
      if P < EP and Acc < 0.5 and time == "future":
          kappa_W = 3.0
          k_W = 0.5
          F = math.tanh(kappa_W * V * SC * (1-Acc) * W_p * (EP - P) * math.exp(-k_W * 0.2))
          emotions.append({
              'group': 'Worry',
              'severity': map_severity_worry(F),
              'score': F
          })

      # Anger (if negative, external source, not accepted)
      if P < EP and source == "external" and Acc < 0.5:
          kappa_A = 3.0
          k_A = 0.5
          W_ext = 0.7
          A = math.tanh(kappa_A * V * SC * (1-Acc) * W_ext * (EP - P) * math.exp(-k_A * T))
          if A > 0.2:
              emotions.append({
                  'group': 'Anger',
                  'severity': map_severity_anger(A),
                  'score': A
              })

      # ... continue for all 11 emotion groups

      return emotions
  ```

### Feature 3: Theory of Mind - Emotion Prediction
**User Experience**: AI predicts how someone will feel about something
**AI Action**: Build {self} map for other person, run Webb Equations from their perspective

**Example**:
```
User: "I'm thinking about telling my wife I want to quit my job and start
       a business. How do you think she'll react?"

AI: "Let me model your wife's likely emotional reaction using Theory of Mind:

BUILDING YOUR WIFE'S {SELF} MAP (from what you've told me):
• You (her husband): Power 9/10
• Children: Power 10/10
• Financial Security: Power 8/10 (you mentioned she worries about money)
• Your Happiness: Power 7/10 (she cares about you)
• Stability: Power 7/10 (mentioned she likes predictability)

PREDICTION - Your Wife's Emotional Reaction:

INITIAL REACTION (when you first tell her):

1. FEAR - Afraid Level (Score: 0.55)
   Her Attachment: Financial Security (Power 8)
   Her Webb Equation:
   • Her EP: Maintain stable income = 8
   • Her P: You quitting = loss of income (she perceives as threat)
   • Source: Internal (her fear, not yet integrated)
   • Result: AFRAID

2. WORRY - Worried Level (Score: 0.48)
   Her Attachment: Children's Wellbeing (Power 10)
   Her Webb Equation:
   • Her EP: Kids have what they need = 10
   • Her P: Income uncertainty = threat to kids
   • Source: Internal
   • Time: FUTURE (what if business fails?)
   • Result: WORRIED

3. Possible SADNESS - Hurt (Score: 0.32)
   Her Attachment: You (her partner) (Power 9)
   Her Webb Equation:
   • Her EP: You discuss big decisions together = 9
   • Her P: You're presenting this as decision made?
   • Source: Internal (if she feels excluded from decision)
   • Result: HURT (if she perceives this as you deciding without her)

BUT ALSO:

4. HAPPINESS - Pleased (Score: 0.35)
   Her Attachment: Your Happiness (Power 7)
   Her Webb Equation:
   • Her EP: You are fulfilled = 7
   • Her P: You pursuing dreams = positive
   • Result: PLEASED (she wants you happy)

PREDICTED OVERALL REACTION:
She will likely feel MIXED EMOTIONS, primarily FEAR and WORRY (about
financial security and kids), but also some happiness for you. The fear
will dominate initially.

RECOMMENDED APPROACH TO MINIMIZE NEGATIVE EMOTIONS:

1. REBALANCE HER FEAR:
   • Present detailed financial plan (increase her Source Confidence)
   • Show savings cushion (reduce perceived threat to P)
   • Timeline with milestones (make threat feel less imminent)

   New EP ∆ P: Fear score drops from 0.55 to ~0.25 (Concerned, not Afraid)

2. REBALANCE HER WORRY:
   • Discuss specific child-related concerns
   • Show how kids' needs remain met
   • Involve her in planning

   New EP ∆ P: Worry score drops from 0.48 to ~0.30 (Nervous, not Worried)

3. AMPLIFY HER HAPPINESS:
   • Frame as "OUR family's adventure" (increases her attachment involvement)
   • Ask for her input (makes her part of the decision)
   • Emphasize your happiness increase

   New EP ∆ P: Happiness score rises from 0.35 to ~0.55 (Happy, not just Pleased)

OPTIMAL CONVERSATION OPENER:
'Honey, I want to talk about something I've been thinking about that affects
both of us. I value your input and need your partnership on this. I've been
feeling unfulfilled at work, and I've been exploring the idea of starting a
business. Before you worry, I've put together a financial plan I want to
walk through with you. Can we set aside time this weekend to discuss it?'

This opener:
- Reduces Hurt (includes her in decision)
- Preempts Fear (acknowledges and addresses it)
- Increases her Happiness (values her partnership)

Would you like me to roleplay the conversation so you can practice?"
```

**Technical Implementation**:
- Maintain {self} maps for multiple people
- Run Webb Equations from other person's perspective
- Track relationships between people ({self} maps overlap)
- Generate counterfactual scenarios (what if X happens?)
- Optimize communication to rebalance equations

### Feature 4: Emotional Influence Engine
**User Experience**: AI suggests specific actions/words to create desired emotional states
**AI Action**: Generate Perceptions (P) that will rebalance targeted Webb Equations

**Example**:
```
User: "I need to give my team member critical feedback about missing
       a deadline. How do I do it without devastating them?"

AI: "Let me design an emotionally intelligent feedback approach:

TARGET PERSON: Your team member
CURRENT STATE: Likely already feeling shame/worry about missing deadline

GOALS:
1. Minimize Sadness/Shame (don't devalue their {self} attachment to being competent)
2. Maintain Worry at moderate level (enough to motivate, not paralyze)
3. Introduce constructive elements (opportunity for growth)

EMOTIONAL INFLUENCE STRATEGY:

STEP 1: Affirm before criticizing
Crafted Perception: "I know you're committed to doing great work. That's
why I want to talk about what happened with the deadline."

Webb Equation Impact:
• Attachment: Their competence/worth
• EP: Want to be seen as competent
• P: Boss still values them (positive)
• Result: REDUCES pre-existing shame, sets positive baseline

STEP 2: External attribution (where appropriate)
Crafted Perception: "The deadline was aggressive, and I should have checked
in more during the process."

Webb Equation Impact:
• Shifts source from INTERNAL to partly EXTERNAL
• Reduces Sadness group (was all their fault → shared responsibility)
• Reduces Anger potential (they might be angry at self → less reason)

STEP 3: Fact-focus, not person-focus
Crafted Perception: "The project was due Tuesday, delivered Friday. That
impacted the client timeline."

Webb Equation Impact:
• Attachment: THE PROJECT (not THEM as a person)
• Keeps critique on work product, not self-worth
• Lower power attachment = lower emotional severity

STEP 4: Future-focus with support
Crafted Perception: "Going forward, let's set up weekly check-ins so I can
help remove blockers. What do you need from me to hit the next deadline?"

Webb Equation Impact:
• Time: FUTURE (shifts from Sadness about past → Problem-solving mode)
• Source: Collaborative (not attacking)
• Increases Positive Anticipation (support offered)
• Reduces Worry (clear path forward)

PREDICTED EMOTIONAL OUTCOME:
Before conversation: Shame (0.6), Worry (0.7), Sadness (0.5)
After conversation: Mild Shame (0.3), Moderate Worry (0.4), Determination

FULL SCRIPT:
'Hey [Name], thanks for making time. I know you're committed to doing great
work—that's why I wanted to talk about what happened with the ABC project
deadline. The project was due Tuesday but delivered Friday, which impacted
the client timeline. I take responsibility too; the deadline was aggressive
and I should have checked in more during the process. Going forward, let's
set up weekly check-ins so I can help remove blockers earlier. What do you
need from me to make sure we hit the next deadline together?'

This approach:
✅ Minimizes shame (affirms their value)
✅ Maintains accountability (addresses the issue)
✅ Shifts to problem-solving (future focus)
✅ Builds alliance (collaborative framing)

Would you like to practice this conversation, or should I adjust the
emotional targets?"
```

**Technical Implementation**:
- Reverse engineer Webb Equations: Given desired emotion, calculate required P
- Generate language that creates that P
- Consider Source, Source Confidence, Time factors
- Test multiple intervention strategies
- Rank by predicted emotional outcome

### Feature 5: Emotion Dashboard & Analytics
**User Experience**: Visual insights into emotional patterns over time
**AI Action**: Analyze emotion logs, identify trends, generate actionable insights

**Features**:
- **Emotion Timeline**: Chart showing emotion types over days/weeks
- **Attachment Analysis**: Which attachments drive most emotions?
- **Trigger Patterns**: What events consistently cause negative emotions?
- **Emotion Transitions**: How do emotions evolve (anger → sadness → acceptance)?
- **Webb Equation Audits**: Which equations most frequently imbalanced?
- **Recommendations**: Specific attachment/perception adjustments

**Example Dashboard**:
```
===================================
   EMOTION DASHBOARD - Past 30 Days
===================================

EMOTION FREQUENCY:
😊 Happiness: 42 instances (35%)
😢 Sadness: 28 instances (23%)
😰 Worry: 22 instances (18%)
😠 Anger: 15 instances (13%)
😨 Fear: 8 instances (7%)
... (other groups)

TOP EMOTIONAL TRIGGERS:
1. Career (38% of all emotions) - Mixed positive & negative
2. Relationships (29%) - Mostly positive, some conflict
3. Health (12%) - Mostly worry
4. Financial Security (11%) - Mostly worry
5. Personal Goals (10%) - Mostly positive anticipation

ATTACHMENT POWER ANALYSIS:
Highest Power Attachments:
• Children (10/10) - Drives 15% of emotions
• Spouse (9/10) - Drives 14% of emotions
• Health (8/10) - Drives 12% of emotions
• Career (8/10) - Drives 38% of emotions (high frequency!)

INSIGHT: Your Career attachment drives the most emotions despite not
being your highest power attachment. Consider: Is this the right balance?

EMOTION TRANSITION PATTERNS:
Most Common: Worry → Fear → Anger → Sadness → Acceptance
Your Pattern: Anger → Sadness (you skip fear phase)

INSIGHT: You tend to internalize external attacks quickly (anger →
sadness), suggesting you accept criticism rapidly. This can be healthy
(fast processing) or unhealthy (not defending yourself enough).

WEBB EQUATION AUDIT:
Most Imbalanced Equations (past month):
1. Career EP vs Reality P: Imbalanced 18 times
   → You expect more from career than it's delivering
   → Recommendation: Adjust EP downward OR take action to increase P

2. Work-Life Balance EP vs Reality P: Imbalanced 12 times
   → You want more balance but not achieving it
   → Recommendation: Reduce work attachment power OR set boundaries

3. Self-Worth EP vs Perceived P: Imbalanced 8 times
   → You expect to feel more valued than you perceive
   → Recommendation: Work on self-compassion (internal source confidence)

PREDICTIVE INSIGHTS:
Based on patterns, you're at risk for:
• Burnout (Career equation chronically imbalanced)
• Relationship strain (W-L balance affecting spouse)

Suggested Actions:
1. Have conversation with spouse about work-life (use influence engine)
2. Explore career change or role adjustment
3. Practice self-compassion exercises (rebalance self-worth equation)

[View Detailed Reports] [Get Personalized Recommendations]
```

**Technical Implementation**:
- Time-series database (TimescaleDB or similar)
- Data visualization (Chart.js, D3.js)
- Statistical analysis (frequency, correlation, regression)
- Pattern recognition (ML optional but helpful)
- Recommendation engine based on MHH principles

---

## Technical Architecture

### Tech Stack (Recommended)

**Frontend**:
- React.js (for rich, interactive UI)
- TypeScript (for type safety with complex objects)
- Tailwind CSS (for modern styling)
- Chart.js or Recharts (for visualizations)

**Backend**:
- Python with Fast API (for Webb Equation calculations)
- Node.js/Express (alternative if prefer JavaScript)
- PostgreSQL (for relational data: users, attachments, logs)
- Redis (for caching, real-time features)

**AI/NLP**:
- OpenAI GPT-4 or Anthropic Claude API (for conversation, extraction)
- Custom prompts for {self} map building
- Function calling for structured extraction

**Infrastructure**:
- Docker (containerization)
- Heroku or Railway.app (easy deployment)
- GitHub Actions (CI/CD)

### Database Schema

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP,
    settings JSONB
);

-- Attachments (items on {self} map)
CREATE TABLE attachments (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255),
    category VARCHAR(50), -- 'people', 'ideas', 'accomplishments', 'life_story'
    power_level DECIMAL(3,2), -- 0.00 to 1.00
    valence DECIMAL(3,2), -- -1.00 to 1.00
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    metadata JSONB -- for additional info
);

-- Attachment Associations
CREATE TABLE attachment_associations (
    id UUID PRIMARY KEY,
    attachment_id UUID REFERENCES attachments(id),
    associated_attachment_id UUID REFERENCES attachments(id),
    strength DECIMAL(3,2), -- how strongly associated
    created_at TIMESTAMP
);

-- Perceptions (events/inputs)
CREATE TABLE perceptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    text TEXT, -- what user said/input
    timestamp TIMESTAMP,
    source VARCHAR(50), -- 'internal', 'external', 'self_valuation'
    source_confidence DECIMAL(3,2),
    time_factor VARCHAR(20), -- 'past', 'now', 'future'
    raw_data JSONB -- full analysis
);

-- Perception-Attachment Links
CREATE TABLE perception_attachments (
    perception_id UUID REFERENCES perceptions(id),
    attachment_id UUID REFERENCES attachments(id),
    appraisal DECIMAL(3,2), -- positive/negative valence of P for this attachment
    PRIMARY KEY (perception_id, attachment_id)
);

-- Emotions (calculated results)
CREATE TABLE emotions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    perception_id UUID REFERENCES perceptions(id),
    attachment_id UUID REFERENCES attachments(id),
    emotion_group VARCHAR(50), -- 'Happiness', 'Sadness', 'Fear', etc.
    severity_label VARCHAR(50), -- 'Elated', 'Grief', 'Panic', etc.
    score DECIMAL(4,3), -- -1.000 to 1.000
    calculation_details JSONB, -- store V, SC, Acc, etc. for transparency
    timestamp TIMESTAMP
);

-- Theory of Mind Models (other people's {self} maps)
CREATE TABLE tom_models (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id), -- who is modeling
    target_person_name VARCHAR(255), -- who is being modeled
    attachments JSONB, -- their {self} map
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Conversations (for context)
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    messages JSONB, -- array of {role, content, timestamp}
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Core Algorithms (Pseudocode)

#### 1. {self} Map Extraction from Conversation

```python
def extract_attachments_from_text(user_input, conversation_history):
    """
    Use LLM with structured output to extract attachments
    """
    system_prompt = """
    You are an expert at identifying what matters to people based on
    their language. Extract:
    1. Attachments (things that define their identity)
    2. Power level (0-10, based on linguistic intensity)
    3. Valence (positive or negative framing)
    4. Associations (related concepts)

    Output JSON format:
    {
        "attachments": [
            {
                "name": "Career",
                "power_level": 8,
                "valence": 1,
                "evidence": "said 'really focused on my career right now'",
                "associations": ["software engineering", "new company"]
            }
        ]
    }
    """

    response = llm_api_call(
        system=system_prompt,
        messages=conversation_history + [user_input],
        response_format="json"
    )

    attachments = parse_json(response)

    # Store in database
    for att in attachments:
        create_or_update_attachment(user_id, att)

    return attachments
```

#### 2. Multi-Emotion Calculation

```python
def calculate_all_emotions(user_id, perception_text):
    """
    For a given perception, calculate all relevant emotions
    """
    # Step 1: Analyze perception
    perception_analysis = analyze_perception(perception_text)
    # Returns: {
    #   affected_attachments: [attachment_ids],
    #   appraisals: {attachment_id: valence_score},
    #   source: 'internal' | 'external',
    #   source_confidence: 0-1,
    #   time_factor: 'past' | 'now' | 'future'
    # }

    # Step 2: Get user's {self} map
    attachments = get_user_attachments(user_id)

    # Step 3: For each affected attachment, calculate emotions
    all_emotions = []

    for att_id in perception_analysis['affected_attachments']:
        attachment = get_attachment(att_id)
        appraisal = perception_analysis['appraisals'][att_id]

        # Calculate each emotion group
        emotions = []

        # Happiness
        if appraisal > 0:
            H = calculate_happiness(
                V=attachment.power_level,
                SC=perception_analysis['source_confidence'],
                Acc=determine_acceptance(perception_analysis),
                W_p=1.0 if perception_analysis['source'] == 'internal' else 0.7,
                P=appraisal,
                EP=attachment.expected_value,
                T=time_since_perception(perception_analysis)
            )
            if abs(H) > 0.2:
                emotions.append({
                    'group': 'Happiness',
                    'severity': map_severity_happiness(H),
                    'score': H
                })

        # Sadness (if negative and accepted)
        if appraisal < 0 and perception_analysis['acceptance'] > 0.5:
            S = calculate_sadness(...)
            if abs(S) > 0.2:
                emotions.append(...)

        # Fear (if negative, not accepted, immediate)
        if (appraisal < 0 and
            perception_analysis['acceptance'] < 0.5 and
            perception_analysis['time_factor'] == 'now'):
            F = calculate_fear(...)
            if abs(F) > 0.2:
                emotions.append(...)

        # Worry (if negative, not accepted, future)
        if (appraisal < 0 and
            perception_analysis['acceptance'] < 0.5 and
            perception_analysis['time_factor'] == 'future'):
            W = calculate_worry(...)
            if abs(W) > 0.2:
                emotions.append(...)

        # Anger (if negative, external, not accepted)
        if (appraisal < 0 and
            perception_analysis['source'] == 'external' and
            perception_analysis['acceptance'] < 0.5):
            A = calculate_anger(...)
            if abs(A) > 0.2:
                emotions.append(...)

        # ... continue for all 11 emotion groups ...

        all_emotions.extend(emotions)

    # Step 4: Store in database
    for emotion in all_emotions:
        store_emotion(user_id, perception_id, emotion)

    # Step 5: Return sorted by score (primary emotion first)
    return sorted(all_emotions, key=lambda e: abs(e['score']), reverse=True)
```

#### 3. Theory of Mind Prediction

```python
def predict_emotion_for_other(user_id, target_person, hypothetical_event):
    """
    Predict how target_person will emotionally react to hypothetical_event
    """
    # Step 1: Get or build target person's {self} map
    tom_model = get_tom_model(user_id, target_person)
    if not tom_model:
        tom_model = build_tom_model_from_conversation(user_id, target_person)

    # Step 2: Analyze hypothetical event from their perspective
    perception_analysis = analyze_perception(
        hypothetical_event,
        perspective="third_person",
        self_map=tom_model.attachments
    )

    # Step 3: Calculate emotions using THEIR {self} map
    predicted_emotions = []

    for att_id in perception_analysis['affected_attachments']:
        attachment = tom_model.attachments[att_id]

        # Run Webb Equations from their perspective
        emotions = calculate_all_emotions_for_attachment(
            attachment=attachment,
            perception=perception_analysis,
            perspective="other"
        )

        predicted_emotions.extend(emotions)

    # Step 4: Return prediction with confidence
    return {
        'target_person': target_person,
        'hypothetical_event': hypothetical_event,
        'predicted_emotions': sorted(predicted_emotions, key=lambda e: abs(e['score']), reverse=True),
        'confidence': calculate_tom_confidence(tom_model),
        'reasoning': generate_tom_explanation(predicted_emotions, tom_model)
    }
```

#### 4. Emotional Influence Generation

```python
def generate_emotional_influence(user_id, target_person, desired_emotion_change):
    """
    Generate communication strategies to shift target person's emotions
    """
    # desired_emotion_change format:
    # {
    #   'reduce': [{'emotion': 'Fear', 'target_score': 0.3}],
    #   'increase': [{'emotion': 'Happiness', 'target_score': 0.6}]
    # }

    # Step 1: Get target's current emotional state and {self} map
    tom_model = get_tom_model(user_id, target_person)
    current_emotions = get_current_emotions_for_tom(tom_model)

    # Step 2: For each emotion to change, calculate required Perception shift
    influence_strategies = []

    for reduction in desired_emotion_change['reduce']:
        emotion_name = reduction['emotion']
        current_score = get_emotion_score(current_emotions, emotion_name)
        target_score = reduction['target_score']

        # Reverse engineer Webb Equation
        # If F = tanh(κ · V · SC · (1-Acc) · W_p · (EP - P) · e^(-k·T))
        # And we want F = target_score
        # We can adjust: SC (source confidence), Acc (acceptance), P (perception)

        strategies = []

        # Strategy 1: Reduce Source Confidence
        # Make the threat seem less credible
        sc_adjustment = calculate_sc_for_target_score(current_score, target_score)
        strategies.append({
            'type': 'reduce_source_confidence',
            'adjustment_needed': sc_adjustment,
            'example_language': generate_sc_reduction_language(emotion_name)
        })

        # Strategy 2: Increase Acceptance
        # Help them integrate the change (shifts from Fear to Sadness, but lower intensity)
        acc_adjustment = calculate_acc_for_target_score(current_score, target_score)
        strategies.append({
            'type': 'increase_acceptance',
            'adjustment_needed': acc_adjustment,
            'example_language': generate_acceptance_language(emotion_name)
        })

        # Strategy 3: Improve Perception
        # Make P less negative
        p_adjustment = calculate_p_for_target_score(current_score, target_score)
        strategies.append({
            'type': 'improve_perception',
            'adjustment_needed': p_adjustment,
            'example_language': generate_positive_reframe(emotion_name)
        })

        influence_strategies.append({
            'emotion_to_reduce': emotion_name,
            'current_score': current_score,
            'target_score': target_score,
            'strategies': strategies
        })

    # Step 3: Combine strategies into coherent communication plan
    communication_plan = synthesize_influence_strategies(influence_strategies)

    # Step 4: Generate actual language/script
    script = generate_influence_script(
        tom_model=tom_model,
        communication_plan=communication_plan,
        user_relationship=get_relationship(user_id, target_person)
    )

    return {
        'influence_strategies': influence_strategies,
        'communication_plan': communication_plan,
        'script': script,
        'predicted_outcome': predict_emotions_after_influence(tom_model, script)
    }
```

---

## User Interface Design

### Main Chat Interface

```
┌─────────────────────────────────────────────────────────────┐
│  EmpathAI                                    [Settings] [?] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  You: My boss criticized my work in front of the whole team │
│                                                              │
│  EmpathAI:                                                   │
│  That sounds really difficult. Let me analyze your          │
│  emotional response using the Webb Equation:                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ EMOTION ANALYSIS                                      │  │
│  │                                                        │  │
│  │ 😠 ANGER - Furious Level (0.72)                       │  │
│  │ Attachment: Professional Reputation (Power: 8/10)     │  │
│  │ Why: Public criticism = external attack on your work  │  │
│  │                                                        │  │
│  │ 😢 SADNESS - Hurt Level (0.58)                        │  │
│  │ Attachment: Relationship with Boss (Power: 6/10)      │  │
│  │ Why: Boss is on your {self} map, feeling betrayed     │  │
│  │                                                        │  │
│  │ 😰 WORRY - Worried Level (0.45)                       │  │
│  │ Attachment: Job Security (Power: 7/10)                │  │
│  │ Why: Uncertain if this affects your standing          │  │
│  │                                                        │  │
│  │ [View Full Webb Equation] [Emotion History]           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Would you like help processing these emotions or           │
│  suggestions for how to respond?                            │
│                                                              │
│  [Help Me Process] [Generate Response] [Something Else]     │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  [Type your message...                            ] [Send]  │
└─────────────────────────────────────────────────────────────┘
```

### {self} Map Visualizer

```
┌─────────────────────────────────────────────────────────────┐
│  Your {self} Map                            [Edit] [Export] │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                         ╔═════╗                              │
│                         ║BODY ║ 10                           │
│                         ╚═════╝                              │
│                                                              │
│                    [Children] 10                             │
│                                                              │
│               [Spouse] 9      [Health] 8                     │
│                                                              │
│          [Career] 8                 [Parents] 7              │
│                                                              │
│     [Financial Security] 7                                   │
│                                                              │
│  [Friends] 6           [Hobbies] 5      [Appearance] 5      │
│                                                              │
│     [Politics] 3              [Sports Team] 2                │
│                                                              │
│  Power Level:  Center (10) ────────────────> Edge (1)       │
│                                                              │
│  [View Associations] [Add Attachment] [Analyze Patterns]    │
└─────────────────────────────────────────────────────────────┘
```

### Theory of Mind Interface

```
┌─────────────────────────────────────────────────────────────┐
│  Theory of Mind - Predict Emotions                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Who would you like to model?                               │
│  ┌──────────────────────────────┐                           │
│  │ [Dropdown: My Spouse ▼]      │                           │
│  └──────────────────────────────┘                           │
│                                                              │
│  What hypothetical event?                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ I want to tell her I'm quitting my job to start a    │  │
│  │ business                                              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  [Predict Her Reaction]                                     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ PREDICTION (Confidence: 78%)                          │  │
│  │                                                        │  │
│  │ Your Spouse's Likely Emotions:                        │  │
│  │                                                        │  │
│  │ 😰 FEAR - Afraid Level (0.62)                         │  │
│  │ Her Attachment: Financial Security (Power: 8)         │  │
│  │                                                        │  │
│  │ 😰 WORRY - Worried Level (0.55)                       │  │
│  │ Her Attachment: Children's Wellbeing (Power: 10)      │  │
│  │                                                        │  │
│  │ 😊 HAPPINESS - Pleased Level (0.38)                   │  │
│  │ Her Attachment: Your Happiness (Power: 7)             │  │
│  │                                                        │  │
│  │ Overall: Mixed emotions, primarily FEAR about         │  │
│  │ financial implications.                               │  │
│  │                                                        │  │
│  │ [View Her {self} Map] [See Full Analysis]             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Get Communication Strategy] [Roleplay Conversation]       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Emotional Intelligence Dashboard                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Past 30 Days Summary:                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Emotion Frequency                                      │ │
│  │ ████████████████░░░░ Happiness (42)                    │ │
│  │ ███████████░░░░░░░░░ Sadness (28)                      │ │
│  │ █████████░░░░░░░░░░░ Worry (22)                        │ │
│  │ ██████░░░░░░░░░░░░░░ Anger (15)                        │ │
│  │ ████░░░░░░░░░░░░░░░░ Fear (8)                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Top Emotional Triggers:                                    │
│  1. Career (38% of emotions) - [View Details]               │
│  2. Relationships (29%) - [View Details]                    │
│  3. Health (12%) - [View Details]                           │
│                                                              │
│  Emotion Timeline (Past Week):                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Score                                                  │ │
│  │  1.0 ┤                                      ●           │ │
│  │  0.5 ┤        ●        ●                                │ │
│  │  0.0 ┼──●──────────────────●──●──────────────────────  │ │
│  │ -0.5 ┤                              ●                   │ │
│  │ -1.0 ┤     ●                                            │ │
│  │      └───────────────────────────────────────────────► │ │
│  │      Mon Tue Wed Thu Fri Sat Sun                       │ │
│  │                                                         │ │
│  │  ● Happiness  ● Sadness  ● Fear  ● Anger  ● Worry     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Insights & Recommendations:                                │
│  ⚠ Your Career attachment is chronically imbalanced        │
│     → Recommendation: Review career expectations             │
│                                                              │
│  ✓ Positive emotion frequency increased 15% this month     │
│                                                              │
│  ℹ Youre skipping Fear phase (Anger → Sadness pattern)     │
│     → This may indicate rapid acceptance of criticism       │
│                                                              │
│  [View Full Report] [Get Personalized Plan]                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
**Goal**: Basic emotion calculation working

**Tasks**:
- [ ] Set up development environment
- [ ] Create database schema
- [ ] Implement basic Webb Equation calculator (3 emotion groups)
- [ ] Build simple chat interface
- [ ] Test with hardcoded attachments

**Deliverable**: Can input event, get emotion calculation

### Phase 2: {self} Map Builder (Week 3)
**Goal**: Extract attachments from conversation

**Tasks**:
- [ ] Integrate LLM API (OpenAI/Claude)
- [ ] Create prompts for attachment extraction
- [ ] Build {self} map data structure
- [ ] Create {self} map visualizer UI
- [ ] Test extraction accuracy

**Deliverable**: Conversational {self} map building works

### Phase 3: Full Emotion System (Week 4)
**Goal**: All 11 emotion groups implemented

**Tasks**:
- [ ] Implement remaining 8 emotion groups
- [ ] Add proper formula parameters (κ, k constants)
- [ ] Build multi-emotion synthesis
- [ ] Create detailed emotion display
- [ ] Test with real scenarios

**Deliverable**: Complete emotion analysis for any input

### Phase 4: Theory of Mind (Week 5)
**Goal**: Model other people's emotions

**Tasks**:
- [ ] Build ToM model data structure
- [ ] Create ToM model builder from conversation
- [ ] Implement third-person Webb Equations
- [ ] Build prediction UI
- [ ] Test prediction accuracy

**Deliverable**: Can predict how others will feel

### Phase 5: Emotional Influence (Week 6)
**Goal**: Generate emotion-balancing strategies

**Tasks**:
- [ ] Implement reverse Webb Equation solver
- [ ] Create influence strategy generator
- [ ] Build script generator
- [ ] Add roleplay/practice mode
- [ ] Test with real communication scenarios

**Deliverable**: Can suggest how to influence emotions

### Phase 6: Dashboard & Analytics (Week 7)
**Goal**: Visualize patterns and insights

**Tasks**:
- [ ] Build time-series analysis
- [ ] Create visualization components
- [ ] Implement pattern detection
- [ ] Generate insights with LLM
- [ ] Build recommendation engine

**Deliverable**: Full analytics dashboard

### Phase 7: Polish & Deploy (Week 8)
**Goal**: Production-ready application

**Tasks**:
- [ ] Comprehensive testing
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Documentation
- [ ] Deploy to production
- [ ] Beta user testing

**Deliverable**: Live application!

---

## Testing Strategy

### Unit Tests
- Webb Equation calculations (all 11 groups)
- Attachment extraction accuracy
- Database operations
- API endpoints

### Integration Tests
- End-to-end emotion analysis flow
- {self} map building through conversation
- Theory of Mind predictions
- Influence generation

### Validation Tests
- Compare predictions to real human emotions
- Validate against MHH framework
- Test edge cases (extreme attachments, mixed emotions)
- Benchmark against existing emotion AI

### User Testing
- 10 beta users for 2 weeks
- Collect accuracy feedback
- Measure user satisfaction
- Gather feature requests

---

## Success Criteria

**Technical**:
✅ All 11 emotion groups implemented correctly
✅ Webb Equation calculations match MHH formulas
✅ {self} map extraction 80%+ accuracy
✅ Theory of Mind predictions 70%+ accuracy (vs. real outcomes)
✅ System response time < 3 seconds
✅ Zero critical bugs

**User Experience**:
✅ Users understand their emotions better (self-reported)
✅ Users find insights actionable
✅ Average session engagement > 10 minutes
✅ Weekly active usage rate > 60%
✅ NPS (Net Promoter Score) > 40

**Research**:
✅ Demonstrate MHH framework viability
✅ Collect dataset for future research
✅ Validate against academic emotion theories
✅ Publish case studies

---

## Commercialization Paths

### Option 1: B2C SaaS
- **Model**: Freemium subscription
- **Free Tier**: Basic emotion tracking
- **Premium**: $10/month - Full features, unlimited ToM, priority support
- **Target**: 10,000 users in year 1 → 1,000 paying → $120k ARR

### Option 2: B2B Licensing
- **Model**: License to therapists, coaches, HR professionals
- **Pricing**: $100/month per professional + $5/month per client
- **Value Prop**: Clinical-grade emotional intelligence tool
- **Target**: 100 professionals → $120k ARR

### Option 3: API Platform
- **Model**: API access for developers
- **Pricing**: Usage-based (per emotion calculation)
- **Value Prop**: Emotional AI as a service
- **Target**: 50 companies integrating → $200k ARR

### Option 4: Open Source + Consulting
- **Model**: Free open source, paid implementation/customization
- **Revenue**: Consulting, training, custom deployments
- **Target**: Build reputation, land enterprise clients

---

## Ethical Guidelines

### Must-Haves:
1. **Informed Consent**: Users must understand they're being emotionally modeled
2. **Transparency**: Show Webb Equation calculations, don't hide the "AI magic"
3. **User Control**: Users can edit their {self} map, delete data anytime
4. **Privacy**: End-to-end encryption, no selling data
5. **Harm Prevention**: Detect & prevent manipulation tactics, suicide risk flagging
6. **Bias Mitigation**: Test across cultures, ages, backgrounds
7. **Professional Boundaries**: Not a replacement for therapy, clear disclaimers

### Nice-to-Haves:
- Ethics review board
- Academic partnerships
- Open source core algorithms
- Community governance

---

## Conclusion

EmpathAI represents a medium-complexity implementation that balances sophistication with buildability. By implementing the full MHH framework, it demonstrates the true power of the Webb Equation to understand, predict, and ethically influence human emotions.

This project is ambitious but achievable for someone with intermediate coding skills and AI assistance over 4-6 weeks. The result is a powerful tool that can:
- Help individuals understand their emotions
- Support professionals in their practice
- Advance emotional AI research
- Demonstrate MHH framework commercially

**Next Step**: Review the implementation guide (MHH_IMPLEMENTATION_GUIDE.md) for detailed instructions on building each component.

---

**License Compliance**: Remember that MHH is AGPL-3.0. If you distribute EmpathAI, you must open source your code and attribute Sean Webb's Webb Equation of Emotion. Consider this when choosing commercialization path.
