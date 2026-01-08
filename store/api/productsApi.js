/**
 * Products API - RTK Query
 * Provides caching, deduplication, and automatic refetching for products, slides, and articles
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
  credentials: 'same-origin',
});

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery,
  tagTypes: ['Product', 'ProductsList', 'Slide', 'Article', 'ArticlesList'],
  endpoints: (builder) => ({
    // Get products list with filters
    getProducts: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.category) searchParams.append('category', params.category);
        if (params.subcategory) searchParams.append('subcategory', params.subcategory);
        if (params.search) searchParams.append('search', params.search);
        if (params.inStock) searchParams.append('inStock', 'true');
        if (params.onSale) searchParams.append('onSale', 'true');
        if (params.size) searchParams.append('size', params.size);
        if (params.color) searchParams.append('color', params.color);
        if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
        if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        
        return `/api/products?${searchParams.toString()}`;
      },
      providesTags: (result, error, arg) => [
        'ProductsList',
        ...(result?.data?.map(({ id }) => ({ type: 'Product', id })) || []),
      ],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get single product by slug
    getProductBySlug: builder.query({
      query: (slug) => `/api/products/by-slug/${slug}`,
      providesTags: (result, error, slug) => [
        { type: 'Product', id: result?.data?.id },
      ],
      // Cache for 10 minutes
      keepUnusedDataFor: 600,
    }),

    // Get product by ID
    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
      keepUnusedDataFor: 600,
    }),

    // Get product rating stats
    getProductRatingStats: builder.query({
      query: (productId) => `/api/products/${productId}/reviews/stats`,
      providesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
      ],
      keepUnusedDataFor: 300,
    }),

    // Get product sold count
    getProductSoldCount: builder.query({
      query: (productId) => `/api/products/${productId}/sold-count`,
      providesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
      ],
      keepUnusedDataFor: 300,
    }),

    // Search products
    searchProducts: builder.query({
      query: (searchQuery) => `/api/products/search?q=${encodeURIComponent(searchQuery)}`,
      providesTags: ['ProductsList'],
      keepUnusedDataFor: 300,
    }),

    // Get slides for hero slider
    getSlides: builder.query({
      query: () => '/api/slides',
      providesTags: ['Slide'],
      keepUnusedDataFor: 300,
    }),

    // Get articles list
    getArticles: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.search) searchParams.append('search', params.search);
        if (params.category) searchParams.append('category', params.category);
        
        const queryString = searchParams.toString();
        return `/api/articles${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result, error, arg) => [
        'ArticlesList',
        ...(result?.data?.map(({ id }) => ({ type: 'Article', id })) || []),
      ],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductBySlugQuery,
  useLazyGetProductBySlugQuery,
  useGetProductByIdQuery,
  useGetProductRatingStatsQuery,
  useGetProductSoldCountQuery,
  useSearchProductsQuery,
  useGetSlidesQuery,
  useGetArticlesQuery,
  useLazyGetArticlesQuery,
} = productsApi;

