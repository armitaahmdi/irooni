"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, AlertCircle, Loader2 } from "lucide-react";
import { formatPrice } from "@/utils/orderHelpers";
import { getColorHex, getColorBorder } from "@/utils/colorMap";
import { getProductUrl } from "@/utils/productCardHelpers";

export default function CartItem({ item, isUpdating, onUpdateQuantity, onRemove }) {
  const product = item.product;
  const price = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : product.price;
  const itemTotal = price * item.quantity;
  const isLowStock = product.stock < 5;
  const productUrl = getProductUrl(product);

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Link
          href={productUrl}
          className="flex-shrink-0 w-full sm:w-20 md:w-24 h-48 sm:h-20 md:h-24 relative rounded-lg overflow-hidden border border-gray-200 hover:opacity-80 transition-opacity"
        >
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={productUrl} className="block">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 hover:text-[#286378] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-600">
            {item.size && (
              <span>
                <span className="font-medium">سایز:</span> {item.size}
              </span>
            )}
            {item.color && (
              <div className="flex items-center gap-2">
                <span className="font-medium">رنگ:</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 ${getColorBorder(item.color)}`}
                  style={{ backgroundColor: getColorHex(item.color) }}
                />
                <span>{item.color}</span>
              </div>
            )}
          </div>

          {isLowStock && (
            <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 px-3 py-1 rounded-lg mb-3">
              <AlertCircle className="w-4 h-4" />
              <span>موجودی در انبار: {product.stock} عدد</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <p className="text-base sm:text-lg font-bold text-[#286378]">{formatPrice(itemTotal)}</p>
              {product.discountPercent && (
                <p className="text-xs sm:text-sm text-gray-500 line-through">
                  {formatPrice(product.price * item.quantity)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <span className="w-10 sm:w-12 text-center font-semibold text-sm sm:text-base">
                {isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin mx-auto" />
                ) : (
                  item.quantity
                )}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={isUpdating || item.quantity >= product.stock}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          disabled={isUpdating}
          className="flex-shrink-0 self-start sm:self-auto text-red-600 hover:text-red-700 disabled:opacity-50 p-1 sm:p-0"
          title="حذف"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

