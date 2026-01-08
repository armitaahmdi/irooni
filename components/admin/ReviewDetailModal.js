"use client";

import { useState, useEffect } from "react";
import { XCircle, User, Package, Send, Loader2 } from "lucide-react";
import { formatDate, renderStars } from "@/utils/reviewHelpers";
import { useToast } from "@/components/providers/ToastProvider";

/**
 * ReviewDetailModal Component
 * Modal for viewing review details and replying
 */
export default function ReviewDetailModal({
  isOpen,
  review,
  onClose,
  onApprove,
  onReject,
  onDelete,
  onReplySubmitted,
}) {
  const { showToast } = useToast();
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (isOpen && review) {
      fetchReplies();
    }
  }, [isOpen, review]);

  const fetchReplies = async () => {
    if (!review) return;

    try {
      const response = await fetch(
        `/api/products/${review.productId}/reviews/${review.id}/reply`
      );
      const data = await response.json();
      if (data.success) {
        setSelectedReview({ ...review, replies: data.data });
      } else {
        setSelectedReview(review);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      setSelectedReview(review);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !selectedReview) {
      showToast("لطفاً متن پاسخ را وارد کنید", "error");
      return;
    }

    setIsSubmittingReply(true);
    try {
      const response = await fetch(
        `/api/products/${selectedReview.product?.id || selectedReview.productId}/reviews/${selectedReview.id}/reply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reply: replyText }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showToast("پاسخ شما با موفقیت ثبت شد", "success");
        setReplyText("");
        fetchReplies();
        if (onReplySubmitted) onReplySubmitted();
      } else {
        showToast(data.error || "خطا در ثبت پاسخ", "error");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      showToast("خطا در ثبت پاسخ", "error");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (!isOpen || !selectedReview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">جزئیات نظر</h2>
          <button
            onClick={() => {
              onClose();
              setReplyText("");
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-full flex items-center justify-center text-white font-bold">
              {selectedReview.user?.name?.charAt(0) || <User className="w-6 h-6" />}
            </div>
            <div>
              <div className="font-bold text-gray-900">
                {selectedReview.user?.name || "کاربر ناشناس"}
              </div>
              <div className="text-sm text-gray-500">{formatDate(selectedReview.createdAt)}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">محصول</label>
            <div className="flex items-center gap-2 text-gray-900">
              <Package className="w-5 h-5" />
              {selectedReview.product?.name || "محصول حذف شده"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">امتیاز</label>
            <div className="flex items-center gap-2">
              {renderStars(selectedReview.rating)}
              <span className="text-lg font-bold text-gray-900">{selectedReview.rating}/5</span>
            </div>
          </div>

          {selectedReview.comment && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">نظر</label>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {selectedReview.comment}
              </p>
            </div>
          )}

          {/* پاسخ‌ها */}
          {selectedReview.replies && selectedReview.replies.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                پاسخ‌ها ({selectedReview.replies.length})
              </label>
              <div className="space-y-3">
                {selectedReview.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-gray-50 rounded-lg p-4 border-r-4 border-[#286378]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {reply.user?.name?.charAt(0) || <User className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {reply.user?.name || "کاربر ناشناس"}
                          </span>
                          {reply.isAdminReply && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              ادمین
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{reply.reply}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* فرم پاسخ ادمین */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">پاسخ ادمین</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] resize-none mb-2"
              placeholder="پاسخ خود را اینجا بنویسید..."
            />
            <button
              onClick={handleSubmitReply}
              disabled={isSubmittingReply || !replyText.trim()}
              className="px-4 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
            >
              {isSubmittingReply ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  ارسال پاسخ
                </>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">وضعیت</label>
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                selectedReview.isApproved
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {selectedReview.isApproved ? "تایید شده" : "در انتظار تایید"}
            </span>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {!selectedReview.isApproved && (
              <button
                onClick={() => {
                  if (onApprove) onApprove(selectedReview.id);
                  onClose();
                }}
                className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all"
              >
                تایید نظر
              </button>
            )}
            {selectedReview.isApproved && (
              <button
                onClick={() => {
                  if (onReject) onReject(selectedReview.id);
                  onClose();
                }}
                className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all"
              >
                رد نظر
              </button>
            )}
            <button
              onClick={() => {
                if (onDelete) onDelete(selectedReview);
                onClose();
              }}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

