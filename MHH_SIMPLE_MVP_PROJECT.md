# MHH Emotional Intelligence - Simple MVP Project

**Project Name**: EmotionScope - Personal Emotion Tracker
**Complexity**: Simple (Beginner-Friendly)
**Time to Build**: 1-2 weeks with AI assistance
**Target Users**: Individuals seeking emotional awareness
**Core Concept**: Track personal emotions based on simplified MHH Webb Equation

---

## Project Overview

**What It Does**:
EmotionScope is a simple chatbot/web app that helps users understand their emotions by mapping their personal attachments ({self} map) and analyzing how daily events affect these attachments using the Webb Equation of Emotion.

**Why It's Simple**:
- Only tracks 3 core emotion groups (Happiness, Sadness, Fear)
- Pre-defined attachment categories
- Text-based interface (no complex UI)
- Local storage (no database needed for MVP)
- Uses simple math (no ML required)

**Why It's Valuable**:
- Provides emotional awareness and insights
- Educational about emotion mechanics
- Therapeutic value (journaling + analysis)
- Demonstrates MHH framework practically

---

## Core Features

### Feature 1: {self} Map Builder
**User Action**: Answer 10 simple questions about what matters to them
**System Action**: Build a simplified {self} map with power levels

**Questions**:
1. "How important is your health to you?" (1-10)
2. "How important is your job/career?" (1-10)
3. "How important are your close relationships?" (1-10)
4. "How important is your financial security?" (1-10)
5. "How important are your hobbies/interests?" (1-10)
6. "How important is your personal growth?" (1-10)
7. "How important is your appearance?" (1-10)
8. "How important are your goals/dreams?" (1-10)
9. "How important is your living situation?" (1-10)
10. "How important is your reputation?" (1-10)

**Output**: Simple {self} map with 10 attachments and power levels

### Feature 2: Daily Check-In
**User Action**: Describe something that happened today (free text)
**System Action**:
1. Identify which attachments are affected
2. Determine if event is positive or negative
3. Calculate emotion using Webb Equation
4. Show user their emotion + explanation

**Example**:
```
User: "I got a promotion at work today!"
System Analysis:
- Affected attachment: Job/Career (Power: 8)
- Event appraisal: Positive (+)
- EP: Want job to maintain/increase = 8
- P: Promotion = +9
- Calculation: P > EP → Positive emotion
- Result: HAPPY (Elated level)
- Explanation: "You're feeling elated because your career
  (which is very important to you) just got a boost!"
```

### Feature 3: Emotion Log
**User Action**: View their emotion history
**System Action**: Show past check-ins with emotions tracked

**Display**:
```
Date       | Event                    | Emotion        | Attachment
-----------|--------------------------|----------------|------------
2025-11-06 | Got promotion            | Elated         | Career
2025-11-05 | Argument with partner    | Sad/Angry      | Relationships
2025-11-04 | Completed project        | Happy          | Goals
```

### Feature 4: Insight Generator
**User Action**: Request insights
**System Action**: Analyze patterns and provide MHH-based insights

**Examples**:
- "Most of your negative emotions (60%) relate to Relationships - this is a high-power attachment for you"
- "When your Career attachment is threatened, you typically feel Fear first, then Anger"
- "Your Financial Security attachment causes more Worry than actual Sadness"

---

## Technical Architecture (Super Simple)

### Tech Stack (Recommended for Non-Coders)
- **Frontend**: HTML + JavaScript (single page)
- **Backend**: Python with Flask (or just JavaScript if web-only)
- **Storage**: Browser LocalStorage (no database)
- **AI Help**: Use ChatGPT/Claude to write all code

### File Structure
```
emotion-scope/
├── index.html          (main interface)
├── style.css           (basic styling)
├── app.js              (all logic here)
└── webb-equations.js   (emotion calculations)
```

### Core Code Components

#### 1. {self} Map Storage
```javascript
// Simple object in LocalStorage
const selfMap = {
  attachments: [
    { name: "Health", power: 8 },
    { name: "Career", power: 7 },
    { name: "Relationships", power: 9 },
    // ... etc
  ]
};
```

#### 2. Webb Equation Calculator (Simplified)
```javascript
function calculateEmotion(attachment, eventPositive) {
  const EP = attachment.power; // Expectation
  const P = eventPositive ? (EP + 2) : (EP - 3); // Perception

  const difference = P - EP;

  if (difference > 0) {
    // Positive emotion (Happiness)
    const severity = Math.abs(difference) * attachment.power / 10;
    return {
      group: "Happiness",
      level: mapSeverity(severity), // "Pleased", "Happy", "Elated"
      score: severity
    };
  } else {
    // Negative emotion (Sadness if accepted, Fear if pending)
    // For MVP, default to Sadness
    const severity = Math.abs(difference) * attachment.power / 10;
    return {
      group: "Sadness",
      level: mapSeverity(severity),
      score: severity
    };
  }
}

function mapSeverity(score) {
  if (score < 2) return "Mild";
  if (score < 4) return "Moderate";
  if (score < 6) return "Strong";
  if (score < 8) return "Intense";
  return "Extreme";
}
```

#### 3. Simple NLP (Keyword Matching)
```javascript
function analyzeEvent(text) {
  const positive = ["promotion", "won", "success", "happy", "great", "love"];
  const negative = ["lost", "failed", "fired", "sad", "bad", "hate"];

  const isPositive = positive.some(word => text.toLowerCase().includes(word));
  const isNegative = negative.some(word => text.toLowerCase().includes(word));

  return {
    valence: isPositive ? "positive" : (isNegative ? "negative" : "neutral"),
    affectedAttachments: identifyAttachments(text)
  };
}

function identifyAttachments(text) {
  const keywords = {
    "Health": ["health", "sick", "exercise", "doctor", "hospital"],
    "Career": ["work", "job", "boss", "promotion", "career", "fired"],
    "Relationships": ["partner", "spouse", "friend", "family", "argument"],
    // ... etc
  };

  const affected = [];
  for (let [attachment, words] of Object.entries(keywords)) {
    if (words.some(word => text.toLowerCase().includes(word))) {
      affected.push(attachment);
    }
  }

  return affected.length > 0 ? affected : ["General"];
}
```

---

## User Interface (Text-Based, Super Simple)

### Screen 1: Welcome & Setup
```
===================================
   Welcome to EmotionScope
===================================

EmotionScope helps you understand your emotions
using the Webb Equation of Emotion.

Let's build your {self} map!

[Start Setup Button]
```

### Screen 2: {self} Map Builder
```
Question 1 of 10:

How important is your HEALTH to you?

Not Important  1  2  3  4  5  6  7  8  9  10  Extremely Important
               [===========o========]

[Next]
```

### Screen 3: Daily Check-In
```
===================================
   Daily Check-In
===================================

What happened today that affected you emotionally?

[Text box: "Type what happened..."]

Examples:
- "I had a fight with my partner"
- "I got praised by my boss"
- "I failed my exam"

[Analyze My Emotion]
```

### Screen 4: Emotion Result
```
===================================
   Your Emotion Analysis
===================================

Event: "I got promoted at work"

Affected {self} Item: CAREER (Power: 8/10)

Webb Equation Analysis:
• Your Expectation (EP): 8
• Your Perception (P): +10 (very positive)
• Difference: +2

RESULT: HAPPINESS - Elated Level

Why You Feel This Way:
Your career is very important to you (power 8/10),
and this promotion exceeds your expectations. The
Webb Equation shows EP ∆ P creates positive emotion
when P meets or exceeds EP!

[Log This] [Check Another Event] [View History]
```

### Screen 5: Emotion Log
```
===================================
   Your Emotion History
===================================

Past 7 Days:

Nov 6 | Career        | Elated (Happiness)
Nov 5 | Relationships | Sad (Sadness)
Nov 4 | Goals         | Happy (Happiness)
Nov 3 | Health        | Concerned (Fear)

[View Insights] [New Check-In]
```

### Screen 6: Insights
```
===================================
   Your Emotional Insights
===================================

Top Emotional Triggers:
1. Relationships (40% of entries)
2. Career (30%)
3. Health (15%)

Emotion Patterns:
• You feel strongest emotions about Relationships
  (average power: 9/10)
• Career events create more positive than negative
  emotions (70% positive)
• Health concerns tend to create Fear emotions

Webb Equation Insight:
Your top attachments (Relationships, Career) drive
most of your emotional reactions. Consider: Are
these the right things to be attached to?

[Learn More About MHH] [New Check-In]
```

---

## Step-by-Step Build Guide (For Non-Coders Using AI)

### Step 1: Set Up Project (5 minutes)
**Prompt to AI**:
```
"Create a simple HTML file with a title 'EmotionScope'
and a button that says 'Start'. Use clean, modern styling."
```

### Step 2: Build {self} Map Builder (30 minutes)
**Prompt to AI**:
```
"Create a questionnaire with 10 questions about life priorities.
Each question has a slider from 1-10. Store answers in an
object called selfMap. Show me the HTML and JavaScript code."
```

### Step 3: Create Check-In Interface (20 minutes)
**Prompt to AI**:
```
"Create a text input where users describe events. Add an
'Analyze' button. Show me the HTML and JavaScript."
```

### Step 4: Implement Simple Emotion Calculator (1 hour)
**Prompt to AI**:
```
"Using the Webb Equation EP ∆ P = ER, write a JavaScript
function that:
1. Takes an attachment object {name, power}
2. Takes a boolean isPositive
3. Calculates if emotion is positive or negative
4. Returns emotion name and severity
Show me the code with comments."
```

### Step 5: Add Keyword Matching (30 minutes)
**Prompt to AI**:
```
"Write a function that:
1. Takes user's event text
2. Checks for positive words (promotion, success, etc.)
3. Checks for negative words (fired, failed, etc.)
4. Checks which life area it's about (career, health, etc.)
5. Returns {valence: positive/negative, attachment: string}
Show me the code."
```

### Step 6: Display Results (30 minutes)
**Prompt to AI**:
```
"Create a results screen that shows:
- The emotion name and severity
- Which attachment was affected
- Simple explanation of Webb Equation
Use the emotion data object from previous step."
```

### Step 7: Add Emotion Log (30 minutes)
**Prompt to AI**:
```
"Create a log view that:
1. Shows past emotion entries from LocalStorage
2. Displays date, attachment, emotion
3. Allows clicking to see details
Show me the HTML and JavaScript."
```

### Step 8: Generate Insights (45 minutes)
**Prompt to AI**:
```
"Write a function that:
1. Analyzes emotion log array
2. Finds most common attachment
3. Counts positive vs negative emotions
4. Generates 3 insight sentences
Show me the code."
```

### Step 9: Style It (Optional, 30 minutes)
**Prompt to AI**:
```
"Add CSS to make EmotionScope look clean and modern.
Use a calming color scheme (blues and greens).
Make it mobile-friendly."
```

### Step 10: Test & Debug (1 hour)
- Test all features manually
- Use AI to help fix bugs:
```
"I'm getting this error: [paste error]. Here's my code: [paste code].
How do I fix it?"
```

**TOTAL TIME**: ~6-8 hours spread over 1-2 weeks

---

## Testing Scenarios

### Test Case 1: Positive Career Event
```
Input: "I got a raise at work today!"
Expected: Happiness (Happy or Elated)
Attachment: Career
```

### Test Case 2: Negative Relationship Event
```
Input: "My partner and I had a big fight"
Expected: Sadness (Sad or Hurt) + possibly Anger
Attachment: Relationships
```

### Test Case 3: Health Worry
```
Input: "I have a doctor's appointment next week for test results"
Expected: Fear (Concerned or Worried)
Attachment: Health
```

### Test Case 4: Mixed Emotions
```
Input: "I got a new job offer but have to move away from family"
Expected: Happiness (Career) + Sadness (Relationships)
Multiple Attachments
```

---

## Extensions (If You Want to Go Further)

### Easy Extensions:
1. **Export Data**: Download emotion log as CSV
2. **Dark Mode**: Toggle button for dark theme
3. **More Emotions**: Add Anger and Worry groups
4. **Charts**: Simple bar chart of emotion frequency
5. **Reminders**: Daily check-in notifications

### Medium Extensions:
1. **AI-Powered NLP**: Use OpenAI API for better event analysis
2. **Attachment Associations**: Link related attachments
3. **Emotion Influence**: Suggest actions to rebalance emotions
4. **Multi-User**: Add login/accounts
5. **Mobile App**: Convert to React Native

### Advanced Extensions:
1. **Full Webb Equation**: All 11 emotion groups with precise formulas
2. **Time Factors**: Track past/present/future properly
3. **Theory of Mind**: Model other people's emotions
4. **Integration**: Connect with journal apps, fitness trackers
5. **Therapy Mode**: Generate therapeutic insights

---

## Success Criteria

**MVP is Complete When**:
✅ User can build {self} map (10 attachments)
✅ User can log daily events
✅ System calculates emotion (3 groups minimum)
✅ System shows Webb Equation explanation
✅ User can view emotion history
✅ System generates basic insights

**MVP is Successful When**:
✅ 5 beta testers use it for 1 week
✅ Users report increased emotional awareness
✅ Users understand Webb Equation basics
✅ No major bugs in core features
✅ Average session: 2-5 minutes (quick & easy)

---

## Value Proposition

**For Users**:
- "Understand WHY you feel what you feel"
- "Track emotional patterns over time"
- "Learn the science of emotions"
- "Free, private, easy to use"

**For You (Builder)**:
- Learn MHH framework hands-on
- Build portfolio project
- Practice AI-assisted coding
- Validate concept before scaling

**For Community**:
- Demonstrate MHH accessibility
- Open source contribution
- Mental health tool
- Educational resource

---

## Launch Plan

### Week 1: Build Core
- Days 1-2: Setup + {self} Map Builder
- Days 3-4: Check-In + Calculator
- Days 5-7: Results + Log

### Week 2: Polish & Test
- Days 8-9: Insights + Styling
- Days 10-11: Testing + Bug Fixes
- Days 12-14: Beta Testing

### Week 3: Launch
- Day 15: Deploy to GitHub Pages (free hosting)
- Day 16: Share on Reddit (r/emotionalintelligence, r/mentalhealth)
- Day 17: Share on Twitter/X with #EmotionalAI hashtag
- Day 18+: Collect feedback, iterate

---

## Resources Needed

**Tools** (All Free):
- Text editor (VS Code)
- Web browser (Chrome/Firefox)
- AI coding assistant (ChatGPT free or Claude)
- Git/GitHub (for hosting & version control)

**Knowledge Required**:
- Basic HTML/CSS/JavaScript concepts (AI can teach you)
- Webb Equation understanding (covered in analysis doc)
- Willingness to learn by doing

**Time Commitment**:
- 1-2 hours per day for 1-2 weeks
- Mostly consists of telling AI what you want
- AI writes 80%+ of code, you assemble & test

---

## FAQ for Non-Coders

**Q: I don't know how to code. Can I really build this?**
A: YES! Modern AI (ChatGPT, Claude) can write all the code. You just need to:
1. Describe what you want
2. Copy-paste code AI gives you
3. Test it
4. Ask AI to fix any issues
Think of yourself as the "product manager" and AI as your "engineer team".

**Q: What if I get stuck?**
A: Just ask AI! Example: "I pasted your code but got this error: [error message]. How do I fix it?" AI is incredibly good at debugging its own code.

**Q: Do I need to pay for hosting?**
A: No! GitHub Pages hosts static websites for free. AI can help you deploy there.

**Q: Can I sell this?**
A: MHH is AGPL-3.0 licensed, meaning if you distribute, you must open-source your code and credit Sean Webb. You can use it for free personal/educational projects.

**Q: How do I make it better over time?**
A: Start with MVP (minimum viable product). Get users. Listen to feedback. Add one feature at a time. AI helps with each iteration.

---

## Conclusion

EmotionScope is the perfect beginner project to learn MHH Emotional Intelligence practically. It's simple enough to build in 1-2 weeks with AI assistance, yet powerful enough to provide real value to users. By building this, you'll:

1. ✅ Master Webb Equation fundamentals
2. ✅ Create a portfolio-worthy project
3. ✅ Help people understand their emotions
4. ✅ Prove the concept works
5. ✅ Build foundation for more complex EI systems

**Ready to build? Start with Step 1 and ask your AI assistant to help!**

---

**Next**: See MHH_MEDIUM_PROJECT.md for a more sophisticated implementation with full emotion groups, Theory of Mind, and emotion influence capabilities.
