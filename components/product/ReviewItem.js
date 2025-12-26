"use client";

import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, CheckCircle, User, Reply, Send, Loader2, X } from "lucide-react";
import { formatDate } from "@/utils/reviewHelpers";
import { renderStars } from "@/utils/reviewHelpers";

/**
 * ReviewItem Component
 * Individual review item with replies and voting
 */
export default function ReviewItem({
  review,
  userVote,
  isAuthenticated,
  onHelpful,
  onReply,
  isSubmittingReply,
}) {
  const [replyingTo, setReplyingTo] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = async () => {
    const success = await onReply(review.id, replyText);
    if (success) {
      setReplyText("");
      setReplyingTo(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#286378] to-[#43909A] rounded-full flex items-center justify-center text-white font-bold">
            {review.user?.name?.charAt(0) || <User className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{review.user?.name || "کاربر ناشناس"}</span>
              {review.isVerifiedPurchase && (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  خرید تایید شده
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {review.title && <h4 className="text-lg font-bold text-gray-900 mb-2">{review.title}</h4>}

      {review.comment && (
        <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
      )}

      {/* پاسخ‌ها */}
      {review.replies && review.replies.length > 0 && (
        <div className="mr-8 mt-4 space-y-3 border-r-2 border-gray-200 pr-4">
          {review.replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
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
      )}

      <div className="flex items-center gap-4 text-sm mt-4">
        <button
          onClick={() => onHelpful(review.id, true)}
          className={`flex items-center gap-1 transition-colors ${
            userVote === true ? "text-green-600 font-semibold" : "text-gray-500 hover:text-green-600"
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          مفید بود ({review.helpfulCount || 0})
        </button>
        <button
          onClick={() => onHelpful(review.id, false)}
          className={`flex items-center gap-1 transition-colors ${
            userVote === false ? "text-red-600 font-semibold" : "text-gray-500 hover:text-red-600"
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          غیرمفید ({review.unhelpfulCount || 0})
        </button>
        {isAuthenticated && (
          <button
            onClick={() => setReplyingTo(!replyingTo)}
            className="flex items-center gap-1 text-gray-500 hover:text-[#286378] transition-colors"
          >
            <Reply className="w-4 h-4" />
            پاسخ
          </button>
        )}
      </div>

      {/* فرم پاسخ */}
      {replyingTo && (
        <div className="mt-4 mr-8 bg-gray-50 rounded-lg p-4">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] resize-none mb-2"
            placeholder="پاسخ خود را اینجا بنویسید..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleReplySubmit}
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
            <button
              onClick={() => {
                setReplyingTo(false);
                setReplyText("");
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              انصراف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

