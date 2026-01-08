"use client";

import { X, Upload } from "lucide-react";

/**
 * ArticleImageUpload Component
 * Image upload for article
 */
export default function ArticleImageUpload({
  image,
  uploadingImage,
  onImageUpload,
  onRemoveImage,
}) {
  if (image) {
    return (
      <div className="relative group">
        <div className="relative w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
          <div className="relative w-full" style={{ aspectRatio: "16/9", minHeight: "300px" }}>
            <img
              src={image}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onRemoveImage}
          className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        {uploadingImage ? (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378]"></div>
        ) : (
          <>
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">کلیک کنید</span> یا تصویر را بکشید
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (حداکثر 5MB)</p>
          </>
        )}
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageUpload(file);
          e.target.value = "";
        }}
        disabled={uploadingImage}
      />
    </label>
  );
}

