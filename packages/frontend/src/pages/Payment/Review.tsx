import { useState, useEffect } from 'react';
import { CheckCircle, Truck, CreditCard, Info, FileText, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../../api/cart';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'react-hot-toast';

interface CartItem {
  _id: string;
  dress: {
    _id: string;
    name: string;
    dailyRentalPrice?: number;
    images?: string[];
  } | string;
  dressId?: string;
  name?: string;
  image?: string;
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
  pricePerDay?: number;
  startDate: string;
  endDate: string;
}

const Review = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        const cartData = await getCart();
        if (!cartData || !cartData.items || cartData.items.length === 0) {
          setError('Your cart is empty');
          navigate('/cart');
          return;
        }
        setCartItems(cartData.items || []);
      } catch (err: any) {
        console.error('Failed to fetch cart:', err);
        setError('Failed to load your cart. Please try again later.');
        toast.error('Failed to load your cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [navigate]);

  // Helper functions for getting cart item properties
  const getDressName = (item: CartItem): string => {
    if (typeof item.dress === 'object' && item.dress?.name) {
      return item.dress.name;
    }
    return item.name || 'Dress';
  };
  
  const getDressImage = (item: CartItem): string => {
    if (typeof item.dress === 'object' && item.dress?.images && item.dress.images.length > 0) {
      return item.dress.images[0];
    }
    return item.image || '/placeholder.svg';
  };
  
  const getSizeName = (item: CartItem): string => {
    if (typeof item.size === 'object' && item.size?.name) {
      return item.size.name;
    }
    return item.sizeName || 'One Size';
  };
  
  const getColorName = (item: CartItem): string => {
    if (typeof item.color === 'object' && item.color?.name) {
      return item.color.name;
    }
    return item.colorName || 'Standard';
  };
  
  const getPricePerDay = (item: CartItem): number => {
    if (typeof item.dress === 'object' && item.dress?.dailyRentalPrice) {
      return item.dress.dailyRentalPrice;
    }
    return item.pricePerDay || 0;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-12">
            <p>Loading your order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-12">
            <p className="text-red-500">{error || 'Your cart is empty'}</p>
            <button 
              onClick={() => navigate('/cart')}
              className="mt-4 px-6 py-2 bg-gray-200 rounded-md"
            >
              Return to Cart
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get the first item for display
  const firstItem = cartItems[0];
  const formattedStartDate = format(new Date(firstItem.startDate), 'dd/MM/yyyy');
  const formattedEndDate = format(new Date(firstItem.endDate), 'dd/MM/yyyy');
  const rentalDays = getRentalDays(firstItem);
  const itemTotal = calculateItemTotal(firstItem);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Progress Tracker */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#000000] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Reserve a time</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#c3937c]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#ead9c9] flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Order overview</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#ededed] flex items-center justify-center">
              <Info className="w-6 h-6 text-[#cbcbcb]" />
            </div>
            <span className="mt-2 text-sm text-[#404040]">Information</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#ededed] flex items-center justify-center">
              <Truck className="w-6 h-6 text-[#cbcbcb]" />
            </div>
            <span className="mt-2 text-sm text-[#404040]">Shipping</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#ededed] flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#cbcbcb]" />
            </div>
            <span className="mt-2 text-sm text-[#404040]">Payment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-[#ededed] p-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 bg-[#f8f0ff] rounded-lg overflow-hidden">
            <img 
              src={getDressImage(firstItem)} 
              alt={getDressName(firstItem)} 
              width="300" 
              height="400" 
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="md:w-2/3">
            <h1 className="text-2xl font-semibold mb-4">{getDressName(firstItem)}</h1>

            <div className="space-y-2 mb-4">
              <p>
                <span className="font-medium">Size:</span> {getSizeName(firstItem)}
              </p>
              <p>
                <span className="font-medium">Color:</span> {getColorName(firstItem)}
              </p>
              <p>
                <span className="font-medium">Price:</span> ${getPricePerDay(firstItem)} per night
              </p>
              <p>
                <span className="font-medium">Rental fee for {rentalDays} nights:</span> ${itemTotal.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Quantity:</span> {firstItem.quantity}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="bg-[#ededed] px-4 py-2 rounded-full">
                <span className="text-sm">
                  Time left to complete reservation <span className="text-[#c3937c] font-medium">12:32</span>
                </span>
              </div>

              <button 
                onClick={() => navigate('/cart')}
                className="px-4 py-2 border border-[#c3937c] text-[#c3937c] rounded-full text-sm hover:bg-[#c3937c] hover:text-white transition-colors"
              >
                Change details
              </button>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="max-w-4xl mx-auto mt-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 border border-[#ededed] rounded-full p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Arrives by {formattedStartDate}</p>
              <p className="text-sm text-[#404040]">Time: 8 to 10 am</p>
            </div>
            <Calendar className="w-5 h-5 text-[#404040]" />
          </div>

          <div className="flex-1 border border-[#ededed] rounded-full p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Returns by {formattedEndDate}</p>
              <p className="text-sm text-[#404040]">Time: 8 to 10 am</p>
            </div>
            <Calendar className="w-5 h-5 text-[#404040]" />
          </div>

          <button 
            onClick={() => navigate('/cart')}
            className="px-6 py-4 border border-[#c3937c] text-[#c3937c] rounded-full text-sm hover:bg-[#c3937c] hover:text-white transition-colors"
          >
            Change Date
          </button>
        </div>

        {/* Navigation buttons */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-between">
          <button
            onClick={() => navigate('/cart')}
            className="px-6 py-3 border border-[#c3937c] text-[#c3937c] rounded-full flex items-center gap-2 hover:bg-[#c3937c] hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to cart
          </button>
          
          <button
            onClick={() => {
              navigate('/payment-information');
            }}
            className="px-6 py-3 bg-[#c3937c] text-white rounded-full flex items-center gap-2 hover:bg-[#b3836c] transition-colors">
            Complete reservation
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Review; 