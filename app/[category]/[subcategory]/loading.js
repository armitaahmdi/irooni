/**
 * Subcategory Page Loading Component
 */
import { ProductCardSkeleton } from "@/components/ui/SkeletonLoader";

export default function SubcategoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

