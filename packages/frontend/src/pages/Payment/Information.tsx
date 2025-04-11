import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartItem, OrderSummary, Address } from './types';
import { calculateOrderSummary, formatCurrency } from './utils/paymentUtils';
import CheckoutSteps from './components/CheckoutSteps';
import AddressForm from './components/AddressForm';

const Information: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<OrderSummary>({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    currency: 'USD'
  });
  const [savedAddress, setSavedAddress] = useState<Partial<Address> | null>(null);
  
  // Fetch cart data and user info on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch cart data
        const cartResponse = await axios.get('http://localhost:3000/cart', { withCredentials: true });
        
        if (cartResponse.data.success && cartResponse.data.data) {
          setCartItems(cartResponse.data.data.items || []);
          
          // Calculate order summary if there are items
          if (cartResponse.data.data.items && cartResponse.data.data.items.length > 0) {
            const firstItem = cartResponse.data.data.items[0];
            const calculatedSummary = calculateOrderSummary(
              cartResponse.data.data.items,
              new Date(firstItem.startDate),
              new Date(firstItem.endDate)
            );
            setSummary(calculatedSummary);
          }
        } else {
          setError('No items in cart');
          setTimeout(() => {
            navigate('/cart');
          }, 2000);
          return;
        }
        
        // Fetch user profile to get saved address if any
        try {
          const profileResponse = await axios.get('http://localhost:3000/users/profile', { withCredentials: true });
          
          if (profileResponse.data.success && profileResponse.data.data?.address) {
            setSavedAddress(profileResponse.data.data.address);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Non-critical, continue without saved address
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [navigate]);
  
  const handleAddressSubmit = async (addressData: Address) => {
    try {
      setIsSubmitting(true);
      
      // Save address to session storage for use in later steps
      sessionStorage.setItem('shippingAddress', JSON.stringify(addressData));
      
      // Optionally save to user profile
      try {
        await axios.put('http://localhost:3000/users/profile', 
          { address: addressData }, 
          { withCredentials: true }
        );
      } catch (error) {
        console.error('Error saving address to profile:', error);
        // Non-critical, continue to next step anyway
      }
      
      // Navigate to next step
      navigate('/payment-shipping');
    } catch (error) {
      console.error('Error processing address:', error);
      setError('Failed to save address information');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBackToReview = () => {
    navigate('/payment-review');
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <CheckoutSteps currentStep="information" completedSteps={['review']} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c3937c]"></div>
        </div>
      </div>
    );
  }
  
  if (error && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <CheckoutSteps currentStep="information" completedSteps={['review']} />
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-600 mb-6">Redirecting to cart...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <CheckoutSteps currentStep="information" completedSteps={['review']} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Address Form */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
              {error}
            </div>
          )}
          
          <AddressForm 
            onSubmit={handleAddressSubmit}
            initialAddress={savedAddress || undefined}
            isLoading={isSubmitting}
            submitLabel="Continue to Shipping"
          />
          
          <div className="mt-6">
            <button
              onClick={handleBackToReview}
              className="text-[#c3937c] hover:text-[#a67c66] font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Return to cart
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map((item, index) => {
                // Calculate days
                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);
                const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                
                return (
                  <div key={index} className="py-4 flex items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#c3937c] text-white text-xs flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-xs text-gray-500">{item.sizeName} · {item.colorName}</p>
                      <p className="text-xs text-gray-500">{days} days rental</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.pricePerDay * days * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm">{formatCurrency(summary.subtotal)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Tax</span>
                <span className="text-sm">{formatCurrency(summary.tax)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm">
                  {summary.shipping === 0 
                    ? 'Free' 
                    : formatCurrency(summary.shipping)
                  }
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-[#c3937c]">
                  {formatCurrency(summary.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information; 