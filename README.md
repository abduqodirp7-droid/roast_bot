# 🔥 Roast AI

**O'zbekcha AI asosidagi hazil platformasi**

> Foydalanuvchilar o'zlari haqida yozadi — AI esa realistik, kulgili roast qaytaradi.

---

## 📁 Loyiha tuzilishi

```
roast-ai/
├── index.html          ← Asosiy veb-sayt
├── miniapp.html        ← Telegram Mini App
├── style.css           ← Umumiy uslublar
├── miniapp.css         ← Mini App uslublari
├── script.js           ← Sayt skripti
├── miniapp.js          ← Mini App mantiq + API chaqiruvlari
├── .gitignore
├── README.md
└── backend/
    ├── server.js       ← Express + Telegram bot + AI proxy
    ├── package.json
    └── .env.example    ← .env namuna (→ .env nomini o'zgartiring)
```

---

## 🚀 Ishga tushirish

### 1. Kerakli narsalar

- Node.js 18+
- Telegram Bot tokeni (@BotFather dan)
- OpenRouter API kaliti (bepul: https://openrouter.ai)

### 2. Backend o'rnatish

```bash
cd backend
npm install
cp .env.example .env
# .env faylini oching va tokenlarni kiriting
nano .env
```

### 3. .env faylini to'ldiring

```
BOT_TOKEN=7123456789:AAxxxxxxxxxxxxxx
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
MINI_APP_URL=https://your-domain.com/miniapp.html
PORT=3000
```

### 4. Backendni ishga tushiring

```bash
npm start
# yoki development uchun:
npm run dev
```

Server `http://localhost:3000` da ishga tushadi.

### 5. Frontend

Frontend fayllarini web server orqali oching:
- `index.html` — asosiy sayt
- `miniapp.html` — mini app

**Muhim:** `miniapp.js` dagi `BACKEND_URL` ni serveringiz manziliga o'zgartiring:
```js
const BACKEND_URL = 'https://your-backend-domain.com';
```

---

## 🤖 Telegram Mini App sozlash

1. @BotFather ga `/newbot` yuboring
2. Bot tokenini `.env` ga kiriting
3. `/setmenubutton` → Mini App URL ni belgilang
4. `/setdomain` → Domeningizni tasdiqlang

---

## 🌐 Deployment

### Backend (masalan, Railway yoki Render):
```bash
# railway.app yoki render.com da deploy qiling
# Environment variables ni dashboard orqali kiriting
```

### Frontend (masalan, Vercel yoki Netlify):
```bash
# index.html, miniapp.html, style.css, miniapp.css, script.js, miniapp.js
# Bularni statik hosting ga yuklang
```

---

## 🔑 API: OpenRouter

1. https://openrouter.ai ga kiring
2. Bepul hisob oching
3. API kalitini oling → `.env` ga kiriting
4. Bepul model: `mistralai/mistral-7b-instruct:free`

---

## ✅ API Endpoint

```
POST /api/roast
Content-Type: application/json

{ "message": "Men har kuni sport qilaman deyman..." }

→ { "roast": "Optimizmingiz bilan NASA'da ishlasangiz bo'lardi 😄" }
```

---

## 📞 Muallif

- **Email:** abduqodirp7@gmail.com
- **Telefon:** +998 90 020 56 54
- **Telegram:** https://t.me/polatov_776

---

*Faqat ko'ngil ochar maqsadda yaratilgan. © 2025 RoastAI*
