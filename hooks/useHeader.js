import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchCart } from "@/store/slices/cartSlice";
import { useAuth } from "@/store/hooks";

/**
 * Hook for managing header state and logic
 */
export function useHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const hoverTimeoutRef = useRef(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  // Get cart items count from Redux
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartIsInitialized = useAppSelector((state) => state.cart.isInitialized);
  const cartItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  // Fetch cart when user is authenticated and cart is not initialized
  useEffect(() => {
    if (isAuthenticated && !cartIsInitialized) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, cartIsInitialized, dispatch]);

  const toggleMobileCategory = (slug) => {
    setExpandedMobileCategory(expandedMobileCategory === slug ? null : slug);
  };

  const handleSearch = (query, isMobile = false) => {
    const searchTerm = isMobile ? mobileSearchQuery : query;
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      if (isMobile) {
        setIsMobileMenuOpen(false);
        setMobileSearchQuery("");
      } else {
        setSearchQuery("");
      }
    }
  };

  const handleSearchKeyPress = (e, isMobile = false) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(isMobile ? mobileSearchQuery : searchQuery, isMobile);
    }
  };

  const handleMegaMenuEnter = (categorySlug, hasSubcategories) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (hasSubcategories) {
      setActiveMegaMenu(categorySlug);
    }
  };

  const handleMegaMenuLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeMegaMenu,
    setActiveMegaMenu,
    expandedMobileCategory,
    toggleMobileCategory,
    searchQuery,
    setSearchQuery,
    mobileSearchQuery,
    setMobileSearchQuery,
    cartItemsCount,
    handleSearch,
    handleSearchKeyPress,
    handleMegaMenuEnter,
    handleMegaMenuLeave,
  };
}

