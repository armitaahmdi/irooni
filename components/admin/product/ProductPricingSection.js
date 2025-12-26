"use client";

/**
 * ProductPricingSection Component
 * Product pricing and stock management section
 */
export default function ProductPricingSection({ formData, setFormData }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">قیمت‌گذاری</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            قیمت اصلی (تومان) *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            درصد تخفیف (اختیاری)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.discountPercent}
            onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
            placeholder="مثال: 20"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
          {formData.discountPercent && formData.price && (
            <p className="mt-1 text-xs text-gray-500">
              قیمت نهایی:{" "}
              {new Intl.NumberFormat("fa-IR").format(
                Math.round(
                  parseInt(formData.price) * (1 - parseInt(formData.discountPercent) / 100)
                )
              )}{" "}
              تومان
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            امتیاز محصول (اختیاری)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
            placeholder="مثال: 4.8"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            در صورت خالی بودن، در کارت محصول ۴.۸ نمایش داده می‌شود.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تعداد موجودی *</label>
          <input
            type="number"
            required
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
        </div>

        <div className="space-y-3 pt-8">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 text-[#286378] border-gray-300 rounded focus:ring-[#286378]"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
              موجود در انبار
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isVisible"
              checked={formData.isVisible}
              onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
              className="w-4 h-4 text-[#286378] border-gray-300 rounded focus:ring-[#286378]"
            />
            <label htmlFor="isVisible" className="text-sm font-medium text-gray-700">
              نمایش برای کاربران
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
