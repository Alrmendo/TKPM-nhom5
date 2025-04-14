import { toast } from 'react-hot-toast';

// Photography service cart item type
export interface PhotographyCartItem {
  serviceId: string;
  serviceName: string;
  serviceType: string;
  price: number;
  imageUrl: string;
  bookingDate: string;
  location?: string;
}

// Local storage key for photography cart
const PHOTOGRAPHY_CART_KEY = 'photography_cart_items';

// Get photography cart items from local storage
export const getPhotographyCart = (): PhotographyCartItem[] => {
  try {
    const cartItems = localStorage.getItem(PHOTOGRAPHY_CART_KEY);
    return cartItems ? JSON.parse(cartItems) : [];
  } catch (error) {
    console.error('Error getting photography cart:', error);
    return [];
  }
};

// Add photography service to cart (store in local storage)
export const addPhotographyToCart = async (serviceData: PhotographyCartItem): Promise<PhotographyCartItem[]> => {
  try {
    // Get current cart
    const currentCart = getPhotographyCart();
    
    // Check if service already exists in cart
    const existingItemIndex = currentCart.findIndex(item => item.serviceId === serviceData.serviceId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      currentCart[existingItemIndex] = serviceData;
      toast.success('Updated booking in cart!');
    } else {
      // Add new item
      currentCart.push(serviceData);
      toast.success(`${serviceData.serviceName} added to cart!`);
    }
    
    // Save to local storage
    localStorage.setItem(PHOTOGRAPHY_CART_KEY, JSON.stringify(currentCart));
    
    return currentCart;
  } catch (error) {
    console.error('Error adding photography to cart:', error);
    toast.error('Failed to add service to cart');
    return getPhotographyCart();
  }
};

// Remove photography service from cart
export const removePhotographyFromCart = (serviceId: string): PhotographyCartItem[] => {
  try {
    // Get current cart
    const currentCart = getPhotographyCart();
    
    // Filter out the item to remove
    const updatedCart = currentCart.filter(item => item.serviceId !== serviceId);
    
    // Save to local storage
    localStorage.setItem(PHOTOGRAPHY_CART_KEY, JSON.stringify(updatedCart));
    
    toast.success('Service removed from cart');
    return updatedCart;
  } catch (error) {
    console.error('Error removing photography from cart:', error);
    toast.error('Failed to remove service from cart');
    return getPhotographyCart();
  }
};

// Clear photography cart
export const clearPhotographyCart = (): void => {
  localStorage.removeItem(PHOTOGRAPHY_CART_KEY);
  toast.success('Photography cart cleared');
};

// Update photography booking date
export const updatePhotographyBookingDate = (serviceId: string, bookingDate: string): PhotographyCartItem[] => {
  try {
    // Get current cart
    const currentCart = getPhotographyCart();
    
    // Find the item to update
    const itemIndex = currentCart.findIndex(item => item.serviceId === serviceId);
    
    if (itemIndex >= 0) {
      // Update booking date
      currentCart[itemIndex].bookingDate = bookingDate;
      
      // Save to local storage
      localStorage.setItem(PHOTOGRAPHY_CART_KEY, JSON.stringify(currentCart));
      
      toast.success('Booking date updated');
    }
    
    return currentCart;
  } catch (error) {
    console.error('Error updating photography booking date:', error);
    toast.error('Failed to update booking date');
    return getPhotographyCart();
  }
};
