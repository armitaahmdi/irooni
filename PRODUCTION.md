# راهنمای آماده‌سازی و Deployment برای Production

این مستند شامل تمام مراحل و نکات لازم برای آماده‌سازی و deployment پروژه در محیط production است.

## 📋 چک‌لیست Pre-Deployment

### 1. Environment Variables
- [ ] تمام متغیرهای محیطی در `.env` یا سیستم مدیریت secrets تنظیم شده‌اند
- [ ] `NODE_ENV=production` تنظیم شده است
- [ ] `DATABASE_URL` برای production تنظیم شده و از SSL استفاده می‌کند
- [ ] `AUTH_SECRET` یک رشته تصادفی و امن است
- [ ] `NEXT_PUBLIC_BASE_URL` به آدرس production تنظیم شده است
- [ ] API keys (SMS.ir, Neshan Maps, Sentry) تنظیم شده‌اند

### 2. Database
- [ ] دیتابیس PostgreSQL برای production راه‌اندازی شده است
- [ ] Connection pooling بهینه تنظیم شده است
- [ ] Backup strategy تعریف شده است
- [ ] Migrations تست شده‌اند

### 3. Rate Limiting
- [ ] Rate limiting برای API routes فعال است (از in-memory استفاده می‌شود)

### 4. Security
- [ ] Security headers فعال هستند
- [ ] HTTPS فعال است
- [ ] HSTS header تنظیم شده است
- [ ] API keys و secrets در جای امن نگهداری می‌شوند
- [ ] Rate limiting فعال است

### 5. Monitoring
- [ ] Sentry برای error tracking تنظیم شده است
- [ ] Health check endpoint تست شده است (`/api/health`)
- [ ] Logging strategy تعریف شده است

### 6. Performance
- [ ] Image optimization فعال است
- [ ] Compression فعال است
- [ ] Caching headers تنظیم شده‌اند
- [ ] Bundle size بررسی شده است

## 🚀 مراحل Deployment

### گام 1: آماده‌سازی محیط

```bash
# 1. Clone یا pull آخرین تغییرات
git pull origin main

# 2. نصب dependencies
npm ci --production=false

# 3. تنظیم environment variables
cp .env.example .env
# ویرایش .env و تنظیم مقادیر production
```

### گام 2: آماده‌سازی Database

```bash
# 1. تولید Prisma Client
npm run db:generate

# 2. اجرای migrations
npm run db:migrate:prod

# یا دستی:
npx prisma migrate deploy
```

### گام 3: Build پروژه

```bash
# Build برای production
npm run build
```

### گام 4: اجرای پروژه

#### روش 1: با npm (ساده)

```bash
npm start
```

#### روش 2: با Docker (توصیه می‌شود)

```bash
# Build Docker image
docker build -t irooni:latest .

# اجرا با docker-compose
docker-compose up -d
```

#### روش 3: با PM2 (برای سرورهای لینوکس)

```bash
# نصب PM2
npm install -g pm2

# اجرای پروژه
pm2 start npm --name "irooni" -- start

# ذخیره configuration
pm2 save
pm2 startup
```

## 🐳 استفاده از Docker

### اجرای کامل stack (App + Database)

```bash
# اجرای تمام services
docker-compose up -d

# مشاهده logs
docker-compose logs -f

# توقف
docker-compose down

# توقف و حذف volumes (دقت کنید - دیتا حذف می‌شود)
docker-compose down -v
```

### فقط اجرای Application

```bash
docker build -t irooni .
docker run -p 3000:3000 --env-file .env irooni
```

## 🔧 تنظیمات سرور

### الزامات سیستم

- **Node.js**: نسخه 20 یا بالاتر
- **PostgreSQL**: نسخه 14 یا بالاتر
- **RAM**: حداقل 1GB (توصیه: 2GB+)
- **Disk**: حداقل 10GB فضای خالی

### تنظیمات Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name irooni.com www.irooni.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name irooni.com www.irooni.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
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
    }
    
    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 31536000s;
        add_header Cache-Control "public, immutable";
    }
}
```

### تنظیمات Systemd (برای Linux)

ایجاد فایل `/etc/systemd/system/irooni.service`:

```ini
[Unit]
Description=Irooni Next.js Application
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/irooni
Environment="NODE_ENV=production"
EnvironmentFile=/path/to/irooni/.env
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

فعال‌سازی:

```bash
sudo systemctl daemon-reload
sudo systemctl enable irooni
sudo systemctl start irooni
sudo systemctl status irooni
```

## 📊 Monitoring و Health Checks

### Health Check Endpoint

```bash
# بررسی سلامت سیستم
curl https://irooni.com/api/health
```

Response شامل:
- وضعیت دیتابیس
- استفاده از حافظه
- Event loop delay
- Uptime

### Logging

Logs در production به صورت JSON output می‌شوند و می‌توانند به log aggregation services ارسال شوند:

- **CloudWatch** (AWS)
- **LogDNA**
- **Datadog**
- **Sentry**

برای استفاده از transport خاص، فایل `lib/logger.js` را ویرایش کنید.

## 🔐 Security Best Practices

### 1. Environment Variables

- هرگز `.env` را commit نکنید
- از secrets management استفاده کنید (AWS Secrets Manager, HashiCorp Vault, etc.)
- `AUTH_SECRET` باید یک رشته تصادفی قوی باشد

```bash
# تولید AUTH_SECRET
openssl rand -base64 32
```

### 2. Database Security

- از SSL/TLS برای اتصال به دیتابیس استفاده کنید
- Database user باید فقط دسترسی‌های لازم را داشته باشد
- Regular backups را تنظیم کنید

### 3. Rate Limiting

- Rate limiting برای API routes فعال است
- از in-memory rate limiting استفاده می‌شود

### 4. HTTPS

- حتماً از HTTPS استفاده کنید
- SSL certificate معتبر داشته باشید
- HSTS header فعال است

## 🔄 Database Migrations

### اجرای Migrations در Production

```bash
# استفاده از script مخصوص production
npm run db:migrate:prod

# یا دستی
npx prisma migrate deploy
```

**⚠️ مهم**: قبل از اجرای migrations حتماً backup بگیرید:

```bash
npm run db:backup
```

### Rollback Strategy

اگر migration با مشکل مواجه شد:

1. از backup استفاده کنید
2. Migration را بررسی کنید
3. مشکل را برطرف کنید
4. دوباره migration را اجرا کنید

## 🐛 Troubleshooting

### مشکل: Database Connection Failed

```bash
# بررسی connection
npm run db:studio

# بررسی DATABASE_URL
echo $DATABASE_URL

# تست connection
node -e "require('@prisma/client'); console.log('Prisma loaded')"
```

### مشکل: Build Failed

```bash
# پاک کردن cache
rm -rf .next node_modules

# نصب مجدد dependencies
npm ci

# Build مجدد
npm run build
```

### مشکل: High Memory Usage

```bash
# بررسی memory usage
curl https://irooni.com/api/health | jq '.checks.memory'

# Restart application
pm2 restart irooni
# یا
systemctl restart irooni
```


## 📦 Backup Strategy

### Database Backup

```bash
# Backup دستی
npm run db:backup

# یا با cron job (روزانه در ساعت 2 صبح)
0 2 * * * cd /path/to/irooni && npm run db:backup
```

### Backup قبل از Migration

Script migration به صورت خودکار backup می‌گیرد، اما می‌توانید دستی هم backup بگیرید:

```bash
npm run db:backup
```

Backup files در پوشه `backups/` ذخیره می‌شوند.

## 📈 Performance Optimization

### 1. Image Optimization

- Images به صورت خودکار به WebP/AVIF تبدیل می‌شوند
- Cache TTL در production: 1 hour

### 2. Caching

- Static files: 1 year cache
- Images: 1 day cache with stale-while-revalidate
- API responses: بسته به endpoint

### 3. Connection Pooling

- Database pool: 10-30 connections (بسته به load)

## 🔄 CI/CD

GitHub Actions workflow در `.github/workflows/deploy.yml` تعریف شده است.

برای فعال‌سازی:

1. Secrets را در GitHub repository تنظیم کنید:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_BASE_URL`
   - سایر environment variables

2. Workflow به صورت خودکار روی push به `main` branch اجرا می‌شود

## 📝 Environment Variables Reference

برای لیست کامل environment variables، فایل `.env.example` را ببینید.

## 🆘 Support

در صورت بروز مشکل:

1. Logs را بررسی کنید
2. Health check endpoint را بررسی کنید
3. Database connection را تست کنید
4. اگر مشکل ادامه داشت، به تیم توسعه اطلاع دهید

## ✅ Post-Deployment Checklist

بعد از deployment:

- [ ] Health check endpoint پاسخ می‌دهد
- [ ] تمام صفحات اصلی لود می‌شوند
- [ ] Login/Register کار می‌کند
- [ ] Database operations کار می‌کند
- [ ] API endpoints پاسخ می‌دهند
- [ ] Monitoring active است
- [ ] Backups به درستی اجرا می‌شوند
- [ ] SSL certificate معتبر است

