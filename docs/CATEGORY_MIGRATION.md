# راهنمای Migration دسته‌بندی‌ها

این سند راهنمای migration سیستم دسته‌بندی به ساختار جدید است.

## تغییرات انجام شده

### 1. Prisma Schema
- مدل `Category` اضافه شد با فیلدهای:
  - `id`, `title`, `slug`, `parentId`
  - Relation به `Product`
- مدل `Product` به‌روزرسانی شد:
  - فیلد `slug` اضافه شد
  - `categoryId` و `subcategoryId` اضافه شدند
  - Relation به `Category` اضافه شد

### 2. Routing
- روت دینامیک `app/[slug]/page.jsx` برای دسته‌بندی‌ها
- روت محصول `app/product/[productSlug]/page.jsx` با استفاده از slug

### 3. API
- `/api/categories/[slug]` - دریافت دسته‌بندی
- `/api/products/by-slug/[productSlug]` - دریافت محصول با slug
- `/api/products` - به‌روزرسانی شده برای استفاده از ساختار جدید

## مراحل Migration

### 1. به‌روزرسانی Prisma Schema
```bash
npx prisma generate
npx prisma db push
```

### 2. اجرای Migration Script
```bash
node scripts/migrate-categories.js
```

این اسکریپت:
- دسته‌بندی‌ها و زیردسته‌ها را از `data/categories.js` می‌خواند
- آن‌ها را در دیتابیس ایجاد می‌کند
- محصولات موجود را به‌روزرسانی می‌کند
- slug برای محصولات ایجاد می‌کند

### 3. بررسی نتایج
پس از اجرای migration، بررسی کنید:
- دسته‌بندی‌ها در دیتابیس ایجاد شده‌اند
- محصولات `categoryId` و `subcategoryId` دارند
- همه محصولات `slug` دارند

## ساختار URL

### دسته‌بندی‌ها
- دسته اصلی: `/tshirt`
- زیردسته: `/tshirt-long-sleeve`

### محصولات
- `/product/{product-slug}`

## نکات مهم

1. **Slug یکتا**: هر دسته و محصول باید slug یکتا داشته باشد
2. **Subcategory Slug**: زیردسته‌ها slug کامل دارند (مثلاً `tshirt-long-sleeve`)
3. **Backward Compatibility**: API هنوز از ساختار قدیمی پشتیبانی می‌کند

## Troubleshooting

### خطا: "Category not found"
- بررسی کنید که migration script اجرا شده باشد
- بررسی کنید که `data/categories.js` به‌روز است

### خطا: "Product slug is null"
- اجرای دوباره migration script
- بررسی کنید که همه محصولات slug دارند

### خطا: "Prisma client not initialized"
- اجرای `npx prisma generate`
- Restart کردن سرور

