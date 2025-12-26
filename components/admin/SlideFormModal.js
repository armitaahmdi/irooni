"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";

/**
 * SlideFormModal Component
 * Modal for adding/editing slides
 */
export default function SlideFormModal({
  isOpen,
  editingSlide,
  formData,
  setFormData,
  uploading,
  onClose,
  onSubmit,
  onFileUpload,
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, editingSlide);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#286378]">
            {editingSlide ? "ویرایش بنر" : "افزودن بنر جدید"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Desktop Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصویر دسکتاپ <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {formData.image && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-300">
                  <Image src={formData.image} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      {uploading.image ? (
                        <span className="text-[#286378]">در حال آپلود...</span>
                      ) : (
                        <span>کلیک کنید یا فایل را بکشید</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (حداکثر 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) onFileUpload(file, "image", (url) => setFormData((prev) => ({ ...prev, image: url })));
                    }}
                    disabled={uploading.image}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Mobile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تصویر موبایل <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {formData.imageMobile && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-300">
                  <Image
                    src={formData.imageMobile}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      {uploading.imageMobile ? (
                        <span className="text-[#286378]">در حال آپلود...</span>
                      ) : (
                        <span>کلیک کنید یا فایل را بکشید</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (حداکثر 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file)
                        onFileUpload(file, "imageMobile", (url) =>
                          setFormData((prev) => ({ ...prev, imageMobile: url }))
                        );
                    }}
                    disabled={uploading.imageMobile}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              متن Alt (برای SEO) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => setFormData((prev) => ({ ...prev, alt: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
              placeholder="مثال: پیراهن، کفش، کاپشن و پالتو"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              این متن برای SEO و دسترسی‌پذیری استفاده می‌شود
            </p>
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">لینک (اختیاری)</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
              placeholder="/shirt یا /products/category یا https://example.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              برای لینک داخلی فقط مسیر را وارد کنید (مثال: /shirt). برای لینک خارجی آدرس کامل
              را وارد کنید (مثال: https://example.com)
            </p>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ترتیب نمایش</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value) || 0,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
              min="0"
            />
            <p className="mt-1 text-xs text-gray-500">
              بنرها بر اساس این عدد مرتب می‌شوند (عدد کمتر = نمایش اول)
            </p>
          </div>

          {/* Overlay */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="overlay"
              checked={formData.overlay}
              onChange={(e) => setFormData((prev) => ({ ...prev, overlay: e.target.checked }))}
              className="w-4 h-4 text-[#286378] border-gray-300 rounded focus:ring-[#286378]"
            />
            <label htmlFor="overlay" className="text-sm font-medium text-gray-700">
              نمایش Overlay
            </label>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-[#286378] border-gray-300 rounded focus:ring-[#286378]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              فعال
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors"
            >
              {editingSlide ? "ذخیره تغییرات" : "افزودن بنر"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

