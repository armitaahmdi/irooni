# راهنمای اتصال به PostgreSQL

## روش‌های اتصال

### 1. استفاده از PostgreSQL محلی

#### نصب PostgreSQL (اگر نصب نیست):

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

#### ایجاد دیتابیس:

```bash
# ورود به PostgreSQL
sudo -u postgres psql

# در PostgreSQL shell:
CREATE DATABASE irooni;
CREATE USER irooni_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE irooni TO irooni_user;
\q
```

#### تنظیم DATABASE_URL در .env:

```env
DATABASE_URL="postgresql://irooni_user:your_password@localhost:5432/irooni?schema=public"
```

### 2. استفاده از Prisma Managed Postgres (فعلی)

در حال حاضر از Prisma managed Postgres استفاده می‌شود که با دستور `prisma dev` اجرا می‌شود.

### 3. استفاده از PostgreSQL Remote (Cloud)

برای دیتابیس‌های cloud مثل:
- Supabase
- Railway
- Neon
- AWS RDS
- Heroku Postgres

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public&sslmode=require"
```

## تست اتصال

### 1. تست با Prisma Studio:
```bash
npm run db:studio
```

### 2. تست با Prisma CLI:
```bash
# بررسی اتصال
npx prisma db pull

# یا push schema
npm run db:push
```

### 3. تست در کد:

```javascript
// در یک API route یا server component
import { prisma } from '@/lib/prisma'

export async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Connected to database')
    await prisma.$disconnect()
  } catch (error) {
    console.error('❌ Connection failed:', error)
  }
}
```

## ساختار اتصال

1. **prisma.config.ts**: تنظیمات اتصال را از `DATABASE_URL` می‌خواند
2. **lib/prisma.js**: Prisma Client singleton instance
3. **.env**: شامل `DATABASE_URL` (نباید commit شود)

## دستورات مفید

```bash
# تولید Prisma Client
npm run db:generate

# اعمال schema به دیتابیس (بدون migration)
npm run db:push

# ایجاد migration
npm run db:migrate

# باز کردن Prisma Studio
npm run db:studio

# مشاهده وضعیت دیتابیس
npx prisma db pull
```

