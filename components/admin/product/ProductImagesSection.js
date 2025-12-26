"use client";

import { X, Upload } from "lucide-react";

/**
 * ProductImagesSection Component
 * Product images management section
 */
export default function ProductImagesSection({
  formData,
  setFormData,
  newImage,
  setNewImage,
  uploadingImage,
  uploadingImages,
  onImageUpload,
  onAddImage,
  onRemoveImage,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">تصاویر</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">تصویر اصلی *</label>
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="/uploads/products/image.png"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
          <label className="px-4 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {uploadingImage ? "در حال آپلود..." : "آپلود"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onImageUpload(e, true)}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
        </div>
        {formData.image && (
          <div className="mt-2 relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">تصاویر اضافی</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="/uploads/products/image-2.png"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#286378] focus:border-transparent"
          />
          <button
            type="button"
            onClick={onAddImage}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            افزودن URL
          </button>
          <label className="px-4 py-2 bg-[#286378] text-white rounded-lg hover:bg-[#43909A] transition-colors cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {uploadingImages ? "در حال آپلود..." : "آپلود"}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onImageUpload(e, false)}
              className="hidden"
              disabled={uploadingImages}
            />
          </label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(formData.images || []).map((img, index) => (
            <div
              key={index}
              className="relative group border border-gray-300 rounded-lg overflow-hidden"
            >
              <img src={img} alt={`Image ${index + 1}`} className="w-full h-24 object-cover" />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

