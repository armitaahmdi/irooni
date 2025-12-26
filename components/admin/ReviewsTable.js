"use client";

import {
  Package,
  User,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate, renderStars } from "@/utils/reviewHelpers";

/**
 * ReviewsTable Component
 * Displays reviews in a table format
 */
export default function ReviewsTable({
  reviews,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onApprove,
  onReject,
  onDelete,
}) {
  if (reviews.length === 0 && !isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  محصول
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کاربر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  امتیاز
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نظر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ
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
                <td
                  colSpan="7"
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  نظری یافت نشد.
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
                محصول
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                کاربر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                امتیاز
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                نظر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاریخ
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
            {reviews.map((review) => (
              <tr
                key={review.id}
                className={`hover:bg-gray-50 ${!review.isApproved ? "bg-yellow-50" : ""}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {review.product?.name || "محصول حذف شده"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {review.user?.name?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {review.user?.name || "کاربر ناشناس"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="text-sm font-semibold text-gray-900">{review.rating}/5</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {review.comment ? (
                      <p className="line-clamp-2">{review.comment}</p>
                    ) : (
                      <span className="text-gray-400">بدون متن</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      review.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {review.isApproved ? "تایید شده" : "در انتظار تایید"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(review)}
                      className="text-[#286378] hover:text-[#43909A] p-2 rounded-full hover:bg-gray-100 transition-colors"
                      title="مشاهده نظر"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {!review.isApproved && (
                      <button
                        onClick={() => onApprove(review.id)}
                        className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50 transition-colors"
                        title="تایید نظر"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {review.isApproved && (
                      <button
                        onClick={() => onReject(review.id)}
                        className="text-orange-600 hover:text-orange-800 p-2 rounded-full hover:bg-orange-50 transition-colors"
                        title="رد نظر"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(review)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="حذف نظر"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

