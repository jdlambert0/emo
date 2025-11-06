/**
 * MHH Emotional Intelligence Chat App
 * Privacy-first: All data stored locally, no tracking, no login
 */

// ==================== STATE MANAGEMENT ====================
const AppState = {
    mode: 'learn', // 'learn' or 'chat'
    apiProvider: 'openai',
    apiKey: '',
    conversationHistory: [],
    userSkillLevel: 'novice',
    skillScores: {
        vocabulary: 0,
        analysis: 0,
        webb: 0
    },
    settings: {
        ttsEnabled: true,
        showEmotionalAnalysis: true,
        voice: null,
        voiceInputEnabled: true,
        voiceInputLanguage: 'en-US'
    },
    mhhEngine: null,
    currentSpeech: null,
    recognition: null,
    isListening: false
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize MHH Engine
    AppState.mhhEngine = new MHHEngine();

    // Load saved data from localStorage
    loadFromLocalStorage();

    // Initialize text-to-speech voices
    initializeTTS();

    // Initialize speech recognition
    initializeSpeechRecognition();

    // Adjust textarea height on input
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    // Load conversation history
    displayConversationHistory();

    // Update skill progress display
    updateSkillProgress();
});

// ==================== LOCAL STORAGE ====================
function loadFromLocalStorage() {
    try {
        // Load API settings
        const savedProvider = localStorage.getItem('mhh_api_provider');
        const savedApiKey = localStorage.getItem('mhh_api_key');
        const savedMode = localStorage.getItem('mhh_mode');

        if (savedProvider) {
            AppState.apiProvider = savedProvider;
            document.getElementById('aiProvider').value = savedProvider;
        }

        if (savedApiKey) {
            AppState.apiKey = savedApiKey;
            document.getElementById('apiKey').value = savedApiKey;
        }

        if (savedMode) {
            AppState.mode = savedMode;
            switchMode(savedMode);
        }

        // Load conversation history
        const savedHistory = localStorage.getItem('mhh_conversation_history');
        if (savedHistory) {
            AppState.conversationHistory = JSON.parse(savedHistory);
        }

        // Load skill progress
        const savedSkillLevel = localStorage.getItem('mhh_skill_level');
        if (savedSkillLevel) {
            AppState.userSkillLevel = savedSkillLevel;
        }

        const savedSkillScores = localStorage.getItem('mhh_skill_scores');
        if (savedSkillScores) {
            AppState.skillScores = JSON.parse(savedSkillScores);
        }

        // Load settings
        const savedSettings = localStorage.getItem('mhh_settings');
        if (savedSettings) {
            AppState.settings = { ...AppState.settings, ...JSON.parse(savedSettings) };
            document.getElementById('ttsEnabled').checked = AppState.settings.ttsEnabled;
            document.getElementById('showEmotionalAnalysis').checked = AppState.settings.showEmotionalAnalysis;
        }

    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('mhh_api_provider', AppState.apiProvider);
        localStorage.setItem('mhh_api_key', AppState.apiKey);
        localStorage.setItem('mhh_mode', AppState.mode);
        localStorage.setItem('mhh_conversation_history', JSON.stringify(AppState.conversationHistory));
        localStorage.setItem('mhh_skill_level', AppState.userSkillLevel);
        localStorage.setItem('mhh_skill_scores', JSON.stringify(AppState.skillScores));
        localStorage.setItem('mhh_settings', JSON.stringify(AppState.settings));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function clearAllData() {
    if (confirm('Are you sure? This will delete all your conversations and progress. This cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
}

// ==================== MODE SWITCHING ====================
function switchMode(mode) {
    AppState.mode = mode;

    // Update button states
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        }
    });

    // Update descriptions
    document.querySelectorAll('.desc-content').forEach(desc => {
        desc.classList.remove('active');
    });
    document.getElementById(mode === 'learn' ? 'learnDesc' : 'chatDesc').classList.add('active');

    // Show/hide skill progress
    const skillProgress = document.getElementById('skillProgress');
    if (mode === 'learn') {
        skillProgress.classList.add('active');
        skillProgress.style.display = 'block';
    } else {
        skillProgress.classList.remove('active');
        skillProgress.style.display = 'none';
    }

    saveToLocalStorage();
}

// ==================== SETTINGS MODAL ====================
function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');

    // Save settings
    AppState.apiProvider = document.getElementById('aiProvider').value;
    AppState.apiKey = document.getElementById('apiKey').value;
    AppState.settings.ttsEnabled = document.getElementById('ttsEnabled').checked;
    AppState.settings.showEmotionalAnalysis = document.getElementById('showEmotionalAnalysis').checked;

    // Voice input settings
    const voiceInputCheckbox = document.getElementById('voiceInputEnabled');
    if (voiceInputCheckbox) {
        AppState.settings.voiceInputEnabled = voiceInputCheckbox.checked;
    }

    const voiceSelect = document.getElementById('voiceSelect');
    if (voiceSelect.value) {
        AppState.settings.voice = voiceSelect.value;
    }

    saveToLocalStorage();
}

function updateAPIKeyLabel() {
    const provider = document.getElementById('aiProvider').value;
    const label = document.getElementById('apiKeyLabel');

    if (provider === 'local') {
        label.textContent = 'API Key (Not Required)';
        document.getElementById('apiKey').disabled = true;
    } else {
        label.textContent = 'API Key';
        document.getElementById('apiKey').disabled = false;
    }
}

// ==================== TEXT-TO-SPEECH ====================
function initializeTTS() {
    const voiceSelect = document.getElementById('voiceSelect');

    function populateVoices() {
        const voices = speechSynthesis.getVoices();
        voiceSelect.innerHTML = '';

        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            if (voice.default) {
                option.selected = true;
            }
            voiceSelect.appendChild(option);
        });

        // Set saved voice
        if (AppState.settings.voice !== null) {
            voiceSelect.value = AppState.settings.voice;
        }
    }

    populateVoices();
    speechSynthesis.onvoiceschanged = populateVoices;
}

function speakText(text, button) {
    // Stop any ongoing speech
    if (AppState.currentSpeech) {
        speechSynthesis.cancel();
        AppState.currentSpeech = null;
        if (button) button.classList.remove('playing');
        return;
    }

    if (!AppState.settings.ttsEnabled) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Set voice
    const voices = speechSynthesis.getVoices();
    const voiceIndex = AppState.settings.voice || 0;
    if (voices[voiceIndex]) {
        utterance.voice = voices[voiceIndex];
    }

    // Configure speech
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Handle events
    if (button) {
        button.classList.add('playing');
    }

    utterance.onend = () => {
        if (button) button.classList.remove('playing');
        AppState.currentSpeech = null;
    };

    utterance.onerror = () => {
        if (button) button.classList.remove('playing');
        AppState.currentSpeech = null;
    };

    AppState.currentSpeech = utterance;
    speechSynthesis.speak(utterance);
}

// ==================== SPEECH RECOGNITION (VOICE INPUT) ====================
function initializeSpeechRecognition() {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        // Hide microphone button if not supported
        const micBtn = document.getElementById('micBtn');
        if (micBtn) {
            micBtn.style.display = 'none';
        }
        return;
    }

    // Create recognition instance
    AppState.recognition = new SpeechRecognition();
    AppState.recognition.continuous = false; // Stop after one sentence
    AppState.recognition.interimResults = true; // Show interim results
    AppState.recognition.lang = AppState.settings.voiceInputLanguage || 'en-US';

    // Event: Speech recognition starts
    AppState.recognition.onstart = () => {
        AppState.isListening = true;
        const micBtn = document.getElementById('micBtn');
        if (micBtn) {
            micBtn.classList.add('listening');
            micBtn.innerHTML = '🎙️';
            micBtn.title = 'Listening... (click to stop)';
        }
    };

    // Event: Speech recognition result
    AppState.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Update input field with transcript
        const messageInput = document.getElementById('messageInput');
        if (finalTranscript) {
            messageInput.value = finalTranscript.trim();
            // Automatically send if we have final transcript
            setTimeout(() => {
                if (messageInput.value.trim()) {
                    sendMessage();
                }
            }, 500);
        } else {
            // Show interim results
            messageInput.placeholder = interimTranscript || 'Listening...';
        }
    };

    // Event: Speech recognition ends
    AppState.recognition.onend = () => {
        AppState.isListening = false;
        const micBtn = document.getElementById('micBtn');
        if (micBtn) {
            micBtn.classList.remove('listening');
            micBtn.innerHTML = '🎤';
            micBtn.title = 'Click to speak';
        }
        const messageInput = document.getElementById('messageInput');
        messageInput.placeholder = 'Type your message here...';
    };

    // Event: Speech recognition error
    AppState.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        AppState.isListening = false;

        const micBtn = document.getElementById('micBtn');
        if (micBtn) {
            micBtn.classList.remove('listening');
            micBtn.innerHTML = '🎤';
        }

        const messageInput = document.getElementById('messageInput');
        messageInput.placeholder = 'Type your message here...';

        // Show user-friendly error messages
        if (event.error === 'no-speech') {
            showNotification('No speech detected. Please try again.', 'warning');
        } else if (event.error === 'audio-capture') {
            showNotification('Microphone not found. Please check permissions.', 'error');
        } else if (event.error === 'not-allowed') {
            showNotification('Microphone permission denied. Please enable in browser settings.', 'error');
        } else {
            showNotification(`Speech recognition error: ${event.error}`, 'error');
        }
    };
}

function toggleVoiceInput() {
    if (!AppState.recognition) {
        showNotification('Speech recognition not supported in this browser. Try Chrome or Edge.', 'error');
        return;
    }

    if (!AppState.settings.voiceInputEnabled) {
        showNotification('Voice input is disabled. Enable it in Settings.', 'warning');
        return;
    }

    if (AppState.isListening) {
        // Stop listening
        AppState.recognition.stop();
    } else {
        // Start listening
        try {
            AppState.recognition.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
            showNotification('Failed to start microphone. Please try again.', 'error');
        }
    }
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#6366f1'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ==================== MESSAGE HANDLING ====================
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (!message) return;

    // Check if API key is set
    if (!AppState.apiKey && AppState.apiProvider !== 'local') {
        alert('Please set your API key in Settings (⚙️) first.');
        openSettings();
        return;
    }

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Add user message to UI
    addMessageToUI('user', message);

    // Add to conversation history
    AppState.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });

    // Show typing indicator
    showTypingIndicator();

    // Analyze emotion
    const emotionalAnalysis = AppState.mhhEngine.analyzeText(message);
    const emotions = AppState.mhhEngine.calculateAllEmotions(emotionalAnalysis);

    try {
        // Get AI response
        const aiResponse = await getAIResponse(message, emotions);

        // Remove typing indicator
        hideTypingIndicator();

        // Add bot message to UI
        addMessageToUI('bot', aiResponse, emotions);

        // Add to conversation history
        AppState.conversationHistory.push({
            role: 'assistant',
            content: aiResponse,
            emotions: emotions,
            timestamp: new Date().toISOString()
        });

        // Update skill progress (if in learn mode)
        if (AppState.mode === 'learn') {
            updateSkillFromConversation(message, aiResponse);
        }

        // Save to localStorage
        saveToLocalStorage();

    } catch (error) {
        hideTypingIndicator();
        addMessageToUI('bot', `❌ Error: ${error.message}. Please check your API key in Settings.`);
    }
}

function addMessageToUI(role, content, emotions = null) {
    const messagesContainer = document.getElementById('chatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;

    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🧠';

    // Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    // Format message with markdown-like formatting
    const formattedContent = formatMessage(content);
    contentDiv.innerHTML = formattedContent;

    // Add emotional analysis if available and enabled
    if (role === 'bot' && emotions && emotions.length > 0 && AppState.settings.showEmotionalAnalysis) {
        const analysisDiv = document.createElement('div');
        analysisDiv.className = 'emotion-analysis';

        analysisDiv.innerHTML = `<h4>🧠 Emotional Analysis:</h4>`;

        emotions.forEach(emotion => {
            const badge = document.createElement('span');
            badge.className = 'emotion-badge';
            badge.textContent = `${emotion.name}: ${emotion.severity} (${emotion.score.toFixed(2)})`;
            badge.style.background = AppState.mhhEngine.EMOTION_GROUPS[emotion.type]?.color || '#6366f1';
            badge.style.color = 'white';
            analysisDiv.appendChild(badge);
        });

        contentDiv.appendChild(analysisDiv);
    }

    // Add audio button for bot messages
    if (role === 'bot' && AppState.settings.ttsEnabled) {
        const audioBtn = document.createElement('button');
        audioBtn.className = 'audio-btn';
        audioBtn.innerHTML = '🔊';
        audioBtn.title = 'Read aloud';
        audioBtn.onclick = (e) => {
            e.stopPropagation();
            speakText(content, audioBtn);
        };
        contentDiv.appendChild(audioBtn);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function formatMessage(text) {
    // Simple markdown-like formatting
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')               // Italic
        .replace(/\n/g, '</p><p>')                          // Paragraphs
        .replace(/• /g, '<br>• ');                          // Bullet points

    return `<p>${formatted}</p>`;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';

    typingDiv.innerHTML = `
        <div class="message-avatar">🧠</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// ==================== AI INTEGRATION ====================
async function getAIResponse(userMessage, emotions) {
    // Build system prompt based on mode
    const systemPrompt = buildSystemPrompt();

    // Build enriched user prompt
    const enrichedPrompt = buildEnrichedPrompt(userMessage, emotions);

    // Call appropriate AI provider
    if (AppState.apiProvider === 'openai') {
        return await callOpenAI(systemPrompt, enrichedPrompt);
    } else if (AppState.apiProvider === 'anthropic') {
        return await callAnthropic(systemPrompt, enrichedPrompt);
    } else if (AppState.apiProvider === 'local') {
        // For MVP, return a helpful message
        return "Local AI is coming soon! For now, please use OpenAI or Anthropic by setting your API key in Settings.";
    }
}

function buildSystemPrompt() {
    const basePrompt = `You are an emotionally intelligent AI assistant powered by the Mind Hacking Happiness (MHH) Webb Equation framework. You understand emotions mathematically and can help people develop emotional intelligence.

The Webb Equation: EP ∆ P = ER (Expectation/Preference compared to Perception generates Emotional Reaction)

Core principles:
- All emotions follow mathematical rules based on attachments ({self} map items)
- You can predict, explain, and help people process emotions
- Be warm, empathetic, and educational

Privacy: All conversations stay local on the user's device. No tracking.`;

    if (AppState.mode === 'learn') {
        return basePrompt + `\n\nMODE: Teaching Emotional Intelligence

Your role: Teacher and coach for emotional intelligence.

Based on user skill level (${AppState.userSkillLevel}):
- Novice: Teach basics, use Socratic questioning, build vocabulary
- Intermediate: Teach {self} maps, patterns, Webb Equation details
- Advanced: Teach Theory of Mind, strategic communication
- Mastery: Be a peer reflector, challenge thinking

Always:
1. Guide discovery, don't just tell answers
2. Teach Webb Equation concepts as you go
3. Build their emotional vocabulary
4. Celebrate growth and insights
5. Gradually reduce assistance as they improve`;
    } else {
        return basePrompt + `\n\nMODE: Open Conversation

Your role: Emotionally intelligent conversation partner.

- Respond naturally to any topic
- Apply Webb Equation insights when relevant (but don't over-explain)
- Show deep empathy based on emotional analysis
- Be helpful, supportive, and authentic
- You can discuss any topic, not just emotions`;
    }
}

function buildEnrichedPrompt(userMessage, emotions) {
    if (emotions.length === 0) {
        return userMessage;
    }

    let prompt = `User message: "${userMessage}"\n\n`;

    if (AppState.settings.showEmotionalAnalysis) {
        prompt += `EMOTIONAL ANALYSIS (Webb Equation):\n\n`;

        emotions.forEach((emotion, index) => {
            prompt += `${index + 1}. ${emotion.name} - ${emotion.severity} (Score: ${emotion.score.toFixed(2)})\n`;
            prompt += `   ${emotion.explanation}\n\n`;
        });

        prompt += `Respond with empathy for these specific emotions. `;

        if (AppState.mode === 'learn') {
            prompt += `Help them understand WHY they feel this way using Webb Equation concepts.`;
        }
    }

    return prompt;
}

async function callOpenAI(systemPrompt, userPrompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AppState.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: systemPrompt },
                ...AppState.conversationHistory.slice(-10).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 800
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function callAnthropic(systemPrompt, userPrompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': AppState.apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
                ...AppState.conversationHistory.slice(-10).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                })),
                { role: 'user', content: userPrompt }
            ]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    return data.content[0].text;
}

// ==================== SKILL TRACKING ====================
function updateSkillFromConversation(userMessage, aiResponse) {
    const message = userMessage.toLowerCase();

    // Check for emotional vocabulary improvement
    const emotionWords = ['angry', 'sad', 'happy', 'fear', 'worry', 'shame', 'pride', 'grief'];
    const webbTerms = ['expectation', 'perception', 'attachment', 'webb equation', 'self map'];

    if (emotionWords.some(word => message.includes(word))) {
        AppState.skillScores.vocabulary = Math.min(100, AppState.skillScores.vocabulary + 2);
    }

    if (webbTerms.some(term => message.includes(term))) {
        AppState.skillScores.webb = Math.min(100, AppState.skillScores.webb + 3);
    }

    // Check for self-analysis attempts
    if (message.includes('because') || message.includes('i think') || message.includes('i feel')) {
        AppState.skillScores.analysis = Math.min(100, AppState.skillScores.analysis + 2);
    }

    // Update skill level
    const avgScore = (AppState.skillScores.vocabulary + AppState.skillScores.analysis + AppState.skillScores.webb) / 3;

    if (avgScore < 25) {
        AppState.userSkillLevel = 'novice';
    } else if (avgScore < 50) {
        AppState.userSkillLevel = 'intermediate';
    } else if (avgScore < 75) {
        AppState.userSkillLevel = 'advanced';
    } else {
        AppState.userSkillLevel = 'mastery';
    }

    updateSkillProgress();
    saveToLocalStorage();
}

function updateSkillProgress() {
    document.getElementById('overallLevel').textContent = AppState.userSkillLevel.charAt(0).toUpperCase() + AppState.userSkillLevel.slice(1);
    document.getElementById('vocabProgress').style.width = AppState.skillScores.vocabulary + '%';
    document.getElementById('analysisProgress').style.width = AppState.skillScores.analysis + '%';
    document.getElementById('webbProgress').style.width = AppState.skillScores.webb + '%';
}

// ==================== CONVERSATION HISTORY ====================
function displayConversationHistory() {
    const messagesContainer = document.getElementById('chatMessages');

    // Keep only the welcome message, clear the rest
    const welcomeMessage = messagesContainer.querySelector('.bot-message');
    messagesContainer.innerHTML = '';
    if (welcomeMessage) {
        messagesContainer.appendChild(welcomeMessage);
    }

    // Display saved messages
    AppState.conversationHistory.forEach(msg => {
        if (msg.role === 'user') {
            addMessageToUI('user', msg.content);
        } else {
            addMessageToUI('bot', msg.content, msg.emotions || null);
        }
    });
}

// ==================== EXPORT FUNCTIONS TO GLOBAL SCOPE ====================
window.switchMode = switchMode;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.updateAPIKeyLabel = updateAPIKeyLabel;
window.clearAllData = clearAllData;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.toggleVoiceInput = toggleVoiceInput;
