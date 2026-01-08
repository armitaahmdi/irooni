# چک‌لیست Deployment برای Production

این چک‌لیست شامل تمام مراحل لازم برای deployment موفق پروژه در محیط production است.

## قبل از شروع

- [ ] دسترسی SSH به سرور production دارید
- [ ] Node.js نسخه 20 یا بالاتر نصب است (`node --version`)
- [ ] PostgreSQL نسخه 14 یا بالاتر نصب و در حال اجرا است
- [ ] PM2 نصب است (`npm install -g pm2`)
- [ ] Nginx یا reverse proxy دیگر تنظیم شده است

## مرحله 1: آماده‌سازی Environment Variables

- [ ] فایل `.env` در root directory پروژه ایجاد شده است
- [ ] `NODE_ENV=production` تنظیم شده است
- [ ] `DATABASE_URL` تنظیم شده و از SSL استفاده می‌کند (برای production)
  ```bash
  # مثال:
  DATABASE_URL="postgresql://user:password@host:5432/database?schema=public&sslmode=require"
  ```
- [ ] `AUTH_SECRET` تنظیم شده (برای تولید: `openssl rand -base64 32`)
- [ ] `NEXT_PUBLIC_BASE_URL` به آدرس production تنظیم شده
  ```bash
  NEXT_PUBLIC_BASE_URL="https://irooni-men.ir"
  ```
- [ ] `NEXT_PUBLIC_API_URL` خالی است یا فقط base URL (بدون `/api`)
  ```bash
  NEXT_PUBLIC_API_URL=""  # خالی بهتر است
  ```
- [ ] API keys تنظیم شده‌اند (اختیاری):
  - [ ] `SMS_IR_API_KEY`
  - [ ] `NEXT_PUBLIC_NESHAN_API_KEY`
  - [ ] `NEXT_PUBLIC_SENTRY_DSN`

## مرحله 2: آماده‌سازی Database

- [ ] دیتابیس PostgreSQL ایجاد شده است
- [ ] User و Password برای دیتابیس ایجاد شده است
- [ ] دسترسی‌های لازم (privileges) به user داده شده است
- [ ] Prisma Client تولید شده: `npm run db:generate`
- [ ] Migrations اجرا شده: `npm run db:migrate:prod` یا `npx prisma migrate deploy`
- [ ] اتصال دیتابیس تست شده است

## مرحله 3: Build پروژه

- [ ] Dependencies نصب شده: `npm ci --production=false`
- [ ] Prisma Client تولید شده: `npm run db:generate`
- [ ] Build موفق انجام شده: `npm run build`
  - [ ] خطای build وجود ندارد
  - [ ] فایل `.next/standalone/server.js` وجود دارد

## مرحله 4: تنظیمات PM2

- [ ] فایل `ecosystem.config.js` بررسی شده است
- [ ] Environment variables در `ecosystem.config.js` یا `.env` تنظیم شده‌اند
- [ ] PM2 process متوقف شده (اگر قبلاً اجرا بوده): `pm2 stop irooni` یا `pm2 delete irooni`

## مرحله 5: اجرای Application

- [ ] Application با PM2 شروع شده: `pm2 start ecosystem.config.js`
- [ ] Status بررسی شده: `pm2 status`
- [ ] Logs بررسی شده: `pm2 logs irooni --lines 50`
- [ ] خطای startup در logs وجود ندارد
- [ ] Application روی پورت 3000 در حال اجرا است: `curl http://localhost:3000/api/health`

## مرحله 6: تنظیمات Nginx (اگر استفاده می‌کنید)

- [ ] فایل config Nginx تنظیم شده است
- [ ] SSL certificate نصب شده است
- [ ] Nginx reload شده: `sudo nginx -t && sudo systemctl reload nginx`
- [ ] Reverse proxy به `http://localhost:3000` تنظیم شده است
- [ ] HTTPS redirect کار می‌کند

## مرحله 7: تست نهایی

- [ ] وب‌سایت از طریق domain قابل دسترسی است: `https://irooni-men.ir`
- [ ] خطای 502 وجود ندارد
- [ ] API endpoints کار می‌کنند (مثلاً `/api/health`)
- [ ] خطای `api/api/...` وجود ندارد
- [ ] Login/Authentication کار می‌کند
- [ ] Database queries موفق هستند

## مرحله 8: Monitoring و Maintenance

- [ ] PM2 startup script تنظیم شده: `pm2 startup` و `pm2 save`
- [ ] Log rotation تنظیم شده است
- [ ] Health check endpoint تست شده: `/api/health`
- [ ] Monitoring setup شده است (Sentry یا ابزار دیگر)

## Troubleshooting

### خطای 502 Bad Gateway

1. بررسی کنید که PM2 process در حال اجرا است: `pm2 status`
2. بررسی logs: `pm2 logs irooni --lines 100`
3. بررسی کنید که application روی پورت 3000 در حال اجرا است: `curl http://localhost:3000`
4. بررسی environment variables: `pm2 env irooni`
5. بررسی کنید که `.next/standalone/server.js` وجود دارد

### خطای api/api/...

1. بررسی کنید که `NEXT_PUBLIC_API_URL` خالی است یا بدون `/api` است
2. Restart PM2: `pm2 restart irooni`
3. Hard reload مرورگر (Ctrl+Shift+R)

### خطای Database Connection

1. بررسی `DATABASE_URL` در `.env`
2. تست اتصال: `psql $DATABASE_URL`
3. بررسی SSL settings برای production
4. بررسی firewall rules

### خطای AUTH_SECRET

1. بررسی کنید که `AUTH_SECRET` تنظیم شده است
2. برای تولید secret جدید: `openssl rand -base64 32`
3. Restart application بعد از تغییر

## دستورات مفید

```bash
# مشاهده وضعیت PM2
pm2 status

# مشاهده logs
pm2 logs irooni

# Restart application
pm2 restart irooni

# مشاهده environment variables
pm2 env irooni

# تست health check
curl http://localhost:3000/api/health

# بررسی پورت
netstat -tulpn | grep 3000

# تست database connection
psql $DATABASE_URL -c "SELECT 1;"

# مشاهده Nginx logs (اگر استفاده می‌کنید)
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

