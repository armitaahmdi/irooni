"use client";

import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Link as LinkIcon } from "lucide-react";

/**
 * SlidesTable Component
 * Displays slides in a table format
 */
export default function SlidesTable({
  slides,
  onEdit,
  onDelete,
  onToggleActive,
  onOrderChange,
}) {
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ترتیب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تصویر دسکتاپ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تصویر موبایل
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alt Text
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                لینک
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                وضعیت
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {slides.map((slide, index) => (
              <tr key={slide.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOrderChange(slide, "up")}
                      disabled={index === 0}
                      className={`p-1 rounded ${
                        index === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium text-gray-900">{slide.order}</span>
                    <button
                      onClick={() => onOrderChange(slide, "down")}
                      disabled={index === slides.length - 1}
                      className={`p-1 rounded ${
                        index === slides.length - 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden">
                    <Image src={slide.image} alt={slide.alt} fill className="object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={slide.imageMobile}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900 max-w-xs truncate">{slide.alt}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {slide.link ? (
                    (() => {
                      const isExternalLink =
                        slide.link.startsWith("http://") || slide.link.startsWith("https://");
                      if (isExternalLink) {
                        return (
                          <a
                            href={slide.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#286378] hover:text-[#43909A] flex items-center gap-1"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span className="text-sm max-w-xs truncate">{slide.link}</span>
                          </a>
                        );
                      } else {
                        return (
                          <Link
                            href={slide.link}
                            className="text-[#286378] hover:text-[#43909A] flex items-center gap-1"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span className="text-sm max-w-xs truncate">{slide.link}</span>
                          </Link>
                        );
                      }
                    })()
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleActive(slide)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      slide.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {slide.isActive ? (
                      <>
                        <Eye className="w-4 h-4" />
                        فعال
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        غیرفعال
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(slide)}
                      className="text-[#286378] hover:text-[#43909A] p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(slide)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

