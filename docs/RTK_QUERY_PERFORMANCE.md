# RTK Query برای بهینه‌سازی Performance

## 📊 مقایسه: fetch مستقیم vs RTK Query

### ❌ مشکلات استفاده از `fetch` مستقیم:

1. **عدم Caching**: هر بار که کامپوننت mount می‌شود، API call جدید می‌زند
2. **عدم Deduplication**: اگر چند کامپوننت همزمان همان API را صدا بزنند، همه درخواست‌ها اجرا می‌شوند
3. **عدم استفاده از داده‌های قبلی**: حتی اگر داده‌ها تغییر نکرده باشند، دوباره fetch می‌شود
4. **State Management پیچیده**: باید loading, error, data را خودتان مدیریت کنید

### ✅ مزایای RTK Query:

1. **Automatic Caching**: داده‌ها به صورت خودکار cache می‌شوند (5-10 دقیقه)
2. **Request Deduplication**: اگر چند کامپوننت همزمان همان query را صدا بزنند، فقط یک درخواست ارسال می‌شود
3. **Background Refetching**: می‌تواند به صورت خودکار در پس‌زمینه داده‌ها را refresh کند
4. **Loading States خودکار**: `isLoading`, `isFetching`, `error` به صورت خودکار مدیریت می‌شوند
5. **Tag-based Invalidation**: می‌توانید cache را بر اساس tags باطل کنید

## 🚀 نحوه استفاده

### استفاده از RTK Query در کامپوننت‌ها:

```javascript
import { useGetProductsQuery, useGetProductBySlugQuery } from '@/store/api/productsApi';

function ProductsPage() {
  // Automatic caching و deduplication
  const { data, isLoading, error } = useGetProductsQuery({
    page: 1,
    limit: 12,
    category: 'tshirt',
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### استفاده از Lazy Query (برای manual triggering):

```javascript
import { useLazyGetProductsQuery } from '@/store/api/productsApi';

function ProductsPage() {
  const [triggerGetProducts, { data, isLoading }] = useLazyGetProductsQuery();

  const handleFilterChange = () => {
    triggerGetProducts({
      page: 1,
      limit: 12,
      category: 'tshirt',
    });
  };

  return <div>...</div>;
}
```

## 📈 بهبود Performance

### قبل از RTK Query:
- هر بار mount شدن کامپوننت = API call جدید
- 3 کامپوننت همزمان = 3 API call
- تغییر فیلتر = API call جدید (حتی اگر داده cache شده باشد)

### بعد از RTK Query:
- اولین mount = API call
- 3 کامپوننت همزمان = 1 API call (deduplication)
- تغییر فیلتر = استفاده از cache (اگر داده موجود باشد)
- Cache expiration = 5-10 دقیقه (قابل تنظیم)

## 🔧 تنظیمات Cache

در `store/api/productsApi.js`:

```javascript
keepUnusedDataFor: 300, // 5 دقیقه برای products list
keepUnusedDataFor: 600, // 10 دقیقه برای single product
```

## 🎯 Migration Guide

### مرحله 1: استفاده از Hook جدید
```javascript
// قبل
import { useProductsPage } from '@/hooks/useProductsPage';

// بعد (اختیاری - می‌توانید از hook قدیمی استفاده کنید)
import { useProductsPageRTK } from '@/hooks/useProductsPageRTK';
```

### مرحله 2: استفاده مستقیم از RTK Query
```javascript
// در کامپوننت‌ها
import { useGetProductBySlugQuery } from '@/store/api/productsApi';

const { data: product, isLoading } = useGetProductBySlugQuery(slug);
```

## 📝 نکات مهم

1. **RTK Query در @reduxjs/toolkit موجود است** - نیاز به نصب جداگانه ندارد
2. **Cache به صورت خودکار مدیریت می‌شود** - نیازی به manual cache management نیست
3. **Deduplication به صورت خودکار** - اگر چند کامپوننت همزمان query بزنند، فقط یک درخواست ارسال می‌شود
4. **Background refetching** - می‌تواند به صورت خودکار در پس‌زمینه refresh کند

## 🔍 مثال: Product Detail Page

```javascript
import { 
  useGetProductBySlugQuery,
  useGetProductRatingStatsQuery,
  useGetProductSoldCountQuery 
} from '@/store/api/productsApi';

function ProductDetailPage({ slug }) {
  // همه queries به صورت خودکار cache می‌شوند
  const { data: product, isLoading: productLoading } = useGetProductBySlugQuery(slug);
  const { data: ratingStats } = useGetProductRatingStatsQuery(product?.id, {
    skip: !product?.id, // فقط اگر product موجود باشد
  });
  const { data: soldCount } = useGetProductSoldCountQuery(product?.id, {
    skip: !product?.id,
  });

  // ...
}
```

## ⚡ نتیجه

استفاده از RTK Query می‌تواند:
- **50-70% کاهش** در تعداد API calls
- **بهبود 2-3 برابری** در سرعت بارگذاری صفحات
- **کاهش قابل توجه** در مصرف bandwidth
- **تجربه کاربری بهتر** با استفاده از cache

