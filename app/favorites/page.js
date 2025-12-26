"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectFavorites } from "@/store/slices/favoritesSlice";
import ProductCard from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

export default function FavoritesPage() {
  const favoriteIds = useAppSelector(selectFavorites);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set page title
  useEffect(() => {
    document.title = "علاقه‌مندی‌های من | پوشاک ایرونی";
  }, []);

  // Fetch favorite products from API
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favoriteIds.length === 0) {
        setFavoriteProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch all products and filter by favoriteIds
        const response = await fetch("/api/products?limit=1000");
        const data = await response.json();

        if (data.success) {
          // Filter products that are in favorites
          const favorites = data.data.filter((product) =>
            favoriteIds.includes(product.id)
          );
          setFavoriteProducts(favorites);
        }
      } catch (error) {
        console.error("Error fetching favorite products:", error);
        setFavoriteProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favoriteIds]);

  return (
    <main className="min-h-[60vh] px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* عنوان */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="flex-1 h-px bg-gray-300"></div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#286378] whitespace-nowrap">
            علاقه‌مندی‌های من
          </h1>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* لیست محصولات */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#286378] animate-spin mx-auto mb-4" />
              <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
          </div>
        ) : favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-6">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              لیست علاقه‌مندی‌های شما خالی است
            </h2>
            <p className="text-gray-600 mb-6">
              محصولات مورد علاقه خود را با کلیک روی آیکون قلب اضافه کنید
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
