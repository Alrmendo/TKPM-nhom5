import { useState, useEffect } from 'react';
import Header from '../../components/header';
import ProfileSidebar from './profile/sidebar';
import { OrderFilterTabs } from './profile/order-filter-tabs';
import { OrderCard, type OrderItem } from './profile/order-card';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../api/user';
import { getUserOrders, cancelOrder } from '../../api/order';
import { getCart, clearCart } from '../../api/cart';
import { getPhotographyCart } from '../../api/photographyCart';
import { getUserPhotographyBookings, PhotographyBooking } from '../../api/photography';
import { UserProfile } from '../../api/user';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'react-hot-toast';

type OrderFilterTab = 'current' | 'previous' | 'canceled' | 'all';

// Map backend status to frontend status
const mapOrderStatus = (backendStatus: string): 'done' | 'pending' | 'under-review' | 'canceled' => {
  const statusMap: Record<string, 'done' | 'pending' | 'under-review' | 'canceled'> = {
    'pending': 'pending',
    'confirmed': 'under-review',  // backend 'confirmed' maps to frontend 'under-review'
    'cancelled': 'canceled',      // Note different spelling
    'canceled': 'canceled',
    'delivered': 'done',
    'returned': 'done',
    'done': 'done',
    'paid': 'done'    // Map paid status to done so it shows in previous orders
  };
  
  // Log for debugging
  console.log(`Mapping backend status "${backendStatus}" to frontend status "${statusMap[backendStatus.toLowerCase()] || 'pending'}"`);
  console.log(`Is this a paid order? ${backendStatus.toLowerCase() === 'paid'}`);
  
  return statusMap[backendStatus.toLowerCase()] || 'pending'; // Default to pending if status unknown
};

const CurrentOrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('current');
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        console.log('Fetching user orders...');
        const ordersData = await getUserOrders();
        console.log('Raw orders data received:', JSON.stringify(ordersData, null, 2));
        
        // Transform the orders data to match OrderItem structure
        console.log('Transforming orders data to match UI requirements');
        const formattedOrders: OrderItem[] = [];
        
        if (ordersData && ordersData.length > 0) {
          ordersData.forEach(order => {
            console.log('Processing order:', order._id);
            console.log('Order status:', order.status);
            
            // Check if order has items
            if (!order.items || order.items.length === 0) {
              console.warn('Order has no items:', order._id);
              return;
            }
            
            const firstItem = order.items[0];
            console.log('First item in order:', firstItem);
            
            // Map backend status to frontend status
            const mappedStatus = mapOrderStatus(order.status);
            console.log(`Mapped status from "${order.status}" to "${mappedStatus}"`);
            
            // Only add non-paid orders to current orders
            if (order.status.toLowerCase() !== 'paid') {
              formattedOrders.push({
                id: order._id,
                name: firstItem.name, // Assuming the first item's name as the main order name
                image: firstItem.image,
                size: firstItem.size,
                color: firstItem.color,
                rentalDuration: `${Math.ceil((new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60 * 24))} Nights`,
                arrivalDate: new Date(order.arrivalDate || order.startDate).toLocaleDateString(),
                returnDate: new Date(order.returnDate || order.endDate).toLocaleDateString(),
                status: mappedStatus,
                purchaseType: firstItem.purchaseType || 'rent', // Lấy thông tin loại giao dịch từ đơn hàng
              });
            }
          });
        }
        
        // Only fetch cart items if we need them (when viewing current orders)
        if (activeTab === 'current') {
          console.log('Fetching cart items...');
          // Remove the cart fetching code since we don't want to show cart items
          // This replaces the section that was getting cart and photography cart items
          
          /* Original cart fetching code removed as requested */
        }
        
        // Fetch photography bookings
        try {
          const photographyBookings = await getUserPhotographyBookings();
          console.log('===DEBUG=== Photography bookings from API:', photographyBookings);
          
          if (photographyBookings && photographyBookings.length > 0) {
            photographyBookings.forEach(booking => {
              // Map photography booking status to frontend status
              // Just use the original status without mapping
              const statusMapping = booking.status;
              console.log('===DEBUG=== Processing booking:', booking._id, 'with status:', statusMapping);
              
              // Show all photography bookings, not just ones with payment details
              formattedOrders.push({
                id: booking._id,
                name: booking.serviceId?.name || 'Photography Service',
                image: booking.serviceId?.imageUrls?.[0] || booking.serviceId?.images?.[0] || booking.serviceId?.coverImage || '/placeholder-photography.jpg',
                size: booking.serviceId?.packageType || 'Standard',
                color: booking.shootingLocation || 'Studio',
                rentalDuration: 'Photography Service',
                arrivalDate: new Date(booking.shootingDate).toLocaleDateString(),
                returnDate: new Date(booking.shootingDate).toLocaleDateString(),
                status: statusMapping,
                isPhotographyService: true,
                purchaseType: 'service',
                additionalDetails: booking.additionalRequests
              });
            });
          }
        } catch (photoBookingsErr) {
          console.error('Error fetching photography bookings:', photoBookingsErr);
        }
        
        console.log('Final formatted orders:', formattedOrders);
        
        // Use different deduplication strategies for different order types
        const uniqueOrderMap = new Map();
        formattedOrders.forEach(order => {
          // For photography services, use ID as unique key to preserve all bookings
          if (order.isPhotographyService) {
            const key = order.id;
            uniqueOrderMap.set(key, order);
          } else {
            // For wedding dresses, use name+size+color as key to prevent duplicates
            const key = `${order.name}-${order.size}-${order.color}`;
            // If we already have this item, only replace if it's not a cart item
            if (!uniqueOrderMap.has(key) || (uniqueOrderMap.get(key).isCartItem && !order.isCartItem)) {
              uniqueOrderMap.set(key, order);
            }
          }
        });
        
        // Convert back to array
        const deduplicatedOrders = Array.from(uniqueOrderMap.values())
          // Filter out cart items
          .filter(order => !order.isCartItem);
        console.log('Deduplicated orders:', deduplicatedOrders);
        
        setOrders(deduplicatedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (err instanceof Error) {
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, activeTab]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    // For photography services, debug the status check
    if (order.isPhotographyService) {
      const status = order.status ? order.status.toLowerCase() : '';
      console.log('===DEBUG=== Filtering photo order:', order.id, 'Status:', order.status, 'Tab:', activeTab);
      
      let shouldShow = false;
      if (activeTab === 'current') shouldShow = status === 'pending' || status === 'confirmed';
      if (activeTab === 'previous') shouldShow = status === 'completed';
      if (activeTab === 'canceled') shouldShow = status === 'cancelled' || status === 'canceled';
      if (activeTab === 'all') shouldShow = true;
      
      // Exclude cart items
      if (order.isCartItem) shouldShow = false;
      
      console.log('===DEBUG=== Should show?', shouldShow);
      return shouldShow;
    }
    
    // For regular orders, exclude cart items and use the existing logic
    if (order.isCartItem) return false;
    if (activeTab === 'current') return order.status === 'pending' || order.status === 'under-review';
    if (activeTab === 'previous') return order.status === 'done';
    if (activeTab === 'canceled') return order.status === 'canceled';
    return true;
  });
  
  console.log('===DEBUG=== Active tab:', activeTab);
  console.log('===DEBUG=== Final filtered orders:', filteredOrders);

  // Handle canceling/deleting an order
  const handleDeleteOrder = async (orderId: string) => {
    try {
      setLoading(true);
      
      // Check if this is a cart item
      if (orderId.startsWith('cart-item-')) {
        // Extract the index from the cart-item-X pattern
        const itemIndex = parseInt(orderId.replace('cart-item-', ''), 10);
        
        // For cart items, we use removeFromCart instead of cancelOrder
        const { removeFromCart } = await import('../../api/cart');
        await removeFromCart(itemIndex);
        
        toast.success('Item removed from cart successfully');
      } else {
        // For actual orders, use cancelOrder
        await cancelOrder(orderId);
        toast.success('Order canceled successfully');
      }
      
      // Refresh the orders list
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
    } catch (err: any) {
      console.error('Failed to delete order:', err);
      toast.error(err.message || 'Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileSidebar
              activeTab="current-orders"
              userName={userData ? userData.username : 'User'}
              userImage={userData?.profileImageUrl}
              fullName={userData ? `${userData.firstName} ${userData.lastName}` : undefined}
            />
          </div>

          <div className="md:col-span-2">
            <OrderFilterTabs defaultTab={activeTab} onTabChange={setActiveTab} />

            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-lg border p-8 text-center">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onDelete={activeTab === 'current' ? handleDeleteOrder : undefined}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg border p-8 text-center">
                  <p className="text-gray-500">No {activeTab} orders found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CurrentOrdersPage;
