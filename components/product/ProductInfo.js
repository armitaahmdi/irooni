"use client";

const formatPrice = (value) => new Intl.NumberFormat("fa-IR").format(value) + " تومان";

/**
 * ProductInfo Component
 * Displays product basic information (title, price, rating, sales, category)
 */
export default function ProductInfo({ 
  product, 
  hasDiscount, 
  discountPercent, 
  viewersCount,
}) {
  if (!product) return null;

  return (
    <div className="space-y-4">
      {/* Title and Price */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex-1 leading-tight">
          {product.name}
        </h1>
        <div className="text-left md:text-right">
          <div className="text-2xl md:text-xl font-bold text-[#286378]">
            {formatPrice(product.price)}
          </div>
          {hasDiscount && (
            <div className="text-sm text-gray-400 line-through mt-1">
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>
      </div>

      {/* Product Parameters - Soft and Textured Design */}
      <div className="flex flex-wrap items-center gap-3">
        {product.code && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-xl border border-gray-200/60 shadow-sm backdrop-blur-sm">
            <span className="text-xs text-gray-500 font-medium">کد</span>
            <span className="text-sm font-semibold text-gray-900">{product.code}</span>
          </div>
        )}
        {product.material && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-blue-50/60 to-blue-100/40 rounded-xl border border-blue-200/50 shadow-sm backdrop-blur-sm">
            <span className="text-xs text-gray-500 font-medium">جنس</span>
            <span className="text-sm font-semibold text-gray-900">{product.material}</span>
          </div>
        )}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-sm backdrop-blur-sm ${
          product.inStock 
            ? "bg-gradient-to-br from-green-50/70 to-emerald-100/50 border-green-200/60" 
            : "bg-gradient-to-br from-red-50/70 to-rose-100/50 border-red-200/60"
        }`}>
          <span className="text-xs text-gray-500 font-medium">موجودی</span>
          <span className={`text-sm font-semibold ${product.inStock ? "text-green-700" : "text-red-700"}`}>
            {product.inStock ? "موجود" : "ناموجود"}
          </span>
        </div>
      </div>
    </div>
  );
}
