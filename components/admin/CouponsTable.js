"use client";

import { Tag, Edit, Trash2, Percent, DollarSign, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/utils/couponHelpers";

/**
 * CouponsTable Component
 * Displays coupons in a table format
 */
export default function CouponsTable({
  coupons,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) {
  if (coupons.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کد تخفیف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نوع تخفیف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مبلغ/درصد تخفیف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تعداد استفاده
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  محدودیت استفاده
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  کد تخفیفی یافت نشد.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                کد تخفیف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نوع تخفیف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                مبلغ/درصد تخفیف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تعداد استفاده
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                محدودیت استفاده
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => {
              const usagePercentage =
                coupon.usageLimit && coupon.usageLimit > 0
                  ? (coupon.usedCount / coupon.usageLimit) * 100
                  : 0;

              return (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#286378]" />
                      <div>
                        <div className="text-sm font-bold text-gray-900">{coupon.code}</div>
                        {coupon.description && (
                          <div className="text-xs text-gray-500 mt-1">{coupon.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {coupon.discountType === "percentage" ? (
                        <Percent className="w-4 h-4 text-blue-500" />
                      ) : (
                        <DollarSign className="w-4 h-4 text-green-500" />
                      )}
                      <span className="text-sm text-gray-900">
                        {coupon.discountType === "percentage" ? "درصدی" : "مبلغ ثابت"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {coupon.discountType === "percentage" ? (
                        <span>{coupon.discountValue}%</span>
                      ) : (
                        <span>{formatPrice(coupon.discountValue)}</span>
                      )}
                    </div>
                    {coupon.minPurchase && (
                      <div className="text-xs text-gray-500 mt-1">
                        حداقل: {formatPrice(coupon.minPurchase)}
                      </div>
                    )}
                    {coupon.maxDiscount && (
                      <div className="text-xs text-gray-500 mt-1">
                        حداکثر: {formatPrice(coupon.maxDiscount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {coupon.usedCount} بار
                        </div>
                        {coupon.usageLimit && (
                          <div className="text-xs text-gray-500">از {coupon.usageLimit} بار</div>
                        )}
                      </div>
                    </div>
                    {coupon.usageLimit && coupon.usageLimit > 0 && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            usagePercentage >= 100
                              ? "bg-red-500"
                              : usagePercentage >= 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {coupon.usageLimit ? (
                      <div className="text-sm text-gray-900">{coupon.usageLimit} نفر</div>
                    ) : (
                      <span className="text-sm text-gray-400">نامحدود</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        coupon.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(coupon)}
                        className="text-[#286378] hover:text-[#43909A] p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="ویرایش"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDelete(coupon)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4 border-t border-gray-200">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-sm font-medium text-gray-700">
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}

