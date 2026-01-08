/**
 * Query optimization utilities
 * Helps prevent N+1 queries and optimize database access
 */

/**
 * Optimize product queries with proper includes
 * @param {Object} options - Query options
 * @returns {Object} - Optimized Prisma query object
 */
export function optimizeProductQuery(options = {}) {
  const {
    includeCategory = false,
    includeSubcategory = false,
    includeVariants = false,
    includeReviews = false,
    includeReviewStats = false,
  } = options;

  const include = {};

  if (includeCategory) {
    include.category = {
      select: {
        id: true,
        title: true,
        slug: true,
      },
    };
  }

  if (includeSubcategory) {
    include.subcategory = {
      select: {
        id: true,
        title: true,
        slug: true,
      },
    };
  }

  if (includeVariants) {
    include.variants = {
      select: {
        id: true,
        color: true,
        size: true,
        price: true,
        stock: true,
        image: true,
      },
    };
  }

  if (includeReviews) {
    include.reviews = {
      where: {
        isApproved: true,
      },
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    };
  }

  if (includeReviewStats) {
    // Use aggregation for review stats instead of loading all reviews
    // This will be handled separately with aggregate queries
  }

  return { include: Object.keys(include).length > 0 ? include : undefined };
}

/**
 * Optimize order queries
 * @param {Object} options - Query options
 * @returns {Object} - Optimized Prisma query object
 */
export function optimizeOrderQuery(options = {}) {
  const {
    includeUser = false,
    includeItems = false,
    includeProductDetails = false,
    includeAddress = false,
  } = options;

  const include = {};

  if (includeUser) {
    include.user = {
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
    };
  }

  if (includeItems) {
    include.items = {
      select: {
        id: true,
        productName: true,
        productImage: true,
        productPrice: true,
        quantity: true,
        subtotal: true,
        size: true,
        color: true,
        ...(includeProductDetails && {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              image: true,
            },
          },
          variant: {
            select: {
              id: true,
              color: true,
              size: true,
            },
          },
        }),
      },
    };
  }

  if (includeAddress) {
    include.address = {
      select: {
        id: true,
        title: true,
        province: true,
        city: true,
        address: true,
        postalCode: true,
      },
    };
  }

  return { include: Object.keys(include).length > 0 ? include : undefined };
}

/**
 * Batch load related data to prevent N+1 queries
 * @param {Array} items - Array of items with foreign keys
 * @param {Function} loader - Function to load related data
 * @param {string} key - Foreign key field name
 * @returns {Promise<Map>} - Map of loaded data
 */
export async function batchLoad(items, loader, key) {
  if (!items || items.length === 0) {
    return new Map();
  }

  // Extract unique IDs
  const ids = [...new Set(items.map(item => item[key]).filter(Boolean))];

  if (ids.length === 0) {
    return new Map();
  }

  // Load all related data in one query
  const relatedData = await loader(ids);

  // Create a map for quick lookup
  const map = new Map();
  relatedData.forEach(item => {
    map.set(item.id, item);
  });

  return map;
}

/**
 * Optimize pagination query
 * @param {Object} options - Pagination options
 * @returns {Object} - Pagination object with skip and take
 */
export function optimizePagination(page = 1, limit = 20, maxLimit = 100) {
  const safePage = Math.max(1, parseInt(page) || 1);
  const safeLimit = Math.min(maxLimit, Math.max(1, parseInt(limit) || 20));
  const skip = (safePage - 1) * safeLimit;

  return {
    skip,
    take: safeLimit,
    page: safePage,
    limit: safeLimit,
  };
}

/**
 * Create optimized where clause for products
 * @param {Object} filters - Filter options
 * @returns {Object} - Optimized where clause
 */
export function optimizeProductWhere(filters = {}) {
  const where = {};
  const andConditions = [];

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.subcategoryId) {
    where.subcategoryId = filters.subcategoryId;
  }

  if (filters.inStock !== undefined) {
    where.inStock = filters.inStock === true || filters.inStock === 'true';
  }

  // Handle isVisible filter - use OR for backward compatibility
  if (filters.isVisible !== undefined) {
    where.isVisible = filters.isVisible === true || filters.isVisible === 'true';
  } else {
    // Default: show visible products or products with null isVisible (for backward compatibility)
    // Add to AND conditions to combine with other filters
    andConditions.push({
      OR: [
        { isVisible: true },
        { isVisible: null }  // برای محصولات قدیمی یا خالی
      ]
    });
  }

  if (filters.onSale) {
    where.discountPercent = { gt: 0 };
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {};
    if (filters.minPrice) {
      where.price.gte = parseInt(filters.minPrice);
    }
    if (filters.maxPrice) {
      where.price.lte = parseInt(filters.maxPrice);
    }
  }

  if (filters.size) {
    where.sizes = { has: filters.size };
  }

  if (filters.color) {
    where.colors = { has: filters.color };
  }

  // Handle search
  if (filters.search) {
    andConditions.push({
      OR: [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { code: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ]
    });
  }

  // Combine AND conditions with other where clauses
  if (andConditions.length > 0) {
    // Add existing where conditions to AND
    const existingConditions = Object.entries(where).map(([key, value]) => ({ [key]: value }));
    where.AND = [...andConditions, ...existingConditions];
    // Remove individual fields that are now in AND
    Object.keys(where).forEach(key => {
      if (key !== 'AND') delete where[key];
    });
  }

  return where;
}

/**
 * Optimize sort order
 * @param {string} sortBy - Sort field
 * @returns {Object} - OrderBy object
 */
export function optimizeSort(sortBy = 'newest') {
  const sortMap = {
    newest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc' },
    'price-asc': { price: 'asc' },
    'price-desc': { price: 'desc' },
    'rating-desc': { rating: 'desc' },
    'rating-asc': { rating: 'asc' },
    popular: { rating: 'desc' },
  };

  return sortMap[sortBy] || sortMap.newest;
}

