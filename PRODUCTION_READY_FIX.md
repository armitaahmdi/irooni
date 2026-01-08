# رفع مشکل api/api/ و آماده‌سازی برای Production

## مشکل
بعد از deployment روی سرور، درخواست‌های API به صورت `https://irooni-men.ir/api/api/...` در می‌آمدند که باعث خطا می‌شد.

## علت مشکل
مشکل زمانی رخ می‌دهد که `NEXT_PUBLIC_API_URL` در `.env` به صورت `https://irooni-men.ir/api` تنظیم شده باشد، و در کد هم endpoint‌ها با `/api/...` شروع می‌شوند. این باعث می‌شود URL نهایی به صورت `https://irooni-men.ir/api/api/...` درآید.

## راه‌حل پیاده‌سازی شده

### 1. اصلاح `lib/api/client.js`
کد به گونه‌ای اصلاح شد که به صورت خودکار `/api` انتهایی را از `NEXT_PUBLIC_API_URL` حذف کند:

```javascript
const API_BASE_URL_RAW = process.env.NEXT_PUBLIC_API_URL || '';
// Remove trailing /api if present to prevent double /api/api/...
const API_BASE_URL = API_BASE_URL_RAW.replace(/\/api\/?$/, '');
```

### 2. تنظیم صحیح Environment Variables
**مهم:** `NEXT_PUBLIC_API_URL` باید **خالی** باشد یا فقط base URL باشد (بدون `/api`):

```env
# ✅ صحیح - خالی (توصیه می‌شود)
NEXT_PUBLIC_API_URL=

# ✅ صحیح - فقط base URL
NEXT_PUBLIC_API_URL=https://irooni-men.ir

# ❌ اشتباه - شامل /api
NEXT_PUBLIC_API_URL=https://irooni-men.ir/api
```

## تست و بررسی Production Readiness

### اسکریپت جدید: `check-production-ready.js`
یک اسکریپت جامع برای بررسی آماده‌سازی production ایجاد شد:

```bash
npm run check:prod
```

این اسکریپت موارد زیر را بررسی می‌کند:
- ✅ وجود فایل `.env` و تنظیمات environment variables
- ✅ صحت `NEXT_PUBLIC_API_URL` (نباید شامل `/api` باشد)
- ✅ وجود فایل‌های build (`.next/standalone/server.js`)
- ✅ تنظیمات `package.json`
- ✅ تنظیمات `next.config.mjs` (output: standalone)
- ✅ تنظیمات `ecosystem.config.js`
- ✅ وجود fix برای مشکل `api/api/`
- ✅ تنظیمات Prisma

### استفاده
```bash
# اجرای اسکریپت بررسی
npm run check:prod
```

## دستورالعمل برای سرور

### گام 1: بررسی `.env` در سرور
```bash
# بررسی مقدار NEXT_PUBLIC_API_URL
grep NEXT_PUBLIC_API_URL .env
```

مقدار باید یکی از اینها باشد:
- خالی: `NEXT_PUBLIC_API_URL=`
- یا فقط base URL: `NEXT_PUBLIC_API_URL=https://irooni-men.ir`

**نباید** شامل `/api` باشد.

### گام 2: Build مجدد (اگر کد تغییر کرده)
```bash
# Pull آخرین تغییرات
git pull

# نصب dependencies
npm ci --production=false

# Build
npm run build
```

### گام 3: Restart PM2
```bash
pm2 restart irooni
# یا
pm2 reload irooni
```

### گام 4: بررسی logs
```bash
pm2 logs irooni --lines 50
```

### گام 5: تست API
```bash
# تست health endpoint
curl http://localhost:3000/api/health

# یا از مرورگر
# بررسی Console مرورگر برای اطمینان از عدم وجود خطای api/api/...
```

## بررسی در مرورگر

بعد از restart، در مرورگر:
1. باز کردن Developer Tools (F12)
2. رفتن به تب Network
3. بررسی درخواست‌های API
4. اطمینان از اینکه URLها به صورت `/api/...` یا `https://irooni-men.ir/api/...` هستند (نه `api/api/...`)

## نکات مهم

1. **NEXT_PUBLIC_API_URL باید خالی باشد**: این بهترین روش است چون از مسیرهای نسبی استفاده می‌شود.

2. **Fix در کد اضافه شده است**: حتی اگر `NEXT_PUBLIC_API_URL` اشتباه تنظیم شده باشد، کد به صورت خودکار `/api` اضافی را حذف می‌کند.

3. **بعد از تغییر .env نیاز به rebuild نیست**: فقط restart کافی است (مگر اینکه کد تغییر کرده باشد).

4. **RTK Query**: RTK Query از `window.location.origin` استفاده می‌کند، بنابراین تحت تأثیر `NEXT_PUBLIC_API_URL` قرار نمی‌گیرد.

## فایل‌های تغییر یافته

- ✅ `lib/api/client.js` - اضافه شدن fix برای `/api/api/`
- ✅ `scripts/check-production-ready.js` - اسکریپت جدید برای بررسی production readiness
- ✅ `package.json` - اضافه شدن script `check:prod`

## مراجع

برای اطلاعات بیشتر:
- `DEPLOYMENT_GUIDE.md` - راهنمای کامل deployment
- `DEPLOYMENT_CHECKLIST.md` - چک‌لیست deployment
- `env.example` - نمونه تنظیمات environment variables

