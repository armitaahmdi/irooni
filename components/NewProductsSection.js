"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Loader2, ArrowLeft } from "lucide-react";
import { newProducts } from "@/data/newProducts";

const NewProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(4);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=4&sortBy=newest");
        
        if (!response.ok) {
          console.warn("Failed to fetch products:", response.status);
          setProducts(newProducts);
          setDisplayedCount(Math.min(4, newProducts.length));
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON but got:", contentType, text.substring(0, 100));
          setProducts(newProducts);
          setDisplayedCount(Math.min(4, newProducts.length));
          return;
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
          setDisplayedCount(Math.min(4, data.data.length));
        } else {
          setProducts(newProducts);
          setDisplayedCount(Math.min(4, newProducts.length));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(newProducts);
        setDisplayedCount(Math.min(4, newProducts.length));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const displayedProducts = products.slice(0, displayedCount);
  return (
    <section className="w-full flex justify-center px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        {/* عنوان بخش */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-10">
          {/* خط ساده سمت راست */}
          <div className="flex-1 h-px bg-gray-300"></div>

          {/* محتوای اصلی */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* عنوان */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#286378] whitespace-nowrap tracking-tight">
              جدیدترین محصولات
            </h2>
          </div>

          {/* خط ساده سمت چپ */}
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* کارت‌های محصولات */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#286378] animate-spin" />
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-600">
            محصولی یافت نشد
          </div>
        )}

        {/* دکمه بارگذاری بیشتر و مشاهده همه */}
        <div className="flex flex-col items-center gap-4 mt-12">
          {/* لینک مشاهده همه محصولات */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            <span>مشاهده همه محصولات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          </div>
      </div>
    </section>
  );
};

export default NewProductsSection;
