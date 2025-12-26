"use client";

import Link from "next/link";
import { ChevronDown, Shirt, FileText, Package, User, Box, BriefcaseBusiness, CircleDot } from "lucide-react";
import { productCategories } from "@/data/categories";
import MegaMenu from "./MegaMenu";

/**
 * CategoryMenu Component
 * Desktop category navigation with mega menu
 */
export default function CategoryMenu({ activeMegaMenu, onMegaMenuEnter, onMegaMenuLeave }) {
  // Icon mapping for categories
  const getCategoryIcon = (slug) => {
    const iconMap = {
      tshirt: <Shirt className="w-4 h-4" />,
      shirt: <FileText className="w-4 h-4" />,
      jacket: <Package className="w-4 h-4" />,
      sweatshirt: <User className="w-4 h-4" />,
      "sport-set": <Box className="w-4 h-4" />,
      pants: <BriefcaseBusiness className="w-4 h-4" />,
      "sport-coat": <Package className="w-4 h-4" />,
      shoes: <CircleDot className="w-4 h-4" />,
      accessories: <Box className="w-4 h-4" />,
    };
    return iconMap[slug] || <CircleDot className="w-4 h-4" />;
  };

  return (
    <div className="relative border-t border-gray-100 bg-gradient-to-b from-white/95 to-gray-50/80 backdrop-blur-sm">
      <div className="flex md:justify-center h-[60px]">
        <div className="max-w-7xl px-6 h-full flex items-center gap-6 lg:gap-10">
          {productCategories.map((category) => (
            <div
              key={category.slug}
              className="relative"
              data-category={category.slug}
              onMouseEnter={() => onMegaMenuEnter(category.slug, category.subcategories.length > 0)}
              onMouseLeave={onMegaMenuLeave}
            >
              <Link
                href={`/${category.slug}`}
                className={`relative flex items-center gap-1.5 text-sm font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 ${
                  activeMegaMenu === category.slug
                    ? "text-[#286378] bg-gradient-to-br from-[#A2CFFF]/30 to-[#A2CFFF]/15 shadow-md scale-105"
                    : "text-gray-700 hover:text-[#286378] hover:bg-gradient-to-br hover:from-[#A2CFFF]/20 hover:to-[#A2CFFF]/10 hover:shadow-sm hover:scale-105"
                }`}
              >
                {category.name}
                {category.subcategories.length > 0 && (
                  <ChevronDown
                    className={`w-4 h-4 transition-all duration-300 ${
                      activeMegaMenu === category.slug ? "rotate-180 text-[#286378]" : ""
                    }`}
                  />
                )}
                {activeMegaMenu === category.slug && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-[#286378] to-[#43909A] rounded-full shadow-sm"></span>
                )}
              </Link>

              {activeMegaMenu === category.slug && category.subcategories.length > 0 && (
                <MegaMenu
                  category={category}
                  onMouseEnter={() => onMegaMenuEnter(category.slug, true)}
                  onMouseLeave={onMegaMenuLeave}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

