"use client";

import Link from "next/link";
import { MessageSquare, Star, CheckCircle2, ExternalLink } from "lucide-react";

/**
 * ReviewsSection Component
 * User reviews list
 */
export default function ReviewsSection({
  reviews,
  isLoading,
  reviewsPage,
  reviewsTotalPages,
  setReviewsPage,
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#286378] mb-6">دیدگاه‌های من</h2>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری نظرات...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">هنوز دیدگاهی ثبت نکرده‌اید</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#286378] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {review.product && (
                      <Link
                        href={
                          review.product.category?.slug && review.product.subcategory?.slug
                            ? `/${review.product.category.slug}/${review.product.subcategory.slug}/${review.product.slug}`
                            : review.product.slug
                            ? `/products?slug=${review.product.slug}`
                            : "#"
                        }
                        className="flex items-center gap-2 hover:text-[#286378] transition-colors"
                      >
                        <img
                          src={review.product.image}
                          alt={review.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-bold text-gray-900">{review.product.name}</h3>
                          <p className="text-xs text-gray-500">مشاهده محصول</p>
                        </div>
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({review.rating}/5)</span>
                    {review.isApproved ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        تایید شده
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        در انتظار تایید
                      </span>
                    )}
                    {review.isVerifiedPurchase && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        خرید تایید شده
                      </span>
                    )}
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {new Intl.DateTimeFormat("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(new Date(review.createdAt))}
                    </span>
                    {review.helpfulCount > 0 && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {review.helpfulCount} نفر مفید دانستند
                      </span>
                    )}
                  </div>
                  {review.replies && review.replies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        پاسخ‌ها ({review.replies.length})
                      </p>
                      {review.replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {reply.user?.name || "کاربر"}
                            </span>
                            {reply.isAdminReply && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-[#286378] text-white rounded-full">
                                ادمین
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{reply.reply}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {review.product && (
                  <Link
                    href={
                      review.product.category?.slug && review.product.subcategory?.slug
                        ? `/${review.product.category.slug}/${review.product.subcategory.slug}/${review.product.slug}`
                        : review.product.slug
                        ? `/products?slug=${review.product.slug}`
                        : "#"
                    }
                    className="p-2 text-[#286378] hover:bg-[#286378]/10 rounded-lg transition-colors"
                    title="مشاهده محصول"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {reviewsTotalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setReviewsPage((prev) => Math.max(1, prev - 1))}
                disabled={reviewsPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                قبلی
              </button>
              <span className="px-4 py-2 text-gray-700">
                صفحه {reviewsPage} از {reviewsTotalPages}
              </span>
              <button
                onClick={() => setReviewsPage((prev) => Math.min(reviewsTotalPages, prev + 1))}
                disabled={reviewsPage === reviewsTotalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

