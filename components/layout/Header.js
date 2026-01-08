"use client";

import { Grid2x2, X } from "lucide-react";
import { useHeader } from "@/hooks/useHeader";
import HeaderLogo from "./HeaderLogo";
import HeaderSearch from "./HeaderSearch";
import HeaderNavigation from "./HeaderNavigation";
import CategoryMenu from "./CategoryMenu";
import MobileMenuDrawer from "./MobileMenuDrawer";

const Header = () => {
  const {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeMegaMenu,
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
  } = useHeader();

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-100/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        {/* Desktop Header */}
        <div className="hidden md:block">
          <div className="h-[100px] w-full flex justify-center py-4">
            <div className="w-[90%] max-w-7xl flex justify-center px-6 h-full">
              <div className="w-full flex items-center justify-between gap-6 h-full">
                <HeaderLogo />
                <HeaderSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSearch={handleSearch}
                  onKeyPress={(e) => handleSearchKeyPress(e, false)}
                />
                <HeaderNavigation cartItemsCount={cartItemsCount} />
              </div>
            </div>
          </div>

          <CategoryMenu
            activeMegaMenu={activeMegaMenu}
            onMegaMenuEnter={handleMegaMenuEnter}
            onMegaMenuLeave={handleMegaMenuLeave}
          />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="h-16 px-4 flex items-center justify-between gap-3 bg-gradient-to-l from-white via-white to-[#A2CFFF]/5 border-b border-gray-100/80 shadow-sm">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#286378]/10 to-[#43909A]/10 hover:from-[#286378]/20 hover:to-[#43909A]/20 active:scale-95 transition-all duration-300 border border-[#286378]/20 flex-shrink-0"
              aria-label="منو"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#286378]" />
              ) : (
                <Grid2x2 className="w-5 h-5 text-[#286378]" />
              )}
            </button>
            <div className="flex-1 max-w-xs">
              <HeaderSearch
                searchQuery={mobileSearchQuery}
                setSearchQuery={setMobileSearchQuery}
                onSearch={handleSearch}
                onKeyPress={(e) => handleSearchKeyPress(e, true)}
                isMobile={true}
              />
            </div>
            <div className="flex items-center gap-2">
              <HeaderLogo isMobile={true} />
              <HeaderNavigation cartItemsCount={cartItemsCount} isMobile={true} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        expandedCategory={expandedMobileCategory}
        onToggleCategory={toggleMobileCategory}
      />
    </>
  );
};

export default Header;
