import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Get user orders
export const getUserOrders = async () => {
  try {
    console.log('Making API request to fetch user orders');
    const response = await API.get('/orders/user');
    console.log('Orders API response status:', response.status);
    console.log('Orders API response headers:', response.headers);
    
    if (!response.data || !response.data.data) {
      console.warn('API returned unexpected data structure:', response.data);
      return [];
    }
    
    console.log('Orders API data count:', response.data.data.length);
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch orders - detailed error:', error);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

// Get order by ID
export const getOrderById = async (orderId: string) => {
  try {
    const response = await API.get(`/orders/${orderId}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
};

// Create order
export const createOrder = async () => {
  try {
    console.log('Creating order from cart items...');
    const response = await API.post('/orders/create');
    console.log('Order creation API response status:', response.status);
    
    if (!response.data || !response.data.data) {
      console.warn('Order creation API returned unexpected data structure:', response.data);
      throw new Error('Unexpected response format');
    }
    
    console.log('New order created with ID:', response.data.data._id);
    console.log('New order status:', response.data.data.status);
    console.log('New order full data:', JSON.stringify(response.data.data, null, 2));
    
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to create order - detailed error:', error);
    if (error.response) {
      console.error('Error response status:', error.response.status);
      console.error('Error response data:', error.response.data);
    }
    throw new Error(error.response?.data?.message || 'Failed to create order');
  }
};

// Cancel order
export const cancelOrder = async (orderId: string) => {
  try {
    const response = await API.put(`/orders/cancel/${orderId}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to cancel order');
  }
};

// Get all orders (Admin function)
export const getAllOrders = async () => {
  try {
    const response = await API.get('/orders/admin');
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to fetch all orders:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch all orders');
  }
};

// Update order status (Admin function)
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await API.put(`/orders/${orderId}/status`, { status });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};

// Update payment status (Admin function)
export const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
  try {
    const response = await API.put(`/orders/${orderId}/payment-status`, { paymentStatus });
    return response.data.data;
  } catch (error: any) {
    console.error('Failed to update payment status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update payment status');
  }
};