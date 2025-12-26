"use client";

import { XCircle } from "lucide-react";

const INITIAL_FORM_DATA = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minPurchase: "",
  maxDiscount: "",
  usageLimit: "",
  isActive: true,
};

/**
 * CouponFormModal Component
 * Modal for adding/editing coupons
 */
export default function CouponFormModal({
  isOpen,
  editingCoupon,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, editingCoupon);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {editingCoupon ? "ویرایش کد تخفیف" : "ایجاد کد تخفیف جدید"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              کد تخفیف <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase(),
                })
              }
              required
              disabled={!!editingCoupon}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] disabled:bg-gray-100"
              placeholder="مثال: SUMMER2024"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              توضیحات (اختیاری)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] resize-none"
              placeholder="توضیحات کد تخفیف..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                نوع تخفیف <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378]"
              >
                <option value="percentage">درصدی</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {formData.discountType === "percentage"
                  ? "درصد تخفیف"
                  : "مبلغ تخفیف (تومان)"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: e.target.value,
                  })
                }
                required
                min="1"
                max={formData.discountType === "percentage" ? "100" : undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378]"
                placeholder={formData.discountType === "percentage" ? "10" : "50000"}
              />
            </div>
          </div>

          {formData.discountType === "percentage" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                حداکثر تخفیف (تومان) (اختیاری)
              </label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378]"
                placeholder="100000"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              حداقل مبلغ خرید (تومان) (اختیاری)
            </label>
            <input
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378]"
              placeholder="100000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              تعداد استفاده (اختیاری)
            </label>
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378]"
              placeholder="100"
            />
            <p className="text-xs text-gray-500 mt-1">
              تعداد افرادی که می‌توانند از این کد استفاده کنند (خالی = نامحدود)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-[#286378] border-gray-300 rounded focus:ring-[#286378]"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
              فعال
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold rounded-lg hover:from-[#43909A] hover:to-[#286378] transition-all"
            >
              {editingCoupon ? "ذخیره تغییرات" : "ایجاد کد تخفیف"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { INITIAL_FORM_DATA };

