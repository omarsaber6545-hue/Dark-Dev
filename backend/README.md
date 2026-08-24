# ⚡ DARK LIVE CHAT & DISCORD RELAY BACKEND

نظام شات مباشر وفوري متكامل مع بوت ديسكورد ثنائي الاتجاه وقاعدة بيانات SQLite لحفظ المحادثات.

---

## 🚀 كيفية التثبيت والتشغيل (Installation & Setup)

### 1. تثبيت الاعتماديات (Install Dependencies)
```bash
cd backend
npm install
```

### 2. إعداد ملف البيئة (Environment Variables)
قم بنسخ ملف `.env.example` إلى `.env`:
```bash
cp .env.example .env
```

املأ القيم المطلوبة في `.env`:
- `DISCORD_BOT_TOKEN`: توكن البوت من [Discord Developer Portal](https://discord.com/developers/applications).
- `DISCORD_CHANNEL_ID`: معرّف روم الدعم في سيرفرك (Channel ID).

> **ملاحظة هامة لإعداد البوت في ديسكورد:**
> تأكد من تفعيل **Privileged Gateway Intents** (خاصة `Message Content Intent` و `Server Members Intent`) من تبويب **Bot** في بوابة مطوري ديسكورد.

### 3. تشغيل الخادم (Start Server)
```bash
# وضع التطوير
npm run dev

# أو وضع التشغيل العادي
npm start
```

الخادم سيعمل على المنفذ: `http://localhost:5000` وسيقوم بتهيئة قاعدة بيانات SQLite تلقائياً في `src/database/livechat.sqlite`.

---

## 📡 آلية العمل والربط الثنائي (How it Works)

1. **الزائر يرسل رسالة من الموقع**:
   - يتم إنشاء Session ID فريد وتُحفظ الرسالة في SQLite.
   - البوت ينشئ إيمبد فاخر في روم الدعم بديسكورد بالبيانات والتوقيت ورابط الصفحة.
2. **المطور يرد من ديسكورد**:
   - يعمل المطور **Reply** على رسالة البوت.
   - يلتقط البوت الرد ويرسله فوراً عبر الـ WebSocket للزائر على الموقع في أقل من 500ms مع نغمة تنبيه!
