"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Eye, EyeOff, FileText } from "lucide-react";
import { formatDate } from "@/utils/reviewHelpers";

export default function ArticlesTable({ articles, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#286378] mx-auto"></div>
        <p className="mt-4 text-gray-600">در حال بارگذاری مقالات...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="p-12 text-center">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-2">مقاله‌ای یافت نشد</p>
        <Link href="/admin/articles/new" className="text-[#286378] hover:underline">
          ایجاد مقاله جدید
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">عنوان</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">دسته‌بندی</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">وضعیت</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">تاریخ ایجاد</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  {article.image && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={article.image}
                        alt={article.title || "بدون عنوان"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{article.title || "بدون عنوان"}</p>
                    <p className="text-sm text-gray-500">{article.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                  {article.category || "بدون دسته‌بندی"}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {article.isPublished ? (
                    <>
                      <Eye className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">منتشر شده</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400 font-medium">پیش‌نویس</span>
                    </>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">{formatDate(article.createdAt)}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-3">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="ویرایش"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => onDelete(article.id, article.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

