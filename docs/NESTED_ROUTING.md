# ساختار Nested Routing

## ساختار URL

سیستم routing به صورت nested پیاده‌سازی شده است:

- **دسته اصلی**: `/[category]`
  - مثال: `/tshirt`
  
- **زیردسته**: `/[category]/[subcategory]`
  - مثال: `/tshirt/long-sleeve`
  
- **محصول**: `/[category]/[subcategory]/[productSlug]`
  - مثال: `/tshirt/long-sleeve/product-slug`

## ساختار فولدر

```
app/
  [category]/
    page.jsx                     ← صفحه دسته اصلی
    [subcategory]/
      page.jsx                   ← صفحه زیردسته
      [productSlug]/
        page.jsx                ← صفحه محصول
```

## توابع API

### 1. `getCategoryBySlug(categorySlug)`
دریافت دسته‌بندی بر اساس slug

```javascript
const category = await getCategoryBySlug("tshirt");
```

### 2. `getSubcategoryBySlugs(categorySlug, subcategorySlug)`
دریافت زیردسته بر اساس category و subcategory slug

```javascript
const subcategory = await getSubcategoryBySlugs("tshirt", "long-sleeve");
// این تابع slug کامل را می‌سازد: "tshirt-long-sleeve"
```

### 3. `getProductsByCategory(categoryId, subcategoryId)`
- اگر فقط `categoryId` داده شود: همه محصولات category + تمام subcategories
- اگر `subcategoryId` هم داده شود: فقط محصولات آن subcategory

## منطق صفحات

### صفحه دسته (`/[category]/page.jsx`)
- نمایش همه محصولات category + تمام subcategories
- اگر slug مربوط به subcategory باشد، redirect به مسیر صحیح

### صفحه زیردسته (`/[category]/[subcategory]/page.jsx`)
- نمایش فقط محصولات آن subcategory
- بررسی می‌کند که subcategory متعلق به category است

### صفحه محصول (`/[category]/[subcategory]/[productSlug]/page.jsx`)
- نمایش جزئیات محصول
- Breadcrumb شامل: خانه > category > subcategory > محصول

## تغییرات انجام شده

1. ✅ ساختار فولدر nested ایجاد شد
2. ✅ تابع `getSubcategoryBySlugs` اضافه شد
3. ✅ صفحات category, subcategory, product ایجاد شدند
4. ✅ `ProductCard` به‌روزرسانی شد برای استفاده از مسیر nested
5. ✅ `ProductsPage` breadcrumb به‌روزرسانی شد
6. ✅ روت‌های قدیمی حذف شدند

## نکات مهم

1. **Subcategory Slug**: در دیتابیس، subcategory slug کامل است (مثلاً `tshirt-long-sleeve`)
   - در مسیر URL، فقط بخش subcategory استفاده می‌شود (مثلاً `long-sleeve`)
   - تابع `getSubcategoryBySlugs` این تبدیل را انجام می‌دهد

2. **Product Slug**: محصولات باید slug یکتا داشته باشند

3. **Backward Compatibility**: API هنوز از ساختار قدیمی پشتیبانی می‌کند

## مثال‌های URL

- دسته تیشرت: `/tshirt`
- زیردسته آستین بلند: `/tshirt/long-sleeve`
- محصول: `/tshirt/long-sleeve/tshirt-آبی-سایز-لارج`

