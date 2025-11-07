/**
 * EmotiScope - Bug Fixes and Improvements
 * This file contains critical patches for app.js
 * Apply these fixes to resolve all identified bugs
 */

// ==================== CONFIGURATION CONSTANTS ====================
const CONFIG = {
    MAX_CONVERSATION_HISTORY: 100,
    MAX_MESSAGE_LENGTH: 5000,
    API_TIMEOUT: 30000,
    RATE_LIMIT_INTERVAL: 1000,
    MAX_CONCURRENT_NOTIFICATIONS: 3,
    DEBOUNCE_DELAY: 300,
    VOICE_RECOGNITION_DEBOUNCE: 500
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Safely get DOM element with error handling
 */
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

/**
 * Debounce function to limit execution rate
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Safely parse JSON with validation
 */
function safeJSONParse(jsonString, defaultValue = null) {
    try {
        const parsed = JSON.parse(jsonString);
        return parsed !== null && typeof parsed === 'object' ? parsed : defaultValue;
    } catch (error) {
        console.error('JSON parse error:', error);
        return defaultValue;
    }
}

/**
 * Validate object structure
 */
function validateObject(obj, requiredKeys) {
    if (!obj || typeof obj !== 'object') return false;
    return requiredKeys.every(key => key in obj);
}

/**
 * Notification manager to limit concurrent notifications
 */
const NotificationManager = {
    notifications: [],
    maxNotifications: CONFIG.MAX_CONCURRENT_NOTIFICATIONS,

    show(message, type = 'info') {
        // Remove oldest if at max
        if (this.notifications.length >= this.maxNotifications) {
            const oldest = this.notifications.shift();
            if (oldest && oldest.parentNode) {
                oldest.parentNode.removeChild(oldest);
            }
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: ${20 + (this.notifications.length * 80)}px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : type === 'success' ? '#10b981' : '#6366f1'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            transition: top 0.3s ease;
        `;

        document.body.appendChild(notification);
        this.notifications.push(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                    const index = this.notifications.indexOf(notification);
                    if (index > -1) {
                        this.notifications.splice(index, 1);
                    }
                    // Reposition remaining notifications
                    this.reposition();
                }
            }, 300);
        }, 3000);
    },

    reposition() {
        this.notifications.forEach((notif, index) => {
            notif.style.top = `${20 + (index * 80)}px`;
        });
    }
};

// ==================== FIXED LICENSE MANAGER ====================
const LicenseManagerFixed = {
    ...LicenseManager,

    loadLicense() {
        try {
            const savedLicense = localStorage.getItem('emotiscope_license');
            if (savedLicense) {
                const license = safeJSONParse(savedLicense, {});
                // Validate license structure
                if (validateObject(license, ['tier'])) {
                    AppState.license = {
                        tier: license.tier || 'free',
                        key: license.key || null,
                        validUntil: license.validUntil || null
                    };
                }
            }
        } catch (error) {
            console.error('Error loading license:', error);
            NotificationManager.show('Failed to load license. Using free tier.', 'warning');
        }
    },

    loadMessageCount() {
        try {
            const saved = localStorage.getItem('emotiscope_message_count');
            if (saved) {
                const data = safeJSONParse(saved, {});
                if (validateObject(data, ['count', 'monthStart'])) {
                    this.messageCount = typeof data.count === 'number' ? data.count : 0;
                    this.monthStart = data.monthStart || new Date().toISOString();
                } else {
                    this.messageCount = 0;
                    this.monthStart = new Date().toISOString();
                }
            } else {
                this.messageCount = 0;
                this.monthStart = new Date().toISOString();
            }
        } catch (error) {
            console.error('Error loading message count:', error);
            this.messageCount = 0;
            this.monthStart = new Date().toISOString();
        }
    },

    saveLicense() {
        try {
            localStorage.setItem('emotiscope_license', JSON.stringify(AppState.license));
        } catch (error) {
            console.error('Error saving license:', error);
            NotificationManager.show('Failed to save license. Please try again.', 'error');
        }
    }
};

// ==================== FIXED LOCAL STORAGE OPERATIONS ====================
function saveToLocalStorageFixed() {
    try {
        // Trim conversation history to max limit
        if (AppState.conversationHistory.length > CONFIG.MAX_CONVERSATION_HISTORY) {
            AppState.conversationHistory = AppState.conversationHistory.slice(-CONFIG.MAX_CONVERSATION_HISTORY);
        }

        localStorage.setItem('mhh_api_provider', AppState.apiProvider);
        localStorage.setItem('mhh_api_key', AppState.apiKey);
        localStorage.setItem('mhh_mode', AppState.mode);
        localStorage.setItem('mhh_conversation_history', JSON.stringify(AppState.conversationHistory));
        localStorage.setItem('mhh_skill_level', AppState.userSkillLevel);
        localStorage.setItem('mhh_skill_scores', JSON.stringify(AppState.skillScores));
        localStorage.setItem('mhh_settings', JSON.stringify(AppState.settings));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        if (error.name === 'QuotaExceededError') {
            NotificationManager.show('Storage full! Clearing old messages...', 'warning');
            // Clear old messages and try again
            AppState.conversationHistory = AppState.conversationHistory.slice(-50);
            try {
                localStorage.setItem('mhh_conversation_history', JSON.stringify(AppState.conversationHistory));
                NotificationManager.show('Storage cleared. Please continue.', 'success');
            } catch (e) {
                NotificationManager.show('Failed to save. Consider exporting your data.', 'error');
            }
        } else {
            NotificationManager.show('Failed to save data. Check browser settings.', 'error');
        }
    }
}

function loadFromLocalStorageFixed() {
    try {
        // Load API settings with validation
        const savedProvider = localStorage.getItem('mhh_api_provider');
        const savedApiKey = localStorage.getItem('mhh_api_key');
        const savedMode = localStorage.getItem('mhh_mode');

        if (savedProvider) {
            AppState.apiProvider = savedProvider;
            const providerElement = safeGetElement('aiProvider');
            if (providerElement) {
                providerElement.value = savedProvider;
            }
        }

        if (savedApiKey) {
            AppState.apiKey = savedApiKey;
            const apiKeyElement = safeGetElement('apiKey');
            if (apiKeyElement) {
                apiKeyElement.value = savedApiKey;
            }
        }

        if (savedMode && (savedMode === 'learn' || savedMode === 'chat')) {
            AppState.mode = savedMode;
            switchModeFixed(savedMode);
        }

        // Load conversation history with validation
        const savedHistory = localStorage.getItem('mhh_conversation_history');
        if (savedHistory) {
            const history = safeJSONParse(savedHistory, []);
            if (Array.isArray(history)) {
                // Validate each message
                AppState.conversationHistory = history.filter(msg =>
                    validateObject(msg, ['role', 'content'])
                ).slice(-CONFIG.MAX_CONVERSATION_HISTORY);
            }
        }

        // Load skill progress with validation
        const savedSkillLevel = localStorage.getItem('mhh_skill_level');
        if (savedSkillLevel && ['novice', 'intermediate', 'advanced', 'mastery'].includes(savedSkillLevel)) {
            AppState.userSkillLevel = savedSkillLevel;
        }

        const savedSkillScores = localStorage.getItem('mhh_skill_scores');
        if (savedSkillScores) {
            const scores = safeJSONParse(savedSkillScores, {});
            if (validateObject(scores, ['vocabulary', 'analysis', 'webb'])) {
                AppState.skillScores = {
                    vocabulary: Math.min(100, Math.max(0, scores.vocabulary || 0)),
                    analysis: Math.min(100, Math.max(0, scores.analysis || 0)),
                    webb: Math.min(100, Math.max(0, scores.webb || 0))
                };
            }
        }

        // Load settings with validation
        const savedSettings = localStorage.getItem('mhh_settings');
        if (savedSettings) {
            const settings = safeJSONParse(savedSettings, {});
            AppState.settings = { ...AppState.settings, ...settings };

            const ttsEnabled = safeGetElement('ttsEnabled');
            if (ttsEnabled) {
                ttsEnabled.checked = AppState.settings.ttsEnabled;
            }

            const showAnalysis = safeGetElement('showEmotionalAnalysis');
            if (showAnalysis) {
                showAnalysis.checked = AppState.settings.showEmotionalAnalysis;
            }
        }

    } catch (error) {
        console.error('Error loading from localStorage:', error);
        NotificationManager.show('Failed to load saved data. Starting fresh.', 'warning');
    }
}

// ==================== FIXED MODE SWITCHING ====================
function switchModeFixed(mode) {
    AppState.mode = mode;

    // Update button states and ARIA attributes with null checks
    document.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.dataset && btn.dataset.mode) {
            const isActive = btn.dataset.mode === mode;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        }
    });

    // Update descriptions with null checks
    document.querySelectorAll('.desc-content').forEach(desc => {
        desc.classList.remove('active');
    });

    const descId = mode === 'learn' ? 'learnDesc' : 'chatDesc';
    const descElement = safeGetElement(descId);
    if (descElement) {
        descElement.classList.add('active');
    }

    // Show/hide skill progress with null check
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

    saveToLocalStorageFixed();
}

// ==================== FIXED VOICE RECOGNITION WITH DEBOUNCING ====================
let voiceRecognitionDebounce = null;

function toggleVoiceInputFixed() {
    // Clear any pending debounce
    if (voiceRecognitionDebounce) {
        clearTimeout(voiceRecognitionDebounce);
    }

    // Debounce to prevent rapid clicks
    voiceRecognitionDebounce = setTimeout(() => {
        if (!AppState.recognition) {
            NotificationManager.show('Speech recognition not supported in this browser. Try Chrome or Edge.', 'error');
            return;
        }

        if (!AppState.settings.voiceInputEnabled) {
            NotificationManager.show('Voice input is disabled. Enable it in Settings.', 'warning');
            return;
        }

        if (AppState.isListening) {
            // Stop listening
            try {
                AppState.recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
                AppState.isListening = false;
            }
        } else {
            // Start listening
            try {
                AppState.recognition.start();
            } catch (error) {
                console.error('Failed to start speech recognition:', error);
                // Check if it's already running
                if (error.message && error.message.includes('already')) {
                    NotificationManager.show('Voice recognition already active. Please wait.', 'warning');
                } else {
                    NotificationManager.show('Failed to start microphone. Please try again.', 'error');
                }
            }
        }
    }, CONFIG.VOICE_RECOGNITION_DEBOUNCE);
}

// ==================== FIXED TEXT AREA RESIZE WITH DEBOUNCING ====================
const debouncedResizeTextarea = debounce((textarea) => {
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
}, CONFIG.DEBOUNCE_DELAY);

// ==================== FIXED SEND MESSAGE WITH CHECKS ====================
async function sendMessageFixed() {
    const input = safeGetElement('messageInput');
    if (!input) {
        console.error('Message input not found');
        return;
    }

    let message = input.value.trim();
    if (!message) return;

    // Check if MHH Engine is loaded
    if (!AppState.mhhEngine) {
        NotificationManager.show('Emotion engine not loaded. Please refresh the page.', 'error');
        return;
    }

    // Validate and sanitize input
    try {
        message = validateInput(message, CONFIG.MAX_MESSAGE_LENGTH);
    } catch (error) {
        NotificationManager.show(error.message, 'error');
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
        NotificationManager.show('Please set your API key in Settings (⚙️) first.', 'warning');
        openSettings();
        return;
    }

    // Rate limiting
    if (!RateLimiter.canMakeCall()) {
        const waitTime = Math.ceil(RateLimiter.getWaitTime() / 1000);
        NotificationManager.show(`Please wait ${waitTime} second(s) before sending another message.`, 'warning');
        return;
    }

    // Disable send button and show loading state
    const sendBtn = safeGetElement('sendBtn');
    const micBtn = safeGetElement('micBtn');

    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.classList.add('loading');
    }
    if (micBtn) micBtn.disabled = true;
    input.disabled = true;

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Add user message to UI
    addMessageToUI('user', message);

    // Add to conversation history with limit
    AppState.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
    });

    // Trim history if too long
    if (AppState.conversationHistory.length > CONFIG.MAX_CONVERSATION_HISTORY) {
        AppState.conversationHistory = AppState.conversationHistory.slice(-CONFIG.MAX_CONVERSATION_HISTORY);
    }

    // Show typing indicator
    showTypingIndicator();

    // Analyze emotion
    try {
        const emotionalAnalysis = AppState.mhhEngine.analyzeText(message);
        const emotions = AppState.mhhEngine.calculateAllEmotions(emotionalAnalysis);

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
        updateLicenseUIFixed();

        // Update skill progress (if in learn mode)
        if (AppState.mode === 'learn') {
            updateSkillFromConversation(message, aiResponse);
        }

        // Save to localStorage
        saveToLocalStorageFixed();

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
        if (micBtn) micBtn.disabled = false;
        input.disabled = false;
        input.focus();
    }
}

// ==================== FIXED LICENSE UI ====================
function updateLicenseUIFixed() {
    const tier = LicenseManager.getCurrentTier();
    const remaining = LicenseManager.getMessagesRemaining();
    const percentage = LicenseManager.getUsagePercentage();

    // Update header badge with null checks
    let headerBadge = safeGetElement('licenseBadge');
    const headerContent = document.querySelector('.header-content');

    if (!headerBadge && headerContent) {
        headerBadge = document.createElement('div');
        headerBadge.id = 'licenseBadge';
        headerBadge.className = 'license-badge';
        headerContent.appendChild(headerBadge);
    }

    if (headerBadge) {
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
}

// ==================== FIXED SKILL PROGRESS ====================
function updateSkillProgressFixed() {
    const overallLevel = safeGetElement('overallLevel');
    if (overallLevel) {
        overallLevel.textContent = AppState.userSkillLevel.charAt(0).toUpperCase() + AppState.userSkillLevel.slice(1);
    }

    const vocabProgress = safeGetElement('vocabProgress');
    if (vocabProgress) {
        vocabProgress.style.width = Math.min(100, Math.max(0, AppState.skillScores.vocabulary)) + '%';
    }

    const analysisProgress = safeGetElement('analysisProgress');
    if (analysisProgress) {
        analysisProgress.style.width = Math.min(100, Math.max(0, AppState.skillScores.analysis)) + '%';
    }

    const webbProgress = safeGetElement('webbProgress');
    if (webbProgress) {
        webbProgress.style.width = Math.min(100, Math.max(0, AppState.skillScores.webb)) + '%';
    }
}

// ==================== FIXED WELCOME MESSAGE ====================
function displayConversationHistoryFixed() {
    const messagesContainer = safeGetElement('chatMessages');
    if (!messagesContainer) {
        console.error('Chat messages container not found');
        return;
    }

    // Clone and keep the welcome message
    const welcomeMessage = messagesContainer.querySelector('.bot-message');
    const welcomeClone = welcomeMessage ? welcomeMessage.cloneNode(true) : null;

    // Clear all messages
    messagesContainer.innerHTML = '';

    // Re-add welcome message
    if (welcomeClone) {
        messagesContainer.appendChild(welcomeClone);
    }

    // Display saved messages
    if (Array.isArray(AppState.conversationHistory)) {
        AppState.conversationHistory.forEach(msg => {
            if (msg && validateObject(msg, ['role', 'content'])) {
                if (msg.role === 'user') {
                    addMessageToUI('user', msg.content);
                } else {
                    addMessageToUI('bot', msg.content, msg.emotions || null);
                }
            }
        });
    }
}

// ==================== EXPORT FIXED FUNCTIONS ====================
if (typeof window !== 'undefined') {
    window.EmotiScopeFixes = {
        NotificationManager,
        saveToLocalStorageFixed,
        loadFromLocalStorageFixed,
        switchModeFixed,
        toggleVoiceInputFixed,
        debouncedResizeTextarea,
        sendMessageFixed,
        updateLicenseUIFixed,
        updateSkillProgressFixed,
        displayConversationHistoryFixed,
        safeGetElement,
        debounce,
        safeJSONParse,
        validateObject,
        CONFIG
    };
}
