import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { productCategories } from "@/data/categories";
import { useProductsFilter } from "@/hooks/useProductsFilter";

const PRODUCTS_PER_PAGE = 12;
const MAX_PRICE = 5000000;
const DEBOUNCE_DELAY = 300; // ms for debouncing filter changes
const FILTER_PRODUCTS_LIMIT = 200; // Reduced from 1000 for better performance

export function useProductsPage({ categorySlug, subcategorySlug, searchQuery }) {
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

  const categoryInfo = categorySlug
    ? productCategories.find((cat) => cat.slug === categorySlug)
    : null;

  const getAvailableSizesForCategory = (category) => {
    if (!category) {
      return [
        "S",
        "M",
        "L",
        "XL",
        "XXL",
        "3XL",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
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

  // Debounced fetch for filter products - only fetch when category changes, not on every filter change
  useEffect(() => {
    const fetchAllProductsForFilters = async () => {
      try {
        const params = new URLSearchParams({ limit: FILTER_PRODUCTS_LIMIT.toString() });
        const categoryToUse = categorySlug || selectedCategoryFilter;
        if (categoryToUse) params.append("category", categoryToUse);
        if (subcategorySlug) params.append("subcategory", subcategorySlug);

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setAllProductsForFilters(data.data);
        }
      } catch (error) {
        console.error("Error fetching products for filters:", error);
      }
    };

    fetchAllProductsForFilters();
  }, [categorySlug, subcategorySlug, selectedCategoryFilter]);

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

  // Fetch products with debouncing for filter changes
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: PRODUCTS_PER_PAGE.toString(),
          sortBy: sortBy,
        });

        if (categorySlug) params.append("category", categorySlug);
        if (subcategorySlug) params.append("subcategory", subcategorySlug);
        if (inStock) params.append("inStock", "true");
        if (onSale) params.append("onSale", "true");
        if (selectedSize) params.append("size", selectedSize);
        if (selectedColor) params.append("color", selectedColor);
        if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString());
        if (priceRange[1] < MAX_PRICE) params.append("maxPrice", priceRange[1].toString());
        if (searchQuery) params.append("search", searchQuery);

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          console.warn("Failed to fetch products:", response.status);
          setProducts([]);
          setTotalPages(1);
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON but got:", contentType, text.substring(0, 100));
          setProducts([]);
          setTotalPages(1);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.data);
          setTotalPages(data.pagination?.totalPages || 1);
        } else {
          console.error("Error fetching products:", data.error);
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    // Determine if we need debouncing (for filter changes) or immediate fetch (for page/category changes)
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
    isLoading,
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

