import { productCategories } from "@/data/categories";

/**
 * Get subcategory slug by name (Persian)
 * @param {string} categorySlug - Category slug (e.g., "tshirt")
 * @param {string} subcategoryName - Subcategory name in Persian (e.g., "آستین کوتاه")
 * @returns {string|null} - Subcategory slug (e.g., "short-sleeve") or null if not found
 */
export function getSubcategorySlugByName(categorySlug, subcategoryName) {
  const category = productCategories.find((cat) => cat.slug === categorySlug);
  if (!category) return null;

  const subcategory = category.subcategories.find(
    (sub) => sub.name === subcategoryName
  );
  return subcategory ? subcategory.slug : null;
}

/**
 * Get subcategory name (Persian) by slug
 * @param {string} categorySlug - Category slug (e.g., "tshirt")
 * @param {string} subcategorySlug - Subcategory slug (e.g., "short-sleeve")
 * @returns {string|null} - Subcategory name in Persian (e.g., "آستین کوتاه") or null if not found
 */
export function getSubcategoryNameBySlug(categorySlug, subcategorySlug) {
  const category = productCategories.find((cat) => cat.slug === categorySlug);
  if (!category) return null;

  const subcategory = category.subcategories.find(
    (sub) => sub.slug === subcategorySlug
  );
  return subcategory ? subcategory.name : null;
}

/**
 * Normalize subcategory value - converts name to slug if needed
 * This ensures subcategory is always stored as slug in database
 * @param {string} categorySlug - Category slug
 * @param {string} subcategoryValue - Subcategory value (could be slug or name)
 * @returns {string|null} - Normalized subcategory slug or null
 */
export function normalizeSubcategory(categorySlug, subcategoryValue) {
  if (!subcategoryValue) return null;

  const category = productCategories.find((cat) => cat.slug === categorySlug);
  if (!category) return subcategoryValue; // Return as-is if category not found

  // Check if it's already a slug
  const subcategoryBySlug = category.subcategories.find(
    (sub) => sub.slug === subcategoryValue
  );
  if (subcategoryBySlug) {
    return subcategoryValue; // Already a slug
  }

  // Check if it's a name (Persian)
  const subcategoryByName = category.subcategories.find(
    (sub) => sub.name === subcategoryValue
  );
  if (subcategoryByName) {
    return subcategoryByName.slug; // Convert name to slug
  }

  // If not found, return as-is (might be a custom value)
  return subcategoryValue;
}

/**
 * Check if a subcategory slug is valid for a category
 * @param {string} categorySlug - Category slug
 * @param {string} subcategorySlug - Subcategory slug to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidSubcategory(categorySlug, subcategorySlug) {
  if (!subcategorySlug) return true; // Empty subcategory is valid (optional)

  const category = productCategories.find((cat) => cat.slug === categorySlug);
  if (!category) return false;

  return category.subcategories.some((sub) => sub.slug === subcategorySlug);
}

/**
 * Normalize category value - converts name to slug if needed
 * This ensures category is always stored as slug in database
 * @param {string} categoryValue - Category value (could be slug or name)
 * @returns {string|null} - Normalized category slug or null
 */
export function normalizeCategory(categoryValue) {
  if (!categoryValue) return null;

  // Check if it's already a slug
  const categoryBySlug = productCategories.find(
    (cat) => cat.slug === categoryValue
  );
  if (categoryBySlug) {
    return categoryValue; // Already a slug
  }

  // Check if it's a name (Persian)
  const categoryByName = productCategories.find(
    (cat) => cat.name === categoryValue
  );
  if (categoryByName) {
    return categoryByName.slug; // Convert name to slug
  }

  // If not found, return as-is (might be a custom value)
  return categoryValue;
}

