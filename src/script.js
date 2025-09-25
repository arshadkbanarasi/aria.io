// ARIA Chatbot JavaScript (Gemini Version)
// Author: Your Name
// Description: Vanilla JavaScript implementation of ARIA AI Chatbot with Google Gemini API

// Gemini API Configuration
// Replace 'PUT_YOUR_GEMINI_API_KEY_HERE' with your actual Gemini API key
const GEMINI_API_KEY = 'AIzaSyAuccR4b_2WGtF39dMo8XDNrwdeiNuJy8k';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Global Variables
let messages = [];
let isLoading = false;
let isDarkMode = false;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const newChatBtn = document.getElementById('newChatBtn');
const themeToggleBtn = document.getElementById('themeToggle');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatContainer = document.getElementById('chatContainer');
const messagesArea = document.getElementById('messagesArea');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const toast = document.getElementById('toast');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    adjustTextareaHeight();
    loadThemePreference();
});

// Event Listeners
function initializeEventListeners() {
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
    newChatBtn.addEventListener('click', startNewChat);
    themeToggleBtn.addEventListener('click', toggleTheme);
    chatForm.addEventListener('submit', handleFormSubmit);
    messageInput.addEventListener('input', adjustTextareaHeight);
    messageInput.addEventListener('keydown', handleKeyDown);

    const suggestionCards = document.querySelectorAll('.suggestion-card');
    suggestionCards.forEach(card => {
        card.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            if (prompt) sendMessage(prompt);
        });
    });
}

// Sidebar
function toggleSidebar() {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
}
function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
}

// Theme
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    const icon = themeToggleBtn.querySelector('i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('darkMode', isDarkMode);
}
function loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        isDarkMode = true;
        document.body.classList.add('dark');
        themeToggleBtn.querySelector('i').className = 'fas fa-sun';
    }
}

// Chat
function handleFormSubmit(e) {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message && !isLoading) sendMessage(message);
}
function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleFormSubmit(e);
    }
}
function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
}

async function sendMessage(messageText) {
    if (!messageText.trim() || isLoading) return;
    welcomeScreen.style.display = 'none';
    chatContainer.style.display = 'block';

    const userMessage = {
        id: Date.now().toString(),
        content: messageText,
        sender: 'user',
        timestamp: new Date()
    };
    messages.push(userMessage);
    displayMessage(userMessage);

    messageInput.value = '';
    adjustTextareaHeight();
    isLoading = true;
    updateSendButton();
    displayLoadingMessage();

    try {
        const aiResponse = await getAIResponse(messages);
        removeLoadingMessage();

        const assistantMessage = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            sender: 'assistant',
            timestamp: new Date()
        };
        messages.push(assistantMessage);
        displayMessage(assistantMessage);

    } catch (error) {
        console.error('Error getting AI response:', error);
        removeLoadingMessage();
        const errorMessage = {
            id: (Date.now() + 1).toString(),
            content: '⚠️ Error: Could not reach Gemini API. Please check your API key.',
            sender: 'assistant',
            timestamp: new Date()
        };
        messages.push(errorMessage);
        displayMessage(errorMessage);
        showToast('Failed to get response from Gemini.');
    } finally {
        isLoading = false;
        updateSendButton();
        scrollToBottom();
    }
}

// Display functions
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender}`;
    messageElement.setAttribute('data-message-id', message.id);

    const avatar = message.sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    const senderName = message.sender === 'user' ? 'You' : 'ARIA';
    const timeString = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageElement.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${senderName}</span>
                <span class="message-time">${timeString}</span>
            </div>
            <div class="message-text">${escapeHtml(message.content)}</div>
            ${message.sender === 'assistant' ? `
                <div class="message-actions">
                    <button class="action-btn" onclick="copyMessage('${message.id}')"><i class="fas fa-copy"></i> Copy</button>
                    <button class="action-btn"><i class="fas fa-thumbs-up"></i></button>
                    <button class="action-btn"><i class="fas fa-thumbs-down"></i></button>
                </div>` : ''}
        </div>
    `;
    messagesArea.appendChild(messageElement);
    scrollToBottom();
}
function displayLoadingMessage() {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading-message';
    loadingElement.id = 'loadingMessage';
    loadingElement.innerHTML = `
        <div class="loading-avatar"><div class="loading-dot"></div></div>
        <div class="loading-content">
            <div class="loading-header"><span class="message-sender">ARIA</span><span class="message-time">thinking...</span></div>
            <div class="loading-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        </div>`;
    messagesArea.appendChild(loadingElement);
    scrollToBottom();
}
function removeLoadingMessage() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) loadingMessage.remove();
}
function updateSendButton() {
    if (isLoading) {
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        sendBtn.disabled = true;
    } else {
        sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        sendBtn.disabled = false;
    }
}
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Gemini AI Integration
async function getAIResponse(messageHistory) {
    try {
        const contents = messageHistory.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents })
        });

        if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from Gemini AI.";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

// Utils
function copyMessage(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (message) {
        navigator.clipboard.writeText(message.content)
            .then(() => showToast('Message copied!'))
            .catch(() => showToast('Failed to copy message'));
    }
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
function startNewChat() {
    messages = [];
    messagesArea.innerHTML = '';
    welcomeScreen.style.display = 'flex';
    chatContainer.style.display = 'none';
    closeSidebar();
    showToast('New chat started');
}
function getCurrentDate() {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
console.log(`
🚀 ARIA Chatbot (Gemini) Loaded!
📅 ${getCurrentDate()}
💡 ARIA = Adaptive Reasoning & Intelligence Assistant
🔑 Add your Gemini API key to enable real AI responses!
`);
function checkMobileView() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && sidebar.classList.contains('open')) closeSidebar();
}
window.addEventListener('resize', checkMobileView);
