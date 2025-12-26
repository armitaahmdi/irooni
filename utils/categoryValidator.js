import { productCategories } from "@/data/categories";

/**
 * Validate category and subcategory combination
 * @param {string} categorySlug - Category slug
 * @param {string} subcategorySlug - Subcategory slug (optional)
 * @returns {object} - { valid: boolean, error?: string, category?: object, subcategory?: object }
 */
export function validateCategorySubcategory(categorySlug, subcategorySlug = null) {
  // Find category
  const category = productCategories.find((cat) => cat.slug === categorySlug);
  
  if (!category) {
    return {
      valid: false,
      error: `دسته‌بندی "${categorySlug}" یافت نشد`,
    };
  }

  // If no subcategory provided, it's valid (subcategory is optional)
  if (!subcategorySlug || subcategorySlug === "") {
    return {
      valid: true,
      category,
      subcategory: null,
    };
  }

  // Find subcategory
  const subcategory = category.subcategories.find(
    (sub) => sub.slug === subcategorySlug
  );

  if (!subcategory) {
    return {
      valid: false,
      error: `زیردسته "${subcategorySlug}" در دسته‌بندی "${category.name}" یافت نشد`,
    };
  }

  return {
    valid: true,
    category,
    subcategory,
  };
}

/**
 * Get all subcategories for a category
 * @param {string} categorySlug - Category slug
 * @returns {array} - Array of subcategory objects
 */
export function getSubcategoriesByCategory(categorySlug) {
  const category = productCategories.find((cat) => cat.slug === categorySlug);
  return category?.subcategories || [];
}

/**
 * Check if a category has subcategories
 * @param {string} categorySlug - Category slug
 * @returns {boolean}
 */
export function hasSubcategories(categorySlug) {
  const category = productCategories.find((cat) => cat.slug === categorySlug);
  return category?.subcategories?.length > 0;
}

