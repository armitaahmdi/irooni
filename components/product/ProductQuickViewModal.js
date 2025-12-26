"use client";

import { useEffect } from "react";
import Image from "next/image";
import NavigationLink from "@/components/NavigationLink";
import { formatPrice, getProductUrl } from "@/utils/productCardHelpers";

export default function ProductQuickViewModal({ product, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const productUrl = getProductUrl(product);
  const imageCandidates = [product.image, ...(product.images || [])].filter(Boolean);
  const primaryImage = imageCandidates[0];
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent =
    typeof product.discountPercent === "number"
      ? product.discountPercent
      : hasDiscount && product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  const sortedSizes = [...sizes].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
    if (safeIndexA !== safeIndexB) return safeIndexA - safeIndexB;
    return a.localeCompare(b, "fa");
  });
  const ratingValue =
    typeof product.rating === "number"
      ? product.rating
      : typeof product.rating === "string"
        ? parseFloat(product.rating)
        : 4.8;
  const safeRating = Number.isFinite(ratingValue) ? ratingValue : 4.8;
  const features = Array.isArray(product.features)
    ? product.features.filter(Boolean)
    : product.features
      ? [product.features]
      : [];
  const sizeChart = Array.isArray(product.sizeChart) ? product.sizeChart : [];
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const sizeStock = product.sizeStock && typeof product.sizeStock === "object" ? product.sizeStock : null;
  const colors = Array.isArray(product.colors) ? product.colors.filter(Boolean) : [];
  const description = product.description?.trim();
  const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("fa-IR");
  };
  const detailRows = [
    product.code ? { label: "کد محصول", value: product.code } : null,
    product.category ? { label: "دسته‌بندی", value: product.category } : null,
    product.subcategory ? { label: "زیردسته", value: product.subcategory } : null,
    product.material ? { label: "جنس", value: product.material } : null,
    typeof product.stock === "number" ? { label: "موجودی", value: `${product.stock} عدد` } : null,
    typeof product.inStock === "boolean"
      ? { label: "وضعیت موجودی", value: product.inStock ? "موجود" : "ناموجود" }
      : null,
    formatDate(product.createdAt)
      ? { label: "تاریخ ایجاد", value: formatDate(product.createdAt) }
      : null,
    formatDate(product.updatedAt)
      ? { label: "آخرین بروزرسانی", value: formatDate(product.updatedAt) }
      : null,
  ].filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-gray-700 shadow hover:bg-white"
          aria-label="بستن"
        >
          ✕
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-square bg-gray-100">
            {primaryImage && (
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="p-6 md:p-8 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">{product.name}</h3>
              {(product.code || product.material) && (
                <p className="text-xs text-gray-500">
                  {product.code && <span>کد: {product.code}</span>}
                  {product.code && product.material && <span className="mx-1">•</span>}
                  {product.material && <span>جنس: {product.material}</span>}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-0.5 text-amber-400" aria-label={`امتیاز ${safeRating}`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= Math.round(safeRating) ? "" : "text-gray-200"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="font-medium">{safeRating.toFixed(1)}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#286378]">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] font-semibold text-white bg-rose-500 px-2 py-0.5 rounded-full">
                    فروش ویژه
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {typeof discountPercent === "number" && (
                <p className="text-xs text-rose-500 mt-1">٪{discountPercent} تخفیف</p>
              )}
            </div>

            {sortedSizes.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">سایزهای مهم</p>
                <div className="flex flex-wrap gap-2">
                  {sortedSizes.slice(0, 6).map((size) => (
                    <span
                      key={size}
                      className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">رنگ‌های موجود</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {detailRows.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">جزئیات محصول</p>
                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                  {detailRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{row.label}</span>
                      <span>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {description && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">توضیحات</p>
                <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
              </div>
            )}

            {features.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">ویژگی‌ها</p>
                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                  {features.map((feature, index) => (
                    <li key={`${feature}-${index}`}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {sizeChart.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">جدول سایز</p>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-xs text-right">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-gray-600 font-semibold">سایز</th>
                        <th className="px-3 py-2 text-gray-600 font-semibold">عرض سینه</th>
                        <th className="px-3 py-2 text-gray-600 font-semibold">قد لباس</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.map((item, index) => (
                        <tr key={`${item.size || "size"}-${index}`} className="border-t border-gray-100">
                          <td className="px-3 py-2 text-gray-600">{item.size}</td>
                          <td className="px-3 py-2 text-gray-600">{item.chest}</td>
                          <td className="px-3 py-2 text-gray-600">{item.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {variants.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">موجودی سایز/رنگ</p>
                <div className="space-y-2">
                  {variants.map((variant, index) => (
                    <div
                      key={`${variant.size}-${variant.color}-${index}`}
                      className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <span>
                        {variant.size ? `سایز ${variant.size}` : "بدون سایز"}{" "}
                        {variant.color ? `• ${variant.color}` : ""}
                      </span>
                      <span className="font-medium">
                        {typeof variant.stock === "number" ? `${variant.stock} عدد` : "نامشخص"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sizeStock && Object.keys(sizeStock).length > 0 && variants.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600">موجودی سایزها</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  {Object.entries(sizeStock).map(([size, stock]) => (
                    <div
                      key={size}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <span>{size}</span>
                      <span className="font-medium">{stock} عدد</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-3">
              <NavigationLink
                href={productUrl}
                className="flex-1 text-center px-4 py-2.5 rounded-full bg-[#286378] text-white text-sm font-semibold hover:bg-[#1f5363] transition-colors"
              >
                مشاهده محصول
              </NavigationLink>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 text-center px-4 py-2.5 rounded-full border border-gray-200 text-gray-600 text-sm font-semibold hover:border-gray-300 transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
