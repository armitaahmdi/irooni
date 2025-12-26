import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite, selectIsFavorite } from "@/store/slices/favoritesSlice";
import { addToCart, updateCartItem, removeFromCart } from "@/store/slices/cartSlice";
import { addProduct as addToRecentlyViewed } from "@/store/slices/recentlyViewedSlice";
import { useToast } from "@/components/providers/ToastProvider";
import { useProductStock } from "./useProductStock";

/**
 * Hook for managing product detail page logic
 */
export function useProductDetail(product, routeParams) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [viewersCount] = useState(() => Math.floor(Math.random() * 50) + 20);
  const [hoveredOutOfStockColor, setHoveredOutOfStockColor] = useState(null);
  const [hoveredOutOfStockSize, setHoveredOutOfStockSize] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [isCartProcessing, setIsCartProcessing] = useState(false);

  const isLiked = useAppSelector((state) =>
    product?.id ? selectIsFavorite(state, product.id) : false
  );
  const cartItems = useAppSelector((state) => state.cart.items);

  // Stock management hook
  const stockData = useProductStock(product, cartItems, selectedSize, selectedColor);

  // پیدا کردن محصول در سبد خرید
  const cartItem = cartItems.find(
    (item) =>
      item.product.id === product?.id &&
      item.size === selectedSize &&
      item.color === selectedColor
  );
  const cartQuantity = cartItem?.quantity || 0;
  const isInCart = cartQuantity > 0;

  // بررسی اینکه آیا محصول جدید است
  const isNewProduct = useCallback((product) => {
    if (!product || (!product.createdAt && !product.created_at)) return false;

    const createdAt = product.createdAt || product.created_at;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = now - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= 4;
  }, []);

  // دریافت تعداد نظرات
  const fetchReviewsCount = useCallback(
    async (productId) => {
      try {
        const response = await fetch(`/api/products/${productId}/reviews/stats`);
        const data = await response.json();
        if (data.success) {
          setReviewsCount(data.data.totalRatings || 0);
        }
      } catch (error) {
        console.error("Error fetching reviews count:", error);
      }
    },
    []
  );

  // دریافت محصولات مرتبط
  const fetchRelatedProducts = useCallback(
    async (category, productSlug) => {
      if (!category) return;

      try {
        const relatedResponse = await fetch(`/api/products?category=${category}&limit=4`);
        const relatedData = await relatedResponse.json();
        if (relatedData.success) {
          const related = relatedData.data
            .filter((p) => p.slug !== productSlug)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    },
    []
  );

  // تنظیم سایز و رنگ پیش‌فرض
  useEffect(() => {
    if (product) {
      if (!selectedSize && product.sizes?.[0]) {
        setSelectedSize(product.sizes[0]);
      }
      if (!selectedColor && product.colors?.[0]) {
        setSelectedColor(product.colors[0]);
      }
    }
  }, [product, selectedSize, selectedColor]);

  // دریافت تعداد نظرات و محصولات مرتبط
  useEffect(() => {
    if (product) {
      fetchReviewsCount(product.id);
      if (product.category) {
        fetchRelatedProducts(product.category, routeParams.productSlug);
      }
    }
  }, [product, routeParams.productSlug, fetchReviewsCount, fetchRelatedProducts]);

  // Handlers
  const handleToggleFavorite = useCallback(() => {
    if (!product) return;
    dispatch(toggleFavorite(product.id));
    if (!isLiked) {
      showToast("محصول به لیست علاقه‌مندی‌ها اضافه شد", "success");
    } else {
      showToast("محصول از لیست علاقه‌مندی‌ها حذف شد", "success");
    }
  }, [product, isLiked, dispatch, showToast]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    if (!selectedSize || !selectedColor) {
      showToast("لطفاً سایز و رنگ را انتخاب کنید", "error");
      return;
    }

    const variant = product.variants?.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );

    const availableStock = stockData.getAvailableStockForSizeColor(selectedSize, selectedColor);
    if (availableStock < 1) {
      showToast("این سایز و رنگ در حال حاضر موجود نیست", "error");
      return;
    }

    setIsCartProcessing(true);
    try {
      await dispatch(
        addToCart({
          productId: product.id,
          quantity: 1,
          size: selectedSize,
          color: selectedColor,
          variantId: variant?.id || null,
        })
      ).unwrap();
      showToast("محصول به سبد خرید اضافه شد", "success");

      if (variant) {
        await stockData.fetchRealTimeStock(selectedSize, selectedColor, variant.id);
      } else {
        await stockData.fetchRealTimeStock(selectedSize, selectedColor, null);
      }
    } catch (error) {
      showToast(error || "خطا در افزودن به سبد خرید", "error");
    } finally {
      setIsCartProcessing(false);
    }
  }, [
    product,
    selectedSize,
    selectedColor,
    stockData,
    dispatch,
    showToast,
  ]);

  const handleIncreaseQuantity = useCallback(async () => {
    if (!cartItem || !product || isCartProcessing) return;

    const variant = product.variants?.find(
      (v) => v.size === selectedSize && v.color === selectedColor
    );
    let availableStock = stockData.getAvailableStockForSizeColor(selectedSize, selectedColor);

    const variantKey = variant?.id || `${selectedSize}-${selectedColor}`;
    if (stockData.realTimeStock[variantKey] === undefined) {
      const realTimeStockValue = await stockData.fetchRealTimeStock(
        selectedSize,
        selectedColor,
        variant?.id || null
      );
      if (realTimeStockValue > 0) {
        availableStock = realTimeStockValue;
      }
    } else {
      availableStock = stockData.realTimeStock[variantKey];
    }

    if (availableStock <= 0) {
      showToast(`موجودی این سایز و رنگ تمام شده است`, "error");
      return;
    }

    setIsCartProcessing(true);
    try {
      await dispatch(
        updateCartItem({
          itemId: cartItem.id,
          quantity: cartQuantity + 1,
        })
      ).unwrap();

      if (variant) {
        await stockData.fetchRealTimeStock(selectedSize, selectedColor, variant.id);
      } else {
        await stockData.fetchRealTimeStock(selectedSize, selectedColor, null);
      }
    } catch (error) {
      showToast(error || "خطا در به‌روزرسانی سبد خرید", "error");
    } finally {
      setIsCartProcessing(false);
    }
  }, [
    cartItem,
    product,
    selectedSize,
    selectedColor,
    cartQuantity,
    isCartProcessing,
    stockData,
    dispatch,
    showToast,
  ]);

  const handleDecreaseQuantity = useCallback(async () => {
    if (!cartItem || cartQuantity <= 1 || isCartProcessing) return;

    setIsCartProcessing(true);
    try {
      await dispatch(
        updateCartItem({
          itemId: cartItem.id,
          quantity: cartQuantity - 1,
        })
      ).unwrap();

      const variant = product?.variants?.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      );
      if (variant) {
        await stockData.fetchRealTimeStock(selectedSize, selectedColor, variant.id);
      } else {
        await stockData.fetchRealTimeStock(selectedSize, selectedColor, null);
      }
    } catch (error) {
      showToast(error || "خطا در به‌روزرسانی سبد خرید", "error");
    } finally {
      setIsCartProcessing(false);
    }
  }, [
    cartItem,
    cartQuantity,
    isCartProcessing,
    product,
    selectedSize,
    selectedColor,
    stockData,
    dispatch,
    showToast,
  ]);

  const handleRemoveFromCart = useCallback(async () => {
    if (!cartItem || isCartProcessing) return;

    setIsCartProcessing(true);
    try {
      await dispatch(removeFromCart(cartItem.id)).unwrap();
      showToast("محصول از سبد خرید حذف شد", "success");

      const variant = product?.variants?.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      );
      if (variant) {
        await stockData.fetchRealTimeStock(selectedSize, selectedColor, variant.id);
      } else {
        await stockData.fetchRealTimeStock(selectedSize, selectedColor, null);
      }
    } catch (error) {
      showToast(error || "خطا در حذف از سبد خرید", "error");
    } finally {
      setIsCartProcessing(false);
    }
  }, [
    cartItem,
    isCartProcessing,
    product,
    selectedSize,
    selectedColor,
    stockData,
    dispatch,
    showToast,
  ]);

  const handleShare = useCallback(async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  }, [product]);

  const isNew = product ? isNewProduct(product) : false;
  const isProductOutOfStock = stockData.checkCompletelyOutOfStock();

  return {
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    relatedProducts,
    activeTab,
    setActiveTab,
    viewersCount,
    hoveredOutOfStockColor,
    setHoveredOutOfStockColor,
    hoveredOutOfStockSize,
    setHoveredOutOfStockSize,
    reviewsCount,
    isCartProcessing,
    isLiked,
    cartQuantity,
    isInCart,
    isNew,
    isProductOutOfStock,
    stockData,
    handleToggleFavorite,
    handleAddToCart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveFromCart,
    handleShare,
  };
}

