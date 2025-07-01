/**
 * API service layer for The Pickle Pot backend
 * Handles all HTTP requests to the backend API at localhost:8000
 */

import { getAuthToken } from "./auth";

const API_BASE_URL = "/api";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Get auth token using auth utility
  const token = getAuthToken();
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData,
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Network error", 0, { originalError: error });
  }
}

// Authentication API
export const authApi = {
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
  }) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },

  refreshToken: async () => {
    return apiRequest("/auth/refresh", {
      method: "POST",
    });
  },

  getProfile: async () => {
    return apiRequest("/auth/profile");
  },
};

// User Management API
export const userApi = {
  getProfile: async () => {
    return apiRequest("/users/profile");
  },

  updateProfile: async (profileData: any) => {
    return apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  getAddresses: async () => {
    return apiRequest("/users/addresses");
  },

  addAddress: async (address: any) => {
    return apiRequest("/users/addresses", {
      method: "POST",
      body: JSON.stringify(address),
    });
  },

  updateAddress: async (addressId: string, address: any) => {
    return apiRequest(`/users/addresses/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(address),
    });
  },

  deleteAddress: async (addressId: string) => {
    return apiRequest(`/users/addresses/${addressId}`, {
      method: "DELETE",
    });
  },

  getPaymentMethods: async () => {
    return apiRequest("/users/payment-methods");
  },

  addPaymentMethod: async (paymentMethod: any) => {
    return apiRequest("/users/payment-methods", {
      method: "POST",
      body: JSON.stringify(paymentMethod),
    });
  },

  updatePaymentMethod: async (methodId: string, paymentMethod: any) => {
    return apiRequest(`/users/payment-methods/${methodId}`, {
      method: "PUT",
      body: JSON.stringify(paymentMethod),
    });
  },

  deletePaymentMethod: async (methodId: string) => {
    return apiRequest(`/users/payment-methods/${methodId}`, {
      method: "DELETE",
    });
  },
};

// Products API
export const productsApi = {
  getProducts: async (params?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return apiRequest(`/products${query ? `?${query}` : ""}`);
  },

  getProduct: async (productId: string) => {
    return apiRequest(`/products/${productId}`);
  },

  getFeaturedProducts: async () => {
    return apiRequest("/products/featured");
  },
};

// Categories API
export const categoriesApi = {
  getCategories: async () => {
    return apiRequest("/categories");
  },

  getCategory: async (categoryId: string) => {
    return apiRequest(`/categories/${categoryId}`);
  },
};

// Cart API
export const cartApi = {
  getCart: async () => {
    return apiRequest("/cart");
  },

  addItem: async (item: {
    productId: string;
    quantity: number;
    variantId?: string;
  }) => {
    return apiRequest("/cart/items", {
      method: "POST",
      body: JSON.stringify(item),
    });
  },

  updateItem: async (itemId: string, data: { quantity: number }) => {
    return apiRequest(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  removeItem: async (itemId: string) => {
    return apiRequest(`/cart/items/${itemId}`, {
      method: "DELETE",
    });
  },

  clearCart: async () => {
    return apiRequest("/cart/clear", {
      method: "POST",
    });
  },
};

// Orders API
export const ordersApi = {
  getOrders: async () => {
    return apiRequest("/orders");
  },

  getOrder: async (orderId: string) => {
    return apiRequest(`/orders/${orderId}`);
  },

  createOrder: async (orderData: any) => {
    return apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  },
};

// Coupons API
export const couponsApi = {
  validateCoupon: async (code: string) => {
    return apiRequest(`/coupons/validate/${code}`);
  },

  applyCoupon: async (code: string) => {
    return apiRequest("/coupons/apply", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
};

// Reviews API
export const reviewsApi = {
  getProductReviews: async (productId: string) => {
    return apiRequest(`/products/${productId}/reviews`);
  },

  createReview: async (productId: string, review: any) => {
    return apiRequest(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
    });
  },
};

// Wishlist API
export const wishlistApi = {
  getWishlist: async () => {
    return apiRequest("/wishlist");
  },

  addToWishlist: async (productId: string) => {
    return apiRequest("/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  },

  removeFromWishlist: async (productId: string) => {
    return apiRequest(`/wishlist/${productId}`, {
      method: "DELETE",
    });
  },
};

export { ApiError };
