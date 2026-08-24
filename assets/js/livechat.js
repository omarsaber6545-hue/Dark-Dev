/**
 * ==============================================================================
 * DARK LIVE CHAT CLIENT ENGINE
 * Real-time WebSockets, Discord Relay Synchronization, & Local Storage Persistence
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // Configuration & Server URL
    // -------------------------------------------------------------------------
    const BACKEND_URL = window.DARK_CHAT_SERVER_URL || 'http://localhost:5000';
    
    // State
    let socket = null;
    let sessionId = localStorage.getItem('dark_chat_session_id') || null;
    let guestName = localStorage.getItem('dark_chat_guest_name') || '';
    let guestContact = localStorage.getItem('dark_chat_contact_info') || '';
    let guestTopic = localStorage.getItem('dark_chat_topic') || '';
    let isWidgetOpen = false;
    let unreadCount = 0;
    let typingTimeout = null;
    let isSending = false;

    // -------------------------------------------------------------------------
    // DOM Elements Creation (Inject Widget HTML)
    // -------------------------------------------------------------------------
    injectChatWidgetHTML();

    const launcherBtn = document.getElementById('darkChatLauncher');
    const chatWidget = document.getElementById('darkChatWidget');
    const onboardingView = document.getElementById('darkChatOnboarding');
    const activeChatView = document.getElementById('darkChatActiveView');
    const onboardingForm = document.getElementById('darkChatOnboardingForm');
    const chatBody = document.getElementById('darkChatBody');
    const chatInput = document.getElementById('darkChatInput');
    const chatForm = document.getElementById('darkChatForm');
    const typingIndicator = document.getElementById('darkChatTyping');
    const unreadBadge = document.getElementById('darkChatUnreadBadge');
    const btnMinimize = document.getElementById('darkChatMinimize');
    const btnCloseSession = document.getElementById('darkChatCloseSession');

    // -------------------------------------------------------------------------
    // Check & Render Appropriate View (Onboarding vs Active Chat)
    // -------------------------------------------------------------------------
    function checkViewState() {
        if (guestName && guestContact) {
            if (onboardingView) onboardingView.style.display = 'none';
            if (activeChatView) activeChatView.style.display = 'flex';
        } else {
            if (onboardingView) onboardingView.style.display = 'flex';
            if (activeChatView) activeChatView.style.display = 'none';
        }
    }
    checkViewState();

    // -------------------------------------------------------------------------
    // Web Audio Synthesizer (Subtle luxury chime for support replies)
    // -------------------------------------------------------------------------
    function playNotificationSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch (e) {
            // AudioContext not allowed before user gesture
        }
    }

    // -------------------------------------------------------------------------
    // Initialize Socket.IO Connection
    // -------------------------------------------------------------------------
    function initSocket() {
        if (typeof io === 'undefined') {
            console.warn('⚠️ Socket.IO client library not loaded. Live chat will initialize when connected.');
            return;
        }

        socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            reconnectionDelay: 2000
        });

        socket.on('connect', () => {
            console.log('⚡ Connected to DARK Live Chat Server:', socket.id);
            updateConnectionStatus(true);
            if (guestName && guestContact) {
                initSession();
            }
        });

        socket.on('disconnect', () => {
            console.log('🔌 Disconnected from Live Chat Server');
            updateConnectionStatus(false);
        });

        socket.on('connect_error', () => {
            updateConnectionStatus(false);
        });

        // Incoming support reply from Discord
        socket.on('support_message', (msg) => {
            appendMessage({
                id: msg.id,
                sender: 'support',
                content: msg.content,
                createdAt: msg.createdAt,
                supportName: msg.supportName
            });

            playNotificationSound();

            if (!isWidgetOpen) {
                unreadCount++;
                updateUnreadBadge();
            }
        });

        // Echo for user message from other tabs
        socket.on('new_message', (msg) => {
            if (msg.sender === 'user') {
                const existing = document.querySelector(`[data-msg-id="${msg.id}"]`);
                if (!existing) {
                    appendMessage(msg);
                }
            }
        });

        // Typing indicator from support
        socket.on('support_typing', ({ isTyping }) => {
            if (typingIndicator) {
                if (isTyping) typingIndicator.classList.add('active');
                else typingIndicator.classList.remove('active');
                scrollToBottom();
            }
        });

        // Rate Limit Warning
        socket.on('rate_limit_exceeded', ({ message }) => {
            showChatNotice(message, 'warning');
        });
    }

    // -------------------------------------------------------------------------
    // Session Initialization
    // -------------------------------------------------------------------------
    function initSession() {
        if (!socket || !socket.connected) return;

        socket.emit('init_session', { sessionId, guestName }, (res) => {
            if (res && res.success) {
                sessionId = res.session.id;
                localStorage.setItem('dark_chat_session_id', sessionId);

                // Render history
                if (res.history && Array.isArray(res.history)) {
                    clearMessages();
                    res.history.forEach(msg => appendMessage(msg, false));
                    scrollToBottom();
                }
            }
        });
    }

    // -------------------------------------------------------------------------
    // Onboarding Form Submission
    // -------------------------------------------------------------------------
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('darkChatInitName')?.value.trim();
            const contactVal = document.getElementById('darkChatInitContact')?.value.trim();
            const topicSelect = document.getElementById('darkChatInitTopic');
            const topicVal = topicSelect ? topicSelect.options[topicSelect.selectedIndex].text : 'استفسار عام';

            if (!nameVal || !contactVal) return;

            guestName = nameVal;
            guestContact = contactVal;
            guestTopic = topicVal;

            localStorage.setItem('dark_chat_guest_name', guestName);
            localStorage.setItem('dark_chat_contact_info', guestContact);
            localStorage.setItem('dark_chat_topic', guestTopic);

            checkViewState();
            initSession();

            // Welcome notice in chat
            showChatNotice(`مرحباً ${guestName}! تم توصيلك بدارك مباشرة، اكتب رسالتك الآن وستصله فوراً.`);
            setTimeout(() => {
                if (chatInput) chatInput.focus();
            }, 300);
        });
    }

    // -------------------------------------------------------------------------
    // Message Rendering
    // -------------------------------------------------------------------------
    function appendMessage(msg, shouldScroll = true) {
        if (!chatBody) return;

        const isUser = msg.sender === 'user';
        const row = document.createElement('div');
        row.className = `dark-chat-msg-row ${isUser ? 'user' : 'support'}`;
        if (msg.id) row.setAttribute('data-msg-id', msg.id);

        const timeStr = msg.createdAt 
            ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        row.innerHTML = `
            ${!isUser ? `
                <div class="dark-chat-msg-sender">
                    <svg viewBox="0 0 24 24" style="width:13px;height:13px;fill:#10b981"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9.5L4.5 8.2v5.6L12 18l7.5-4.2V8.2L12 11.5z"/></svg>
                    <span>${escapeHtml(msg.supportName || 'DARK DEV')}</span>
                </div>
            ` : ''}
            <div class="dark-chat-bubble">${escapeHtml(msg.content)}</div>
            <div class="dark-chat-msg-time">${timeStr}</div>
        `;

        chatBody.appendChild(row);
        if (shouldScroll) scrollToBottom();
    }

    function showChatNotice(text, type = 'info') {
        if (!chatBody) return;
        const notice = document.createElement('div');
        notice.className = 'dark-chat-system-card';
        notice.style.borderColor = type === 'warning' ? '#f59e0b' : 'rgba(255,255,255,0.12)';
        notice.innerHTML = `<span>${escapeHtml(text)}</span>`;
        chatBody.appendChild(notice);
        scrollToBottom();
    }

    function clearMessages() {
        if (!chatBody) return;
        chatBody.innerHTML = `
            <div class="dark-chat-system-card">
                <b>⚡ محادثة فورية مباشرة مع دارك</b>
                تواصل معي هنا مباشرة؛ ستصلني رسالتك فوراً على ديسكورد وسأرد عليك لحظياً هنا داخل الموقع.
            </div>
        `;
    }

    function scrollToBottom() {
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    // -------------------------------------------------------------------------
    // Form & Input Event Handlers
    // -------------------------------------------------------------------------
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sendMessage();
        });
    }

    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        chatInput.addEventListener('input', () => {
            // Auto resize
            chatInput.style.height = 'auto';
            chatInput.style.height = `${Math.min(chatInput.scrollHeight, 90)}px`;

            // Emit typing indicator
            if (socket && socket.connected && sessionId) {
                socket.emit('visitor_typing', { sessionId, isTyping: true });
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    socket.emit('visitor_typing', { sessionId, isTyping: false });
                }, 2000);
            }
        });
    }

    function sendMessage() {
        if (!chatInput || isSending) return;
        const content = chatInput.value.trim();
        if (!content) return;

        isSending = true;

        // Reset input
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Optimistically render message in UI immediately
        const tempId = `temp-${Date.now()}`;
        appendMessage({
            id: tempId,
            sender: 'user',
            content,
            createdAt: new Date().toISOString()
        });

        // Send via Socket.IO with full guest profile
        if (socket && socket.connected) {
            socket.emit('send_message', {
                sessionId,
                content,
                guestName,
                guestContact,
                guestTopic,
                url: window.location.href
            }, (res) => {
                isSending = false;
                if (res && res.success) {
                    const tempEl = document.querySelector(`[data-msg-id="${tempId}"]`);
                    if (tempEl && res.message && res.message.id) {
                        tempEl.setAttribute('data-msg-id', res.message.id);
                    }
                }
            });
        } else {
            isSending = false;
            showChatNotice('⚠️ تعذر الاتصال بالخادم اللحظي، يرجى التأكد من تشغيل خادم الباك إند.', 'warning');
        }
    }

    // -------------------------------------------------------------------------
    // Toggle Widget Open / Minimize
    // -------------------------------------------------------------------------
    function toggleChat(open) {
        isWidgetOpen = typeof open === 'boolean' ? open : !isWidgetOpen;
        if (isWidgetOpen) {
            chatWidget.classList.add('active');
            launcherBtn.classList.add('active');
            unreadCount = 0;
            updateUnreadBadge();
            scrollToBottom();
            setTimeout(() => {
                if (guestName && guestContact) {
                    if (chatInput) chatInput.focus();
                } else {
                    const initNameInput = document.getElementById('darkChatInitName');
                    if (initNameInput) initNameInput.focus();
                }
            }, 300);
        } else {
            chatWidget.classList.remove('active');
            launcherBtn.classList.remove('active');
        }
    }

    if (launcherBtn) launcherBtn.addEventListener('click', () => toggleChat());
    if (btnMinimize) btnMinimize.addEventListener('click', () => toggleChat(false));

    if (btnCloseSession) {
        btnCloseSession.addEventListener('click', () => {
            const confirmMsg = document.documentElement.lang === 'en' 
                ? 'End live chat session & reset details?' 
                : 'هل تريد إنهاء المحادثة وتغيير بياناتك لبدء جلسة جديدة؟';
            if (confirm(confirmMsg)) {
                if (socket && socket.connected && sessionId) {
                    socket.emit('close_session', { sessionId, guestName });
                }
                localStorage.removeItem('dark_chat_session_id');
                localStorage.removeItem('dark_chat_guest_name');
                localStorage.removeItem('dark_chat_contact_info');
                localStorage.removeItem('dark_chat_topic');
                sessionId = null;
                guestName = '';
                guestContact = '';
                guestTopic = '';
                checkViewState();
                clearMessages();
            }
        });
    }

    function updateUnreadBadge() {
        if (!unreadBadge) return;
        if (unreadCount > 0) {
            unreadBadge.textContent = unreadCount;
            unreadBadge.style.display = 'block';
        } else {
            unreadBadge.style.display = 'none';
        }
    }

    function updateConnectionStatus(isOnline) {
        const statusText = document.getElementById('darkChatStatusText');
        const statusDot = document.querySelector('.dark-chat-avatar-status');
        if (statusText) {
            statusText.textContent = isOnline 
                ? (document.documentElement.lang === 'en' ? 'Online & Available' : 'متصل ومتاح للرد')
                : (document.documentElement.lang === 'en' ? 'Connecting...' : 'جارٍ الاتصال...');
            statusText.style.color = isOnline ? 'var(--chat-online)' : 'var(--chat-muted)';
        }
        if (statusDot) {
            statusDot.style.background = isOnline ? 'var(--chat-online)' : '#ef4444';
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // -------------------------------------------------------------------------
    // HTML Template Injection
    // -------------------------------------------------------------------------
    function injectChatWidgetHTML() {
        if (document.getElementById('darkChatLauncher')) return;

        const container = document.createElement('div');
        container.id = 'darkChatContainer';
        container.innerHTML = `
            <!-- Floating Launcher Button -->
            <button id="darkChatLauncher" class="dark-chat-launcher" aria-label="Open Live Chat">
                <svg class="launcher-icon" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
                <svg class="launcher-close" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <div class="launcher-status-dot"></div>
                <div id="darkChatUnreadBadge" class="dark-chat-unread-badge">0</div>
            </button>

            <!-- Chat Window Widget -->
            <div id="darkChatWidget" class="dark-chat-widget" role="dialog" aria-modal="true">
                <!-- Header -->
                <div class="dark-chat-header">
                    <div class="dark-chat-header-profile">
                        <div class="dark-chat-avatar-wrapper">
                            <img src="assets/images/favicon.svg" alt="DARK Support">
                            <div class="dark-chat-avatar-status"></div>
                        </div>
                        <div class="dark-chat-header-info">
                            <h4>DARK <span class="support-badge">DEV</span></h4>
                            <p id="darkChatStatusText">متصل ومتاح للرد</p>
                        </div>
                    </div>
                    <div class="dark-chat-header-actions">
                        <button id="darkChatCloseSession" class="dark-chat-btn-action" title="إنهاء الجلسة / New Chat">
                            <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        </button>
                        <button id="darkChatMinimize" class="dark-chat-btn-action" title="تصغير / Minimize">
                            <svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                    </div>
                </div>

                <!-- 1. Onboarding Pre-Chat Form View -->
                <div id="darkChatOnboarding" class="dark-chat-onboarding-view">
                    <div class="dark-chat-onboarding-header">
                        <div class="onboarding-icon">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        </div>
                        <h3>مرحباً بك في الدعم المباشر</h3>
                        <p>يرجى إدخال بياناتك البسيطة لنتمكن من متابعة طلبك والتواصل معك فوراً.</p>
                    </div>

                    <form id="darkChatOnboardingForm" style="display:flex; flex-direction:column; gap:12px;">
                        <div class="dark-chat-field-group">
                            <label>الاسم أو اللقب *</label>
                            <input type="text" id="darkChatInitName" class="dark-chat-field-input" placeholder="اكتب اسمك أو يوزرك..." required>
                        </div>

                        <div class="dark-chat-field-group">
                            <label>وسيلة التواصل (ديسكورد / بريد / هاتف) *</label>
                            <input type="text" id="darkChatInitContact" class="dark-chat-field-input" placeholder="user#0001 أو email@domain.com..." required>
                        </div>

                        <div class="dark-chat-field-group">
                            <label>نوع الاستفسار أو المشروع</label>
                            <select id="darkChatInitTopic" class="dark-chat-field-input" style="background:#000000;">
                                <option value="bot">بوت ديسكورد مخصص (Discord Bot)</option>
                                <option value="game">تطوير لعبة أو مود (Game / Mod)</option>
                                <option value="software">برنامج مكتبي أو نظام (Software / Tool)</option>
                                <option value="web">موقع أو تطبيق ويب (Full-Stack Web)</option>
                                <option value="other">استشارة عامة / أخرى</option>
                            </select>
                        </div>

                        <button type="submit" class="dark-chat-btn-start">
                            <span>بدء المحادثة الفورية مع دارك</span>
                            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M13 3L4 14h7v7l9-11h-7z"/></svg>
                        </button>
                    </form>
                </div>

                <!-- 2. Active Chat View Container -->
                <div id="darkChatActiveView" style="display:none; flex-direction:column; flex:1; overflow:hidden;">
                    <!-- Messages Body -->
                    <div id="darkChatBody" class="dark-chat-body">
                        <div class="dark-chat-system-card">
                            <b>⚡ محادثة فورية مباشرة مع دارك</b>
                            تواصل معي هنا مباشرة؛ ستصلني رسالتك فوراً على ديسكورد وسأرد عليك لحظياً هنا داخل الموقع.
                        </div>
                    </div>

                    <!-- Typing Indicator -->
                    <div id="darkChatTyping" class="dark-chat-typing-indicator">
                        <span class="typing-label">دارك يكتب الآن</span>
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <!-- Footer & Input -->
                    <div class="dark-chat-footer">
                        <form id="darkChatForm" class="dark-chat-input-form">
                            <textarea id="darkChatInput" class="dark-chat-input" placeholder="اكتب رسالتك لدارك مباشرة..." rows="1" required></textarea>
                            <button type="submit" class="dark-chat-btn-send" aria-label="إرسال الرسالة">
                                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                            </button>
                        </form>
                        <div class="dark-chat-footer-hint">⚡ POWERED BY DARK DEV • 2026</div>
                    </div>
                </div>

            </div>
        `;
        document.body.appendChild(container);
    }

    // Initialize Socket
    initSocket();
});
