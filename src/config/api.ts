// Replace with your actual backend URL and port
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com' 
  : 'http://localhost:3001'; // Replace 3001 with your backend port

export const API_ENDPOINTS = {
  // User routes
  user: {
    register: '/user',
    login: '/user/login',
  },
  
  // Restaurant routes
  restaurant: {
    menu: '/restaurant/menu',
  },
  
  // Cart routes
  cart: {
    base: '/cart',
  },
  
  // Order routes
  order: {
    base: '/order',
  },
  
  // Review routes
  review: {
    base: '/review',
    byMenu: (menuId: string) => `/review/menu/${menuId}`,
  },
  
  // Delivery routes
  delivery: {
    base: '/delivery',
  },
  
  // Announcements
  announcements: '/announcements/events',
  
  // Health check
  health: '/healthz',
};