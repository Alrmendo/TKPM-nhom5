import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartItem, OrderSummary } from './types';
import { calculateOrderSummary, formatCurrency, formatDate } from './utils/paymentUtils';
import CheckoutSteps from './components/CheckoutSteps';

const Review: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<OrderSummary>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: 'USD'
  });
  
  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3000/cart', { withCredentials: true });
        
        if (response.data.success && response.data.data) {
          setCartItems(response.data.data.items || []);
          
          // Calculate order summary if there are items
          if (response.data.data.items && response.data.data.items.length > 0) {
            const firstItem = response.data.data.items[0];
            const calculatedSummary = calculateOrderSummary(
              response.data.data.items,
              new Date(firstItem.startDate),
              new Date(firstItem.endDate)
            );
            setSummary(calculatedSummary);
          }
        } else {
          setError('No items in cart');
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        setError('Failed to load cart items');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCart();
  }, []);
  
  const handleContinueToInformation = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty. Add items to proceed.');
      return;
    }
    
    navigate('/payment-information');
  };
  
  const handleBackToCart = () => {
    navigate('/cart');
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <CheckoutSteps currentStep="review" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c3937c]"></div>
        </div>
      </div>
    );
  }
  
  if (error && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <CheckoutSteps currentStep="review" />
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToCart}
            className="rounded-md bg-[#c3937c] px-4 py-2 text-white font-medium shadow-sm hover:bg-[#a67c66] focus:outline-none focus:ring-2 focus:ring-[#c3937c]"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <CheckoutSteps currentStep="review" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Review Your Order</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-6">
              {cartItems.map((item, index) => {
                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);
                const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                const itemTotal = item.pricePerDay * days * item.quantity;
                
                return (
                  <div key={index} className="flex border-b border-gray-200 pb-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">{formatCurrency(itemTotal)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.sizeName} · {item.colorName}
                        </p>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div>
                          <p className="text-gray-500">Qty {item.quantity}</p>
                          <p className="text-gray-500 mt-1">
                            {formatCurrency(item.pricePerDay)} per day × {days} days
                          </p>
                          <p className="text-gray-500 mt-1">
                            {formatDate(startDate)} - {formatDate(endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 border-b border-gray-200 pb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>{formatCurrency(summary.tax)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>
                  {summary.shipping === 0 
                    ? 'Free' 
                    : formatCurrency(summary.shipping)
                  }
                </span>
              </div>
            </div>
            
            <div className="flex justify-between py-4">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-semibold text-[#c3937c]">
                {formatCurrency(summary.total)}
              </span>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleContinueToInformation}
                disabled={cartItems.length === 0}
                className={`w-full rounded-md bg-[#c3937c] px-4 py-3 text-white font-medium shadow-sm hover:bg-[#a67c66] focus:outline-none focus:ring-2 focus:ring-[#c3937c] ${
                  cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Continue to Information
              </button>
              
              <button
                onClick={handleBackToCart}
                className="w-full mt-4 rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#c3937c]"
              >
                Return to Cart
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              By proceeding, you agree to our Terms of Service and Privacy Policy. Your rental is subject to our Rental Agreement terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review; 