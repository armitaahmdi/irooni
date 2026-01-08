"use client";

import RichTextEditor from "@/components/admin/RichTextEditor";
import ArticleImageUpload from "./ArticleImageUpload";

/**
 * ArticleFormFields Component
 * Form fields for article
 */
export default function ArticleFormFields({
  formData,
  setFormData,
  uploadingImage,
  onTitleChange,
  onImageUpload,
  onRemoveImage,
}) {
  return (
    <>
      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          عنوان (اختیاری)
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="عنوان مقاله را وارد کنید"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
      </div>

      {/* Slug */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          اسلاگ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder="slug-for-article"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
        <p className="mt-1 text-sm text-gray-500">
          اسلاگ باید یکتا باشد و در URL استفاده می‌شود
        </p>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          دسته‌بندی (اختیاری)
        </label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
          placeholder="مثلاً: ترند فصلی، راهنمای خرید"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
      </div>

      {/* Image */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          تصویر (اختیاری)
        </label>
        <ArticleImageUpload
          image={formData.image}
          uploadingImage={uploadingImage}
          onImageUpload={onImageUpload}
          onRemoveImage={() => setFormData((prev) => ({ ...prev, image: "" }))}
        />
      </div>

      {/* Excerpt */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          خلاصه / توضیحات کوتاه (اختیاری)
        </label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
          placeholder="خلاصه یا توضیحات کوتاه مقاله را وارد کنید"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#286378] focus:border-transparent"
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          محتوا (اختیاری)
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
          placeholder="محتوای کامل مقاله را وارد کنید..."
        />
        <p className="mt-2 text-sm text-gray-500">
          می‌توانید از ابزارهای بالا برای فرمت‌بندی متن استفاده کنید (بولد، ایتالیک، رنگ، لیست
          و...)
        </p>
      </div>

      {/* Published Status */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
            }
            className="w-5 h-5 text-[#286378] border-gray-300 rounded focus:ring-[#286378]"
          />
          <span className="text-sm font-medium text-gray-700">
            منتشر کردن مقاله (قابل مشاهده برای کاربران)
          </span>
        </label>
      </div>
    </>
  );
}

