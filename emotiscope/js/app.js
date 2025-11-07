/**
 * MHH Emotional Intelligence Chat App
 * Privacy-first: All data stored locally, no tracking, no login
 */

// ==================== CONFIGURATION ====================
const CONFIG = {
    MAX_CONVERSATION_HISTORY: 100,
    MAX_MESSAGE_LENGTH: 5000,
    API_TIMEOUT: 30000,
    RATE_LIMIT_INTERVAL: 1000,
    MAX_CONCURRENT_NOTIFICATIONS: 3
};

// ==================== STORAGE AVAILABILITY CHECK ====================
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Check localStorage availability
const STORAGE_AVAILABLE = isLocalStorageAvailable();
if (!STORAGE_AVAILABLE) {
    console.warn('⚠️ localStorage is not available. Data will not persist between sessions.');
}

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
    isListening: false,
    license: {
        tier: 'free', // 'free', 'premium', 'pro'
        key: null,
        validUntil: null
    }
};

// ==================== UTILITY FUNCTIONS ====================
/**
 * Safely get DOM element with null checking
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`⚠️ Element '${id}' not found in DOM`);
    }
    return element;
}

/**
 * Safely parse JSON with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default if parse fails
 * @returns {any}
 */
function safeJSONParse(jsonString, defaultValue = null) {
    try {
        const parsed = JSON.parse(jsonString);
        return (parsed !== null && typeof parsed === 'object') ? parsed : defaultValue;
    } catch (error) {
        console.error('JSON parse error:', error.message);
        return defaultValue;
    }
}

/**
 * Validate object structure
 * @param {any} obj - Object to validate
 * @param {Array<string>} requiredFields - Required field names
 * @returns {boolean}
 */
function validateObject(obj, requiredFields) {
    if (!obj || typeof obj !== 'object') return false;
    return requiredFields.every(field => field in obj);
}

// ==================== LICENSE MANAGEMENT ====================
const LicenseManager = {
    TIERS: {
        free: {
            name: 'Free',
            messagesPerMonth: 20,
            features: {
                learnMode: true,
                chatMode: true,
                basicAnalytics: true,
                historyExport: false,
                advancedAnalytics: false,
                whiteLabel: false
            }
        },
        premium: {
            name: 'Premium',
            price: 9.99,
            messagesPerMonth: Infinity,
            features: {
                learnMode: true,
                chatMode: true,
                basicAnalytics: true,
                historyExport: true,
                advancedAnalytics: true,
                whiteLabel: false
            }
        },
        pro: {
            name: 'Pro',
            price: 19.99,
            messagesPerMonth: Infinity,
            features: {
                learnMode: true,
                chatMode: true,
                basicAnalytics: true,
                historyExport: true,
                advancedAnalytics: true,
                whiteLabel: true,
                clientTracking: true,
                prioritySupport: true
            }
        }
    },

    init() {
        this.loadLicense();
        this.loadMessageCount();
        this.resetCountIfNewMonth();
    },

    loadLicense() {
        if (!STORAGE_AVAILABLE) return;

        try {
            const savedLicense = localStorage.getItem('emotiscope_license');
            if (savedLicense) {
                const license = safeJSONParse(savedLicense, null);
                if (license && validateObject(license, ['tier'])) {
                    AppState.license = license;
                }
            }
        } catch (error) {
            console.error('Error loading license:', error);
        }
    },

    saveLicense() {
        if (!STORAGE_AVAILABLE) return;

        try {
            localStorage.setItem('emotiscope_license', JSON.stringify(AppState.license));
        } catch (error) {
            console.error('Error saving license:', error);
        }
    },

    loadMessageCount() {
        if (!STORAGE_AVAILABLE) return;

        try {
            const saved = localStorage.getItem('emotiscope_message_count');
            if (saved) {
                const data = safeJSONParse(saved, {});
                this.messageCount = data.count || 0;
                this.monthStart = data.monthStart || new Date().toISOString();
            } else {
                this.messageCount = 0;
                this.monthStart = new Date().toISOString();
            }
        } catch (error) {
            this.messageCount = 0;
            this.monthStart = new Date().toISOString();
        }
    },

    saveMessageCount() {
        if (!STORAGE_AVAILABLE) return;

        try {
            localStorage.setItem('emotiscope_message_count', JSON.stringify({
                count: this.messageCount,
                monthStart: this.monthStart
            }));
        } catch (error) {
            console.error('Error saving message count:', error);
        }
    },

    resetCountIfNewMonth() {
        const now = new Date();
        const monthStart = new Date(this.monthStart);

        // Check if we're in a new month
        if (now.getMonth() !== monthStart.getMonth() || now.getFullYear() !== monthStart.getFullYear()) {
            this.messageCount = 0;
            this.monthStart = now.toISOString();
            this.saveMessageCount();
        }
    },

    getCurrentTier() {
        return this.TIERS[AppState.license.tier] || this.TIERS.free;
    },

    canSendMessage() {
        const tier = this.getCurrentTier();

        // Premium and Pro have unlimited messages
        if (AppState.license.tier !== 'free') {
            return { allowed: true };
        }

        // Free tier check
        if (this.messageCount >= tier.messagesPerMonth) {
            return {
                allowed: false,
                reason: 'monthly_limit',
                limit: tier.messagesPerMonth,
                used: this.messageCount
            };
        }

        return { allowed: true };
    },

    incrementMessageCount() {
        this.messageCount++;
        this.saveMessageCount();
    },

    getMessagesRemaining() {
        const tier = this.getCurrentTier();
        if (AppState.license.tier !== 'free') {
            return Infinity;
        }
        return Math.max(0, tier.messagesPerMonth - this.messageCount);
    },

    getUsagePercentage() {
        const tier = this.getCurrentTier();
        if (AppState.license.tier !== 'free') {
            return 0;
        }
        return Math.min(100, (this.messageCount / tier.messagesPerMonth) * 100);
    },

    hasFeature(featureName) {
        const tier = this.getCurrentTier();
        return tier.features[featureName] || false;
    },

    // Simple license key validation (format: TIER-XXXX-XXXX-XXXX)
    validateLicenseKey(key) {
        if (!key || typeof key !== 'string') {
            return { valid: false, error: 'Invalid license key format' };
        }

        const parts = key.toUpperCase().split('-');

        if (parts.length !== 4) {
            return { valid: false, error: 'Invalid license key format' };
        }

        const tierPrefix = parts[0];

        if (tierPrefix === 'PREMIUM' || tierPrefix === 'PRO') {
            // In a real implementation, you'd validate against a server
            // For now, we'll accept any properly formatted key for demo
            return {
                valid: true,
                tier: tierPrefix.toLowerCase(),
                validUntil: null // null = lifetime
            };
        }

        return { valid: false, error: 'Invalid license key' };
    },

    activateLicense(key) {
        const validation = this.validateLicenseKey(key);

        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        AppState.license = {
            tier: validation.tier,
            key: key,
            validUntil: validation.validUntil
        };

        this.saveLicense();

        return { success: true, tier: validation.tier };
    },

    deactivateLicense() {
        AppState.license = {
            tier: 'free',
            key: null,
            validUntil: null
        };
        this.saveLicense();
    }
};

// ==================== SECURITY UTILITIES ====================
function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function validateInput(input, maxLength = 5000) {
    if (typeof input !== 'string') {
        throw new Error('Invalid input type');
    }
    if (input.length === 0) {
        throw new Error('Input cannot be empty');
    }
    if (input.length > maxLength) {
        throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
    }
    // Check for suspicious patterns
    const suspiciousPatterns = [/<script/i, /javascript:/i, /onerror=/i, /onclick=/i];
    if (suspiciousPatterns.some(pattern => pattern.test(input))) {
        throw new Error('Input contains potentially unsafe content');
    }
    return input.trim();
}

// Rate limiting for API calls
const RateLimiter = {
    lastCallTime: 0,
    minInterval: 1000, // 1 second between calls

    canMakeCall() {
        const now = Date.now();
        if (now - this.lastCallTime < this.minInterval) {
            return false;
        }
        this.lastCallTime = now;
        return true;
    },

    getWaitTime() {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;
        return Math.max(0, this.minInterval - timeSinceLastCall);
    }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize License Manager
    LicenseManager.init();

    // Initialize Enhanced MHH Engine (world-class emotional intelligence)
    try {
        AppState.mhhEngine = new MHHEngineEnhanced();
        console.log('✅ MHH Engine initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize MHH Engine:', error);
        showNotification('Warning: Emotional intelligence engine failed to load. Basic functionality will be limited.', 'error');
        // Create a minimal fallback engine
        AppState.mhhEngine = {
            analyzeText: () => ({ emotions: [], text: '' }),
            calculateAllEmotions: () => [],
            buildSystemPrompt: () => 'You are a helpful AI assistant.',
            EMOTION_GROUPS: {}
        };
    }

    // Load saved data from localStorage
    loadFromLocalStorage();

    // Initialize text-to-speech voices
    initializeTTS();

    // Initialize speech recognition
    initializeSpeechRecognition();

    // Update license UI
    updateLicenseUI();

    // Adjust textarea height on input
    const messageInput = safeGetElement('messageInput');
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = messageInput.scrollHeight + 'px';
        });
    }

    // Load conversation history
    displayConversationHistory();

    // Update skill progress display
    updateSkillProgress();
});

// ==================== LOCAL STORAGE ====================
function loadFromLocalStorage() {
    if (!STORAGE_AVAILABLE) {
        console.log('Skipping localStorage load (not available)');
        return;
    }

    try {
        // Load API settings
        const savedProvider = localStorage.getItem('mhh_api_provider');
        const savedApiKey = localStorage.getItem('mhh_api_key');
        const savedMode = localStorage.getItem('mhh_mode');

        if (savedProvider) {
            AppState.apiProvider = savedProvider;
            const aiProviderEl = safeGetElement('aiProvider');
            if (aiProviderEl) aiProviderEl.value = savedProvider;
        }

        if (savedApiKey) {
            AppState.apiKey = savedApiKey;
            const apiKeyEl = safeGetElement('apiKey');
            if (apiKeyEl) apiKeyEl.value = savedApiKey;
        }

        if (savedMode) {
            AppState.mode = savedMode;
            switchMode(savedMode);
        }

        // Load conversation history
        const savedHistory = localStorage.getItem('mhh_conversation_history');
        if (savedHistory) {
            const data = safeJSONParse(savedHistory, []);
            if (Array.isArray(data)) {
                // Validate each message has required fields
                AppState.conversationHistory = data.filter(msg =>
                    msg && typeof msg === 'object' &&
                    msg.role && msg.content
                ).slice(-CONFIG.MAX_CONVERSATION_HISTORY); // Also apply history limit
            } else {
                console.warn('Invalid conversation history, starting fresh');
                AppState.conversationHistory = [];
            }
        }

        // Load skill progress
        const savedSkillLevel = localStorage.getItem('mhh_skill_level');
        if (savedSkillLevel) {
            AppState.userSkillLevel = savedSkillLevel;
        }

        const savedSkillScores = localStorage.getItem('mhh_skill_scores');
        if (savedSkillScores) {
            const scores = safeJSONParse(savedSkillScores, null);
            if (scores && validateObject(scores, ['vocabulary', 'analysis', 'webb'])) {
                AppState.skillScores = scores;
            }
        }

        // Load settings
        const savedSettings = localStorage.getItem('mhh_settings');
        if (savedSettings) {
            const settings = safeJSONParse(savedSettings, {});
            AppState.settings = { ...AppState.settings, ...settings };
            const ttsEl = safeGetElement('ttsEnabled');
            const analysisEl = safeGetElement('showEmotionalAnalysis');
            if (ttsEl) ttsEl.checked = AppState.settings.ttsEnabled;
            if (analysisEl) analysisEl.checked = AppState.settings.showEmotionalAnalysis;
        }

    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function saveToLocalStorage() {
    if (!STORAGE_AVAILABLE) {
        // Silently skip if storage not available
        return;
    }

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

        // Handle quota exceeded errors
        if (error.name === 'QuotaExceededError' || error.code === 22) {
            // Try to free up space by trimming conversation history
            console.log('localStorage quota exceeded, trimming history...');
            if (AppState.conversationHistory.length > 20) {
                AppState.conversationHistory = AppState.conversationHistory.slice(-20);
                try {
                    localStorage.setItem('mhh_conversation_history', JSON.stringify(AppState.conversationHistory));
                    showNotification('Storage limit reached. Older conversations were trimmed.', 'warning');
                } catch (retryError) {
                    console.error('Failed to save even after trimming:', retryError);
                    showNotification('Storage full. Consider exporting your data and clearing old conversations.', 'error');
                }
            }
        } else if (error.message && error.message.includes('localStorage')) {
            showNotification('Unable to save data. Please check browser settings allow local storage.', 'warning');
        }
    }
}

function clearAllData() {
    if (!STORAGE_AVAILABLE) {
        showNotification('localStorage is not available in this browser', 'warning');
        return;
    }

    if (confirm('Are you sure? This will delete all your conversations and progress. This cannot be undone.')) {
        try {
            localStorage.clear();
            location.reload();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            showNotification('Failed to clear data. Please try again.', 'error');
        }
    }
}

// ==================== MODE SWITCHING ====================
function switchMode(mode) {
    AppState.mode = mode;

    // Update button states and ARIA attributes
    document.querySelectorAll('.mode-btn').forEach(btn => {
        const isActive = btn.dataset.mode === mode;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive);
    });

    // Update descriptions
    document.querySelectorAll('.desc-content').forEach(desc => {
        desc.classList.remove('active');
    });
    const descEl = safeGetElement(mode === 'learn' ? 'learnDesc' : 'chatDesc');
    if (descEl) descEl.classList.add('active');

    // Show/hide skill progress
    const skillProgress = safeGetElement('skillProgress');
    if (skillProgress) {
        if (mode === 'learn') {
            skillProgress.classList.add('active');
            skillProgress.style.display = 'block';
        } else {
            skillProgress.classList.remove('active');
            skillProgress.style.display = 'none';
        }
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
    // Check if body is ready
    if (!document.body) {
        console.warn('Cannot show notification: document.body not ready');
        return;
    }

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

    if (!input) {
        console.error('Message input element not found');
        return;
    }

    let message = input.value.trim();

    if (!message) return;

    // Validate and sanitize input
    try {
        message = validateInput(message, 5000);
    } catch (error) {
        showNotification(error.message, 'error');
        return;
    }

    // Check license limits
    const canSend = LicenseManager.canSendMessage();
    if (!canSend.allowed) {
        showUpgradeModal(canSend);
        return;
    }

    // Check if API key is set
    if (!AppState.apiKey && AppState.apiProvider !== 'local') {
        showNotification('Please set your API key in Settings (⚙️) first.', 'warning');
        openSettings();
        return;
    }

    // Rate limiting
    if (!RateLimiter.canMakeCall()) {
        const waitTime = Math.ceil(RateLimiter.getWaitTime() / 1000);
        showNotification(`Please wait ${waitTime} second(s) before sending another message.`, 'warning');
        return;
    }

    // Disable send button and show loading state
    const sendBtn = document.getElementById('sendBtn');
    const micBtn = document.getElementById('micBtn');
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.classList.add('loading');
    }
    if (micBtn) {
        micBtn.disabled = true;
    }
    input.disabled = true;

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

    // FIX: Limit history to prevent memory crash
    if (AppState.conversationHistory.length > CONFIG.MAX_CONVERSATION_HISTORY) {
        console.log(`Trimming history to last ${CONFIG.MAX_CONVERSATION_HISTORY} messages`);
        AppState.conversationHistory = AppState.conversationHistory.slice(-CONFIG.MAX_CONVERSATION_HISTORY);
    }

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

        // Increment message count
        LicenseManager.incrementMessageCount();
        updateLicenseUI();

        // Update skill progress (if in learn mode)
        if (AppState.mode === 'learn') {
            updateSkillFromConversation(message, aiResponse);
        }

        // Save to localStorage
        saveToLocalStorage();

    } catch (error) {
        console.error('Error getting AI response:', error);
        hideTypingIndicator();
        const errorMsg = error.message || 'Unknown error occurred';
        addMessageToUI('bot', `❌ Error: ${errorMsg}. Please check your API key and internet connection in Settings.`);
    } finally {
        // Re-enable send button and input
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.classList.remove('loading');
        }
        if (micBtn) {
            micBtn.disabled = false;
        }
        input.disabled = false;
        input.focus();
    }
}

function addMessageToUI(role, content, emotions = null) {
    const messagesContainer = document.getElementById('chatMessages');

    if (!messagesContainer) {
        console.error('Cannot add message: chat messages container not found');
        return;
    }

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
    // Sanitize text first to prevent XSS
    const sanitized = sanitizeHTML(text);

    // Simple markdown-like formatting (safe because text is already sanitized)
    let formatted = sanitized
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')               // Italic
        .replace(/\n/g, '</p><p>')                          // Paragraphs
        .replace(/• /g, '<br>• ');                          // Bullet points

    return `<p>${formatted}</p>`;
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');

    if (!messagesContainer) {
        console.warn('Cannot show typing indicator: messages container not found');
        return;
    }

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
    // Use the enhanced MHH engine's comprehensive system prompt builder
    return AppState.mhhEngine.buildSystemPrompt(AppState.mode, AppState.userSkillLevel);
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
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
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your OpenAI API key in Settings.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else if (response.status >= 500) {
                throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
            }

            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `API error (${response.status})`);
        }

        const data = await response.json();
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenAI');
        }
        return data.choices[0].message.content;

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your internet connection and try again.');
        }
        throw error;
    }
}

async function callAnthropic(systemPrompt, userPrompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
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
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your Anthropic API key in Settings.');
            } else if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait a moment and try again.');
            } else if (response.status >= 500) {
                throw new Error('Anthropic service is temporarily unavailable. Please try again later.');
            }

            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || `API error (${response.status})`);
        }

        const data = await response.json();
        if (!data.content || !data.content[0] || !data.content[0].text) {
            throw new Error('Invalid response format from Anthropic');
        }
        return data.content[0].text;

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please check your internet connection and try again.');
        }
        throw error;
    }
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
    const levelEl = safeGetElement('overallLevel');
    const vocabEl = safeGetElement('vocabProgress');
    const analysisEl = safeGetElement('analysisProgress');
    const webbEl = safeGetElement('webbProgress');

    if (levelEl) {
        levelEl.textContent = AppState.userSkillLevel.charAt(0).toUpperCase() + AppState.userSkillLevel.slice(1);
    }
    if (vocabEl) vocabEl.style.width = AppState.skillScores.vocabulary + '%';
    if (analysisEl) analysisEl.style.width = AppState.skillScores.analysis + '%';
    if (webbEl) webbEl.style.width = AppState.skillScores.webb + '%';
}

// ==================== CONVERSATION HISTORY ====================
function displayConversationHistory() {
    const messagesContainer = document.getElementById('chatMessages');

    if (!messagesContainer) {
        console.warn('Chat messages container not found, skipping history display');
        return;
    }

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

// ==================== LICENSE UI ====================
function updateLicenseUI() {
    const tier = LicenseManager.getCurrentTier();
    const remaining = LicenseManager.getMessagesRemaining();
    const percentage = LicenseManager.getUsagePercentage();

    // Update header badge
    let headerBadge = document.getElementById('licenseBadge');
    if (!headerBadge) {
        headerBadge = document.createElement('div');
        headerBadge.id = 'licenseBadge';
        headerBadge.className = 'license-badge';
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            headerContent.appendChild(headerBadge);
        } else {
            // Can't add badge if header doesn't exist yet
            console.warn('Header content not found, skipping license badge');
            return;
        }
    }

    // Safety check: only update if badge exists in DOM
    if (!headerBadge || !headerBadge.parentNode) {
        console.warn('License badge not in DOM, skipping update');
        return;
    }

    if (AppState.license.tier === 'free') {
        headerBadge.innerHTML = `
            <span class="tier-name">Free</span>
            <span class="tier-usage">${remaining}/20 messages left</span>
        `;
        headerBadge.className = 'license-badge free-tier';

        // Show warning at 80% usage
        if (percentage >= 80) {
            headerBadge.classList.add('warning');
        }
    } else {
        headerBadge.innerHTML = `
            <span class="tier-name">${tier.name}</span>
            <span class="tier-usage">✓ Unlimited</span>
        `;
        headerBadge.className = `license-badge ${AppState.license.tier}-tier`;
    }
}

function showUpgradeModal(limitInfo) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('upgradeModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'upgradeModal';
        modal.className = 'modal upgrade-modal';
        modal.innerHTML = `
            <div class="modal-content upgrade-content">
                <button class="close-btn" onclick="closeUpgradeModal()" aria-label="Close">&times;</button>

                <div class="upgrade-hero">
                    <div class="upgrade-icon">🚀</div>
                    <h2>You've Reached Your Monthly Limit</h2>
                    <p>You've used all ${limitInfo.limit} free messages this month. Upgrade to continue your emotional intelligence journey!</p>
                </div>

                <div class="pricing-tiers">
                    <div class="pricing-card">
                        <div class="tier-header">
                            <h3>Free</h3>
                            <div class="tier-price">$0<span>/month</span></div>
                        </div>
                        <ul class="tier-features">
                            <li>✓ 20 messages/month</li>
                            <li>✓ Learn Mode</li>
                            <li>✓ Chat Mode</li>
                            <li>✓ Basic analytics</li>
                            <li>✗ History export</li>
                            <li>✗ Advanced analytics</li>
                        </ul>
                        <div class="tier-current">Current Plan</div>
                    </div>

                    <div class="pricing-card featured">
                        <div class="tier-badge">MOST POPULAR</div>
                        <div class="tier-header">
                            <h3>Premium</h3>
                            <div class="tier-price">$9.99<span>/month</span></div>
                        </div>
                        <ul class="tier-features">
                            <li>✓ Unlimited messages</li>
                            <li>✓ Learn Mode</li>
                            <li>✓ Chat Mode</li>
                            <li>✓ Basic analytics</li>
                            <li>✓ History export</li>
                            <li>✓ Advanced analytics</li>
                        </ul>
                        <a href="pricing.html" class="tier-cta">Upgrade to Premium</a>
                    </div>

                    <div class="pricing-card">
                        <div class="tier-header">
                            <h3>Pro</h3>
                            <div class="tier-price">$19.99<span>/month</span></div>
                        </div>
                        <ul class="tier-features">
                            <li>✓ Everything in Premium</li>
                            <li>✓ White-label</li>
                            <li>✓ Client tracking</li>
                            <li>✓ Priority support</li>
                            <li>✓ For therapists/coaches</li>
                        </ul>
                        <a href="pricing.html" class="tier-cta secondary">Upgrade to Pro</a>
                    </div>
                </div>

                <div class="upgrade-footer">
                    <p>💳 No commitment • Cancel anytime • 30-day money-back guarantee</p>
                    <button class="link-btn" onclick="showLicenseActivation()">Already have a license key?</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    modal.classList.add('active');
}

function closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function showLicenseActivation() {
    closeUpgradeModal();

    const key = prompt('Enter your license key:\n\nFormat: PREMIUM-XXXX-XXXX-XXXX or PRO-XXXX-XXXX-XXXX');

    if (!key) return;

    const result = LicenseManager.activateLicense(key);

    if (result.success) {
        showNotification(`🎉 License activated! You're now on the ${result.tier.toUpperCase()} tier.`, 'success');
        updateLicenseUI();
    } else {
        showNotification(`❌ ${result.error}`, 'error');
    }
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
window.closeUpgradeModal = closeUpgradeModal;
window.showLicenseActivation = showLicenseActivation;
