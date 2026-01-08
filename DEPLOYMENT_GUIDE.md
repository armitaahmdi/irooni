# راهنمای کامل Deployment برای Production

این راهنما شامل مراحل دقیق deployment پروژه Next.js در محیط production است.

## پیش‌نیازها

### نرم‌افزارهای مورد نیاز:

- **Node.js**: نسخه 20 یا بالاتر
- **PostgreSQL**: نسخه 14 یا بالاتر
- **PM2**: برای مدیریت process
- **Nginx**: برای reverse proxy (اختیاری اما توصیه می‌شود)

### بررسی نسخه‌ها:

```bash
node --version    # باید 20.x.x یا بالاتر باشد
npm --version
psql --version
pm2 --version
```

## مرحله 1: آماده‌سازی سرور

### 1.1 ایجاد دیتابیس PostgreSQL

```bash
# ورود به PostgreSQL
sudo -u postgres psql

# در PostgreSQL shell:
CREATE DATABASE irooni;
CREATE USER irooni_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE irooni TO irooni_user;
\c irooni
GRANT ALL ON SCHEMA public TO irooni_user;
\q
```

### 1.2 نصب PM2 (اگر نصب نیست)

```bash
npm install -g pm2
```

## مرحله 2: تنظیم Environment Variables

### 2.1 ایجاد فایل .env

در root directory پروژه، فایل `.env` ایجاد کنید:

```bash
cp .env.example .env
nano .env  # یا از editor دیگر استفاده کنید
```

### 2.2 تنظیم متغیرهای ضروری

```env
# محیط اجرا
NODE_ENV=production

# آدرس پایه (بدون اسلش انتهایی)
NEXT_PUBLIC_BASE_URL=https://irooni-men.ir

# آدرس API (خالی بگذارید - مهم!)
NEXT_PUBLIC_API_URL=

# Database URL (برای production باید SSL داشته باشد)
DATABASE_URL=postgresql://irooni_user:your_password@localhost:5432/irooni?schema=public&sslmode=require

# AUTH_SECRET (برای تولید: openssl rand -base64 32)
AUTH_SECRET=your-generated-secret-here

# تنظیمات دیتابیس (اختیاری)
DATABASE_POOL_MAX=30
DATABASE_POOL_MIN=10

# Logging
LOG_LEVEL=info

# API Keys (اختیاری)
SMS_IR_API_KEY=your-sms-api-key
NEXT_PUBLIC_NESHAN_API_KEY=your-neshan-api-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

**نکته مهم:** `NEXT_PUBLIC_API_URL` باید خالی باشد تا از مسیرهای نسبی استفاده شود. اگر این متغیر به `https://irooni-men.ir/api` تنظیم شود، درخواست‌ها به `api/api/...` تبدیل می‌شوند که خطا ایجاد می‌کند.

### 2.3 تولید AUTH_SECRET

```bash
openssl rand -base64 32
```

خروجی را در `AUTH_SECRET` قرار دهید.

## مرحله 3: آماده‌سازی پروژه

### 3.1 Clone یا Pull آخرین تغییرات

```bash
cd /path/to/irooni
git pull origin main  # یا branch دیگر
```

### 3.2 نصب Dependencies

```bash
npm ci --production=false
```

### 3.3 تولید Prisma Client

```bash
npm run db:generate
```

### 3.4 اجرای Migrations

```bash
npm run db:migrate:prod
# یا
npx prisma migrate deploy
```

### 3.5 Build پروژه

```bash
npm run build
```

این دستور باید بدون خطا اجرا شود. بعد از build موفق، فایل `.next/standalone/server.js` ایجاد می‌شود.

## مرحله 4: تنظیمات PM2

### 4.1 بررسی ecosystem.config.js

فایل `ecosystem.config.js` باید تنظیمات صحیح داشته باشد. این فایل قبلاً به‌روزرسانی شده است.

### 4.2 توقف Process قبلی (اگر وجود دارد)

```bash
pm2 stop irooni
# یا
pm2 delete irooni
```

### 4.3 شروع Application با PM2

```bash
pm2 start ecosystem.config.js
```

یا اگر از فایل `.env` استفاده می‌کنید:

```bash
pm2 start ecosystem.config.js --env production
```

### 4.4 بررسی وضعیت

```bash
pm2 status
```

باید status `online` را ببینید.

### 4.5 مشاهده Logs

```bash
pm2 logs irooni --lines 50
```

خطاها را بررسی کنید. اگر خطایی وجود دارد، ادامه دهید.

### 4.6 تست Health Check

```bash
curl http://localhost:3000/api/health
```

باید پاسخ JSON دریافت کنید.

### 4.7 تنظیم Startup Script

برای اینکه بعد از restart سرور، application به صورت خودکار شروع شود:

```bash
pm2 startup
# دستور نمایش داده شده را اجرا کنید
pm2 save
```

## مرحله 5: تنظیمات Nginx (اختیاری اما توصیه می‌شود)

### 5.1 ایجاد فایل Config

```bash
sudo nano /etc/nginx/sites-available/irooni-men.ir
```

### 5.2 محتوای Config

```nginx
server {
    listen 80;
    server_name irooni-men.ir www.irooni-men.ir;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name irooni-men.ir www.irooni-men.ir;
    
    # SSL certificates
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Proxy settings
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 31536000s;
        add_header Cache-Control "public, immutable";
    }
    
    # Maximum upload size
    client_max_body_size 10M;
}
```

### 5.3 فعال‌سازی Config

```bash
sudo ln -s /etc/nginx/sites-available/irooni-men.ir /etc/nginx/sites-enabled/
```

### 5.4 تست و Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## مرحله 6: تست نهایی

### 6.1 تست از طریق Domain

مرورگر را باز کنید و به `https://irooni-men.ir` بروید.

### 6.2 بررسی‌های لازم

- [ ] صفحه اصلی لود می‌شود
- [ ] خطای 502 وجود ندارد
- [ ] API endpoints کار می‌کنند (مثلاً `/api/health`)
- [ ] خطای `api/api/...` وجود ندارد (در Console مرورگر بررسی کنید)
- [ ] Login/Authentication کار می‌کند
- [ ] Database queries موفق هستند

## Troubleshooting

### مشکل: خطای 502 Bad Gateway

**علل احتمالی:**
1. Application crash کرده یا start نشده
2. Application روی پورت دیگری در حال اجرا است
3. Nginx config اشتباه است

**راه‌حل:**
```bash
# بررسی وضعیت PM2
pm2 status

# بررسی logs
pm2 logs irooni --lines 100

# تست local
curl http://localhost:3000

# بررسی پورت
netstat -tulpn | grep 3000

# Restart application
pm2 restart irooni
```

### مشکل: خطای api/api/...

**علت:** `NEXT_PUBLIC_API_URL` اشتباه تنظیم شده (دارد `/api` دارد)

**راه‌حل:**
1. در فایل `.env`، `NEXT_PUBLIC_API_URL` را خالی کنید:
   ```env
   NEXT_PUBLIC_API_URL=
   ```
2. یا اگر باید تنظیم شود، فقط base URL را بگذارید (بدون `/api`):
   ```env
   NEXT_PUBLIC_API_URL=https://irooni-men.ir
   ```
3. Restart application:
   ```bash
   pm2 restart irooni
   ```
4. Hard reload مرورگر (Ctrl+Shift+R)

### مشکل: Database Connection Error

**راه‌حل:**
```bash
# تست اتصال
psql $DATABASE_URL -c "SELECT 1;"

# بررسی DATABASE_URL
echo $DATABASE_URL

# بررسی PostgreSQL service
sudo systemctl status postgresql

# بررسی firewall
sudo ufw status
```

### مشکل: AUTH_SECRET Error

**راه‌حل:**
1. بررسی کنید که `AUTH_SECRET` در `.env` تنظیم شده است
2. برای تولید secret جدید:
   ```bash
   openssl rand -base64 32
   ```
3. Secret را در `.env` قرار دهید
4. Restart application:
   ```bash
   pm2 restart irooni
   ```

### مشکل: Build Failed

**راه‌حل:**
```bash
# پاک کردن cache
rm -rf .next node_modules package-lock.json

# نصب مجدد
npm ci --production=false

# تولید Prisma Client
npm run db:generate

# Build مجدد
npm run build
```

## دستورات مفید برای Maintenance

```bash
# مشاهده وضعیت PM2
pm2 status

# مشاهده logs (real-time)
pm2 logs irooni

# مشاهده logs (آخرین 100 خط)
pm2 logs irooni --lines 100

# Restart application
pm2 restart irooni

# Stop application
pm2 stop irooni

# مشاهده اطلاعات process
pm2 show irooni

# مشاهده environment variables
pm2 env irooni

# مشاهده memory و CPU usage
pm2 monit

# مشاهده Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# تست health check
curl http://localhost:3000/api/health

# بررسی پورت
netstat -tulpn | grep 3000
```

## به‌روزرسانی Application

برای deploy تغییرات جدید:

```bash
# 1. Pull آخرین تغییرات
git pull origin main

# 2. نصب dependencies (اگر package.json تغییر کرده)
npm ci --production=false

# 3. تولید Prisma Client (اگر schema تغییر کرده)
npm run db:generate

# 4. اجرای migrations (اگر migration جدید وجود دارد)
npm run db:migrate:prod

# 5. Build
npm run build

# 6. Restart PM2
pm2 restart irooni

# 7. بررسی logs
pm2 logs irooni --lines 50
```

## پشتیبان‌گیری Database

```bash
# پشتیبان‌گیری با script
npm run db:backup

# یا دستی
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

## نکات امنیتی

1. هرگز فایل `.env` را commit نکنید
2. از SSL برای database connection در production استفاده کنید
3. `AUTH_SECRET` را یک رشته تصادفی و قوی انتخاب کنید
4. از firewall برای محدود کردن دسترسی به database استفاده کنید
5. Logs را به صورت منظم بررسی کنید
6. Backup database را به صورت منظم انجام دهید

