"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";
import { useAppDispatch } from "@/store/hooks";
import { addProduct as addToRecentlyViewed } from "@/store/slices/recentlyViewedSlice";
import { productCategories } from "@/data/categories";
import { getSubcategoryNameBySlug } from "@/utils/subcategoryHelper";
import Breadcrumb from "@/components/Breadcrumb";
import CollapsibleBreadcrumb from "@/components/CollapsibleBreadcrumb";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductSizeSelector from "@/components/product/ProductSizeSelector";
import ProductColorSelector from "@/components/product/ProductColorSelector";
import ProductCartControls from "@/components/product/ProductCartControls";
import ProductFeatures from "@/components/product/ProductFeatures";
import ProductDetailsTabs from "@/components/product/ProductDetailsTabs";
import ProductDetailHeader from "@/components/product/ProductDetailHeader";
import ProductBottomBar from "@/components/product/ProductBottomBar";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useToast } from "@/components/providers/ToastProvider";
import StructuredData from "@/components/pages/StructuredData";
import SocialShare from "@/components/SocialShare";
import { 
  useGetProductBySlugQuery,
  useGetProductRatingStatsQuery,
  useGetProductSoldCountQuery 
} from "@/store/api/productsApi";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [routeParams, setRouteParams] = useState({
    category: null,
    subcategory: null,
    productSlug: null,
  });
  const [averageRating, setAverageRating] = useState(4.8);
  const [totalRatings, setTotalRatings] = useState(0);
  const [soldCount, setSoldCount] = useState(0);

  // Use product detail hook (must be called before any conditional returns)
  const productDetailData = useProductDetail(product, routeParams);

  // Resolve params (Next.js 15+ may have Promise params)
  useEffect(() => {
    const resolveParams = async () => {
      if (params instanceof Promise) {
        const resolved = await params;
        setRouteParams({
          category: resolved?.category,
          subcategory: resolved?.subcategory,
          productSlug: resolved?.productSlug,
        });
      } else {
        setRouteParams({
          category: params?.category,
          subcategory: params?.subcategory,
          productSlug: params?.productSlug,
        });
      }
    };
    resolveParams();
  }, [params]);

  // Use RTK Query for automatic caching and better performance
  const { 
    data: productData, 
    isLoading: isProductLoading,
    error: productError 
  } = useGetProductBySlugQuery(routeParams.productSlug, {
    skip: !routeParams.productSlug,
  });

  // Fetch rating stats and sold count with RTK Query (conditional on product ID)
  const productId = productData?.data?.id;
  const { data: ratingData } = useGetProductRatingStatsQuery(productId, {
    skip: !productId,
  });
  const { data: soldData } = useGetProductSoldCountQuery(productId, {
    skip: !productId,
  });

  // Update product state when RTK Query data arrives
  useEffect(() => {
    if (productData?.success && productData.data) {
      const foundProduct = productData.data;
      setProduct(foundProduct);
      document.title = `${foundProduct.name} | پوشاک ایرونی`;
      dispatch(addToRecentlyViewed(foundProduct));
    } else if (productError || (productData && !productData.success)) {
      // Redirect if product not found
      if (routeParams.category) {
        router.replace(`/${routeParams.category}`);
      } else {
        router.replace("/404");
      }
    }
  }, [productData, productError, routeParams.category, router, dispatch]);

  // Update rating stats
  useEffect(() => {
    if (ratingData?.success) {
      setAverageRating(ratingData.data.averageRating || 4.8);
      setTotalRatings(ratingData.data.totalRatings || 0);
    }
  }, [ratingData]);

  // Update sold count
  useEffect(() => {
    if (soldData?.success) {
      setSoldCount(soldData.data.soldCount || 0);
    } else {
      setSoldCount(10); // Fallback
    }
  }, [soldData]);

  // Update loading state
  useEffect(() => {
    setIsLoading(isProductLoading);
  }, [isProductLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#286378] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری محصول...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">محصول یافت نشد</p>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discountPercent && product.discountPercent > 0;
  const discountPercent = product.discountPercent || 0;

  // Build breadcrumb
  const categorySlug = routeParams.category || product?.category;
  const subcategorySlug = routeParams.subcategory || product?.subcategory;

  const categoryInfo = categorySlug
    ? productCategories.find((cat) => cat.slug === categorySlug)
    : null;
  const categoryName = categoryInfo ? categoryInfo.name : categorySlug;

  const subcategoryName =
    subcategorySlug && categorySlug
      ? getSubcategoryNameBySlug(categorySlug, subcategorySlug) || subcategorySlug
      : null;

  const breadcrumbItems = [];
  if (categorySlug && categoryName) {
    breadcrumbItems.push({ label: categoryName, href: `/${categorySlug}` });

    if (subcategorySlug && subcategoryName) {
      breadcrumbItems.push({
        label: subcategoryName,
        href: `/${categorySlug}/${subcategorySlug}`,
      });
    }
  }

  if (product?.name) {
    breadcrumbItems.push({ label: product.name });
  }

  // Count categories
  const categoryCount = categorySlug && subcategorySlug ? 2 : categorySlug ? 1 : 0;

  // Build structured data for SEO
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://irooni.com";
  const productUrl = `${baseUrl}${categorySlug ? `/${categorySlug}${subcategorySlug ? `/${subcategorySlug}` : ""}` : ""}/${product.slug || product.id}`;
  
  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href && { "item": `${baseUrl}${item.href}` }),
    })),
  };

  // Product structured data
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || product.name,
    "image": product.image ? [product.image, ...(product.images || [])].filter(Boolean) : [],
    "sku": product.code || product.id,
    "brand": {
      "@type": "Brand",
      "name": "پوشاک ایرونی",
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "IRR",
      "price": product.price,
      "availability": product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "پوشاک ایرونی",
      },
    },
    ...(hasDiscount && {
      "aggregateOffer": {
        "@type": "AggregateOffer",
        "lowPrice": product.price,
        "highPrice": product.originalPrice || product.price,
        "priceCurrency": "IRR",
      },
    }),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={breadcrumbStructuredData} />
      <StructuredData data={productStructuredData} />
      
      <main className="min-h-screen bg-white md:bg-gray-50">
        {/* Mobile Header */}
      <ProductDetailHeader
        isLiked={productDetailData.isLiked}
        onToggleFavorite={productDetailData.handleToggleFavorite}
        breadcrumbItems={breadcrumbItems}
        fallbackUrl={categorySlug ? `/${categorySlug}${subcategorySlug ? `/${subcategorySlug}` : ""}` : "/"}
      />

      {/* Breadcrumb - Desktop */}
      <nav className="hidden md:block" aria-label="Breadcrumb">
        <Breadcrumb items={breadcrumbItems} />
      </nav>
      
      {/* Breadcrumb for SEO - Hidden visually but in HTML for search engines */}
      <nav className="sr-only" aria-label="Breadcrumb">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          {breadcrumbItems.map((item, index) => (
            <li
              key={index}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.href ? (
                <a itemProp="item" href={item.href}>
                  <span itemProp="name">{item.label}</span>
                </a>
              ) : (
                <span itemProp="name">{item.label}</span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile Content - Padding for header and bottom bar */}
      <div 
        className="md:hidden pt-14"
        style={{
          paddingBottom: 'calc(120px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <div className="space-y-4">
          {/* Image Gallery - Full width, no padding */}
          <ProductImageGallery
            product={product}
            hasDiscount={hasDiscount}
            discountPercent={discountPercent}
            isProductOutOfStock={productDetailData.isProductOutOfStock}
            isNew={productDetailData.isNew}
          />

          {/* Product Info Card */}
          <div className="px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <ProductInfo
                product={product}
                hasDiscount={hasDiscount}
                discountPercent={discountPercent}
                viewersCount={productDetailData.viewersCount}
              />

              {/* Social Share */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <SocialShare
                  title={`${product.name} - پوشاک ایرونی`}
                  description={product.description || `خرید ${product.name} با بهترین کیفیت و قیمت`}
                  image={product.image}
                />
              </div>
            </div>
          </div>

          {/* Color & Size Selection Card */}
          <div className="px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-5">
              {/* Color Selection */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-3">انتخاب رنگ</label>
                <ProductColorSelector
                  product={product}
                  selectedSize={productDetailData.selectedSize}
                  selectedColor={productDetailData.selectedColor}
                  onColorChange={productDetailData.setSelectedColor}
                  getAvailableStockForSizeColor={
                    productDetailData.stockData.getAvailableStockForSizeColor
                  }
                  getAvailableStockForColor={productDetailData.stockData.getAvailableStockForColor}
                  hoveredOutOfStockColor={productDetailData.hoveredOutOfStockColor}
                  setHoveredOutOfStockColor={productDetailData.setHoveredOutOfStockColor}
                  showToast={showToast}
                />
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-base font-bold text-gray-900 mb-3">انتخاب سایز</label>
                <ProductSizeSelector
                  product={product}
                  selectedSize={productDetailData.selectedSize}
                  onSizeChange={productDetailData.setSelectedSize}
                  getAvailableStockForSize={productDetailData.stockData.getAvailableStockForSize}
                  hoveredOutOfStockSize={productDetailData.hoveredOutOfStockSize}
                  setHoveredOutOfStockSize={productDetailData.setHoveredOutOfStockSize}
                  showToast={showToast}
                />
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <ProductFeatures />
            </div>
          </div>

          {/* Tabs Section - Description, Features, Reviews */}
          <div className="px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <ProductDetailsTabs
                product={product}
                activeTab={productDetailData.activeTab}
                onTabChange={productDetailData.setActiveTab}
                reviewsCount={productDetailData.reviewsCount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-10 md:mb-12">
          {/* Image Gallery */}
          <ProductImageGallery
            product={product}
            hasDiscount={hasDiscount}
            discountPercent={discountPercent}
            isProductOutOfStock={productDetailData.isProductOutOfStock}
            isNew={productDetailData.isNew}
          />

          {/* Product Info - Sticky */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <ProductInfo
              product={product}
              hasDiscount={hasDiscount}
              discountPercent={discountPercent}
              viewersCount={productDetailData.viewersCount}
            />

            {/* Color Selection */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">رنگ</label>
              <ProductColorSelector
                product={product}
                selectedSize={productDetailData.selectedSize}
                selectedColor={productDetailData.selectedColor}
                onColorChange={productDetailData.setSelectedColor}
                getAvailableStockForSizeColor={
                  productDetailData.stockData.getAvailableStockForSizeColor
                }
                getAvailableStockForColor={productDetailData.stockData.getAvailableStockForColor}
                hoveredOutOfStockColor={productDetailData.hoveredOutOfStockColor}
                setHoveredOutOfStockColor={productDetailData.setHoveredOutOfStockColor}
                showToast={showToast}
              />
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">سایز</label>
              <ProductSizeSelector
                product={product}
                selectedSize={productDetailData.selectedSize}
                onSizeChange={productDetailData.setSelectedSize}
                getAvailableStockForSize={productDetailData.stockData.getAvailableStockForSize}
                hoveredOutOfStockSize={productDetailData.hoveredOutOfStockSize}
                setHoveredOutOfStockSize={productDetailData.setHoveredOutOfStockSize}
                showToast={showToast}
              />
            </div>

            {/* Cart Controls */}
            <div className="mt-6">
              <ProductCartControls
                product={product}
                selectedSize={productDetailData.selectedSize}
                selectedColor={productDetailData.selectedColor}
                isInCart={productDetailData.isInCart}
                cartQuantity={productDetailData.cartQuantity}
                isCartProcessing={productDetailData.isCartProcessing}
                isLiked={productDetailData.isLiked}
                getAvailableStockForSizeColor={
                  productDetailData.stockData.getAvailableStockForSizeColor
                }
                getAvailableStockForColor={productDetailData.stockData.getAvailableStockForColor}
                onAddToCart={productDetailData.handleAddToCart}
                onIncreaseQuantity={productDetailData.handleIncreaseQuantity}
                onDecreaseQuantity={productDetailData.handleDecreaseQuantity}
                onRemoveFromCart={productDetailData.handleRemoveFromCart}
                onToggleFavorite={productDetailData.handleToggleFavorite}
                onShare={productDetailData.handleShare}
              />
            </div>

            {/* Features */}
            <div className="mt-6">
              <ProductFeatures />
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <ProductDetailsTabs
          product={product}
          activeTab={productDetailData.activeTab}
          onTabChange={productDetailData.setActiveTab}
          reviewsCount={productDetailData.reviewsCount}
        />

        {/* Related Products */}
        {productDetailData.relatedProducts.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                محصولات مرتبط
              </h2>
              {categorySlug && (
                <Link
                  href={`/${categorySlug}${subcategorySlug ? `/${subcategorySlug}` : ""}`}
                  prefetch={true}
                  className="text-[#286378] hover:text-[#43909A] font-semibold text-sm flex items-center gap-1"
                >
                  مشاهده همه
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {productDetailData.relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recently Viewed Products */}
      <RecentlyViewedSection excludeProductId={product?.id} maxItems={8} />

      {/* Mobile Bottom Bar */}
      <ProductBottomBar
        product={product}
        selectedSize={productDetailData.selectedSize}
        selectedColor={productDetailData.selectedColor}
        isInCart={productDetailData.isInCart}
        cartQuantity={productDetailData.cartQuantity}
        isCartProcessing={productDetailData.isCartProcessing}
        getAvailableStockForSizeColor={productDetailData.stockData.getAvailableStockForSizeColor}
        onAddToCart={productDetailData.handleAddToCart}
        onIncreaseQuantity={productDetailData.handleIncreaseQuantity}
        onDecreaseQuantity={productDetailData.handleDecreaseQuantity}
        onRemoveFromCart={productDetailData.handleRemoveFromCart}
      />
      </main>
    </>
  );
}
