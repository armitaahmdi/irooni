/**
 * MetaTags Component
 * Dynamic meta tags for SEO
 */

import Head from 'next/head';

export default function MetaTags({
  title,
  description,
  image,
  url,
  type = 'website',
  keywords = [],
  noindex = false,
  nofollow = false,
  canonical,
  ogLocale = 'fa_IR',
  alternateLocale,
  siteName = 'پوشاک ایرونی',
}) {
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullImage = image || '/logo/main-logo.png';
  const fullDescription = description || 'فروشگاه اینترنتی پوشاک مردانه با کیفیت و استایل روز';

  const robots = [];
  if (noindex) robots.push('noindex');
  if (nofollow) robots.push('nofollow');
  if (robots.length === 0) robots.push('index', 'follow');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robots.join(', ')} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />
      {alternateLocale && <meta property="og:locale:alternate" content={alternateLocale} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="Content-Language" content="fa" />
      <meta name="language" content="Persian" />
    </Head>
  );
}

/**
 * Generate product meta tags
 */
export function generateProductMetaTags(product, baseUrl = 'https://irooni.com') {
  const title = product.name;
  const description = product.description || `${product.name} - خرید آنلاین از پوشاک ایرونی`;
  const image = product.image || '/logo/main-logo.png';
  const url = `${baseUrl}/product/${product.slug || product.id}`;
  const keywords = [
    product.name,
    'پوشاک مردانه',
    'خرید آنلاین',
    'فروشگاه اینترنتی',
    product.category,
    product.subcategory,
  ].filter(Boolean);

  return {
    title,
    description,
    image,
    url,
    type: 'product',
    keywords,
    canonical: url,
  };
}

