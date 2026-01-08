"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { productCategories } from "@/data/categories";

const formatPrice = (price) => {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
};

export default function ProductDetailsModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">جزئیات محصول</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Product Image */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">نام محصول</label>
              <p className="text-lg font-semibold text-gray-900">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">کد محصول</label>
              <p className="text-lg text-gray-900">{product.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">دسته‌بندی</label>
              <p className="text-lg text-gray-900">
                {productCategories.find((c) => c.slug === product.category)?.name ||
                  product.category}
              </p>
            </div>
            {product.subcategory && (
              <div>
                <label className="text-sm font-medium text-gray-500">زیردسته</label>
                <p className="text-lg text-gray-900">{product.subcategory}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">قیمت اصلی</label>
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(product.price)}
              </p>
            </div>
            {product.discountPercent && product.discountPercent > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">درصد تخفیف</label>
                <p className="text-lg text-red-600 font-semibold">
                  {product.discountPercent}%
                </p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">موجودی</label>
              <p className="text-lg text-gray-900">
                {product.stock || 0} عدد
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">وضعیت</label>
              <span
                className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                  product.inStock
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.inStock ? "موجود" : "ناموجود"}
              </span>
            </div>
          </div>

          {/* Additional Images */}
          {product.images && product.images.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                تصاویر اضافی
              </label>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden">
                    <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">سایزها</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">رنگ‌ها</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Material */}
          {product.material && (
            <div>
              <label className="text-sm font-medium text-gray-500">جنس</label>
              <p className="text-lg text-gray-900">{product.material}</p>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                توضیحات
              </label>
              <p className="text-gray-900 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">ویژگی‌ها</label>
              <ul className="list-disc list-inside space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="text-gray-900">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Size Chart */}
          {product.sizeChart && Array.isArray(product.sizeChart) && product.sizeChart.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">جدول سایز</label>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-300">
                        سایز
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-300">
                        عرض سینه (cm)
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 border border-gray-300">
                        قد لباس (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">
                          {item.size}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">
                          {item.chest}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700 border border-gray-300">
                          {item.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            بستن
          </button>
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="px-4 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors"
            onClick={onClose}
          >
            ویرایش محصول
          </Link>
        </div>
      </div>
    </div>
  );
}

