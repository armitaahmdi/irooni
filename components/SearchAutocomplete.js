"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, Loader2 } from "lucide-react";

const formatPrice = (value) => new Intl.NumberFormat("fa-IR").format(value) + " تومان";

export default function SearchAutocomplete({ query, onSelect, isMobile = false }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // بستن dropdown وقتی کلیک خارج از آن انجام می‌شود
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        // اگر روی input کلیک شده، dropdown را نبند
        const target = event.target;
        if (target.tagName === "INPUT" && target.type === "text") {
          return;
        }
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // پاک کردن timeout قبلی
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // اگر query کمتر از 2 کاراکتر است، نتایج را پاک کن
    if (!query || query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      setIsLoading(false);
      return;
    }

    // Debounce: 300ms صبر کن بعد از توقف تایپ
    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query.trim())}&limit=5`);
        const data = await response.json();

        if (data.success) {
          setResults(data.data);
          setShowResults(data.data.length > 0);
        } else {
          setResults([]);
          setShowResults(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleProductClick = (product) => {
    setShowResults(false);
    if (onSelect) {
      onSelect();
    }
    router.push(product.url);
  };

  if (!showResults && !isLoading) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute ${
        isMobile ? "top-full mt-2 right-0 left-0 z-[101]" : "top-full mt-1 right-0 z-50"
      } bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden ${
        isMobile ? "mx-5" : "w-full max-w-[320px]"
      }`}
      style={{
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-[#286378] animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-semibold text-gray-600">نتایج جستجو</p>
          </div>
          <div className="divide-y divide-gray-100">
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-right group"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <Image
                    src={product.image || "/logo/main-logo.png"}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#286378] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {product.discountPercent ? (
                      <>
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm font-bold text-[#286378]">
                          {formatPrice(product.finalPrice)}
                        </span>
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                          {product.discountPercent}%
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-[#286378]">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
                <SearchIcon className="w-4 h-4 text-gray-400 group-hover:text-[#286378] transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              className="text-xs font-semibold text-[#286378] hover:text-[#43909A] transition-colors flex items-center justify-center gap-1"
              onClick={() => setShowResults(false)}
            >
              مشاهده همه نتایج
              <SearchIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ) : query.trim().length >= 2 ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-gray-500">نتیجه‌ای یافت نشد</p>
        </div>
      ) : null}
    </div>
  );
}

