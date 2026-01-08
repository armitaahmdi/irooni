"use client";

import { useState, lazy, Suspense } from "react";
import { useProductCard } from "@/hooks/useProductCard";
import ProductCardImage from "./product/ProductCardImage";
import ProductCardInfo from "./product/ProductCardInfo";
import ProductCardColors from "./product/ProductCardColors";
import ProductCardFavoriteButton from "./product/ProductCardFavoriteButton";
import ProductCardCartControls from "./product/ProductCardCartControls";

// Lazy load modal for better performance
const ProductQuickViewModal = lazy(() => import("./product/ProductQuickViewModal"));

const ProductCard = ({ product, className = "" }) => {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const {
    isLiked,
    cartQuantity,
    isInCart,
    availableStock,
    isOutOfStock,
    isCartProcessing,
    handleToggleFavorite,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveFromCart,
  } = useProductCard(product);

  return (
    <>
      <div className={`group relative ${className}`}>
      {/* Action Buttons */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-1 sm:gap-1.5 z-30">
        <ProductCardFavoriteButton
          key={`favorite-${product.id}`}
          isLiked={isLiked}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>

      {/* Main Card */}
      <div className="relative h-full flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-200/40 hover:border-[#286378]/40 group/card hover:-translate-y-2 transition-all duration-700"
        style={{
          boxShadow: `
            0 4px 20px rgba(40, 99, 120, 0.08),
            0 8px 30px rgba(40, 99, 120, 0.06),
            0 2px 8px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.02)
          `,
        }}
      >
        {/* Premium Multi-layer Shadow on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none"
          style={{
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.12),
              0 12px 40px rgba(0, 0, 0, 0.08),
              0 8px 24px rgba(0, 0, 0, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05)
            `,
          }}
        ></div>
        {/* Image Section */}
        <ProductCardImage
          product={product}
          hasDiscount={hasDiscount}
          discountPercent={discountPercent}
          isOutOfStock={isOutOfStock}
          onQuickView={() => setIsQuickViewOpen(true)}
        />

        {/* Content Section - Flex grow to fill space */}
        <div className="flex-1 flex flex-col">
          <ProductCardInfo product={product} hasDiscount={hasDiscount} />

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="px-3 sm:px-4 md:px-5 mb-2 sm:mb-3">
              <ProductCardColors colors={product.colors} />
            </div>
          )}

          {/* Cart Controls - Always at bottom */}
          <div className="mt-auto px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5">
            <ProductCardCartControls
              isInCart={isInCart}
              cartQuantity={cartQuantity}
              isCartProcessing={isCartProcessing}
              availableStock={availableStock}
              onAddToCart={handleAddToCart}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
              onRemoveFromCart={handleRemoveFromCart}
            />
          </div>
        </div>
      </div>
      </div>
      {isQuickViewOpen && (
        <Suspense fallback={null}>
          <ProductQuickViewModal
            product={product}
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default ProductCard;
