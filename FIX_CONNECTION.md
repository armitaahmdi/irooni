# 🔧 رفع خطای اتصال به دیتابیس

## مشکل
خطای `Using engine type "client" requires either "adapter" or "accelerateUrl"` به این دلیل است که از فرمت `prisma+postgres://` استفاده می‌کنید.

## راه حل: استفاده از PostgreSQL محلی

### گام 1: راه‌اندازی دیتابیس

اسکریپت را اجرا کنید:
```bash
./setup-database.sh
```

یا دستی:
```bash
sudo -u postgres psql
CREATE DATABASE irooni;
CREATE USER irooni_user WITH PASSWORD 'irooni_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE irooni TO irooni_user;
\c irooni
GRANT ALL ON SCHEMA public TO irooni_user;
\q
```

### گام 2: تغییر DATABASE_URL در .env

فایل `.env` را باز کنید و این خط را تغییر دهید:

**قبل (فرمت Prisma managed):**
```env
DATABASE_URL="prisma+postgres://localhost:51213/..."
```

**بعد (فرمت استاندارد PostgreSQL):**
```env
DATABASE_URL="postgresql://irooni_user:irooni_pass_2024@localhost:5432/irooni?schema=public"
```

### گام 3: تست اتصال

```bash
npm run db:generate
npm run db:push
```

اگر خطایی نداشت، مشکل حل شده است! ✅

---

## راه حل جایگزین: استفاده از Prisma Dev (برای توسعه)

اگر می‌خواهید از Prisma managed Postgres استفاده کنید:

```bash
# در یک ترمینال جداگانه
npx prisma dev
```

سپس DATABASE_URL را به فرمت استاندارد PostgreSQL تغییر دهید (Prisma dev یک دیتابیس محلی ایجاد می‌کند).

---

## بررسی اتصال

بعد از تغییر DATABASE_URL، سرور را restart کنید:

```bash
# توقف سرور (Ctrl+C)
# سپس دوباره اجرا کنید:
npm run dev
```

سپس به این آدرس بروید:
```
http://localhost:3000/api/test-db
```

اگر پیام موفقیت دیدید، همه چیز درست است! 🎉

