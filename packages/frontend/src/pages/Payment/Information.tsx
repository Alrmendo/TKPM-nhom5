import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartItem, OrderSummary, Address } from './types';
import { calculateOrderSummary, formatCurrency } from './utils/paymentUtils';
import CheckoutSteps from './components/CheckoutSteps';
import AddressForm from './components/AddressForm';
import { useToast } from '../../hooks/use-toast';

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
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [defaultAddressId, setDefaultAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra dữ liệu đơn hàng trong localStorage trước
        const orderDataStr = localStorage.getItem('currentOrder');
        if (orderDataStr) {
          try {
            const orderData = JSON.parse(orderDataStr);
            console.log('Order data from localStorage in Information page:', orderData);
            
            if (orderData && orderData.items && orderData.items.length > 0) {
              setCartItems(orderData.items);
              
              const firstItem = orderData.items[0];
              let itemStartDate = firstItem.startDate ? new Date(firstItem.startDate) : new Date();
              let itemEndDate = firstItem.endDate ? new Date(firstItem.endDate) : new Date();
              
              // Đảm bảo ngày hợp lệ
              if (isNaN(itemStartDate.getTime())) itemStartDate = new Date();
              if (isNaN(itemEndDate.getTime())) itemEndDate = new Date();
              
              const calculatedSummary = calculateOrderSummary(
                orderData.items,
                itemStartDate,
                itemEndDate
              );
              setSummary(calculatedSummary);
              
              // Chỉ lấy thông tin địa chỉ nếu có dữ liệu đơn hàng từ localStorage
              await fetchAddressAndProfileData();
              setIsLoading(false);
              return; // Thoát luôn nếu đã có dữ liệu trong localStorage
            }
          } catch (e) {
            console.error('Error parsing order data from localStorage:', e);
          }
        }
        
        // Nếu không có dữ liệu trong localStorage, thực hiện logic cũ
        const cartResponse = await axios.get('http://localhost:3000/cart', { withCredentials: true });
        
        if (cartResponse.data.success && cartResponse.data.data) {
          const cartItems = cartResponse.data.data.items || [];
          setCartItems(cartItems);
          
          // Tính toán tổng đơn hàng nếu có items
          if (cartItems && cartItems.length > 0) {
            // Chuyển đổi dữ liệu giỏ hàng thành định dạng đơn hàng
            const processedItems = cartItems.map((item: any) => {
              return {
                dressId: typeof item.dress === 'object' ? item.dress._id : (item.dressId || item.dress),
                name: typeof item.dress === 'object' ? item.dress.name : item.name,
                image: typeof item.dress === 'object' && item.dress.images ? item.dress.images[0] : item.image,
                size: typeof item.size === 'object' ? item.size.name : item.sizeName,
                color: typeof item.color === 'object' ? item.color.name : item.colorName,
                quantity: item.quantity,
                pricePerDay: typeof item.dress === 'object' && item.dress.dailyRentalPrice ? 
                  item.dress.dailyRentalPrice : (item.pricePerDay || 0),
                startDate: item.startDate,
                endDate: item.endDate
              };
            });
            
            if (processedItems.length > 0) {
              const firstItem = processedItems[0];
              // Sử dụng startDate và endDate từ giỏ hàng hoặc giá trị mặc định
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              
              let itemStartDate = firstItem.startDate ? new Date(firstItem.startDate) : today;
              let itemEndDate = firstItem.endDate ? new Date(firstItem.endDate) : tomorrow;
              
              // Đảm bảo ngày hợp lệ
              if (isNaN(itemStartDate.getTime())) itemStartDate = today;
              if (isNaN(itemEndDate.getTime())) itemEndDate = tomorrow;
              
              const calculatedSummary = calculateOrderSummary(
                processedItems,
                itemStartDate,
                itemEndDate
              );
              
              setSummary(calculatedSummary);
              
              // Lưu dữ liệu đã xử lý vào localStorage
              const orderData = {
                items: processedItems
              };
              localStorage.setItem('currentOrder', JSON.stringify(orderData));
              setCartItems(processedItems);
            }
          } else {
            setError('No items in cart');
            setTimeout(() => {
              navigate('/cart');
            }, 2000);
            return;
          }
        } else {
          setError('No items in cart');
          setTimeout(() => {
            navigate('/cart');
          }, 2000);
          return;
        }
        
        await fetchAddressAndProfileData();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An error occurred while loading your order');
        setIsLoading(false);
      }
    };
    
    // Tách phần lấy địa chỉ và thông tin profile thành function riêng
    const fetchAddressAndProfileData = async () => {
      // Fetch user addresses
      try {
        const addressesResponse = await axios.get('http://localhost:3000/users/addresses', { withCredentials: true });
        
        if (addressesResponse.data.success && addressesResponse.data.data) {
          const addressData = addressesResponse.data.data;
          setSavedAddresses(addressData.addresses || []);
          setDefaultAddressId(addressData.defaultAddressId || null);
          
          // Show address form if no saved addresses
          if (!addressData.addresses || addressData.addresses.length === 0) {
            setShowAddressForm(true);
          } else {
            // Just show the saved addresses without selecting any by default
            setSelectedAddressId(null);
            setShowAddressForm(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user addresses:', error);
        // Non-critical, continue without saved addresses
      }
      
      // Fetch user profile
      try {
        const profileResponse = await axios.get('http://localhost:3000/users/profile', { withCredentials: true });
        
        if (profileResponse.data.success && profileResponse.data.data) {
          // Store profile data for pre-filling forms if needed
          const userData = profileResponse.data.data;
          
          // If we have profile data but no addresses, pre-set the form with name and contact info
          if (savedAddresses.length === 0 && userData) {
            setShowAddressForm(true);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Non-critical, continue without profile data
      }
    };
    
    fetchData();
  }, [navigate, savedAddresses.length]);
  
  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowAddressForm(false);
  };
  
  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setShowAddressForm(true);
  };
  
  const handleAddressSubmit = async (addressData: Address) => {
    try {
      setIsSubmitting(true);
      
      // Save address to session storage for use in later steps
      sessionStorage.setItem('shippingAddress', JSON.stringify(addressData));
      
      // If this is a new address and user opted to save it, add it to their profile
      if (showAddressForm) {
        try {
          await axios.post('http://localhost:3000/users/addresses', 
            { 
              address: addressData,
              setAsDefault: savedAddresses.length === 0 // Set as default if it's the first address
            }, 
            { withCredentials: true }
          );
          
          toast({
            title: 'Address saved',
            description: 'Your address has been saved to your profile'
          });
        } catch (error) {
          console.error('Error saving address to profile:', error);
          // Non-critical, continue to next step anyway
        }
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
    navigate('/cart');
  };
  
  // Handle using a selected saved address
  const handleUseSavedAddress = async () => {
    if (!selectedAddressId) {
      toast({
        title: 'Please select an address',
        description: 'You must select a delivery address to continue',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Find the selected address
      const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
      if (!selectedAddress) {
        setError('Selected address not found');
        setIsSubmitting(false);
        return;
      }
      
      // Convert to the format expected by the checkout process
      const addressForCheckout: Address = {
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        company: selectedAddress.company || '',
        address: selectedAddress.address,
        apartment: selectedAddress.apartment || '',
        city: selectedAddress.city,
        province: selectedAddress.province,
        postalCode: selectedAddress.postalCode,
        phone: selectedAddress.phone,
        country: selectedAddress.country
      };
      
      // Save to session storage for use in later steps
      sessionStorage.setItem('shippingAddress', JSON.stringify(addressForCheckout));
      
      // Navigate to next step
      navigate('/payment-shipping');
    } catch (error) {
      console.error('Error processing saved address:', error);
      setError('Failed to process address information');
    } finally {
      setIsSubmitting(false);
    }
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
          
          {/* Saved Addresses Section */}
          {savedAddresses.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2">Saved Addresses</h2>
              <p className="text-sm text-gray-600 mb-4">Please select an address for delivery</p>
              
              <div className="space-y-4">
                {savedAddresses.map((address) => (
                  <div 
                    key={address.id}
                    className={`border rounded-md p-4 cursor-pointer transition-colors ${
                      selectedAddressId === address.id 
                        ? 'border-[#c3937c] bg-[#f9f5f2]' 
                        : 'border-gray-200 hover:border-[#c3937c]'
                    }`}
                    onClick={() => handleSelectAddress(address.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center h-6 mt-1">
                        <div className={`w-5 h-5 rounded-full border ${selectedAddressId === address.id ? 'border-[#c3937c]' : 'border-gray-300'} flex items-center justify-center`}>
                          {selectedAddressId === address.id && (
                            <div className="w-3 h-3 rounded-full bg-[#c3937c]"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">
                            {address.firstName} {address.lastName}
                          </h3>
                          {address.id === defaultAddressId && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {address.address}
                          {address.apartment && `, ${address.apartment}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.province}, {address.country}
                        </p>
                        <p className="text-sm text-gray-600">{address.postalCode}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  className="text-[#c3937c] hover:text-[#a67c66] font-medium text-sm mt-2 flex items-center"
                  onClick={handleUseNewAddress}
                >
                  + Add a new address
                </button>
              </div>
              
              {!showAddressForm && (
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleUseSavedAddress}
                    disabled={isSubmitting || !selectedAddressId}
                    className={`w-full rounded-md px-4 py-2 text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c3937c] ${
                      selectedAddressId ? 'bg-[#c3937c] hover:bg-[#a67c66]' : 'bg-gray-400 cursor-not-allowed'
                    } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Processing...' : selectedAddressId ? 'Deliver to this address' : 'Please select an address'}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Show Address Form if needed */}
          {showAddressForm && (
            <AddressForm 
              onSubmit={handleAddressSubmit}
              isLoading={isSubmitting}
              submitLabel="Continue to Shipping"
            />
          )}
          
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
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatCurrency(summary.tax)}</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {summary.shipping === 0 ? 'Free' : formatCurrency(summary.shipping)}
                </span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span className="text-[#c3937c]">{formatCurrency(summary.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;