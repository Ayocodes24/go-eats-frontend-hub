// Replace with your actual backend URL and port
export const API_BASE_URL = ''; // use relative URL to enable proxy



export const API_ENDPOINTS = {
  // User routes
  user: {
    register: '${API_BASE_URL}/user',
    login: '${API_BASE_URL}/user/login',
  },
  
  // Restaurant routes
  restaurant: {
    menu: '${API_BASE_URL}/restaurant/menu',
  },
  
  // Cart routes
  cart: {
    base: '${API_BASE_URL}/cart',
  },
  
  // Order routes
  order: {
    base: '${API_BASE_URL}/order',
  },
  
  // Review routes
  review: {
    base: '${API_BASE_URL}/review',
    byMenu: (menuId: string) => `/review/menu/${menuId}`,
  },
  
  // Delivery routes
  delivery: {
    base: '${API_BASE_URL}/delivery',
  },
  
  // Announcements
  announcements: '${API_BASE_URL}/announcements/events',
  
  // Health check
  health: '${API_BASE_URL}/healthz',
};
