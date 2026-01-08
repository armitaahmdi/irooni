/**
 * Skeleton Loader Components
 * For better loading states
 */

export function SkeletonBox({ className = '', width, height }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      <div className="relative w-full aspect-square bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <SkeletonBox height="1.25rem" width="80%" />
        <SkeletonBox height="1rem" width="60%" />
        <div className="flex justify-between items-center">
          <SkeletonBox height="1.5rem" width="100px" />
          <SkeletonBox height="1.5rem" width="80px" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white md:bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <SkeletonBox height="600px" className="rounded-2xl" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <SkeletonBox key={i} height="100px" className="rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <SkeletonBox height="2rem" width="80%" />
            <SkeletonBox height="1.5rem" width="60%" />
            <div className="space-y-2">
              <SkeletonBox height="2rem" width="120px" />
              <SkeletonBox height="1.5rem" width="100px" />
            </div>
            <div className="space-y-3">
              <SkeletonBox height="1rem" />
              <SkeletonBox height="1rem" />
              <SkeletonBox height="1rem" width="70%" />
            </div>
            <div className="space-y-4">
              <SkeletonBox height="3rem" />
              <SkeletonBox height="3rem" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      <SkeletonBox height="200px" />
      <div className="p-4 space-y-3">
        <SkeletonBox height="1.5rem" width="90%" />
        <SkeletonBox height="1rem" width="100%" />
        <SkeletonBox height="1rem" width="80%" />
        <SkeletonBox height="1rem" width="60px" />
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonBox height="1.25rem" width="150px" />
        <SkeletonBox height="1rem" width="80px" />
      </div>
      <SkeletonBox height="1rem" width="200px" />
      <div className="flex gap-4">
        {[1, 2, 3].map(i => (
          <SkeletonBox key={i} height="80px" width="80px" className="rounded" />
        ))}
      </div>
      <SkeletonBox height="2rem" width="120px" />
    </div>
  );
}

