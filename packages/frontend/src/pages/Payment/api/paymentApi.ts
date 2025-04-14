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
    try {
      // Kiểm tra dữ liệu trong localStorage
      const orderDataStr = localStorage.getItem('currentOrder');
      if (orderDataStr) {
        const orderData = JSON.parse(orderDataStr);
        
        // Nếu có dữ liệu trong localStorage, sử dụng để tạo đơn hàng
        if (orderData && orderData.items && orderData.items.length > 0) {
          try {
            // Thử tạo đơn hàng từ giỏ hàng trên server
            const response = await api.post('/orders/create');
            return response.data.data;
          } catch (error: any) {
            console.error('Error creating order from server cart:', error);
            
            // Nếu server báo giỏ hàng trống, thử tạo đơn hàng từ dữ liệu localStorage
            if (error.response && error.response.data && 
                (error.response.data.message === 'Cart is empty' || 
                 error.response.status === 400)) {
              
              console.log('Creating order from localStorage data instead...');
              
              // Gửi trực tiếp dữ liệu đến endpoint chung '/orders/create'
              // Thêm các tham số để backend hiểu đang tạo đơn hàng từ dữ liệu trực tiếp
              const createResponse = await api.post('/orders/create', {
                useLocalData: true, // Flag để backend biết đây là dữ liệu gửi trực tiếp
                items: orderData.items,
                startDate: orderData.items[0].startDate,
                endDate: orderData.items[0].endDate
              });
              
              return createResponse.data.data;
            }
            
            // Nếu không phải lỗi giỏ hàng trống, ném lỗi
            throw error;
          }
        }
      }
      
      // Nếu không có dữ liệu trong localStorage, gọi API thông thường
      const response = await api.post('/orders/create');
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(
          error.response.data?.message || 'Failed to create order. Please try again later.'
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error('Error creating order: ' + error.message);
      }
    }
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
    try {
      const response = await api.post(`/orders/${orderId}/payment`, { paymentMethod });
      return response.data.data;
    } catch (error: any) {
      console.error('Error processing payment:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        throw new Error(
          error.response.data?.message || 'Server error during payment processing. Please try again later.'
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error('Error processing payment: ' + error.message);
      }
    }
  }
};

export default PaymentApi; 