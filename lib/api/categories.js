import { prisma } from "@/lib/prisma";

/**
 * دریافت دسته‌بندی بر اساس slug
 */
export async function getCategoryBySlug(slug) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
      },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    throw error;
  }
}

/**
 * دریافت محصولات بر اساس categoryId
 * اگر subcategoryId هم داده شود، فقط محصولات آن subcategory را برمی‌گرداند
 */
export async function getProductsByCategory(categoryId, subcategoryId = null) {
  let products = [];
  try {
    const where = {};

    if (subcategoryId) {
      // اگر subcategoryId داده شده، فقط محصولات آن subcategory
      where.subcategoryId = subcategoryId;
    } else {
      // اگر subcategoryId داده نشده، همه محصولات category + subcategories
      where.categoryId = categoryId;
    }

    products = await prisma.product.findMany({
      where: {
        ...where,
        OR: [
          { isVisible: true },
          { isVisible: null }  // برای محصولات قدیمی یا خالی
        ],
      },
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  } catch (error) {
    console.warn("Prisma query failed for products by category, using empty array", error);
    return []; // Fallback to empty array
  }
}

/**
 * دریافت محصول بر اساس slug
 */
export async function getProductBySlug(productSlug) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: productSlug,
        OR: [
          { isVisible: true },
          { isVisible: null }  // برای محصولات قدیمی یا خالی
        ],
      },
      include: {
        category: true,
        subcategory: true,
        variants: {
          orderBy: [
            { color: "asc" },
            { size: "asc" },
          ],
        },
      },
    });

    return product;
  } catch (error) {
    console.warn("Prisma query failed for product by slug, returning null", error);
    return null; // Fallback to null instead of throwing
  }
}

/**
 * دریافت زیردسته بر اساس categorySlug و subcategorySlug
 */
export async function getSubcategoryBySlugs(categorySlug, subcategorySlug) {
  try {
    // ساخت slug کامل برای subcategory (مثلاً tshirt-long-sleeve)
    const fullSubcategorySlug = `${categorySlug}-${subcategorySlug}`;
    
    const subcategory = await prisma.category.findUnique({
      where: { slug: fullSubcategorySlug },
      include: {
        parent: true,
        children: true,
      },
    });

    return subcategory;
  } catch (error) {
    console.error("Error fetching subcategory by slugs:", error);
    throw error;
  }
}

/**
 * بررسی اینکه آیا slug مربوط به یک محصول است یا دسته‌بندی
 */
export async function isProductSlug(slug) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    return !!product;
  } catch (error) {
    console.error("Error checking if slug is product:", error);
    return false;
  }
}
