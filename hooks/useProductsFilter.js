import { useMemo } from "react";
import { productCategories } from "@/data/categories";
import { colorMap } from "@/utils/colorMap";

/**
 * Hook for products filtering logic
 */
export function useProductsFilter({
  allProductsForFilters,
  categorySlug,
  selectedCategoryFilter,
  selectedSize,
  selectedColor,
  priceRange,
  inStock,
  onSale,
  sortBy,
  getAvailableSizesForCategory,
}) {
  // Get available sizes
  const availableSizes = useMemo(() => {
    const categoryToUse = categorySlug || selectedCategoryFilter;
    const validSizesForCategory = getAvailableSizesForCategory(categoryToUse);
    
    const sizes = new Set();
    allProductsForFilters.forEach((p) => {
      p.sizes?.forEach((s) => {
        if (validSizesForCategory.includes(s)) {
          sizes.add(s);
        }
      });
    });
    
    if (sizes.size === 0) {
      return validSizesForCategory;
    }
    
    const sortedSizes = Array.from(sizes);
    
    if (!categorySlug) {
      const numericSizes = sortedSizes.filter(s => !isNaN(parseInt(s))).sort((a, b) => parseInt(a) - parseInt(b));
      const letterSizes = sortedSizes.filter(s => isNaN(parseInt(s)));
      const sizeOrder = ["S", "M", "L", "XL", "XXL", "3XL"];
      const sortedLetterSizes = letterSizes.sort((a, b) => {
        const indexA = sizeOrder.indexOf(a);
        const indexB = sizeOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
      return [...sortedLetterSizes, ...numericSizes];
    } else if (categoryToUse === "shoes" || categoryToUse === "pants") {
      return sortedSizes.sort((a, b) => parseInt(a) - parseInt(b));
    } else {
      const sizeOrder = ["S", "M", "L", "XL", "XXL", "3XL"];
      return sortedSizes.sort((a, b) => {
        const indexA = sizeOrder.indexOf(a);
        const indexB = sizeOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }
  }, [allProductsForFilters, categorySlug, selectedCategoryFilter, getAvailableSizesForCategory]);

  // Get available colors
  const availableColors = useMemo(() => {
    const colorCountMap = new Map();
    allProductsForFilters.forEach((p) => {
      p.colors?.forEach((color) => {
        if (!colorCountMap.has(color)) {
          colorCountMap.set(color, 0);
        }
        colorCountMap.set(color, colorCountMap.get(color) + 1);
      });
    });

    const allColors = Object.keys(colorMap).map((color) => ({
      color,
      count: colorCountMap.get(color) || 0,
    }));

    return allColors.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.color.localeCompare(b.color, "fa");
    });
  }, [allProductsForFilters]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...allProductsForFilters];

    // Category filter
    const categoryToUse = categorySlug || selectedCategoryFilter;
    if (categoryToUse) {
      filtered = filtered.filter((p) => p.categorySlug === categoryToUse);
    }

    // Size filter
    if (selectedSize) {
      filtered = filtered.filter((p) => p.sizes?.includes(selectedSize));
    }

    // Color filter
    if (selectedColor) {
      filtered = filtered.filter((p) => p.colors?.includes(selectedColor));
    }

    // Price filter
    filtered = filtered.filter((p) => {
      const finalPrice = p.discountPercent > 0 
        ? p.price * (1 - p.discountPercent / 100)
        : p.price;
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
    });

    // Stock filter
    if (inStock) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Sale filter
    if (onSale) {
      filtered = filtered.filter((p) => p.discountPercent > 0);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price-low") {
        const priceA = a.discountPercent > 0 ? a.price * (1 - a.discountPercent / 100) : a.price;
        const priceB = b.discountPercent > 0 ? b.price * (1 - b.discountPercent / 100) : b.price;
        return priceA - priceB;
      } else if (sortBy === "price-high") {
        const priceA = a.discountPercent > 0 ? a.price * (1 - a.discountPercent / 100) : a.price;
        const priceB = b.discountPercent > 0 ? b.price * (1 - b.discountPercent / 100) : b.price;
        return priceB - priceA;
      } else {
        // newest
        return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at);
      }
    });

    return filtered;
  }, [
    allProductsForFilters,
    categorySlug,
    selectedCategoryFilter,
    selectedSize,
    selectedColor,
    priceRange,
    inStock,
    onSale,
    sortBy,
  ]);

  return {
    availableSizes,
    availableColors,
    filteredProducts,
  };
}

