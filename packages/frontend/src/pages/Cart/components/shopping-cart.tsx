import { useState, useEffect } from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Separator } from '../../../components/separator';
import { EmptyCart } from './empty-cart';
import { getCart, removeFromCart, updateCartItemDates, clearCart } from '../../../api/cart';
import { createOrder } from '../../../api/order';
import DatePicker from '../../PDP/pdp/date-picker';

// Define the CartItem type based on the API response
interface CartItem {
  _id: string;
  dress: {
    _id: string;
    name: string;
    dailyRentalPrice?: number;  // Make this optional
    images?: string[];
  } | string;  // The dress could also be just an ID string
  dressId?: string;  // In case it's stored directly
  name?: string;     // In case name is stored directly
  image?: string;    // In case image is stored directly
  size: {
    _id: string;
    name: string;
  } | string;
  sizeId?: string;
  sizeName?: string;
  color: {
    _id: string;
  name: string;
  } | string;
  colorId?: string;
  colorName?: string;
  quantity: number;
  pricePerDay?: number;  // Add this field from the backend
  startDate: string;
  endDate: string;
}

export const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  
  // States for date picker
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [newStartDate, setNewStartDate] = useState<Date | null>(null);
  const [newEndDate, setNewEndDate] = useState<Date | null>(null);

  // Helper function to get dress name
  const getDressName = (item: CartItem): string => {
    if (typeof item.dress === 'object' && item.dress?.name) {
      return item.dress.name;
    }
    return item.name || 'Dress';
  };
  
  // Helper function to get dress image
  const getDressImage = (item: CartItem): string => {
    if (typeof item.dress === 'object' && item.dress?.images && item.dress.images.length > 0) {
      return item.dress.images[0];
    }
    return item.image || '/placeholder.svg';
  };
  
  // Helper function to get size name
  const getSizeName = (item: CartItem): string => {
    if (typeof item.size === 'object' && item.size?.name) {
      return item.size.name;
    }
    return item.sizeName || 'One Size';
  };
  
  // Helper function to get color name
  const getColorName = (item: CartItem): string => {
    if (typeof item.color === 'object' && item.color?.name) {
      return item.color.name;
    }
    return item.colorName || 'Standard';
  };
  
  // Helper function to get price per day
  const getPricePerDay = (item: CartItem): number => {
    if (typeof item.dress === 'object' && item.dress?.dailyRentalPrice) {
      return item.dress.dailyRentalPrice;
    }
    return item.pricePerDay || 0;
  };

  // Fetch cart data on component mount
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        console.log('Fetching cart data...');
        const cartData = await getCart();
        console.log('Cart data received:', cartData);
        
        if (!cartData || !cartData.items) {
          console.warn('Empty or invalid cart data received:', cartData);
          setCartItems([]);
        } else {
          setCartItems(cartData.items || []);
          console.log('Cart items:', cartData.items);
        }
      } catch (err: any) {
        console.error('Failed to fetch cart:', err);
        console.error('Error details:', err.message);
        if (err.response) {
          console.error('Error response:', err.response);
        }
        setError('Failed to load your cart. Please try again later.');
        toast.error('Failed to load your cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Handle removing item from cart
  const handleRemoveItem = async (index: number) => {
    try {
      await removeFromCart(index);
      setCartItems(cartItems.filter((_, idx) => idx !== index));
      toast.success('Item removed from cart');
    } catch (err) {
      console.error('Failed to remove item:', err);
      toast.error('Failed to remove item from cart');
    }
  };

  // Handle updating item dates
  const handleUpdateDates = async (index: number) => {
    if (!newStartDate || !newEndDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    try {
      const formattedStartDate = format(newStartDate, 'yyyy-MM-dd');
      const formattedEndDate = format(newEndDate, 'yyyy-MM-dd');
      
      await updateCartItemDates(index, {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });
      
      // Update local state
      const updatedItems = [...cartItems];
      updatedItems[index] = {
        ...updatedItems[index],
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };
      
      setCartItems(updatedItems);
      setEditingItem(null);
      setNewStartDate(null);
      setNewEndDate(null);
      toast.success('Dates updated successfully');
    } catch (err) {
      console.error('Failed to update dates:', err);
      toast.error('Failed to update rental dates');
    }
  };

  // Handle proceeding to checkout
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setIsProcessingOrder(true);
      console.log('Starting order creation process with cart items:', cartItems);
      
      // Create order from cart
      const order = await createOrder();
      console.log('Order created successfully:', order);
      console.log('Order details:', JSON.stringify(order, null, 2));
      
      // Show success message
      toast.success('Order created successfully!');
      
      // Clear cart after successful order creation
      await clearCart();
      console.log('Cart cleared after order creation');
      
      // Navigate to current orders page in profile
      console.log('Navigating to current orders page');
      navigate('/profile/current-orders');
    } catch (error: any) {
      console.error('Failed to create order:', error);
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('Server response:', error.response.data);
        console.error('Status code:', error.response.status);
      }
      toast.error(error.message || 'Failed to create order. Please try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Calculate rental days for an item
  const getRentalDays = (item: CartItem): number => {
    try {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      return differenceInDays(end, start) + 1; // Include both start and end dates
    } catch (err) {
      console.error('Error calculating rental days:', err);
      return 1; // Default to 1 day if calculation fails
    }
  };

  // Calculate total for a single item
  const calculateItemTotal = (item: CartItem): number => {
    try {
      const rentalDays = getRentalDays(item);
      const pricePerDay = getPricePerDay(item);
      return pricePerDay * rentalDays * item.quantity;
    } catch (err) {
      console.error('Error calculating item total:', err, item);
      return 0;
    }
  };

  // Calculate cart total
  const total = cartItems.reduce((sum, item) => {
    try {
      return sum + calculateItemTotal(item);
    } catch (err) {
      console.error('Error in total calculation for item:', item, err);
      return sum;
    }
  }, 0);

  // Handle date picker changes
  const handleStartDateChange = (date: Date) => {
    setNewStartDate(date);
    setShowStartDatePicker(false);
  };
  
  const handleEndDateChange = (date: Date) => {
    setNewEndDate(date);
    setShowEndDatePicker(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-lg text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <button 
          className="bg-[#c3937c] text-white py-2 px-4 rounded-full"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mt-10 space-y-8">
        {cartItems.map((item, index) => (
          <div
            key={item._id}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/4 bg-[#f8f3ee] p-4 flex items-center justify-center">
                <img
                  src={getDressImage(item)}
                  alt={getDressName(item)}
                  className="h-full max-h-[200px] object-cover"
                />
              </div>

              <div className="w-full md:w-3/4 p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-2xl font-serif">{getDressName(item)}</h3>
                    <div className="mt-4 space-y-1 text-[#404040]">
                      <p>Size: {getSizeName(item)}</p>
                      <p>Color: {getColorName(item)}</p>
                      <p>Price: ${getPricePerDay(item)} per night</p>
                      <p>
                        Rental fee for {getRentalDays(item)} nights: $
                        {calculateItemTotal(item)}
                      </p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <button
                      className="text-[#c3937c] hover:text-[#a67563] font-medium"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2 bg-[#f8f3ee] rounded-full px-4 py-2">
                    <CalendarIcon className="h-4 w-4 text-[#c3937c]" />
                    <span>Arrives: {format(new Date(item.startDate), 'dd/MM/yyyy')}</span>
                    <span className="mx-2">|</span>
                    <Clock className="h-4 w-4 text-[#c3937c]" />
                    <span>Time: 8 to 10 am</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#f8f3ee] rounded-full px-4 py-2">
                    <CalendarIcon className="h-4 w-4 text-[#c3937c]" />
                    <span>Returns: {format(new Date(item.endDate), 'dd/MM/yyyy')}</span>
                    <span className="mx-2">|</span>
                    <Clock className="h-4 w-4 text-[#c3937c]" />
                    <span>Time: 8 to 10 am</span>
                  </div>
                </div>

                {editingItem === item._id ? (
                  <div className="mt-4 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative">
                        <DatePicker
                          label="Start Date"
                          selectedDate={newStartDate || new Date(item.startDate)}
                          onDateChange={handleStartDateChange}
                          showPicker={showStartDatePicker}
                          onPickerChange={setShowStartDatePicker}
                          minDate={new Date()}
                        />
                      </div>
                      <div className="relative">
                        <DatePicker
                          label="End Date"
                          selectedDate={newEndDate || new Date(item.endDate)}
                          onDateChange={handleEndDateChange}
                          showPicker={showEndDatePicker}
                          onPickerChange={setShowEndDatePicker}
                          minDate={newStartDate || new Date(item.startDate)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-[#c3937c] hover:bg-[#a67563] text-white px-4 py-2 rounded-md"
                        onClick={() => handleUpdateDates(index)}
                      >
                        Update Dates
                      </button>
                      <button
                        className="border border-gray-300 px-4 py-2 rounded-md"
                        onClick={() => {
                          setEditingItem(null);
                          setNewStartDate(null);
                          setNewEndDate(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                <div className="mt-4">
                    <button 
                      className="text-[#c3937c] hover:text-[#a67563] font-medium"
                      onClick={() => {
                        setEditingItem(item._id);
                        setNewStartDate(new Date(item.startDate));
                        setNewEndDate(new Date(item.endDate));
                      }}
                    >
                    Change Date
                  </button>
                </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-serif mb-4">Summary of orders</h2>
        <div className="space-y-3">
          {cartItems.map((item, index) => (
            <div key={item._id} className="flex justify-between">
              <span>
                {getDressName(item)} ({getRentalDays(item)} nights)
              </span>
              <span>${calculateItemTotal(item)}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          className="bg-[#c3937c] hover:bg-[#a67563] text-white rounded-full px-8 py-6 h-auto font-medium"
          onClick={handleCheckout}
          disabled={isProcessingOrder || cartItems.length === 0}
        >
          {isProcessingOrder ? 'Processing...' : 'Continue payment'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center bg-[#f8f3ee] rounded-full px-4 py-2">
          <span className="text-[#c3937c] font-medium">
            Time left to complete reservation:
          </span>
          <span className="ml-2 font-bold">12:32</span>
        </div>
      </div>
    </div>
  );
};
