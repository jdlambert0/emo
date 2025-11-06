/**
 * MHH Emotional Intelligence Engine
 * Implements the Webb Equation framework for emotion analysis
 */

class MHHEngine {
    constructor() {
        this.EMOTION_GROUPS = {
            happiness: { name: 'Happiness', color: '#10b981' },
            sadness: { name: 'Sadness', color: '#6366f1' },
            fear: { name: 'Fear', color: '#f59e0b' },
            anger: { name: 'Anger', color: '#ef4444' },
            worry: { name: 'Worry', color: '#f59e0b' },
            regret: { name: 'Regret', color: '#8b5cf6' },
            pride: { name: 'Pride', color: '#10b981' },
            shame: { name: 'Shame', color: '#ef4444' },
            disgust: { name: 'Disgust', color: '#84cc16' },
            positive_anticipation: { name: 'Positive Anticipation', color: '#06b6d4' },
            negative_anticipation: { name: 'Negative Anticipation', color: '#f97316' }
        };

        this.SEVERITY_LEVELS = {
            happiness: ['Content', 'Pleased', 'Happy', 'Joyful', 'Ecstatic'],
            sadness: ['Wistful', 'Downhearted', 'Sad', 'Sorrowful', 'Grief'],
            fear: ['Nervous', 'Scared', 'Afraid', 'Fearful', 'Terror'],
            anger: ['Annoyed', 'Frustrated', 'Angry', 'Furious', 'Rage'],
            worry: ['Concerned', 'Worried', 'Anxious', 'Distressed', 'Panicked']
        };
    }

    /**
     * Calculate emotion using Webb Equation: EP ∆ P = ER
     */
    calculateEmotion(params) {
        const { emotionType, V, SC, Acc, W, P, EP, T } = params;
        const kappa = 3.0;
        const k = 0.5;

        let score = 0;

        switch(emotionType) {
            case 'happiness':
                if (P > EP) {
                    score = Math.tanh(kappa * V * SC * Acc * W * (P - EP) * Math.exp(-k * T));
                }
                break;

            case 'sadness':
                if (P < EP && Acc >= 0.5) {
                    score = -Math.tanh(kappa * V * SC * Acc * W * (EP - P) * Math.exp(-k * T));
                }
                break;

            case 'fear':
                if (P < EP && Acc < 0.5) {
                    score = Math.tanh(kappa * V * SC * (1 - Acc) * W * (EP - P) * Math.exp(-k * T));
                }
                break;

            case 'anger':
                if (P < EP && Acc < 0.5 && params.source === 'external') {
                    score = Math.tanh(kappa * V * SC * (1 - Acc) * W * (EP - P) * Math.exp(-k * T));
                }
                break;

            case 'worry':
                if (params.timeFactor === 'future' && P < EP) {
                    score = Math.tanh(kappa * V * SC * (1 - Acc) * W * (EP - P) * Math.exp(-k * (T + 1)));
                }
                break;
        }

        return Math.abs(score);
    }

    /**
     * Map emotion score to severity level
     */
    getSeverity(emotionType, score) {
        const absScore = Math.abs(score);
        const levels = this.SEVERITY_LEVELS[emotionType] || ['Low', 'Moderate', 'Medium', 'High', 'Very High'];

        if (absScore < 0.2) return levels[0];
        if (absScore < 0.4) return levels[1];
        if (absScore < 0.6) return levels[2];
        if (absScore < 0.8) return levels[3];
        return levels[4];
    }

    /**
     * Analyze text for emotional content (simplified for MVP)
     */
    analyzeText(text) {
        const lowerText = text.toLowerCase();

        // Simple keyword-based emotion detection
        const emotionKeywords = {
            happiness: ['happy', 'joy', 'excited', 'glad', 'pleased', 'delighted', 'great', 'wonderful', 'love'],
            sadness: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'grief', 'loss', 'lost'],
            fear: ['afraid', 'scared', 'terrified', 'frightened', 'nervous', 'anxious'],
            anger: ['angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated', 'irritated'],
            worry: ['worried', 'anxious', 'concerned', 'stressed', 'nervous', 'uneasy']
        };

        const detectedEmotions = [];

        // Check for emotion keywords
        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            for (const keyword of keywords) {
                if (lowerText.includes(keyword)) {
                    detectedEmotions.push({
                        type: emotion,
                        keyword: keyword,
                        confidence: 0.7
                    });
                    break;
                }
            }
        }

        // Detect source (internal vs external)
        const externalMarkers = ['he', 'she', 'they', 'boss', 'colleague', 'friend', 'someone'];
        const hasExternal = externalMarkers.some(marker => lowerText.includes(marker));

        // Detect time factor
        let timeFactor = 'present';
        if (lowerText.includes('will') || lowerText.includes('going to') || lowerText.includes('tomorrow')) {
            timeFactor = 'future';
        } else if (lowerText.includes('yesterday') || lowerText.includes('last') || lowerText.includes('ago')) {
            timeFactor = 'past';
        }

        return {
            detectedEmotions,
            source: hasExternal ? 'external' : 'internal',
            timeFactor,
            text
        };
    }

    /**
     * Generate Webb Equation explanation
     */
    generateExplanation(emotion, params) {
        const explanations = {
            happiness: `This is **Happiness** because your perception (what happened) exceeded your expectations. According to the Webb Equation: EP (${params.EP}) < P (${params.P}), creating positive emotion.`,

            sadness: `This is **Sadness** because there's a loss or unmet expectation that you've accepted. Webb Equation: EP (${params.EP}) > P (${params.P}) with high acceptance (${params.Acc}).`,

            fear: `This is **Fear** because there's a perceived threat that you haven't fully accepted yet. Webb Equation shows: EP (${params.EP}) > P (${params.P}) with low acceptance (${params.Acc}).`,

            anger: `This is **Anger** because an external source violated your expectations and you haven't accepted it. Webb Equation: External source, EP (${params.EP}) > P (${params.P}), low acceptance (${params.Acc}).`,

            worry: `This is **Worry** (future-oriented fear) because you're anticipating a threat. Webb Equation predicts future imbalance: EP (${params.EP}) > expected P (${params.P}).`
        };

        return explanations[emotion] || `Detected emotion: ${emotion}`;
    }

    /**
     * Calculate all relevant emotions for a situation
     */
    calculateAllEmotions(analysis, attachmentPower = 7) {
        const emotions = [];

        for (const detected of analysis.detectedEmotions) {
            // Default Webb Equation parameters
            const params = {
                emotionType: detected.type,
                V: attachmentPower / 10,  // Attachment power
                SC: detected.confidence,   // Source confidence
                Acc: analysis.source === 'internal' ? 0.6 : 0.3,  // Acceptance
                W: analysis.source === 'internal' ? 1.0 : 0.7,    // Weight
                P: detected.type === 'happiness' ? 5 : -5,        // Perception valence
                EP: 0,                     // Expectation
                T: 0,                      // Time elapsed
                source: analysis.source,
                timeFactor: analysis.timeFactor
            };

            const score = this.calculateEmotion(params);

            if (score > 0.1) {  // Only include significant emotions
                emotions.push({
                    type: detected.type,
                    name: this.EMOTION_GROUPS[detected.type]?.name || detected.type,
                    score: score,
                    severity: this.getSeverity(detected.type, score),
                    explanation: this.generateExplanation(detected.type, params),
                    params: params
                });
            }
        }

        // Sort by score (highest first)
        emotions.sort((a, b) => b.score - a.score);

        return emotions;
    }
}

// Export for use in app.js
window.MHHEngine = MHHEngine;
