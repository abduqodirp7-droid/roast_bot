// =============================================
// ROAST AI – MINI APP SCRIPT
// =============================================
// NOTE: API key is sent to backend proxy, NOT exposed here.
// Set BACKEND_URL to your Node.js server URL.
// =============================================

const BACKEND_URL = 'http://localhost:3000'; // Change to your deployed backend URL

// ---- SCREEN NAVIGATION ----
const screens = {
  welcome: document.getElementById('screen-welcome'),
  how: document.getElementById('screen-how'),
  chat: document.getElementById('screen-chat'),
};

function goTo(screenName) {
  Object.entries(screens).forEach(([name, el]) => {
    if (name === screenName) {
      el.classList.remove('slide-out');
      el.classList.add('active');
    } else if (el.classList.contains('active')) {
      el.classList.add('slide-out');
      setTimeout(() => {
        el.classList.remove('active', 'slide-out');
      }, 400);
    }
  });
}

// ---- BUTTON EVENTS ----
document.getElementById('btn-start-roast')?.addEventListener('click', () => goTo('chat'));
document.getElementById('btn-how-it-works')?.addEventListener('click', () => goTo('how'));
document.getElementById('btn-start-from-how')?.addEventListener('click', () => goTo('chat'));
document.getElementById('back-from-how')?.addEventListener('click', () => goTo('welcome'));
document.getElementById('back-from-chat')?.addEventListener('click', () => goTo('welcome'));

// ---- CHAT LOGIC ----
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const charCountEl = document.getElementById('charCount');

// Auto-resize textarea
userInput?.addEventListener('input', () => {
  const len = userInput.value.length;
  charCountEl.textContent = len;
  charCountEl.parentElement.classList.toggle('warn', len > 400);

  userInput.style.height = 'auto';
  userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
});

// Send on Enter (Shift+Enter for newline)
userInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn?.addEventListener('click', sendMessage);

// Clear chat
document.getElementById('clear-chat')?.addEventListener('click', () => {
  if (!confirm('Chatni tozalashni xohlaysizmi?')) return;
  chatMessages.innerHTML = `
    <div class="chat-msg bot intro-msg">
      Salom! 👋 Men Roast AI. O'zingiz haqingizda biror narsa yozing — men sizni do'stlarcha roast qilaman. Xotirjam bo'ling, haqorat yo'q, faqat kulgili hazil! 😄
    </div>`;
});

function appendMessage(text, type) {
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg typing';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  document.getElementById('typingIndicator')?.remove();
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text || sendBtn.disabled) return;

  // Show user message
  appendMessage(text, 'user');
  userInput.value = '';
  userInput.style.height = 'auto';
  charCountEl.textContent = '0';
  sendBtn.disabled = true;
  showTyping();

  try {
    const response = await fetch(`${BACKEND_URL}/api/roast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });

    removeTyping();

    if (!response.ok) {
      throw new Error(`Server xatosi: ${response.status}`);
    }

    const data = await response.json();
    const roast = data.roast || "Hm, bu safar so'z topilmadi 😅";
    appendMessage(roast, 'bot');

  } catch (err) {
    removeTyping();
    const errDiv = appendMessage(
      '⚠️ Xatolik yuz berdi. Internet yoki serveringizni tekshiring va qayta urinib ko\'ring.',
      'bot error'
    );
  } finally {
    sendBtn.disabled = false;
    userInput.focus();
  }
}

// ---- TELEGRAM MINI APP INIT ----
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  // Apply Telegram color scheme if available
  if (tg.colorScheme === 'light') {
    document.body.classList.add('tg-light');
  }
}
