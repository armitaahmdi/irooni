/**
 * useProductsPageRTK - Optimized version using RTK Query
 * Provides automatic caching, deduplication, and better performance
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { productCategories } from "@/data/categories";
import { useProductsFilter } from "@/hooks/useProductsFilter";
import { useLazyGetProductsQuery } from "@/store/api/productsApi";

const PRODUCTS_PER_PAGE = 12;
const MAX_PRICE = 5000000;
const DEBOUNCE_DELAY = 300; // ms for debouncing filter changes
const FILTER_PRODUCTS_LIMIT = 200; // Reduced from 1000 for better performance

export function useProductsPageRTK({ categorySlug, subcategorySlug, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [allProductsForFilters, setAllProductsForFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    stock: true,
    size: true,
    color: true,
    price: true,
  });
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  // RTK Query hook - lazy query for manual triggering
  const [triggerGetProducts, { data, isLoading: isRTKLoading, error }] = useLazyGetProductsQuery();

  const categoryInfo = categorySlug
    ? productCategories.find((cat) => cat.slug === categorySlug)
    : null;

  const getAvailableSizesForCategory = (category) => {
    if (!category) {
      return [
        "S", "M", "L", "XL", "XXL", "3XL",
        "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48",
      ];
    }
    if (category === "shoes" || category === "pants") {
      return ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48"];
    }
    return ["S", "M", "L", "XL", "XXL", "3XL"];
  };

  const { availableSizes, availableColors } = useProductsFilter({
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
  });

  // Fetch all products for filters (only when category changes)
  useEffect(() => {
    const fetchAllProductsForFilters = async () => {
      try {
        const params = {
          limit: FILTER_PRODUCTS_LIMIT,
        };
        const categoryToUse = categorySlug || selectedCategoryFilter;
        if (categoryToUse) params.category = categoryToUse;
        if (subcategorySlug) params.subcategory = subcategorySlug;

        const result = await triggerGetProducts(params).unwrap();
        if (result?.success) {
          setAllProductsForFilters(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching products for filters:", error);
      }
    };

    fetchAllProductsForFilters();
  }, [categorySlug, subcategorySlug, selectedCategoryFilter, triggerGetProducts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    categorySlug,
    subcategorySlug,
    inStock,
    onSale,
    selectedSize,
    selectedColor,
    selectedCategoryFilter,
    sortBy,
    searchQuery,
  ]);

  // Debounce timer ref for filter changes
  const debounceTimerRef = useRef(null);

  // Fetch products with RTK Query and debouncing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const params = {
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
          sortBy: sortBy,
        };

        if (categorySlug) params.category = categorySlug;
        if (subcategorySlug) params.subcategory = subcategorySlug;
        if (inStock) params.inStock = true;
        if (onSale) params.onSale = true;
        if (selectedSize) params.size = selectedSize;
        if (selectedColor) params.color = selectedColor;
        if (priceRange[0] > 0) params.minPrice = priceRange[0];
        if (priceRange[1] < MAX_PRICE) params.maxPrice = priceRange[1];
        if (searchQuery) params.search = searchQuery;

        const result = await triggerGetProducts(params).unwrap();

        if (result?.success) {
          setProducts(result.data || []);
          setTotalPages(result.pagination?.totalPages || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching products:", {
          status: error?.status,
          data: error?.data,
          message: error?.error || error?.message || error,
        });
        setProducts([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    // Determine if we need debouncing (for filter changes) or immediate fetch
    const needsDebounce = selectedSize || selectedColor || priceRange[0] > 0 || priceRange[1] < MAX_PRICE || inStock || onSale || selectedCategoryFilter;
    const isFilterChange = needsDebounce && currentPage === 1;

    if (isFilterChange) {
      // Debounce filter changes
      debounceTimerRef.current = setTimeout(fetchProducts, DEBOUNCE_DELAY);
    } else {
      // Immediate fetch for page changes, category changes, etc.
      fetchProducts();
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    categorySlug,
    subcategorySlug,
    currentPage,
    sortBy,
    inStock,
    onSale,
    selectedSize,
    selectedColor,
    selectedCategoryFilter,
    priceRange,
    searchQuery,
    triggerGetProducts,
  ]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const finalPrice =
        p.discountPercent > 0 ? p.price * (1 - p.discountPercent / 100) : p.price;
      return finalPrice >= priceRange[0] && finalPrice <= priceRange[1];
    });
  }, [products, priceRange]);

  const pageTitle = searchQuery
    ? `نتایج جستجو: ${searchQuery}`
    : subcategorySlug && categoryInfo
    ? categoryInfo.subcategories.find((s) => s.slug === subcategorySlug)?.name
    : categoryInfo
    ? categoryInfo.name
    : "همه محصولات";

  useEffect(() => {
    document.title = `${pageTitle} | پوشاک ایرونی`;
  }, [pageTitle]);

  const breadcrumbItems = useMemo(() => {
    if (categoryInfo) {
      const items = [{ label: categoryInfo.name, href: `/${categorySlug}` }];

      if (subcategorySlug && categoryInfo.subcategories) {
        const subcategory = categoryInfo.subcategories.find((s) => s.slug === subcategorySlug);
        if (subcategory) {
          items.push({
            label: subcategory.name,
            href: `/${categorySlug}/${subcategorySlug}`,
          });
        }
      }

      return items;
    } else if (searchQuery) {
      return [{ label: `نتایج جستجو: ${searchQuery}` }];
    } else {
      return [{ label: "همه محصولات" }];
    }
  }, [categoryInfo, categorySlug, subcategorySlug, searchQuery]);

  const handleClearFilters = () => {
    setSelectedSize("");
    setSelectedColor("");
    setPriceRange([0, MAX_PRICE]);
    setInStock(false);
    setOnSale(false);
    setSelectedCategoryFilter("");
  };

  const activeFiltersCount = [
    selectedCategoryFilter,
    inStock,
    onSale,
    selectedSize,
    selectedColor,
    priceRange[1] < MAX_PRICE,
  ].filter(Boolean).length;

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return {
    products: filteredProducts,
    isLoading: isLoading || isRTKLoading,
    sortBy,
    setSortBy,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    priceRange,
    setPriceRange,
    inStock,
    setInStock,
    onSale,
    setOnSale,
    showFilters,
    setShowFilters,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    expandedFilters,
    toggleFilterSection,
    isFiltersExpanded,
    setIsFiltersExpanded,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    availableSizes,
    availableColors,
    categorySlug,
    getAvailableSizesForCategory,
    pageTitle,
    breadcrumbItems,
    handleClearFilters,
    activeFiltersCount,
  };
}
