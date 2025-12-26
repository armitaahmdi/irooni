# مراحل Migration - راهنمای سریع

## مشکلات حل شده ✅

1. **خطای Routing**: روت قدیمی `app/product/[id]` حذف شد
2. **خطای Prisma Schema**: فیلدهای `categoryId` و `slug` به optional تبدیل شدند
3. **Migration Script**: به‌روزرسانی شد تا از PrismaClient به درستی استفاده کند

## مراحل اجرا

### 1. به‌روزرسانی Prisma Schema
```bash
npx prisma generate
npx prisma db push
```

این دستورات:
- Prisma Client را generate می‌کند
- تغییرات schema را به دیتابیس اعمال می‌کند
- فیلدهای legacy (`categoryLegacy`, `subcategoryLegacy`) را اضافه می‌کند تا بتوانیم داده‌های قدیمی را بخوانیم

### 2. اجرای Migration Script
```bash
node scripts/migrate-categories.js
```

این اسکریپت:
- دسته‌بندی‌ها و زیردسته‌ها را از `data/categories.js` ایجاد می‌کند
- محصولات موجود را به‌روزرسانی می‌کند:
  - `categoryId` و `subcategoryId` را تنظیم می‌کند
  - `slug` برای محصولات ایجاد می‌کند

### 3. (اختیاری) حذف فیلدهای Legacy
پس از اطمینان از صحت migration، می‌توانید فیلدهای legacy را از schema حذف کنید:

```prisma
// این خطوط را از schema.prisma حذف کنید:
categoryLegacy      String?  @map("category")
subcategoryLegacy   String?  @map("subcategory")
```

سپس دوباره:
```bash
npx prisma generate
npx prisma db push
```

## ساختار URL نهایی

- **دسته اصلی**: `/tshirt`
- **زیردسته**: `/tshirt-long-sleeve`  
- **محصول**: `/product/{product-slug}`

## نکات مهم

1. **Backward Compatibility**: API route قدیمی `/api/products/[id]` هنوز کار می‌کند
2. **Product Routes**: همه لینک‌های محصول باید به `/product/{slug}` تغییر کنند
3. **Category Routes**: همه لینک‌های دسته‌بندی باید به `/{slug}` تغییر کنند

## Troubleshooting

### خطا: "Category not found"
- بررسی کنید که migration script اجرا شده باشد
- بررسی کنید که `data/categories.js` به‌روز است

### خطا: "Product slug is null"
- اجرای دوباره migration script
- بررسی کنید که همه محصولات slug دارند

### خطا: Routing conflict
- مطمئن شوید که `app/product/[id]` حذف شده است
- Restart کردن Next.js dev server

