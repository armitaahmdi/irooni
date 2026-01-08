/**
 * Product-specific meta tags component
 * Updates meta tags client-side for dynamic product pages
 * Note: For better SEO, consider using generateMetadata in a layout.js file
 */

"use client";

import { useEffect } from 'react';

export default function ProductMetaTags({ product, baseUrl = 'https://irooni.com' }) {
  useEffect(() => {
    if (!product) return;

    const title = `${product.name} | پوشاک ایرونی`;
    const description = product.description || `${product.name} - خرید آنلاین از پوشاک ایرونی`;
    const imageUrl = product.image 
      ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`)
      : `${baseUrl}/logo/main-logo.png`;
    const url = typeof window !== 'undefined' ? window.location.href : baseUrl;
    const keywords = [
      product.name,
      'پوشاک مردانه',
      'خرید آنلاین',
      'فروشگاه اینترنتی',
      product.category,
      product.subcategory,
    ].filter(Boolean).join(', ');

    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', imageUrl, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', 'product', true);
    updateMetaTag('og:site_name', 'پوشاک ایرونی', true);
    updateMetaTag('og:locale', 'fa_IR', true);
    
    // Product-specific Open Graph
    if (product.price) {
      updateMetaTag('product:price:amount', product.price.toString(), true);
      updateMetaTag('product:price:currency', 'IRR', true);
    }
    if (product.inStock !== undefined) {
      updateMetaTag('product:availability', product.inStock ? 'in stock' : 'out of stock', true);
    }

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', imageUrl);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [product, baseUrl]);

  return null;
}

