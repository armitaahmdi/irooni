"use client";

import { productCategories } from "@/data/categories";

/**
 * ProductBasicInfo Component
 * Basic product information form section
 */
export default function ProductBasicInfo({ formData, setFormData, getAvailableSizes }) {
  const selectedCategoryData = productCategories.find((cat) => cat.slug === formData.category);

  const handleCategoryChange = (newCategory) => {
    const newAvailableSizes = getAvailableSizes(newCategory);
    const currentSizes = formData.sizes || [];
    const validSizes = currentSizes.filter((size) => newAvailableSizes.includes(size));
    const validVariants = (formData.variants || []).filter((v) =>
      newAvailableSizes.includes(v.size)
    );
    setFormData({
      ...formData,
      category: newCategory,
      subcategory: "",
      sizes: validSizes,
      variants: validVariants,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">اطلاعات پایه</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">نام محصول *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">کد محصول *</label>
        <input
          type="text"
          required
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          >
            <option value="">انتخاب کنید</option>
            {productCategories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategoryData?.subcategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">زیردسته‌بندی</label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
            >
              <option value="">انتخاب کنید</option>
              {selectedCategoryData.subcategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

