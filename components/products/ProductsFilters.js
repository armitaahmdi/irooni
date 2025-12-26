"use client";

import FiltersHeader from "./FiltersHeader";
import ActiveFilters from "./ActiveFilters";
import CategoryFilter from "./CategoryFilter";
import StockSaleFilter from "./StockSaleFilter";
import SizeFilter from "./SizeFilter";
import ColorFilter from "./ColorFilter";
import PriceRangeFilter from "./PriceRangeFilter";

/**
 * ProductsFilters Component
 * Reusable filters sidebar for products page
 */
export default function ProductsFilters({
  // Filter states
  inStock,
  setInStock,
  onSale,
  setOnSale,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  selectedCategoryFilter,
  setSelectedCategoryFilter,
  priceRange,
  setPriceRange,
  // UI states
  expandedFilters,
  toggleFilterSection,
  isFiltersExpanded,
  setIsFiltersExpanded,
  showFilters,
  // Data
  availableSizes,
  availableColors,
  categorySlug,
}) {
  const activeFiltersCount = [
    selectedCategoryFilter,
    inStock,
    onSale,
    selectedSize,
    selectedColor,
    priceRange[1] < 5000000,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setInStock(false);
    setOnSale(false);
    setSelectedSize("");
    setSelectedColor("");
    setSelectedCategoryFilter("");
    setPriceRange([0, 5000000]);
  };

  return (
    <aside
      className={`lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
    >
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl border border-gray-200/50 overflow-hidden lg:sticky lg:top-4 backdrop-blur-sm ring-1 ring-gray-100">
        {/* Header */}
        <FiltersHeader
          isFiltersExpanded={isFiltersExpanded}
          setIsFiltersExpanded={setIsFiltersExpanded}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={handleClearFilters}
        />

        {/* Filters Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isFiltersExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50/30">
            {/* Active Filters */}
            <ActiveFilters
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
            />

            {/* Category Filter */}
            {!categorySlug && (
              <CategoryFilter
                selectedCategoryFilter={selectedCategoryFilter}
                setSelectedCategoryFilter={setSelectedCategoryFilter}
                expandedFilters={expandedFilters}
                toggleFilterSection={toggleFilterSection}
              />
            )}

            {/* Stock & Sale Filter */}
            <StockSaleFilter
              inStock={inStock}
              setInStock={setInStock}
              onSale={onSale}
              setOnSale={setOnSale}
              expandedFilters={expandedFilters}
              toggleFilterSection={toggleFilterSection}
            />

            {/* Size Filter */}
            <SizeFilter
              availableSizes={availableSizes}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              expandedFilters={expandedFilters}
              toggleFilterSection={toggleFilterSection}
            />

            {/* Color Filter */}
            <ColorFilter
              availableColors={availableColors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              expandedFilters={expandedFilters}
              toggleFilterSection={toggleFilterSection}
            />

            {/* Price Range */}
            <PriceRangeFilter
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              expandedFilters={expandedFilters}
              toggleFilterSection={toggleFilterSection}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
