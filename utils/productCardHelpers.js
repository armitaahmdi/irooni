/**
 * Helper functions for ProductCard component
 */

export const formatPrice = (value) =>
  new Intl.NumberFormat("fa-IR").format(value) + " تومان";

/**
 * Check if product is new (less than 4 days old)
 */
export const isNewProduct = (product) => {
  if (!product.createdAt && !product.created_at) return false;

  const createdAt = product.createdAt || product.created_at;
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffTime = now - createdDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= 4;
};

/**
 * Get product URL based on category and subcategory
 */
export const getProductUrl = (product) => {
  // استخراج category slug
  const categorySlug = product.category?.slug || product.category;
  
  // استخراج subcategory slug
  let subcategorySlug = product.subcategory?.slug || product.subcategory;
  
  // اگر subcategory slug کامل است (مثل tshirt-long-sleeve)، باید category را از آن حذف کنیم
  if (subcategorySlug && categorySlug && typeof subcategorySlug === "string" && subcategorySlug.startsWith(`${categorySlug}-`)) {
    subcategorySlug = subcategorySlug.replace(`${categorySlug}-`, "");
  }
  
  // اگر category و subcategory داریم، URL کامل بسازیم
  if (categorySlug && subcategorySlug) {
    return `/${categorySlug}/${subcategorySlug}/${product.slug || product.id}`;
  }
  
  // اگر فقط category داریم (بدون subcategory)، باید از یک subcategory پیش‌فرض استفاده کنیم
  // از آنجایی که route /[category]/[productSlug] وجود ندارد،
  // از "all" به عنوان subcategory پیش‌فرض استفاده می‌کنیم
  if (categorySlug) {
    // استفاده از "all" به عنوان subcategory پیش‌فرض برای محصولات بدون subcategory
    return `/${categorySlug}/all/${product.slug || product.id}`;
  }
  
  // اگر هیچ category نداریم، نمی‌توانیم URL صحیح بسازیم
  // در این حالت، از slug یا ID محصول استفاده می‌کنیم (اما این route وجود ندارد)
  // برای جلوگیری از خطا، به صفحه محصولات هدایت می‌کنیم
  return `/products`;
};

