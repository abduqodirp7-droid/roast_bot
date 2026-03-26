// =============================================
// ROAST AI – NODE.JS BACKEND
// =============================================
// Dependencies:
//   npm install express cors node-telegram-bot-api node-fetch dotenv
//
// Create a .env file with:
//   BOT_TOKEN=your_telegram_bot_token
//   OPENROUTER_API_KEY=your_openrouter_key
//   PORT=3000
// =============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://your-website.com/miniapp.html';
const PORT = process.env.PORT || 3000;

// ---- TELEGRAM BOT ----
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const WELCOME_MSG = `
🔥 *Roast AI ga xush kelibsiz!*

Men sizi do'stlarcha roast qilishga tayyor sun'iy intellektman.

O'zingiz haqingizda biror narsa yozing yoki quyidagi tugmani bosing 👇
`;

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, WELCOME_MSG, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🔥 Mini App ochish', web_app: { url: MINI_APP_URL } }],
        [{ text: '❓ Qanday ishlaydi?', callback_data: 'how_it_works' }],
      ],
    },
  });
});

bot.on('callback_query', (query) => {
  if (query.data === 'how_it_works') {
    bot.answerCallbackQuery(query.id);
    bot.sendMessage(query.message.chat.id, `
📖 *Qanday ishlaydi?*

1️⃣ O'zingiz haqida biror narsa yozing (kasbingiz, muammo, vaziyat)
2️⃣ AI sizning yozganingizni o'qib, o'ziga xos roast tayyorlaydi
3️⃣ Kulasiz va do'stlaringizga yuborasiz 😄

Haqorat yo'q — faqat do'stona hazil!
`, { parse_mode: 'Markdown' });
  }
});

bot.on('message', async (msg) => {
  if (msg.text?.startsWith('/')) return;
  const chatId = msg.chat.id;
  const userText = msg.text;
  if (!userText) return;

  // Show typing
  bot.sendChatAction(chatId, 'typing');

  try {
    const roast = await generateRoast(userText);
    bot.sendMessage(chatId, `🔥 ${roast}`, {
      reply_to_message_id: msg.message_id,
    });
  } catch (err) {
    console.error('Roast error:', err);
    bot.sendMessage(chatId, '⚠️ Hozircha javob bera olmadim. Bir ozdan keyin urinib ko\'ring.');
  }
});

// ---- API ENDPOINT (for Mini App & Website) ----
app.post('/api/roast', async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim().length < 2) {
    return res.status(400).json({ error: 'Xabar juda qisqa' });
  }

  try {
    const roast = await generateRoast(message);
    res.json({ roast });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  }
});

// ---- AI ROAST GENERATOR ----
async function generateRoast(userMessage) {
  const systemPrompt = `Sen "Roast AI" deb ataladigan o'zbek tilidagi hazil assistantisan.
Sening vazifang: foydalanuvchi yozgan narsa asosida unga do'stona, kulgili, realistik "roast" qilish.

QOIDALAR:
- FAQAT O'zbek tilida yoz
- 1-2 ta qisqa gap yoz (ko'pi bilan 3 ta gap)
- Haqiqiy hayotga asoslangan, relatable o'zbek hazili ishlat
- Do'stona, sarkastik, kulgili — ammo hech qachon haqoratli emas
- Shablonli emas, har safar noyob bo'lsin
- Bolalar kulgisi emas — kattalar hazili (lekin odobli)
- Misol uslub: "...deysan, lekin..." yoki "...bo'lsang ham..." kabi qurilmalar ishlat
- Emoji ishlatishingiz mumkin (1-2 ta)
- Uzun tushuntirish yozma — faqat roast`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://roastai.uz',
      'X-Title': 'Roast AI',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct:free', // Free model on OpenRouter
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error: ${response.status} – ${err}`);
  }

  const data = await response.json();
  const roast = data.choices?.[0]?.message?.content?.trim();

  if (!roast) throw new Error('Bo\'sh javob keldi');
  return roast;
}

// ---- HEALTH CHECK ----
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Roast AI Backend' });
});

// ---- START SERVER ----
app.listen(PORT, () => {
  console.log(`✅ Roast AI backend ishlayapti: http://localhost:${PORT}`);
  console.log(`🤖 Telegram bot polling...`);
});
