import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartItem, OrderSummary, Address, PaymentFormData, PaymentMethod } from './types';
import { calculateOrderSummary, formatCurrency } from './utils/paymentUtils';
import CheckoutSteps from './components/CheckoutSteps';
import PaymentForm from './components/PaymentForm';
import PaymentErrorModal from './components/PaymentErrorModal';
import PaymentApi from './api/paymentApi';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
}

// Componente para modal de error
const ErrorModal = ({ isOpen, onClose, message, onRetry }: { 
  isOpen: boolean; 
  onClose: () => void; 
  message: string;
  onRetry: () => void;
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="mb-4 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">Payment Unsuccessful</h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onRetry}
            className="w-full py-2 bg-[#c3937c] hover:bg-[#a67c66] text-white font-medium rounded-lg"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg"
          >
            Change Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingOption | null>(null);
  const [summary, setSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const hasError = useRef(false);
  const apiCallAttempted = useRef(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData | null>(null);
  
  // Fetch cart data and get info from session storage
  useEffect(() => {
    // Ngăn gọi API lần thứ 2 nếu đã có lỗi
    if (hasError.current || apiCallAttempted.current) return;
    
    const fetchData = async () => {
      try {
        apiCallAttempted.current = true;
        setIsLoading(true);
        
        // --- Xử lý dữ liệu từ session storage ---
        
        // Lấy thông tin địa chỉ từ session storage, nếu không có thì điều hướng về trang Information
        const savedAddress = sessionStorage.getItem('shippingAddress');
        if (!savedAddress) {
          setError('No shipping address found');
          setTimeout(() => {
            navigate('/payment-information');
          }, 2000);
          return;
        }
        
        try {
          setShippingAddress(JSON.parse(savedAddress));
        } catch (e) {
          console.error('Invalid address format in session storage:', e);
          setError('Invalid address format. Please go back and try again.');
          hasError.current = true;
          return;
        }
        
        // Lấy phương thức giao hàng từ session storage, nếu không có thì điều hướng về trang Shipping
        const savedShippingMethod = sessionStorage.getItem('shippingMethod');
        if (!savedShippingMethod) {
          setError('No shipping method selected');
          setTimeout(() => {
            navigate('/payment-shipping');
          }, 2000);
          return;
        }
        
        try {
          setShippingMethod(JSON.parse(savedShippingMethod));
        } catch (e) {
          console.error('Invalid shipping method format in session storage:', e);
          setError('Invalid shipping format. Please go back and try again.');
          hasError.current = true;
          return;
        }
        
        // Lấy thông tin đơn hàng từ session storage nếu có
        const savedSummary = sessionStorage.getItem('orderSummary');
        if (savedSummary) {
          try {
            setSummary(JSON.parse(savedSummary));
          } catch (e) {
            console.error('Invalid order summary format in session storage:', e);
            // Không xử lý lỗi này vì chúng ta có thể lấy lại dữ liệu từ API
          }
        }
        
        // --- Xử lý gọi API để lấy dữ liệu giỏ hàng ---
        
        try {
          // Thiết lập timeout cho axios để tránh chờ quá lâu
          const cartResponse = await axios.get('http://localhost:3000/cart', {
            withCredentials: true,
            timeout: 5000, // 5 giây timeout
          });
          
          if (cartResponse.data.success && cartResponse.data.data) {
            setCartItems(cartResponse.data.data.items || []);
            
            // Tính toán summary nếu chưa có trong session storage và có items
            if (!savedSummary && cartResponse.data.data.items && cartResponse.data.data.items.length > 0) {
              const firstItem = cartResponse.data.data.items[0];
              let calculatedSummary = calculateOrderSummary(
                cartResponse.data.data.items,
                new Date(firstItem.startDate),
                new Date(firstItem.endDate)
              );
              
              // Apply shipping cost from shipping method
              if (shippingMethod) {
                calculatedSummary = {
                  ...calculatedSummary,
                  shipping: shippingMethod.price,
                  total: calculatedSummary.subtotal + calculatedSummary.tax + shippingMethod.price
                };
              }
              
              setSummary(calculatedSummary);
            }
          } else {
            // Nếu không có items thì hiển thị lỗi và chuyển về trang cart
            setError('No items in cart');
            setTimeout(() => {
              navigate('/cart');
            }, 2000);
            return;
          }
        } catch (error) {
          console.error('Error fetching cart data:', error);
          
          // Nếu backend không hoạt động, sử dụng dữ liệu từ session storage
          if (savedSummary) {
            setError('Could not connect to server. Using saved cart information.');
            // Không chuyển hướng vì chúng ta vẫn có dữ liệu để hiển thị
          } else {
            setError('Could not load cart data. Please check your connection and try again.');
            hasError.current = true;
          }
        }
      } catch (error) {
        console.error('Error in checkout process:', error);
        setError('Failed to load required data. Please try again later.');
        hasError.current = true;
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []); // Loại bỏ các dependencies không cần thiết để tránh re-render
  
  const handlePaymentSubmit = async (formData: PaymentFormData) => {
    try {
      setIsProcessingPayment(true);
      setError(null);
      
      // Save form data for retry
      setPaymentFormData(formData);
      
      // Create a formatted payment method
      const paymentMethod: PaymentMethod = {
        id: 'card_' + Date.now().toString(),
        type: 'credit_card',
        last4: formData.cardNumber.replace(/\s/g, '').slice(-4),
        cardBrand: getCardBrand(formData.cardNumber),
        expiryDate: formData.expiryDate
      };
      
      let newOrder;
      
      try {
        // Create order from cart
        newOrder = await PaymentApi.createOrder();
        
        if (!newOrder || !newOrder._id) {
          throw new Error('Failed to create order');
        }
        
        // Update shipping address for the order
        if (shippingAddress) {
          await PaymentApi.updateShippingAddress(newOrder._id, shippingAddress);
        }
        
        // Process payment for the order
        await PaymentApi.processPayment(newOrder._id, paymentMethod);
        
        // Clear session storage
        sessionStorage.removeItem('shippingAddress');
        sessionStorage.removeItem('shippingMethod');
        sessionStorage.removeItem('orderSummary');
        
        // Navigate to success page
        navigate('/payment-successful');
      } catch (apiError) {
        console.error('API error during payment processing:', apiError);
        // If we created an order but payment failed, we should cancel that order
        if (newOrder && newOrder._id) {
          try {
            await PaymentApi.cancelOrder(newOrder._id);
          } catch (cancelError) {
            console.error('Failed to cancel order after payment error:', cancelError);
          }
        }
        throw new Error(apiError.message || 'Server error during payment processing. Please try again later.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'There was an issue processing your payment');
      setShowErrorModal(true);
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  const handleRetryPayment = () => {
    if (paymentFormData) {
      handlePaymentSubmit(paymentFormData);
    }
    setShowErrorModal(false);
  };
  
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };
  
  const handleBackToShipping = () => {
    navigate('/payment-shipping');
  };
  
  // Helper function to determine card brand from card number
  const getCardBrand = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) {
      return 'Visa';
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return 'Mastercard';
    } else if (/^3[47]/.test(cleanNumber)) {
      return 'American Express';
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      return 'Discover';
    } else {
      return 'Unknown';
    }
  };
  
  // Nếu không thể kết nối tới server nhưng vẫn có thông tin từ session, hiển thị một thông báo
  const renderServerConnectionError = () => {
    if (error && error.includes("Could not connect to server")) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 mb-4">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error} Some features may be limited.</p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <CheckoutSteps currentStep="payment" completedSteps={['review', 'information', 'shipping']} />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c3937c]"></div>
        </div>
      </div>
    );
  }
  
  if (error && (!cartItems.length || !shippingAddress || !shippingMethod) && !error.includes("Could not connect to server")) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <CheckoutSteps currentStep="payment" completedSteps={['review', 'information', 'shipping']} />
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-600 mb-6">Redirecting...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <CheckoutSteps currentStep="payment" completedSteps={['review', 'information', 'shipping']} />
      
      {renderServerConnectionError()}
      
      {/* Error Modal */}
      <ErrorModal 
        isOpen={showErrorModal} 
        onClose={handleCloseErrorModal}
        message={errorMessage}
        onRetry={handleRetryPayment}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Payment Form */}
        <div className="lg:col-span-2">
          {error && !error.includes("Could not connect to server") && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>
            
            <div className="space-y-6">
              {/* Shipping Address Summary */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-base font-medium mb-2">Địa chỉ giao hàng</h3>
                {shippingAddress && (
                  <div className="text-sm text-gray-600">
                    <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                    <p>{shippingAddress.address}</p>
                    {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                    <p>
                      {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postalCode}
                    </p>
                    <p>{shippingAddress.country}</p>
                  </div>
                )}
              </div>
              
              {/* Shipping Method Summary */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-base font-medium mb-2">Phương thức giao hàng</h3>
                {shippingMethod && (
                  <div className="text-sm text-gray-600">
                    <p>{shippingMethod.name}</p>
                    <p>{shippingMethod.description}</p>
                    <p>
                      {shippingMethod.price === 0 
                        ? 'Miễn phí' 
                        : formatCurrency(shippingMethod.price)
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <PaymentForm 
            onSubmit={handlePaymentSubmit}
            isLoading={isProcessingPayment}
          />
          
          <div className="mt-6">
            <button
              onClick={handleBackToShipping}
              className="text-[#c3937c] hover:text-[#a67c66] font-medium flex items-center"
              disabled={isProcessingPayment}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Quay lại phương thức giao hàng
            </button>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Tổng quan đơn hàng</h2>
            
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
                      <p className="text-xs text-gray-500">{days} ngày thuê</p>
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
                <span className="text-sm text-gray-600">Tạm tính</span>
                <span className="text-sm">{formatCurrency(summary?.subtotal || 0)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Thuế</span>
                <span className="text-sm">{formatCurrency(summary?.tax || 0)}</span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Phí vận chuyển</span>
                <span className="text-sm">
                  {summary?.shipping === 0 
                    ? 'Miễn phí' 
                    : formatCurrency(summary?.shipping || 0)
                  }
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                <span className="font-semibold">Tổng cộng</span>
                <span className="font-semibold text-[#c3937c]">
                  {formatCurrency(summary?.total || 0)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-600">
              Bằng cách hoàn tất thanh toán, bạn đồng ý với Điều khoản dịch vụ và xác nhận rằng bạn đã đọc Chính sách bảo mật. Thông tin thanh toán của bạn được mã hóa an toàn và thông tin của bạn (ngoại trừ chi tiết thanh toán) sẽ được chia sẻ với OX bride.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 