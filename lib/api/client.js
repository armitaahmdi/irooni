/**
 * API Client - Centralized API configuration
 * Handles all API requests with consistent error handling
 */

// Get API base URL and normalize it
// NEXT_PUBLIC_API_URL should be empty or just the base URL (e.g., https://irooni-men.ir)
// NOT https://irooni-men.ir/api (this causes api/api/... issues)
const API_BASE_URL_RAW = process.env.NEXT_PUBLIC_API_URL || '';
// Remove trailing /api if present to prevent double /api/api/...
const API_BASE_URL = API_BASE_URL_RAW.replace(/\/api\/?$/, '');

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Generic request method
   */
  async request(endpoint, options = {}) {
    // Ensure endpoint starts with / if baseURL is empty
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${normalizedEndpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add credentials for cookies
    if (typeof window !== 'undefined') {
      config.credentials = 'same-origin';
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // Enhanced error handling
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export specific API endpoints
export const authApi = {
  sendOTP: (phone) => apiClient.post('/api/auth/send-otp', { phone, action: 'send' }),
  verifyOTP: (phone, otp) => apiClient.post('/api/auth/send-otp', { phone, otp, action: 'verify' }),
  login: (phone, otp) => apiClient.post('/api/auth/login', { phone, otp }),
  logout: () => apiClient.post('/api/auth/signout'),
  getSession: () => apiClient.get('/api/auth/session'),
};

export const cartApi = {
  getCart: () => apiClient.get('/api/cart'),
  addToCart: (productId, quantity, size, color, variantId) => 
    apiClient.post('/api/cart', { productId, quantity, size, color, variantId }),
  updateCartItem: (itemId, quantity) => 
    apiClient.put(`/api/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => 
    apiClient.delete(`/api/cart/${itemId}`),
};

export const ordersApi = {
  getOrders: () => apiClient.get('/api/orders'),
  getOrder: (id) => apiClient.get(`/api/orders/${id}`),
  createOrder: (addressId, paymentMethod, notes, shippingCost, couponId) => 
    apiClient.post('/api/orders', { addressId, paymentMethod, notes, shippingCost, couponId }),
};

export const adminOrdersApi = {
  getOrders: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/api/admin/orders${queryString ? `?${queryString}` : ''}`);
  },
  getOrder: (id) => apiClient.get(`/api/admin/orders/${id}`),
  updateOrder: (id, data) => apiClient.put(`/api/admin/orders/${id}`, data),
};

export default apiClient;

