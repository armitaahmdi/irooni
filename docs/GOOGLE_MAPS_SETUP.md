# راهنمای دریافت Google Maps API Key

## مراحل دریافت API Key

### 1. ورود به Google Cloud Console
- به آدرس [https://console.cloud.google.com/](https://console.cloud.google.com/) بروید
- با حساب Google خود وارد شوید

### 2. ایجاد پروژه جدید
1. در بالای صفحه، روی منوی کشویی پروژه‌ها کلیک کنید
2. روی "New Project" (پروژه جدید) کلیک کنید
3. نام پروژه را وارد کنید (مثلاً: `irooni-maps`)
4. روی "Create" کلیک کنید
5. منتظر بمانید تا پروژه ایجاد شود

### 3. فعال‌سازی Google Maps APIs
برای استفاده از نقشه و جستجوی آدرس، باید این API‌ها را فعال کنید:

#### الف) Google Maps JavaScript API
1. از منوی سمت چپ، "APIs & Services" > "Library" را انتخاب کنید
2. در نوار جستجو، `Maps JavaScript API` را جستجو کنید
3. روی آن کلیک کنید و "Enable" را بزنید

#### ب) Places API
1. در همان صفحه Library، `Places API` را جستجو کنید
2. روی آن کلیک کنید و "Enable" را بزنید

#### ج) Geocoding API (اختیاری - برای تبدیل مختصات به آدرس)
1. در همان صفحه Library، `Geocoding API` را جستجو کنید
2. روی آن کلیک کنید و "Enable" را بزنید

### 4. دریافت API Key
1. از منوی سمت چپ، "APIs & Services" > "Credentials" را انتخاب کنید
2. روی دکمه "+ CREATE CREDENTIALS" کلیک کنید
3. "API key" را انتخاب کنید
4. کلید API شما ایجاد می‌شود و نمایش داده می‌شود
5. **فوراً کلید را کپی کنید** (بعداً قابل مشاهده نیست!)

### 5. محدود کردن API Key (برای امنیت)
⚠️ **مهم:** برای جلوگیری از سوء استفاده، API Key را محدود کنید:

1. روی API Key که تازه ایجاد کردید کلیک کنید
2. در بخش "Application restrictions":
   - "HTTP referrers (web sites)" را انتخاب کنید
   - آدرس‌های مجاز را اضافه کنید:
     ```
     http://localhost:3000/*
     https://yourdomain.com/*
     ```
3. در بخش "API restrictions":
   - "Restrict key" را انتخاب کنید
   - فقط این API‌ها را انتخاب کنید:
     - Maps JavaScript API
     - Places API
     - Geocoding API (اگر فعال کردید)
4. روی "Save" کلیک کنید

### 6. اضافه کردن API Key به پروژه
1. در ریشه پروژه، فایل `.env.local` را باز کنید (یا ایجاد کنید)
2. این خط را اضافه کنید:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```
3. `your_api_key_here` را با کلید API که کپی کردید جایگزین کنید

### 7. راه‌اندازی مجدد سرور
```bash
# اگر سرور در حال اجرا است، آن را متوقف کنید (Ctrl+C)
# سپس دوباره اجرا کنید:
npm run dev
```

## نکات مهم

### هزینه‌ها
- Google Maps API دارای **$200 credit رایگان** در هر ماه است
- برای اکثر پروژه‌های کوچک و متوسط، این مقدار کافی است
- برای مشاهده استفاده و هزینه‌ها: "APIs & Services" > "Dashboard"

### محدودیت‌ها
- در حالت Free tier، محدودیت‌هایی وجود دارد
- برای پروژه‌های تجاری بزرگ، ممکن است نیاز به پرداخت داشته باشید

### امنیت
- **هرگز** API Key را در Git commit نکنید
- فایل `.env.local` در `.gitignore` قرار دارد
- API Key را فقط در سرور خود نگه دارید

## تست کردن
بعد از اضافه کردن API Key:
1. به `/profile` بروید
2. بخش "آدرس‌ها" را انتخاب کنید
3. روی "افزودن آدرس جدید" کلیک کنید
4. باید نقشه Google Maps نمایش داده شود

## مشکلات رایج

### نقشه نمایش داده نمی‌شود
- بررسی کنید که API Key در `.env.local` درست اضافه شده باشد
- بررسی کنید که Maps JavaScript API فعال شده باشد
- Console مرورگر را بررسی کنید (F12) برای خطاها

### خطای "This API project is not authorized"
- بررسی کنید که Maps JavaScript API و Places API فعال شده باشند
- چند دقیقه صبر کنید تا تغییرات اعمال شوند

### خطای "RefererNotAllowedMapError"
- بررسی کنید که در Application restrictions، آدرس صحیح اضافه شده باشد
- برای localhost باید `http://localhost:3000/*` باشد

## لینک‌های مفید
- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Pricing Information](https://developers.google.com/maps/billing-and-pricing/pricing)


