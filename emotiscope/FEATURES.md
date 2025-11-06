# EmotiScope - Complete Feature Documentation

**Last Updated:** 2025-11-06
**Version:** 1.0
**Status:** Testing Phase

This document provides comprehensive documentation of every feature in EmotiScope, the privacy-first emotional intelligence companion powered by the Webb Equation framework.

---

## Table of Contents

1. [Core Features](#1-core-features)
2. [Webb Equation Engine](#2-webb-equation-engine)
3. [User Interface](#3-user-interface)
4. [Voice & Audio Features](#4-voice--audio-features)
5. [AI Integration](#5-ai-integration)
6. [Data & Privacy](#6-data--privacy)
7. [Skill Tracking System](#7-skill-tracking-system)
8. [License & Monetization](#8-license--monetization)
9. [Progressive Web App](#9-progressive-web-app)
10. [Accessibility](#10-accessibility)
11. [Security Features](#11-security-features)
12. [Settings & Configuration](#12-settings--configuration)

---

## 1. Core Features

### 1.1 Two-Mode System

#### Learn Mode
- **Purpose:** Structured emotional intelligence education
- **Functionality:**
  - AI acts as teacher/coach
  - Socratic questioning to guide discovery
  - Progressive difficulty based on skill level
  - Real-time skill tracking visible
  - Focus on Webb Equation concepts
  - Builds emotional vocabulary systematically

- **User Experience:**
  - "📚 Learn Emotional Intelligence" button
  - Description: "I'll teach you the Webb Equation framework and help you master emotional intelligence through guided conversations"
  - Skill progress panel shows:
    - Overall skill level badge (Novice/Intermediate/Advanced/Mastery)
    - Emotional Vocabulary progress bar (0-100%)
    - Self-Analysis progress bar (0-100%)
    - Webb Equation Understanding progress bar (0-100%)

- **Teaching Approach by Level:**
  - **Novice:** Basics, Socratic questioning, vocabulary building
  - **Intermediate:** {self} maps, patterns, Webb Equation details
  - **Advanced:** Theory of Mind, strategic communication
  - **Mastery:** Peer reflection, challenge thinking

#### Chat Mode
- **Purpose:** Natural conversation with emotional intelligence
- **Functionality:**
  - AI acts as emotionally intelligent conversation partner
  - Applies Webb Equation insights subtly
  - Discusses any topic, not just emotions
  - No skill tracking displayed
  - More relaxed, conversational tone

- **User Experience:**
  - "💬 Open Chat" button
  - Description: "Talk freely about anything. I'll provide emotionally intelligent responses based on the MHH framework"
  - Clean interface without skill progress panel

### 1.2 Emotional Analysis System

#### Real-Time Emotion Detection
- **Keyword-Based Analysis:**
  - Scans user messages for emotional keywords
  - Detects: happiness, sadness, fear, anger, worry, regret, pride, shame, disgust, anticipation
  - Assigns confidence scores (0-1 scale)

- **Emotional Keywords Database:**
  - Happiness: happy, joy, excited, glad, pleased, delighted, great, wonderful, love
  - Sadness: sad, depressed, down, unhappy, miserable, grief, loss, lost
  - Fear: afraid, scared, terrified, frightened, nervous, anxious
  - Anger: angry, mad, furious, rage, annoyed, frustrated, irritated
  - Worry: worried, anxious, concerned, stressed, nervous, uneasy

#### Context Analysis
- **Source Detection:**
  - Internal vs. External attribution
  - External markers: he, she, they, boss, colleague, friend, someone
  - Affects emotion calculations (anger requires external source)

- **Time Factor Detection:**
  - Past: yesterday, last, ago
  - Present: default
  - Future: will, going to, tomorrow
  - Critical for worry vs. fear distinction

#### Emotional Display
- **Visual Badges:**
  - Color-coded by emotion type
  - Shows emotion name + severity level
  - Displays score (0-1 scale with 2 decimal places)
  - Example: "Sadness: Sad (0.42)"

- **Toggle Control:**
  - "Show Emotional Analysis" checkbox in settings
  - Can be disabled for cleaner interface
  - Default: enabled

### 1.3 Conversation Management

#### Message History
- **Persistence:**
  - All messages saved to localStorage
  - Survives browser restarts
  - Stored as JSON array with role, content, timestamp, emotions

- **Display:**
  - User messages: right-aligned, user avatar (👤)
  - Bot messages: left-aligned, brain avatar (🧠)
  - Slide-in animation on new messages
  - Auto-scroll to bottom on new message

- **Conversation Context:**
  - Last 10 messages sent to AI for context
  - Maintains coherent multi-turn conversations
  - Emotional context preserved across messages

#### Message Formatting
- **Markdown Support:**
  - `**bold**` → **bold**
  - `*italic*` → *italic*
  - Newlines → paragraph breaks
  - `• ` → bullet points

- **XSS Protection:**
  - All user input sanitized before display
  - HTML entities escaped
  - Script tags blocked

---

## 2. Webb Equation Engine

### 2.1 Mathematical Framework

#### Webb Equation: EP ∆ P = ER
- **Expectation/Preference (EP):** What you want/expect
- **Perception (P):** What actually happens
- **Emotional Reaction (ER):** The resulting emotion

#### Emotion Calculation Parameters
```javascript
{
  V: Attachment power (0-1) - How much you care
  SC: Source confidence (0-1) - How sure you are
  Acc: Acceptance (0-1) - Have you accepted it?
  W: Weight (0-1) - Importance factor
  P: Perception valence (-10 to +10)
  EP: Expectation (baseline 0)
  T: Time elapsed (affects decay)
  kappa: Scaling constant (3.0)
  k: Decay rate (0.5)
}
```

#### Core Emotion Formulas

**Happiness:** P > EP
```javascript
score = tanh(κ * V * SC * Acc * W * (P - EP) * e^(-kT))
```

**Sadness:** P < EP, High Acceptance
```javascript
score = -tanh(κ * V * SC * Acc * W * (EP - P) * e^(-kT))
```

**Fear:** P < EP, Low Acceptance
```javascript
score = tanh(κ * V * SC * (1-Acc) * W * (EP - P) * e^(-kT))
```

**Anger:** P < EP, Low Acceptance, External Source
```javascript
score = tanh(κ * V * SC * (1-Acc) * W * (EP - P) * e^(-kT))
```

**Worry:** Future-oriented, P < EP
```javascript
score = tanh(κ * V * SC * (1-Acc) * W * (EP - P) * e^(-k(T+1)))
```

### 2.2 Eleven Emotion Groups

| Emotion | Color | Severity Levels |
|---------|-------|----------------|
| Happiness | Green (#10b981) | Content → Pleased → Happy → Joyful → Ecstatic |
| Sadness | Purple (#6366f1) | Wistful → Downhearted → Sad → Sorrowful → Grief |
| Fear | Orange (#f59e0b) | Nervous → Scared → Afraid → Fearful → Terror |
| Anger | Red (#ef4444) | Annoyed → Frustrated → Angry → Furious → Rage |
| Worry | Orange (#f59e0b) | Concerned → Worried → Anxious → Distressed → Panicked |
| Regret | Purple (#8b5cf6) | [5 levels] |
| Pride | Green (#10b981) | [5 levels] |
| Shame | Red (#ef4444) | [5 levels] |
| Disgust | Lime (#84cc16) | [5 levels] |
| Positive Anticipation | Cyan (#06b6d4) | [5 levels] |
| Negative Anticipation | Orange (#f97316) | [5 levels] |

### 2.3 Severity Mapping

Score ranges map to severity levels:
- 0.0 - 0.2: Level 1 (e.g., "Content")
- 0.2 - 0.4: Level 2 (e.g., "Pleased")
- 0.4 - 0.6: Level 3 (e.g., "Happy")
- 0.6 - 0.8: Level 4 (e.g., "Joyful")
- 0.8 - 1.0: Level 5 (e.g., "Ecstatic")

### 2.4 Explanation Generation

Each detected emotion includes a Webb Equation explanation:

**Example - Happiness:**
> "This is **Happiness** because your perception (what happened) exceeded your expectations. According to the Webb Equation: EP (0) < P (5), creating positive emotion."

**Example - Sadness:**
> "This is **Sadness** because there's a loss or unmet expectation that you've accepted. Webb Equation: EP (0) > P (-5) with high acceptance (0.6)."

---

## 3. User Interface

### 3.1 Layout & Design

#### Color System
```css
Primary Purple: #6366f1 (Indigo)
Primary Dark: #4f46e5
Primary Light: #818cf8
Secondary Pink: #ec4899
Success Green: #10b981
Danger Red: #ef4444
Warning Orange: #f59e0b
```

#### Responsive Container
- Max width: 900px
- Centered on screen
- Full-height on mobile
- Box shadow for depth
- White background

### 3.2 Header

#### Components
- **Left Side:**
  - Brain emoji (🧠)
  - "EmotiScope" title
  - Tagline: "Your Private AI Companion for Emotional Growth"

- **Right Side:**
  - Settings button (⚙️)
  - License badge (Free/Premium/Pro)
  - Message counter (for free tier)

#### License Badge Display
- **Free Tier:**
  - Shows "Free" with message count
  - Example: "Free • 15/20 messages left"
  - Warning animation at 80% usage (16/20)

- **Premium Tier:**
  - Shows "Premium • ✓ Unlimited"
  - Purple gradient background

- **Pro Tier:**
  - Shows "Pro • ✓ Unlimited"
  - Darker purple gradient

### 3.3 Mode Selector

#### Visual Design
- Two equal-width buttons
- Active state: filled with primary gradient
- Inactive state: white with border
- Hover state: border color change to primary
- Smooth transitions (0.2s)

#### Accessibility
- `role="tablist"` for screen readers
- `aria-selected` states
- `aria-controls` linking to descriptions
- Keyboard navigation support

### 3.4 Chat Interface

#### Message Display Area
- Scrollable container
- Auto-scroll to bottom on new message
- Minimum height ensures visibility
- Loading states during AI response

#### Message Components

**User Messages:**
- Avatar: 👤
- Alignment: Right side
- Background: Light purple (#f3e8ff)
- Border radius: 1rem (left-side pointed)

**Bot Messages:**
- Avatar: 🧠
- Alignment: Left side
- Background: White
- Border: 1px solid border color
- Includes audio button (🔊) when TTS enabled
- Shows emotional analysis badges (if enabled)

#### Typing Indicator
- Three animated dots
- Appears while waiting for AI response
- Smooth pulse animation
- Same styling as bot message

### 3.5 Input Area

#### Text Input
- Auto-expanding textarea
- Starts at 1 row, grows with content
- Placeholder: "Type your message here..."
- Enter to send, Shift+Enter for new line
- Maximum 5000 characters

#### Control Buttons

**Microphone Button (🎤):**
- Left of input field
- Hover effect: scale up
- Listening state: changes to 🎙️ with animation
- Disabled during message sending
- Hidden if browser doesn't support speech recognition

**Send Button:**
- Right of input field
- Paper airplane SVG icon
- Gradient background
- Loading state during API call
- Disabled when input empty or during send

### 3.6 Modal Dialogs

#### Settings Modal
- Overlay with backdrop blur
- Centered on screen
- Close button (×) top-right
- Click outside to close
- Escape key to close

#### Upgrade Modal
- Triggered when free tier limit reached
- Three-column pricing comparison
- Call-to-action buttons
- Link to pricing page
- "Already have a license?" link

---

## 4. Voice & Audio Features

### 4.1 Voice Input (Speech Recognition)

#### Browser Support
- Chrome/Edge: Full support (Web Speech API)
- Firefox: Limited support
- Safari: Partial support
- Fallback: Microphone button hidden if unsupported

#### Functionality
- **Activation:** Click microphone button (🎤)
- **Visual Feedback:**
  - Button changes to 🎙️
  - "Listening..." animation
  - Interim results shown in placeholder

- **Processing:**
  - Continuous mode: OFF (stops after sentence)
  - Interim results: ON (shows partial transcription)
  - Language: Configurable (default: en-US)

- **Auto-Send:**
  - Final transcript auto-fills input
  - 500ms delay before auto-send
  - User can edit before sending

#### Error Handling
- **No speech detected:** Warning notification
- **Microphone not found:** Error notification
- **Permission denied:** Instructions to enable in browser
- **Other errors:** Generic error message

### 4.2 Text-to-Speech (TTS)

#### Voice Selection
- Dropdown in settings
- Lists all system voices
- Shows voice name and language
- Example: "Google US English (en-US)"
- Selection saved to localStorage

#### Audio Controls
- **Activation:** Click 🔊 button on bot messages
- **Configuration:**
  - Rate: 0.9 (slightly slower than default)
  - Pitch: 1.0 (default)
  - Volume: 1.0 (maximum)

- **Visual Feedback:**
  - Button shows "playing" state
  - Click again to stop

#### Enable/Disable
- Toggle in settings: "Enable Text-to-Speech"
- Default: ON
- When OFF, audio buttons still appear but do nothing
- Setting persists across sessions

---

## 5. AI Integration

### 5.1 Supported Providers

#### OpenAI
- **Model:** GPT-4
- **Endpoint:** `https://api.openai.com/v1/chat/completions`
- **Authentication:** Bearer token
- **API Key Format:** `sk-...`
- **Temperature:** 0.7 (balanced creativity)
- **Max Tokens:** 800 (concise responses)
- **Context Window:** Last 10 messages

#### Anthropic
- **Model:** Claude 3.5 Sonnet (20241022)
- **Endpoint:** `https://api.anthropic.com/v1/messages`
- **Authentication:** x-api-key header
- **API Key Format:** Custom
- **Max Tokens:** 1024
- **API Version:** 2023-06-01
- **Context Window:** Last 10 messages

#### Local AI (Coming Soon)
- Browser-based inference
- No API key required
- WebGPU acceleration planned
- Currently shows "coming soon" message

### 5.2 Request Flow

1. **User Input:** Message submitted
2. **Validation:** Input sanitized and validated
3. **License Check:** Verify message quota
4. **Rate Limit:** 1 second minimum between requests
5. **Emotion Analysis:** MHH engine processes text
6. **Context Building:** Last 10 messages + system prompt
7. **API Call:** Send to selected provider
8. **Timeout:** 30-second maximum wait
9. **Response Processing:** Parse and display
10. **State Update:** Save to history, increment counter

### 5.3 System Prompts

#### Base Prompt (Both Modes)
```
You are an emotionally intelligent AI assistant powered by
the Mind Hacking Happiness (MHH) Webb Equation framework.
You understand emotions mathematically and can help people
develop emotional intelligence.

The Webb Equation: EP ∆ P = ER (Expectation/Preference
compared to Perception generates Emotional Reaction)

Core principles:
- All emotions follow mathematical rules based on
  attachments ({self} map items)
- You can predict, explain, and help people process emotions
- Be warm, empathetic, and educational

Privacy: All conversations stay local on the user's device.
No tracking.
```

#### Learn Mode Addition
```
MODE: Teaching Emotional Intelligence

Your role: Teacher and coach for emotional intelligence.

Based on user skill level (novice/intermediate/advanced/mastery):
- Novice: Teach basics, use Socratic questioning, build vocabulary
- Intermediate: Teach {self} maps, patterns, Webb Equation details
- Advanced: Teach Theory of Mind, strategic communication
- Mastery: Be a peer reflector, challenge thinking

Always:
1. Guide discovery, don't just tell answers
2. Teach Webb Equation concepts as you go
3. Build their emotional vocabulary
4. Celebrate growth and insights
5. Gradually reduce assistance as they improve
```

#### Chat Mode Addition
```
MODE: Open Conversation

Your role: Emotionally intelligent conversation partner.

- Respond naturally to any topic
- Apply Webb Equation insights when relevant
  (but don't over-explain)
- Show deep empathy based on emotional analysis
- Be helpful, supportive, and authentic
- You can discuss any topic, not just emotions
```

### 5.4 Error Handling

#### HTTP Status Codes
- **401 Unauthorized:** "Invalid API key. Please check your [Provider] API key in Settings."
- **429 Too Many Requests:** "Rate limit exceeded. Please wait a moment and try again."
- **500+ Server Errors:** "[Provider] service is temporarily unavailable. Please try again later."
- **Network Timeout:** "Request timed out. Please check your internet connection and try again."

#### User Feedback
- Error messages display in chat as bot messages
- Prefix with ❌ emoji
- Actionable instructions provided
- Non-technical language

---

## 6. Data & Privacy

### 6.1 Local Storage Architecture

#### Stored Data Keys
```javascript
{
  "mhh_api_provider": "openai" | "anthropic" | "local",
  "mhh_api_key": "sk-...",
  "mhh_mode": "learn" | "chat",
  "mhh_conversation_history": [{
    role: "user" | "assistant",
    content: "...",
    timestamp: "ISO 8601",
    emotions: [...]
  }],
  "mhh_skill_level": "novice" | "intermediate" | "advanced" | "mastery",
  "mhh_skill_scores": {
    vocabulary: 0-100,
    analysis: 0-100,
    webb: 0-100
  },
  "mhh_settings": {
    ttsEnabled: boolean,
    showEmotionalAnalysis: boolean,
    voice: number | null,
    voiceInputEnabled: boolean,
    voiceInputLanguage: "en-US"
  },
  "emotiscope_license": {
    tier: "free" | "premium" | "pro",
    key: "TIER-XXXX-XXXX-XXXX" | null,
    validUntil: ISO 8601 | null
  },
  "emotiscope_message_count": {
    count: number,
    monthStart: ISO 8601
  }
}
```

### 6.2 Privacy Guarantees

#### What We DON'T Collect
- ❌ No user accounts
- ❌ No email addresses
- ❌ No conversation logs sent to servers
- ❌ No analytics or tracking
- ❌ No cookies (except localStorage)
- ❌ No IP logging
- ❌ No session recording

#### What Stays Local
- ✅ All conversations
- ✅ API keys (never transmitted except to AI providers)
- ✅ Skill progress
- ✅ Settings and preferences
- ✅ License information
- ✅ Message counts

#### Third-Party Data Sharing
- **AI Providers (OpenAI/Anthropic):**
  - Only message content sent
  - Subject to their privacy policies
  - User's own API key used (direct relationship)

- **Payment Processors (Gumroad/Stripe):**
  - Only during purchase
  - Email address for license delivery
  - Standard payment information

### 6.3 Data Export/Delete

#### Clear All Data
- Button in settings: "🗑️ Clear All Local Data"
- Confirmation dialog required
- Deletes all localStorage entries
- Page reload after deletion
- **Warning:** Cannot be undone

#### Manual Export (Future Feature)
- Export conversation history as JSON
- Export skill progress as CSV
- Available in Premium/Pro tiers

---

## 7. Skill Tracking System

### 7.1 Skill Levels

#### Level Progression
```
Novice (0-24 average score)
  ↓
Intermediate (25-49 average score)
  ↓
Advanced (50-74 average score)
  ↓
Mastery (75-100 average score)
```

#### Average Calculation
```javascript
avgScore = (vocabulary + analysis + webb) / 3
```

### 7.2 Skill Categories

#### Emotional Vocabulary (0-100)
- **Tracks:** Use of emotion words in messages
- **Keywords:** angry, sad, happy, fear, worry, shame, pride, grief
- **Increment:** +2 points per use
- **Purpose:** Measures ability to name emotions precisely

#### Self-Analysis (0-100)
- **Tracks:** Reflective language patterns
- **Keywords:** "because", "I think", "I feel"
- **Increment:** +2 points per use
- **Purpose:** Measures introspection ability

#### Webb Equation Understanding (0-100)
- **Tracks:** Use of framework terminology
- **Keywords:** expectation, perception, attachment, webb equation, self map
- **Increment:** +3 points per use
- **Purpose:** Measures theoretical knowledge

### 7.3 Visual Progress Display

#### Overall Level Badge
- Position: Top-right of skill progress panel
- Styling: Purple pill with white text
- Uppercase text
- Updates in real-time

#### Progress Bars
- Height: 8px
- Background: Light gray
- Fill: Purple gradient (left to right)
- Smooth animation on update (0.3s ease)
- Percentage-based width

### 7.4 Teaching Adaptation

AI responses adapt based on skill level:

**Novice (0-24):**
- Simple language
- Define all terms
- Socratic questioning
- Lots of encouragement
- Focus on basics

**Intermediate (25-49):**
- Introduce {self} maps
- Explain Webb Equation in detail
- Pattern recognition exercises
- More complex scenarios

**Advanced (50-74):**
- Theory of Mind concepts
- Strategic emotional communication
- Apply framework to others
- Challenge assumptions

**Mastery (75-100):**
- Peer-level discussions
- Nuanced edge cases
- Meta-analysis of emotions
- Philosophical questions

---

## 8. License & Monetization

### 8.1 Tier System

#### Free Tier
- **Price:** $0
- **Messages:** 20 per month
- **Features:**
  - ✅ Learn Mode
  - ✅ Chat Mode
  - ✅ Webb Equation education
  - ✅ Basic emotional analytics
  - ✅ 100% private & local storage
  - ❌ History export
  - ❌ Advanced analytics
  - ❌ White-label

#### Premium Tier
- **Price:** $9.99/month (or $79/year - save 34%)
- **Messages:** Unlimited
- **Features:**
  - ✅ Everything in Free
  - ✅ Unlimited AI messages
  - ✅ Advanced emotional analytics
  - ✅ Conversation history export
  - ✅ {self} map visualization
  - ✅ Priority feature access

#### Pro Tier
- **Price:** $19.99/month (or $149/year - save 38%)
- **Messages:** Unlimited
- **Target:** Therapists, coaches, professionals
- **Features:**
  - ✅ Everything in Premium
  - ✅ White-label branding
  - ✅ Client progress tracking
  - ✅ Custom emotion templates
  - ✅ API access
  - ✅ Priority support
  - ✅ Commercial usage rights
  - ✅ Quarterly strategy calls

### 8.2 License Key System

#### Key Format
```
TIER-XXXX-XXXX-XXXX

Examples:
PREMIUM-A7G3-K9M2-P4R8
PRO-B2H5-L3N7-Q6S9
```

#### Character Set
- Uppercase letters: A-Z (excluding O, I)
- Numbers: 2-9 (excluding 0, 1)
- 33 possible characters per position
- Each segment: 4 characters
- Total entropy: ~40 bits per key

#### Validation (Client-Side)
```javascript
validateLicenseKey(key) {
  1. Check format: XXX-XXXX-XXXX-XXXX
  2. Verify tier prefix: PREMIUM or PRO
  3. Return tier and validity

  Note: Currently no server verification (security issue)
}
```

#### Activation Flow
1. User enters key in modal
2. Client validates format
3. Tier extracted from prefix
4. License stored in localStorage
5. UI updates to show new tier
6. Success notification displayed

### 8.3 Message Counting

#### Monthly Reset Logic
```javascript
resetCountIfNewMonth() {
  currentMonth = now.getMonth()
  savedMonth = monthStart.getMonth()

  if (currentMonth !== savedMonth OR year changed) {
    messageCount = 0
    monthStart = now
    save()
  }
}
```

#### Usage Tracking
- Increments after AI response received
- Saved to localStorage immediately
- Checked before sending message
- Warning at 80% usage (16/20 messages)
- Blocked at 100% usage (20/20 messages)

#### Upgrade Flow
1. User hits limit
2. Upgrade modal displays
3. Shows pricing comparison
4. Links to pricing page
5. "Already have a license?" option
6. After purchase, enter license key
7. Unlimited access granted

### 8.4 Payment Integration

#### Gumroad (Production)
- Overlay checkout experience
- 10% transaction fee
- Automatic email delivery
- License key in success URL
- Webhook for automation

#### Stripe (Alternative)
- Custom checkout flow
- 2.9% + $0.30 per transaction
- More control over UX
- Subscription management
- Webhook integration ready

#### Test Mode
- Activated on localhost or `?test=true`
- Demo buttons replace payment buttons
- Test keys: `PREMIUM-DEMO-TEST-KEY`, `PRO-DEMO-TEST-KEY`
- Full feature access for testing

---

## 9. Progressive Web App

### 9.1 Manifest Configuration

#### App Identity
```json
{
  "name": "EmotiScope - Emotional Intelligence Companion",
  "short_name": "EmotiScope",
  "description": "Understand your emotions scientifically with the Webb Equation"
}
```

#### Display Settings
- **Display Mode:** Standalone (full-screen app)
- **Orientation:** Portrait primary
- **Start URL:** /app.html
- **Background Color:** #ffffff (white)
- **Theme Color:** #6366f1 (indigo)

#### Icons
8 sizes provided for all devices:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512
- Purpose: "any maskable" (adaptive icons)

#### App Shortcuts
Desktop/mobile home screen quick actions:
1. **Learn Mode:** Jump directly to learning session
2. **Chat Mode:** Jump directly to open chat

### 9.2 Service Worker

#### Caching Strategy
- Cache-first for static assets
- Network-first for API calls
- Offline fallback page
- Version-based cache invalidation

#### Offline Functionality
- App shell loads offline
- Previous conversations accessible
- Settings remain available
- New messages require internet
- Graceful offline detection

### 9.3 Installation

#### Browser Prompts
- Automatic install banner (Chrome/Edge)
- Manual install option (all browsers)
- Add to Home Screen on iOS
- Desktop installation on Windows/Mac/Linux

#### Install Criteria
- HTTPS required (or localhost)
- Valid manifest.json
- Service worker registered
- Sufficient icons provided

---

## 10. Accessibility

### 10.1 ARIA Labels

#### Semantic HTML
- `<header>`, `<main>`, `<nav>` landmarks
- `role="tablist"` for mode selector
- `role="tab"` for mode buttons
- `role="log"` for message area
- `role="dialog"` for modals

#### Screen Reader Announcements
- `aria-live="polite"` for new messages
- `aria-atomic="false"` for incremental updates
- `aria-selected` for active mode
- `aria-controls` for tab relationships
- `aria-modal="true"` for dialogs

#### Labels
- `aria-label` on icon buttons
- `aria-labelledby` for modal titles
- Hidden labels for inputs
- Descriptive button text

### 10.2 Keyboard Navigation

#### Focus Management
- Visible focus indicators (3px blue outline)
- Logical tab order
- Focus trap in modals
- Escape key closes modals
- Enter key sends messages

#### Shortcuts
- Tab: Next focusable element
- Shift+Tab: Previous element
- Enter: Send message (in textarea)
- Shift+Enter: New line (in textarea)
- Escape: Close modal

### 10.3 Visual Accessibility

#### Color Contrast
- Text on white: 4.5:1 minimum
- Text on primary: 7:1 (AAA level)
- Border contrast: 3:1 minimum
- Link contrast: Clear differentiation

#### Font Sizing
- Base: 16px (browser default)
- Scalable with browser zoom
- Relative units (rem, em)
- No text in images

#### Visual Indicators
- Color + icon (not color alone)
- Loading states visible
- Error states clear
- Success confirmation

---

## 11. Security Features

### 11.1 Content Security Policy

#### Current Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
connect-src 'self' https://api.openai.com https://api.anthropic.com;
img-src 'self' data: https:;
font-src 'self' data:;
```

#### Issues (from Code Review)
- `unsafe-inline` for scripts weakens CSP
- Should use nonces or hashes
- Payment CSP includes Stripe/Gumroad domains

### 11.2 Input Validation

#### Sanitization
```javascript
sanitizeHTML(text) {
  // Creates div element
  // Sets textContent (auto-escapes)
  // Returns escaped HTML
}
```

#### Validation Rules
- Max length: 5000 characters
- No empty messages
- Must be string type
- Blocks suspicious patterns:
  - `<script` tags
  - `javascript:` protocol
  - `onerror=` handlers
  - `onclick=` handlers

### 11.3 Rate Limiting

#### Client-Side Throttling
- Minimum interval: 1000ms (1 second)
- Enforced before API calls
- User notified of wait time
- Prevents accidental spam

#### Purpose
- Protects AI provider rate limits
- Prevents UI flooding
- Reduces API costs
- Improves UX (prevents errors)

### 11.4 API Key Storage

#### Current Implementation
- Stored in localStorage (plain text)
- Never sent to EmotiScope servers
- Only sent to chosen AI provider
- User brings own key (BYOK model)

#### Security Issues (from Code Review)
- Plain text storage vulnerable to XSS
- Should use Web Crypto API encryption
- Consider secure enclave on supported devices

---

## 12. Settings & Configuration

### 12.1 Settings Modal

#### AI Provider Selection
- Dropdown: OpenAI | Anthropic | Local AI
- Saved on change
- Updates API key label
- Disables key field for Local AI

#### API Key Input
- Type: password (hidden characters)
- Placeholder: "sk-..."
- Saved to localStorage on modal close
- Help text: "🔒 Stored locally on your device only"

#### Feature Toggles
- **Enable Text-to-Speech** (checkbox, default: ON)
- **Show Emotional Analysis** (checkbox, default: ON)
- **Enable Voice Input** (checkbox, default: ON)

#### Voice Selection
- Dropdown populated from system voices
- Shows: "Voice Name (language-code)"
- Example: "Google US English (en-US)"
- Saved on change

### 12.2 Privacy Notice

Displayed prominently in settings:
```
🔐 Privacy Guarantee
✓ All data stored locally on your device
✓ No account or login required
✓ No tracking or analytics
✓ API key never leaves your device
✓ Conversations stay private
```

### 12.3 Data Management

#### Clear All Data Button
- Red "danger" styling
- Confirmation dialog
- Irreversible action
- Deletes all localStorage
- Forces page reload

#### Future Features (Premium/Pro)
- Export conversation history
- Export skill progress
- Import previous sessions
- Backup to cloud (optional)

---

## Feature Testing Checklist

### Core Functionality
- [ ] Switch between Learn and Chat modes
- [ ] Send messages in both modes
- [ ] Receive AI responses
- [ ] View emotional analysis
- [ ] See typing indicators

### Voice Features
- [ ] Click microphone to start listening
- [ ] Speak and see transcription
- [ ] Auto-send after speech
- [ ] Click audio button to hear responses
- [ ] Change TTS voice in settings

### Skill Tracking
- [ ] Use emotion words and see vocabulary increase
- [ ] Use reflective language and see analysis increase
- [ ] Use Webb terms and see webb score increase
- [ ] Watch overall level change with progress

### License System
- [ ] Reach 20 message limit on free tier
- [ ] See upgrade modal
- [ ] Enter premium license key
- [ ] Verify unlimited messages
- [ ] Check badge updates to Premium

### Data Persistence
- [ ] Send messages and reload page
- [ ] Verify conversation history preserved
- [ ] Check settings saved across sessions
- [ ] Confirm skill progress persists

### UI/UX
- [ ] Test responsive design on mobile
- [ ] Verify all buttons clickable
- [ ] Check modals open and close
- [ ] Test keyboard navigation
- [ ] Verify color contrast

### Error Handling
- [ ] Try sending without API key
- [ ] Enter invalid API key
- [ ] Test with no internet connection
- [ ] Send empty message
- [ ] Send extremely long message

### PWA Features
- [ ] Install as app
- [ ] Use offline (should show cached UI)
- [ ] Add to home screen (mobile)
- [ ] Test app shortcuts

---

## Technical Specifications

### Browser Requirements
- **Chrome/Edge:** Full support (recommended)
- **Firefox:** Full support (no voice input)
- **Safari:** Partial support (limited voice features)
- **Mobile:** iOS 14+, Android 8+

### Performance
- **First Load:** < 3 seconds
- **Subsequent Loads:** < 1 second (cached)
- **Message Send:** < 2 seconds (network dependent)
- **AI Response:** 5-15 seconds (API dependent)

### Storage Limits
- **localStorage:** 5-10 MB typical browser limit
- **Conversation History:** Unlimited (until storage full)
- **Images:** Not supported
- **File Attachments:** Not supported

### Dependencies
- **Zero** external JavaScript libraries
- **Zero** CSS frameworks
- **Zero** build tools required
- Pure vanilla HTML/CSS/JavaScript

---

## Known Limitations

### Current Limitations
1. Client-side license validation (bypassable)
2. Plain text API key storage
3. No server-side persistence
4. No multi-device sync
5. No conversation search
6. No image analysis
7. Limited to text conversations
8. Browser storage size limits

### Planned Improvements
1. Server-side license verification
2. Encrypted API key storage
3. Optional cloud backup
4. Multi-device sync (opt-in)
5. Advanced search functionality
6. Image emotion analysis
7. Voice-only mode
8. Unlimited cloud storage (Pro)

---

## Version History

### v1.0 (Current)
- Initial public release
- Two-mode system (Learn/Chat)
- Webb Equation engine
- Voice input/output
- Freemium licensing
- PWA support
- Accessibility features

---

**End of Feature Documentation**

For bug reports or feature requests, please contact support or file an issue in the GitHub repository.
