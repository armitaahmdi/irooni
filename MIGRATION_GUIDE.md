# راهنمای اجرای Migration برای فیلد sizeStock

## 🚀 روش 1: استفاده از API Endpoint (توصیه می‌شود - ساده‌ترین)

### گام 1: اطمینان از اجرای سرور
```bash
npm run dev
```

### گام 2: اجرای Migration
در مرورگر به این آدرس بروید:
```
http://localhost:3000/api/admin/migrate/add-size-stock
```

یا با curl:
```bash
curl -X POST http://localhost:3000/api/admin/migrate/add-size-stock
```

**نکته:** باید به عنوان admin لاگین باشید.

---

## 🗄️ روش 2: استفاده از Prisma Studio

### گام 1: باز کردن Prisma Studio
```bash
npx prisma studio
```

### گام 2: اجرای SQL
در Prisma Studio:
1. به تب "Database" بروید
2. در بخش "Raw SQL" این دستور را اجرا کنید:
```sql
ALTER TABLE "products" 
ADD COLUMN IF NOT EXISTS "sizeStock" JSONB;
```

---

## 💻 روش 3: اجرای مستقیم SQL در PostgreSQL

### گام 1: اتصال به دیتابیس
```bash
# اگر از PostgreSQL محلی استفاده می‌کنید:
psql -U irooni_user -d irooni

# یا اگر از postgres user استفاده می‌کنید:
sudo -u postgres psql -d irooni
```

### گام 2: اجرای SQL
```sql
ALTER TABLE "products" 
ADD COLUMN IF NOT EXISTS "sizeStock" JSONB;
```

### گام 3: خروج
```sql
\q
```

---

## 🔧 روش 4: استفاده از Prisma Migrate (اگر shadow database در دسترس باشد)

```bash
# ایجاد migration
npx prisma migrate dev --name add_size_stock --create-only

# سپس فایل migration را ویرایش کنید و فقط این خط را اضافه کنید:
# ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sizeStock" JSONB;

# اجرای migration
npx prisma migrate dev
```

**نکته:** اگر خطای shadow database گرفتید، از روش‌های دیگر استفاده کنید.

---

## ✅ بررسی موفقیت Migration

بعد از اجرای migration، می‌توانید بررسی کنید:

### با Prisma Studio:
```bash
npx prisma studio
```
سپس به جدول `products` بروید و بررسی کنید که فیلد `sizeStock` وجود دارد.

### با SQL:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' AND column_name = 'sizeStock';
```

اگر نتیجه داشت، migration موفق بوده است! ✅

---

## 🐛 رفع مشکلات

### خطا: "column already exists"
این یعنی فیلد از قبل وجود دارد. مشکلی نیست، migration قبلاً اجرا شده است.

### خطا: "permission denied"
مطمئن شوید که کاربر دیتابیس دسترسی لازم را دارد:
```sql
GRANT ALL PRIVILEGES ON DATABASE irooni TO irooni_user;
GRANT ALL ON SCHEMA public TO irooni_user;
```

### خطا: "relation does not exist"
مطمئن شوید که جدول `products` وجود دارد:
```sql
SELECT * FROM products LIMIT 1;
```

