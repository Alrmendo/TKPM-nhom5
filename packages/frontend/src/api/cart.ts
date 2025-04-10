import axios from 'axios';

// Set up axios instance with proper configuration
const API = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Essential for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Set up interceptor to log requests and responses for debugging
API.interceptors.request.use(request => {
  console.log('Cart API Request:', request);
  return request;
}, error => {
  console.error('Cart Request Error:', error);
  return Promise.reject(error);
});

API.interceptors.response.use(response => {
  console.log('Cart API Response:', response);
  return response;
}, error => {
  console.error('Cart Response Error:', error);
  // If we get a 401 Unauthorized error, redirect to login
  if (error.response && error.response.status === 401) {
    console.error('Authentication error - redirecting to login');
    window.location.href = '/signin';
  }
  return Promise.reject(error);
});

// Get user's cart
export const getCart = async () => {
  try {
    console.log('Getting cart...');
    const response = await API.get('/cart');
    console.log('Cart response:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('Error in getCart:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch cart');
  }
};

// Add item to cart
export const addToCart = async (itemData: {
  dressId: string;
  sizeId: string;
  colorId: string;
  quantity: number;
  startDate: string;
  endDate: string;
}) => {
  try {
    console.log('Adding to cart with data:', itemData);
    const response = await API.post('/cart/add', itemData);
    console.log('AddToCart response:', response);
    return response.data.data;
  } catch (error: any) {
    console.error('Error in addToCart:', error);
    console.error('Response data:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to add item to cart');
  }
};

// Remove item from cart
export const removeFromCart = async (itemIndex: number) => {
  try {
    const response = await API.delete(`/cart/remove/${itemIndex}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
  }
};

// Update item dates
export const updateCartItemDates = async (
  itemIndex: number,
  dateData: { startDate: string; endDate: string }
) => {
  try {
    const response = await API.put(`/cart/update-dates/${itemIndex}`, dateData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update item dates');
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    const response = await API.delete('/cart/clear');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to clear cart');
  }
}; 