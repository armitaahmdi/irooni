"use client";

import { Filter, ChevronDown } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import ProductsFilters from "./products/ProductsFilters";
import ProductsToolbar from "./products/ProductsToolbar";
import ProductsGrid from "./products/ProductsGrid";
import ProductsPagination from "./products/ProductsPagination";
// Use RTK Query version for better caching and performance
import { useProductsPageRTK } from "@/hooks/useProductsPageRTK";

export default function ProductsPage({ categorySlug = null, subcategorySlug = null, searchQuery = null }) {
  // Use RTK Query version for automatic caching and deduplication
  const {
    products,
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
    categorySlug: categorySlugFromHook,
    getAvailableSizesForCategory,
    pageTitle,
    breadcrumbItems,
    handleClearFilters,
    activeFiltersCount,
  } = useProductsPageRTK({ categorySlug, subcategorySlug, searchQuery });

  return (
    <main className="min-h-screen bg-gray-50">
      <Breadcrumb items={breadcrumbItems} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between bg-white rounded-xl shadow-md border border-gray-200 p-4"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#286378]" />
              <span className="font-semibold text-gray-900">فیلترها</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#286378] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Filters Sidebar */}
          <ProductsFilters
            inStock={inStock}
            setInStock={setInStock}
            onSale={onSale}
            setOnSale={setOnSale}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedCategoryFilter={selectedCategoryFilter}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            expandedFilters={expandedFilters}
            toggleFilterSection={toggleFilterSection}
            isFiltersExpanded={isFiltersExpanded}
            setIsFiltersExpanded={setIsFiltersExpanded}
            showFilters={showFilters}
            availableSizes={availableSizes}
            availableColors={availableColors}
            categorySlug={categorySlugFromHook}
            getAvailableSizesForCategory={getAvailableSizesForCategory}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                {pageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">{products.length} محصول یافت شد</p>
            </div>

            {/* Toolbar */}
            <ProductsToolbar
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              setCurrentPage={setCurrentPage}
            />

            {/* Products Grid/List */}
            <ProductsGrid
              products={products}
              isLoading={isLoading}
              viewMode={viewMode}
              onClearFilters={handleClearFilters}
            />

            {/* Pagination */}
            <ProductsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
