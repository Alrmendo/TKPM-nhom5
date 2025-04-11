import axios from 'axios';
import { Order, Address, PaymentMethod } from '../types';

const API_URL = 'http://localhost:3000';

// Create a custom axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const PaymentApi = {
  // Create a new order from cart items
  createOrder: async (): Promise<Order> => {
    const response = await api.post('/orders/create');
    return response.data.data;
  },

  // Get order details by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  },
  
  // Get all orders for the current user
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data.data;
  },
  
  // Cancel an order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.put(`/orders/cancel/${orderId}`);
    return response.data.data;
  },
  
  // Update shipping address for an order
  updateShippingAddress: async (orderId: string, address: Address): Promise<Order> => {
    const response = await api.put(`/orders/${orderId}/shipping`, { address });
    return response.data.data;
  },
  
  // Process payment for an order
  processPayment: async (orderId: string, paymentMethod: PaymentMethod): Promise<Order> => {
    const response = await api.post(`/orders/${orderId}/payment`, { paymentMethod });
    return response.data.data;
  }
};

export default PaymentApi; 