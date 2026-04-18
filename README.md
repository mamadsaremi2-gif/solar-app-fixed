# Solar Sizing PWA - اجرا روی localhost و هاست HTTPS

این پروژه به صورت **Vite + React + PWA** آماده شده و الان برای این دو حالت تنظیم شده است:

1. **اجرا روی سیستم خودت با localhost**
2. **استقرار روی هاست HTTPS برای موبایل و نصب PWA**

---

## 1) اجرا روی سیستم خودت (localhost)

### نصب Node.js
اگر Node.js نصب نیست، نسخه LTS را نصب کن.

### اجرای پروژه
```bash
npm install
npm run dev
```

بعد از اجرا، پروژه معمولاً روی این آدرس باز می‌شود:

```text
http://localhost:5173
```

اگر خواستی نسخه build شده را تست کنی:

```bash
npm run build
npm run preview
```

و بعد آدرس زیر را باز کن:

```text
http://localhost:4173
```

### نتیجه
- روی **همان سیستم** برنامه اجرا می‌شود
- در مرورگر دسکتاپ می‌توانی آن را مثل اپ نصب کنی
- چون `localhost` امن محسوب می‌شود، قابلیت‌های PWA فعال می‌مانند

---

## 2) اجرا روی موبایل

### حالت A: فقط دیدن برنامه روی موبایل در شبکه داخلی
اگر موبایل و لپ تاپ روی یک وای فای باشند:

```bash
npm run dev
```

بعد Vite علاوه بر localhost معمولاً یک آدرس شبکه هم می‌دهد، شبیه این:

```text
http://192.168.1.10:5173
```

این آدرس را در مرورگر موبایل باز کن.

**نکته مهم:**
این روش برای **دیدن و تست ساده** خوب است، اما برای نصب کامل PWA روی موبایل همیشه ایده آل نیست؛ برای نصب مطمئن، بهتر است از **HTTPS** استفاده کنی.

---

## 3) بهترین روش برای موبایل و نصب واقعی: هاست HTTPS

برای اینکه روی موبایل بدون دردسر نصب شود، پروژه را روی یک هاست HTTPS منتشر کن.

من دو فایل آماده گذاشته ام:
- `netlify.toml`
- `vercel.json`

یعنی می‌توانی پروژه را خیلی راحت روی **Netlify** یا **Vercel** بالا بیاوری.

---

## 4) استقرار سریع روی Netlify

### روش پیشنهادی
1. وارد Netlify شو
2. گزینه **Add new project** را بزن
3. پوشه پروژه را آپلود کن یا به Git وصل کن
4. این تنظیمات را بگذار:

- **Build command**:
```text
npm run build
```

- **Publish directory**:
```text
dist
```

سپس Deploy را بزن.

### نتیجه
Netlify به تو یک لینک HTTPS می‌دهد، مثل:

```text
https://your-project.netlify.app
```

حالا:
- روی موبایل لینک را باز کن
- از مرورگر گزینه **Add to Home Screen / Install App** را بزن

---

## 5) استقرار سریع روی Vercel

1. وارد Vercel شو
2. پروژه را Import کن
3. فریم ورک را روی **Vite** بگذار
4. تنظیمات پیش فرض را تایید کن

یا با CLI:

```bash
npm i -g vercel
vercel
```

بعد از Deploy، یک لینک HTTPS می‌گیری.

---

## 6) اگر دامنه شخصی داری

اگر هاست و دامنه داری، خروجی build را بگیر:

```bash
npm run build
```

محتوای پوشه `dist/` را روی هاست آپلود کن.

شرط مهم:
- سایت باید با **HTTPS** باز شود
- فایل های `manifest.webmanifest` و `sw.js` باید قابل دسترس باشند

---

## 7) تست نصب PWA

بعد از اجرا روی localhost یا HTTPS:

### دسکتاپ Chrome / Edge
- سایت را باز کن
- کنار نوار آدرس دنبال گزینه Install بگرد
- یا از منوی مرورگر، Install app را بزن

### اندروید Chrome
- سایت را باز کن
- منوی مرورگر
- **Add to Home screen** یا **Install app**

### iPhone / iPad (Safari)
- سایت را باز کن
- Share
- **Add to Home Screen**

---

## 8) فایل های مهم پروژه

- `src/App.jsx` → کد اصلی برنامه
- `public/manifest.webmanifest` → تنظیمات نصب PWA
- `public/sw.js` → Service Worker
- `public/offline.html` → صفحه آفلاین
- `public/logo-watermark.png` → واترمارک لوگوی شما
- `netlify.toml` → تنظیم آماده برای Netlify
- `vercel.json` → تنظیم آماده برای Vercel

---

## 9) اجرای خیلی سریع

### برای خود سیستم
```bash
npm install
npm run dev
```

### برای انتشار روی اینترنت
```bash
npm install
npm run build
```

بعد پروژه را روی Netlify / Vercel منتشر کن.

---

## 10) اگر بخواهی مرحله بعد
اگر خواستی، در مرحله بعدی می‌توانم برایت یکی از این‌ها را هم آماده کنم:

- نسخه **APK اندروید** با Capacitor
- نسخه **EXE ویندوز** با Electron
- استقرار مستقیم روی **دامنه و هاست خودت**
