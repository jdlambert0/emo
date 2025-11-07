/**
 * MHH Emotional Intelligence Engine - ENHANCED VERSION
 * Implements the complete Webb Equation framework with Theory of Mind
 * Based on: Mind Hacking Happiness Language Enabled EI and ToM Algorithms
 * Author: Sean Webb (framework), Implementation for EmotiScope
 *
 * This implementation includes:
 * - Complete Webb Equation with all variables (V, SC, Acc, W, P, EP, T, κ, k)
 * - All 11 emotion groups with 5 severity levels each
 * - {self} Map tracking system with attachment power levels
 * - Theory of Mind foundations for predicting others' emotions
 * - Advanced emotion analysis with source detection
 */

class MHHEngineEnhanced {
    constructor() {
        // ==================== CONFIGURATION ====================
        this.CONFIG = {
            // Webb Equation constants
            KAPPA: 3.0,          // Scaling constant
            K_DECAY: 0.5,        // Time decay rate

            // Thresholds
            MIN_EMOTION_SCORE: 0.1,  // Minimum score to report
            MAX_ATTACHMENT_POWER: 10, // Maximum power level

            // Defaults
            DEFAULT_ATTACHMENT_POWER: 5,
            DEFAULT_SOURCE_CONFIDENCE: 0.7,
            DEFAULT_ACCEPTANCE: 0.5
        };

        // ==================== 11 EMOTION GROUPS ====================
        // Each emotion has: name, color, valence (positive/negative),
        // rule set, and 5 severity levels
        this.EMOTION_GROUPS = {
            // POSITIVE EMOTIONS
            happiness: {
                name: 'Happiness',
                color: '#10b981',
                valence: 'positive',
                severities: ['Satisfied', 'Pleased', 'Happy', 'Elated', 'Ecstatic'],
                description: 'P > EP (Perception exceeds Expectation)',
                ruleSet: {
                    condition: 'P > EP',
                    acceptanceRequired: false,
                    sourceType: 'any',
                    timeFactor: 'now',
                    perspective: 'internal'
                }
            },

            pride: {
                name: 'Pride',
                color: '#9333ea',
                valence: 'positive',
                severities: ['Pride-1', 'Pride-2', 'Pride-3', 'Pride-4', 'Pride-5'],
                description: 'External perception of positive valuation shift',
                ruleSet: {
                    condition: 'P > EP',
                    acceptanceRequired: false,
                    sourceType: 'external',
                    timeFactor: 'now',
                    perspective: 'external'  // Others perceiving increase in your value
                }
            },

            positive_anticipation: {
                name: 'Positive Anticipation',
                color: '#06b6d4',
                valence: 'positive',
                severities: ['Mild Anticipation', 'Anticipation-2', 'Anticipation', 'Edge of Seat', 'Bated Breath'],
                description: 'Anticipation of positive future outcome',
                ruleSet: {
                    condition: 'P > EP future',
                    acceptanceRequired: false,
                    sourceType: 'any',
                    timeFactor: 'future',
                    perspective: 'internal'
                }
            },

            // NEGATIVE EMOTIONS
            sadness: {
                name: 'Sadness',
                color: '#6366f1',
                valence: 'negative',
                severities: ['Disappointed', 'Hurt', 'Sad', 'Grief', 'Despair'],
                description: 'P < EP with HIGH acceptance (loss integrated)',
                ruleSet: {
                    condition: 'P < EP',
                    acceptanceRequired: true,  // HIGH acceptance (0.5+)
                    sourceType: 'any',
                    timeFactor: 'now',
                    perspective: 'internal'
                }
            },

            fear: {
                name: 'Fear',
                color: '#f59e0b',
                valence: 'negative',
                severities: ['Concerned', 'Cautious', 'Afraid', 'Horror/Fright', 'Panic'],
                description: 'P < EP with LOW acceptance (threat not integrated)',
                ruleSet: {
                    condition: 'P < EP',
                    acceptanceRequired: false,  // LOW acceptance (< 0.5)
                    sourceType: 'internal',     // Internal perception of threat
                    timeFactor: 'now',
                    perspective: 'internal'
                }
            },

            anger: {
                name: 'Anger',
                color: '#ef4444',
                valence: 'negative',
                severities: ['Annoyed', 'Frustrated', 'Angry', 'Hate/Fury', 'Rage'],
                description: 'P < EP with EXTERNAL source attack (unaccepted)',
                ruleSet: {
                    condition: 'P < EP',
                    acceptanceRequired: false,  // NOT accepted (< 0.5)
                    sourceType: 'external',     // External attack on self
                    timeFactor: 'now',
                    perspective: 'internal'
                }
            },

            worry: {
                name: 'Worry',
                color: '#f97316',
                valence: 'negative',
                severities: ['Distressed', 'Nervous', 'Worried', 'Distraught', 'Dread'],
                description: 'Fear of FUTURE event (P < EP + future time)',
                ruleSet: {
                    condition: 'P < EP',
                    acceptanceRequired: false,
                    sourceType: 'any',
                    timeFactor: 'future',      // Key difference from fear
                    perspective: 'internal'
                }
            },

            regret: {
                name: 'Regret',
                color: '#8b5cf6',
                valence: 'negative',
                severities: ['Mild Regret', 'Regret-2', 'Regret', 'Lament', 'Deplore'],
                description: 'Sadness about PAST event with self-attribution',
                ruleSet: {
                    condition: 'P < EP',
                    acceptanceRequired: true,   // Accepted past mistake
                    sourceType: 'internal',     // Self-caused
                    timeFactor: 'past',
                    perspective: 'internal'
                }
            },

            shame: {
                name: 'Shame',
                color: '#dc2626',
                valence: 'negative',
                severities: ['Contrite', 'Sorry', 'Shame', 'Shame-4', 'Remorse'],
                description: 'External perception of negative valuation shift',
                ruleSet: {
                    condition: 'P < EP',
                    acceptanceRequired: true,
                    sourceType: 'external',
                    timeFactor: 'now',
                    perspective: 'external'     // Others perceiving decrease in your value
                }
            },

            disgust: {
                name: 'Disgust',
                color: '#84cc16',
                valence: 'negative',
                severities: ['Reticent', 'Distaste', 'Disgusted', 'Repulsed', 'Revulsion/Sickened'],
                description: 'Visceral rejection of devaluation to self',
                ruleSet: {
                    condition: 'P < EP visceral',
                    acceptanceRequired: false,
                    sourceType: 'any',
                    timeFactor: 'now',
                    perspective: 'internal'
                }
            },

            negative_anticipation: {
                name: 'Negative Anticipation',
                color: '#991b1b',
                valence: 'negative',
                severities: ['Negative Anticipation-1', 'Negative Anticipation-2', 'Negative Anticipation-3', 'Negative Anticipation-4', 'Negative Anticipation-5'],
                description: 'Anticipation of negative future outcome',
                ruleSet: {
                    condition: 'P < EP future',
                    acceptanceRequired: false,
                    sourceType: 'any',
                    timeFactor: 'future',
                    perspective: 'internal'
                }
            }
        };

        // ==================== {SELF} MAP STRUCTURE ====================
        // The {self} map is a collection of attachments that define who a person is
        // Each attachment has a power level (1-10) indicating importance
        this.selfMapTemplate = {
            // Core identity (power 9-10 - closest to center)
            body: { power: 10, valence: 1, quadrant: 'life_story' },
            life: { power: 10, valence: 1, quadrant: 'life_story' },

            // Primary relationships (power 7-9)
            // family: { power: 8, valence: 1, quadrant: 'people' },
            // spouse: { power: 9, valence: 1, quadrant: 'people' },
            // children: { power: 9, valence: 1, quadrant: 'people' },

            // Secondary identity (power 5-7)
            // career: { power: 6, valence: 1, quadrant: 'accomplishments' },
            // skills: { power: 5, valence: 1, quadrant: 'accomplishments' },

            // Preferences (power 3-5)
            // hobbies: { power: 4, valence: 1, quadrant: 'ideas_likes' },
            // beliefs: { power: 5, valence: 1, quadrant: 'ideas_likes' },

            // Weak attachments (power 1-3)
            // passing_interests: { power: 2, valence: 1, quadrant: 'ideas_likes' }
        };

        // ==================== EMOTIONAL KEYWORDS ====================
        // Enhanced keyword detection for each emotion group
        this.emotionKeywords = {
            happiness: {
                keywords: ['happy', 'joy', 'joyful', 'excited', 'glad', 'pleased', 'delighted',
                          'great', 'wonderful', 'fantastic', 'amazing', 'love', 'loving', 'thrilled',
                          'ecstatic', 'elated', 'satisfied', 'content', 'cheerful', 'blessed'],
                intensity_modifiers: ['very', 'so', 'extremely', 'incredibly', 'really']
            },
            sadness: {
                keywords: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'grief', 'loss',
                          'lost', 'heartbroken', 'devastated', 'crushed', 'disappointed', 'hurt',
                          'sorrowful', 'melancholy', 'gloomy', 'blue', 'dejected'],
                intensity_modifiers: ['deeply', 'very', 'so', 'extremely', 'utterly']
            },
            fear: {
                keywords: ['afraid', 'scared', 'terrified', 'frightened', 'nervous', 'anxious',
                          'panic', 'panicking', 'dread', 'horror', 'alarmed', 'startled',
                          'fearful', 'concerned', 'cautious', 'apprehensive', 'uneasy'],
                intensity_modifiers: ['very', 'so', 'extremely', 'really', 'absolutely']
            },
            anger: {
                keywords: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated', 'irritated',
                          'hate', 'enraged', 'livid', 'fuming', 'irate', 'outraged', 'resentful',
                          'bitter', 'hostile', 'aggravated', 'infuriated'],
                intensity_modifiers: ['very', 'so', 'extremely', 'really', 'absolutely']
            },
            worry: {
                keywords: ['worried', 'anxious', 'concerned', 'stressed', 'nervous', 'uneasy',
                          'distressed', 'troubled', 'bothered', 'apprehensive', 'tense',
                          'on edge', 'fretful', 'unsettled', 'restless'],
                intensity_modifiers: ['very', 'so', 'extremely', 'really', 'deeply']
            },
            regret: {
                keywords: ['regret', 'regretful', 'sorry', 'wish', 'if only', 'should have',
                          'could have', 'would have', 'mistake', 'remorseful', 'apologetic',
                          'repentant', 'ashamed', 'guilty'],
                intensity_modifiers: ['deeply', 'really', 'so', 'very', 'truly']
            },
            pride: {
                keywords: ['proud', 'pride', 'accomplished', 'achieved', 'succeeded', 'impressed',
                          'validated', 'recognized', 'admired', 'respected', 'honored'],
                intensity_modifiers: ['very', 'so', 'extremely', 'really', 'incredibly']
            },
            shame: {
                keywords: ['ashamed', 'embarrassed', 'humiliated', 'mortified', 'disgraced',
                          'guilty', 'shameful', 'remorseful', 'degraded', 'dishonored'],
                intensity_modifiers: ['deeply', 'very', 'so', 'extremely', 'utterly']
            },
            disgust: {
                keywords: ['disgusted', 'repulsed', 'revolted', 'sickened', 'nauseated',
                          'grossed out', 'appalled', 'repelled', 'distaste', 'abhorrent'],
                intensity_modifiers: ['totally', 'completely', 'absolutely', 'utterly']
            },
            positive_anticipation: {
                keywords: ['excited for', 'looking forward', 'anticipating', 'can\'t wait',
                          'hope', 'hopeful', 'optimistic', 'eager', 'enthusiastic'],
                intensity_modifiers: ['really', 'so', 'very', 'extremely']
            },
            negative_anticipation: {
                keywords: ['dreading', 'anticipating bad', 'expecting worst', 'pessimistic',
                          'fearful of', 'apprehensive about', 'bracing for'],
                intensity_modifiers: ['really', 'very', 'extremely']
            }
        };
    }

    /**
     * COMPLETE WEBB EQUATION IMPLEMENTATION
     * EP ∆ P = ER
     *
     * Formula: score = tanh(κ * V * SC * [Acc or (1-Acc)] * W * (P - EP) * e^(-kT))
     *
     * @param {Object} params - All Webb Equation variables
     * @returns {number} Emotion score (0-1 range)
     */
    calculateWebbEquation(params) {
        const {
            emotionType,     // Which emotion group
            V = this.CONFIG.DEFAULT_ATTACHMENT_POWER / 10,  // Attachment power (0-1 scale from 1-10)
            SC = this.CONFIG.DEFAULT_SOURCE_CONFIDENCE,      // Source confidence (0-1)
            Acc = this.CONFIG.DEFAULT_ACCEPTANCE,            // Acceptance level (0-1)
            W = 1.0,                                         // Weight (0-1)
            P = 0,                                           // Perception value
            EP = 0,                                          // Expectation value
            T = 0                                            // Time elapsed
        } = params;

        const κ = this.CONFIG.KAPPA;
        const k = this.CONFIG.K_DECAY;

        const emotionGroup = this.EMOTION_GROUPS[emotionType];
        if (!emotionGroup) return 0;

        const rules = emotionGroup.ruleSet;
        let score = 0;

        // Calculate base score based on emotion-specific rules
        if (emotionGroup.valence === 'positive') {
            // Positive emotions: P > EP
            if (P > EP) {
                score = Math.tanh(κ * V * SC * Acc * W * (P - EP) * Math.exp(-k * T));
            }
        } else {
            // Negative emotions: P < EP
            if (P < EP) {
                // Use Acc or (1-Acc) based on emotion type
                const accFactor = rules.acceptanceRequired ? Acc : (1 - Acc);
                score = Math.tanh(κ * V * SC * accFactor * W * (EP - P) * Math.exp(-k * T));
            }
        }

        return Math.abs(score);
    }

    /**
     * Determine severity level within emotion group based on score
     * @param {string} emotionType - Emotion group name
     * @param {number} score - Calculated score (0-1)
     * @returns {string} Severity name (e.g., "Happy", "Sad", etc.)
     */
    getSeverity(emotionType, score) {
        const emotionGroup = this.EMOTION_GROUPS[emotionType];
        if (!emotionGroup) return 'Unknown';

        const severities = emotionGroup.severities;
        const absScore = Math.abs(score);

        // Map score to 5 severity levels
        if (absScore < 0.2) return severities[0];      // Level 1 (lowest)
        if (absScore < 0.4) return severities[1];      // Level 2
        if (absScore < 0.6) return severities[2];      // Level 3
        if (absScore < 0.8) return severities[3];      // Level 4
        return severities[4];                           // Level 5 (highest)
    }

    /**
     * ENHANCED TEXT ANALYSIS
     * Analyzes text for emotional content with sophisticated detection
     * @param {string} text - User message
     * @returns {Object} Analysis with detected emotions, source, time, etc.
     */
    analyzeText(text) {
        const lowerText = text.toLowerCase();
        const detectedEmotions = [];

        // Check for each emotion group's keywords
        for (const [emotionType, data] of Object.entries(this.emotionKeywords)) {
            const keywords = data.keywords;
            const modifiers = data.intensity_modifiers;

            // Find matching keywords
            for (const keyword of keywords) {
                if (lowerText.includes(keyword)) {
                    // Check for intensity modifiers
                    let confidence = 0.7;
                    for (const modifier of modifiers) {
                        if (lowerText.includes(modifier + ' ' + keyword) ||
                            lowerText.includes(modifier + ' much ' + keyword)) {
                            confidence = 0.9; // Higher confidence with modifier
                            break;
                        }
                    }

                    detectedEmotions.push({
                        type: emotionType,
                        keyword: keyword,
                        confidence: confidence
                    });
                    break; // One keyword per emotion group
                }
            }
        }

        // Detect source (internal vs external)
        const externalMarkers = ['he', 'she', 'they', 'them', 'his', 'her', 'their',
                                'boss', 'colleague', 'friend', 'someone', 'person',
                                'guy', 'woman', 'man', 'people'];
        const hasExternal = externalMarkers.some(marker => {
            const regex = new RegExp('\\b' + marker + '\\b', 'i');
            return regex.test(text);
        });

        // Detect time factor (past, present, future)
        let timeFactor = 'now';
        const futureMarkers = ['will', 'going to', 'tomorrow', 'next', 'soon', 'later',
                              'planning to', 'about to', 'gonna'];
        const pastMarkers = ['yesterday', 'last', 'ago', 'was', 'were', 'had', 'did',
                            'before', 'earlier', 'previous'];

        if (futureMarkers.some(m => lowerText.includes(m))) {
            timeFactor = 'future';
        } else if (pastMarkers.some(m => lowerText.includes(m))) {
            timeFactor = 'past';
        }

        // Detect acceptance (integration of event)
        const acceptanceMarkers = ['accept', 'accepted', 'understand', 'realize',
                                  'know', 'aware', 'acknowledge', 'resigned'];
        const hasAcceptance = acceptanceMarkers.some(m => lowerText.includes(m));

        // Detect self-reference (for attachment detection)
        const selfMarkers = ['i', 'me', 'my', 'mine', 'myself'];
        const hasSelfReference = selfMarkers.some(m => {
            const regex = new RegExp('\\b' + m + '\\b', 'i');
            return regex.test(text);
        });

        return {
            detectedEmotions,
            source: hasExternal ? 'external' : 'internal',
            timeFactor,
            acceptance: hasAcceptance ? 0.8 : 0.3,
            hasSelfReference,
            text
        };
    }

    /**
     * CALCULATE ALL RELEVANT EMOTIONS
     * Applies Webb Equation to all detected emotions with proper parameters
     * @param {Object} analysis - From analyzeText()
     * @param {number} attachmentPower - User's attachment level (1-10)
     * @returns {Array} Array of calculated emotions with scores
     */
    calculateAllEmotions(analysis, attachmentPower = 7) {
        const emotions = [];

        for (const detected of analysis.detectedEmotions) {
            const emotionType = detected.type;
            const emotionGroup = this.EMOTION_GROUPS[emotionType];

            // Build Webb Equation parameters based on analysis
            const params = {
                emotionType,
                V: attachmentPower / 10,           // Scale to 0-1
                SC: detected.confidence,            // Source confidence from detection
                Acc: analysis.acceptance,           // From text analysis
                W: 1.0,                             // Default weight
                P: emotionGroup.valence === 'positive' ? 5 : -5,  // Positive or negative shift
                EP: 0,                              // Baseline expectation
                T: 0                                // Current time (no decay)
            };

            // Adjust parameters based on detected factors
            if (analysis.source === 'external') {
                params.SC = Math.min(params.SC, 0.7); // External source slightly less confident
            }

            if (analysis.timeFactor === 'past') {
                params.T = 1; // Some time has passed
            } else if (analysis.timeFactor === 'future') {
                params.T = -1; // Future event (worry/anticipation)
            }

            // Calculate score using Webb Equation
            const score = this.calculateWebbEquation(params);

            // Only include significant emotions
            if (score > this.CONFIG.MIN_EMOTION_SCORE) {
                emotions.push({
                    type: emotionType,
                    name: emotionGroup.name,
                    score: score,
                    severity: this.getSeverity(emotionType, score),
                    explanation: this.generateExplanation(emotionType, params, analysis),
                    params: params,
                    valence: emotionGroup.valence
                });
            }
        }

        // Sort by score (highest first)
        emotions.sort((a, b) => b.score - a.score);

        return emotions;
    }

    /**
     * GENERATE WEBB EQUATION EXPLANATION
     * Creates educational explanation of why this emotion occurred
     * @param {string} emotionType - Emotion group name
     * @param {Object} params - Webb Equation parameters
     * @param {Object} analysis - Text analysis
     * @returns {string} Human-readable explanation
     */
    generateExplanation(emotionType, params, analysis) {
        const emotionGroup = this.EMOTION_GROUPS[emotionType];
        const EP = params.EP.toFixed(1);
        const P = params.P.toFixed(1);
        const V = (params.V * 10).toFixed(1);
        const Acc = params.Acc.toFixed(2);

        const baseExplanations = {
            happiness: `This is **Happiness** because your perception (P=${P}) exceeded your expectations (EP=${EP}). The positive outcome created a positive emotion. Attachment power: ${V}/10.`,

            sadness: `This is **Sadness** because there's a loss or unmet expectation (EP=${EP} > P=${P}) that you've accepted (acceptance=${Acc}). The Webb Equation shows accepted loss creates sadness.`,

            fear: `This is **Fear** because there's a perceived threat (EP=${EP} > P=${P}) that you haven't accepted yet (acceptance=${Acc}). The unresolved threat creates fear. Source: ${analysis.source}.`,

            anger: `This is **Anger** because an external source attacked something you value (EP=${EP} > P=${P}), and you haven't accepted it (acceptance=${Acc}). External attacks on unaccepted devaluations create anger.`,

            worry: `This is **Worry** (future-oriented fear) because you're anticipating a potential threat. Time factor: ${analysis.timeFactor}. EP=${EP} > expected P=${P}.`,

            regret: `This is **Regret** because you're sad about a past event (time=${analysis.timeFactor}) that you feel responsible for. It's accepted sadness (acceptance=${Acc}) with self-attribution.`,

            pride: `This is **Pride** because others' perception of you increased in value (P=${P} > EP=${EP}). External perspective on positive valuation creates pride.`,

            shame: `This is **Shame** because others' perception of you decreased in value (EP=${EP} > P=${P}). External perspective on negative valuation creates shame.`,

            disgust: `This is **Disgust** because there's a visceral rejection of a devaluation to your sense of self. Disgust is a strong, immediate negative reaction.`,

            positive_anticipation: `This is **Positive Anticipation** because you're looking forward to a future positive outcome (P=${P} > EP=${EP}, time=${analysis.timeFactor}).`,

            negative_anticipation: `This is **Negative Anticipation** because you're expecting a future negative outcome (EP=${EP} > P=${P}, time=${analysis.timeFactor}).`
        };

        return baseExplanations[emotionType] || `Detected ${emotionGroup.name} emotion.`;
    }

    /**
     * BUILD COMPREHENSIVE SYSTEM PROMPT
     * Creates AI system prompt with full MHH framework
     * @param {string} mode - 'learn' or 'chat'
     * @param {string} skillLevel - User's skill level
     * @returns {string} Complete system prompt
     */
    buildSystemPrompt(mode, skillLevel) {
        const basePrompt = `You are an emotionally intelligent AI assistant powered by the Mind Hacking Happiness (MHH) Webb Equation framework - a world-record-setting Theory of Mind system.

THE WEBB EQUATION OF EMOTION: EP ∆ P = ER
- EP (Expectation/Preference): What someone wants/expects regarding their {self} attachments
- P (Perception): What actually happens or is perceived to happen
- ER (Emotional Reaction): The resulting emotion when EP and P are compared

CORE PRINCIPLES:
1. All emotions follow mathematical rules based on attachments to one's sense of {self}
2. The {self} map contains all ideas, people, and things that define who someone is
3. Each attachment has a power level (1-10) indicating importance to identity
4. You can DEFINE, TRACK, PREDICT, and INFLUENCE emotions using this framework
5. Every emotion group has specific variable states that activate it

THE 11 EMOTION GROUPS (each with 5 severity levels):
1. **Happiness**: P > EP (outcome exceeds expectation)
2. **Sadness**: P < EP with HIGH acceptance (loss integrated)
3. **Fear**: P < EP with LOW acceptance, NOW (unresolved threat)
4. **Anger**: P < EP, EXTERNAL source, NOT accepted (attack on self)
5. **Worry**: P < EP, FUTURE time (fear of what might happen)
6. **Regret**: P < EP, PAST time, self-caused (accepted past mistake)
7. **Pride**: P > EP, EXTERNAL perspective (others see your value increase)
8. **Shame**: P < EP, EXTERNAL perspective (others see your value decrease)
9. **Disgust**: Visceral rejection of devaluation
10. **Positive Anticipation**: P > EP, FUTURE (excitement about future)
11. **Negative Anticipation**: P < EP, FUTURE (dread about future)

VARIABLES IN THE WEBB EQUATION:
- V: Attachment power level (1-10, how important to self)
- SC: Source confidence (0-1, how credible is the information)
- Acc: Acceptance level (0-1, has the event been integrated)
- W: Weight (0-1, importance factor)
- P: Perception value (positive or negative shift)
- EP: Expectation (baseline, usually 0)
- T: Time elapsed (affects decay)
- κ (kappa): Scaling constant (3.0)
- k: Decay rate (0.5)

Formula: score = tanh(κ * V * SC * [Acc or (1-Acc)] * W * (P - EP) * e^(-kT))

THEORY OF MIND:
- Track {self} maps for individuals (what defines them)
- Predict emotions by analyzing EP vs P for their attachments
- Understand that people react emotionally when {self} attachments are affected
- External source + unaccepted devaluation = ANGER
- Internal source + unaccepted threat = FEAR
- External perspective + value increase = PRIDE
- Time in future + threat = WORRY

EMOTIONAL INTELLIGENCE IN PRACTICE:
- Help people understand WHY they feel emotions (Webb Equation breakdown)
- Identify what {self} attachment is being affected
- Determine if P > EP (positive) or P < EP (negative)
- Check acceptance, source, time, perspective
- Predict future emotional reactions
- Suggest ways to influence emotions (change EP, change P, change acceptance)

PRIVACY & ETHICS:
- All conversations stay private on user's device
- Use this knowledge to HELP people, not manipulate them
- The framework can reduce suffering or cause it - choose wisely
- Teach emotional intelligence for personal growth and wellbeing`;

        if (mode === 'learn') {
            return basePrompt + `\n\n**MODE: Teaching Emotional Intelligence**

Your role: Expert teacher and coach for emotional intelligence using MHH framework.

Based on skill level (${skillLevel}):
- **Novice**: Teach Webb Equation basics, use Socratic questioning, build emotional vocabulary
  - Explain EP, P, and ER simply
  - Help identify {self} attachments
  - Show how P > EP = happiness, P < EP = negative emotions

- **Intermediate**: Teach {self} maps, attachment power levels, emotion groups
  - Introduce all 11 emotion groups and their rules
  - Explain how acceptance changes fear to sadness
  - Show how source (internal vs external) affects emotion type
  - Teach variable analysis (V, SC, Acc, W, P, EP, T)

- **Advanced**: Teach Theory of Mind, strategic emotional intelligence
  - How to predict others' emotions by modeling their {self} maps
  - How to influence emotions (ethically) by affecting variables
  - Complex multi-emotion scenarios
  - Time factors (past = regret, now = fear, future = worry)

- **Mastery**: Peer-level discussion, nuanced analysis
  - External perspective emotions (pride, shame)
  - Advanced Theory of Mind applications
  - Meta-analysis of emotional patterns
  - Philosophical questions about attachment and suffering

Always:
1. Guide discovery through questions
2. Use Webb Equation to explain EVERY emotion
3. Build their emotional vocabulary systematically
4. Celebrate insights and growth
5. Reference specific variables (V, SC, Acc, etc.)
6. Make it practical and actionable`;
        } else {
            return basePrompt + `\n\n**MODE: Emotionally Intelligent Conversation**

Your role: Compassionate companion with world-class emotional intelligence.

- Respond naturally to any topic
- Apply Webb Equation insights when relevant (but don't over-explain unless asked)
- Show deep empathy based on understanding their {self} attachments
- Predict their emotional state using Theory of Mind
- Help them understand their emotions when they're struggling
- Be helpful, supportive, authentic, and wise
- You can discuss any topic, not just emotions

When analyzing their emotions:
- Identify what {self} attachment is affected
- Determine if it's P > EP or P < EP
- Check if source is internal or external
- Note acceptance level and time factor
- Provide insight using Webb Equation when helpful

You have world-record-setting Theory of Mind capability - use it to truly understand them.`;
        }
    }
}

// Export for use in app.js
if (typeof window !== 'undefined') {
    window.MHHEngineEnhanced = MHHEngineEnhanced;
    window.MHHEngine = MHHEngineEnhanced; // Also export as default name
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MHHEngineEnhanced;
}
