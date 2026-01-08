/**
 * Accessibility utilities
 * Helpers for improving accessibility
 */

/**
 * Generate ARIA label for product card
 */
export function getProductCardAriaLabel(product) {
  const parts = [product.name];
  
  if (product.price) {
    parts.push(`قیمت ${product.price.toLocaleString('fa-IR')} تومان`);
  }
  
  if (product.discountPercent) {
    parts.push(`${product.discountPercent} درصد تخفیف`);
  }
  
  if (!product.inStock) {
    parts.push('ناموجود');
  }
  
  return parts.join('، ');
}

/**
 * Generate ARIA label for button
 */
export function getButtonAriaLabel(action, context = '') {
  const labels = {
    addToCart: 'افزودن به سبد خرید',
    removeFromCart: 'حذف از سبد خرید',
    addToFavorites: 'افزودن به علاقه‌مندی‌ها',
    removeFromFavorites: 'حذف از علاقه‌مندی‌ها',
    buyNow: 'خرید فوری',
    viewProduct: 'مشاهده محصول',
    close: 'بستن',
    open: 'باز کردن',
    search: 'جستجو',
    filter: 'فیلتر',
    sort: 'مرتب‌سازی',
  };
  
  const baseLabel = labels[action] || action;
  return context ? `${baseLabel} ${context}` : baseLabel;
}

/**
 * Check color contrast ratio
 * Returns true if contrast meets WCAG AA standards (4.5:1 for normal text)
 */
export function checkContrast(foreground, background) {
  // Simplified contrast check
  // In production, use a proper library like 'color-contrast-checker'
  const getLuminance = (color) => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return ratio >= 4.5; // WCAG AA standard
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus trap for modals
 */
export function createFocusTrap(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  const handleTab = (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };
  
  element.addEventListener('keydown', handleTab);
  
  // Focus first element
  if (firstElement) {
    firstElement.focus();
  }
  
  return () => {
    element.removeEventListener('keydown', handleTab);
  };
}

/**
 * Skip to main content link
 */
export function SkipToMainContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      رفتن به محتوای اصلی
    </a>
  );
}

