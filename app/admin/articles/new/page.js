"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import { useArticleFormNew } from "@/hooks/useArticleFormNew";
import ArticleFormFields from "@/components/admin/article/ArticleFormFields";

export default function NewArticlePage() {
  const router = useRouter();
  const {
    formData,
    setFormData,
    isLoading,
    isAuthorized,
    uploadingImage,
    handleTitleChange,
    handleImageUpload,
    handleSubmit,
  } = useArticleFormNew();

  const onImageUpload = async (file) => {
    await handleImageUpload(file);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/admin/articles"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              مقالات
            </Link>
            <ChevronLeft className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 font-medium">مقاله جدید</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">ایجاد مقاله جدید</h1>
          <p className="text-gray-600 mt-1">تمام فیلدها اختیاری هستند (به جز اسلاگ)</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white rounded-xl shadow-md p-8"
        >
          <ArticleFormFields
            formData={formData}
            setFormData={setFormData}
            uploadingImage={uploadingImage}
            onTitleChange={handleTitleChange}
            onImageUpload={onImageUpload}
            onRemoveImage={() => setFormData((prev) => ({ ...prev, image: "" }))}
          />

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading || !formData.slug}
              className="flex items-center gap-2 bg-[#286378] text-white px-6 py-3 rounded-lg hover:bg-[#43909A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>ذخیره مقاله</span>
                </>
              )}
            </button>
            <Link
              href="/admin/articles"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              انصراف
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
