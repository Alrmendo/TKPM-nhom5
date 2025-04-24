import { JSX, useState, useEffect } from 'react';
import Header from '../../components/header';
import ProfileSidebar from './profile/sidebar';
import { OrderFilterTabs } from './profile/order-filter-tabs';
import { OrderCard, type OrderItem } from './profile/order-card';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../api/user';
import { getUserOrders } from '../../api/order';
import {
  getUserPhotographyBookings,
  PhotographyBooking,
} from '../../api/photography';
import { UserProfile } from '../../api/user';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'react-hot-toast';

type OrderFilterTab = 'current' | 'previous' | 'canceled' | 'all';

// Map backend status to frontend status
const mapOrderStatus = (
  backendStatus: string,
):
  | 'done'
  | 'pending'
  | 'under-review'
  | 'canceled'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'returned' => {
  const statusMap: Record<
    string,
    | 'done'
    | 'pending'
    | 'under-review'
    | 'canceled'
    | 'confirmed'
    | 'shipped'
    | 'delivered'
    | 'returned'
  > = {
    pending: 'pending',
    confirmed: 'confirmed',
    shipped: 'shipped',
    delivered: 'delivered',
    cancelled: 'canceled',
    canceled: 'canceled',
    returned: 'returned',
    'under-review': 'under-review',
    done: 'done',
    paid: 'done',
  };

  return statusMap[backendStatus.toLowerCase()] || 'pending';
};

// Map photography booking status to frontend status
const mapPhotographyStatus = (status: string): string => {
  // Just return the original status without mapping
  return status;
};

export default function OrderHistory(): JSX.Element {
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('previous');
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
        const ordersData = await getUserOrders();

        // Transform the orders data to match OrderItem structure
        const formattedOrders: OrderItem[] = [];

        if (ordersData && ordersData.length > 0) {
          ordersData.forEach((order) => {
            // Check if order has items
            if (!order.items || order.items.length === 0) {
              return;
            }

            const firstItem = order.items[0];

            // Map backend status to frontend status
            const mappedStatus = mapOrderStatus(order.status);

            formattedOrders.push({
              id: order._id,
              name: firstItem.name,
              image: firstItem.image,
              size: firstItem.size,
              color: firstItem.color,
              rentalDuration:
                order.startDate && order.endDate
                  ? `${Math.ceil((new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60 * 24))} Nights`
                  : 'N/A',
              arrivalDate: order.arrivalDate
                ? new Date(order.arrivalDate).toLocaleDateString()
                : order.startDate
                  ? new Date(order.startDate).toLocaleDateString()
                  : 'N/A',
              returnDate: order.returnDate
                ? new Date(order.returnDate).toLocaleDateString()
                : order.endDate
                  ? new Date(order.endDate).toLocaleDateString()
                  : 'N/A',
              status: mappedStatus,
              isPaid: order.status.toLowerCase() === 'paid',
            });
          });
        }

        // Fetch photography bookings
        try {
          const photographyBookings = await getUserPhotographyBookings();
          console.log(
            '===DEBUG=== Photography bookings from API:',
            photographyBookings,
          );

          if (photographyBookings && photographyBookings.length > 0) {
            // Show all photography bookings, not just ones with payment details
            photographyBookings.forEach((booking) => {
              console.log(
                '===DEBUG=== Processing booking:',
                booking._id,
                'with status:',
                booking.status,
              );
              formattedOrders.push({
                id: booking._id,
                name: booking.serviceId?.name || 'Photography Service',
                image:
                  booking.serviceId?.imageUrls?.[0] ||
                  booking.serviceId?.images?.[0] ||
                  booking.serviceId?.coverImage ||
                  '/placeholder-photography.jpg',
                size: booking.serviceId?.packageType || 'Standard Package',
                color: booking.shootingLocation || 'Studio',
                rentalDuration: 'Photography Service',
                arrivalDate: new Date(
                  booking.shootingDate,
                ).toLocaleDateString(),
                returnDate: new Date(booking.shootingDate).toLocaleDateString(),
                status: booking.status, // Use status directly without mapping
                isPhotographyService: true,
                purchaseType: 'service',
                additionalDetails: booking.additionalRequests,
              });
            });
          }
        } catch (photoErr) {
          console.error('Error fetching photography bookings:', photoErr);
        }

        // Add photography cart items
        try {
          const { getPhotographyCart } = await import('../../api/photographyCart');
          const photographyCartItems = await getPhotographyCart();
          console.log('Photography cart items:', photographyCartItems);
          
          if (photographyCartItems && photographyCartItems.length > 0) {
            // Add photography items as cart items with "In Cart" status
            photographyCartItems.forEach((item) => {
              formattedOrders.push({
                id: `photography-cart-item-${item.serviceId}`,
                name: item.serviceName,
                image: item.imageUrl,
                size: item.serviceType,
                color: item.location || 'Studio',
                rentalDuration: 'Photography Service',
                arrivalDate: new Date(item.bookingDate).toLocaleDateString(),
                returnDate: new Date(item.bookingDate).toLocaleDateString(),
                status: 'In Cart', // Set status explicitly to "In Cart"
                isCartItem: true,
                isPhotographyService: true,
                purchaseType: 'service'
              });
            });
          }
        } catch (photoCartErr) {
          console.error('Error fetching photography cart items:', photoCartErr);
        }

        // Use different deduplication strategies for different order types
        const uniqueOrderMap = new Map();
        formattedOrders.forEach((order) => {
          // For photography services, use ID as unique key to preserve all bookings
          if (order.isPhotographyService) {
            const key = order.id;
            uniqueOrderMap.set(key, order);
          } else {
            // For wedding dresses, use name+size+color as key to prevent duplicates
            const key = `${order.name}-${order.size}-${order.color}`;
            // If we already have this item, only replace if it's not a cart item
            if (
              !uniqueOrderMap.has(key) ||
              (uniqueOrderMap.get(key).isCartItem && !order.isCartItem)
            ) {
              uniqueOrderMap.set(key, order);
            }
          }
        });

        // Convert back to array
        const deduplicatedOrders = Array.from(uniqueOrderMap.values());

        setOrders(deduplicatedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, activeTab]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    // For photography services, debug the status check
    if (order.isPhotographyService) {
      const status = order.status ? order.status.toLowerCase() : '';
      console.log(
        '===DEBUG=== Filtering photo order:',
        order.id,
        'Status:',
        order.status,
        'Tab:',
        activeTab,
      );

      let shouldShow = false;
      if (activeTab === 'current')
        shouldShow = status === 'pending' || status === 'confirmed' || order.isCartItem === true;
      if (activeTab === 'previous') shouldShow = status === 'completed';
      if (activeTab === 'canceled')
        shouldShow = status === 'cancelled' || status === 'canceled';
      if (activeTab === 'all') shouldShow = true;

      console.log('===DEBUG=== Should show?', shouldShow);
      return shouldShow;
    }

    // For regular orders, use the existing logic
    if (activeTab === 'current')
      return (
        order.status === 'pending' ||
        order.status === 'under-review' ||
        order.status === 'confirmed' ||
        order.status === 'shipped'
      );
    if (activeTab === 'previous')
      return (
        order.status === 'done' ||
        order.status === 'delivered' ||
        order.status === 'returned' ||
        order.isPaid
      );
    if (activeTab === 'canceled')
      return order.status === 'canceled' || order.status === 'cancelled';
    return true;
  });

  console.log('===DEBUG=== Final filtered orders:', filteredOrders);

  // Handle deleting photography cart items
  const handleDeleteOrder = async (orderId: string) => {
    try {
      setLoading(true);
      
      // Check if this is a photography cart item
      if (orderId.startsWith('photography-cart-item-')) {
        // Extract the serviceId from the photography-cart-item-X pattern
        const serviceId = orderId.replace('photography-cart-item-', '');
        
        // For photography cart items, use removePhotographyFromCart
        const { removePhotographyFromCart } = await import('../../api/photographyCart');
        await removePhotographyFromCart(serviceId);
        
        // Show success message
        toast.success('Photography service removed from cart successfully');
        
        // Refresh orders by removing the deleted one
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      }
    } catch (err: any) {
      console.error('Failed to delete item:', err);
      toast.error(err.message || 'Failed to delete item');
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
              activeTab="order-history"
              userName={userData ? userData.username : 'User'}
              userImage={userData?.profileImageUrl}
              fullName={
                userData
                  ? `${userData.firstName} ${userData.lastName}`
                  : undefined
              }
            />
          </div>

          <div className="md:col-span-2">
            <OrderFilterTabs
              defaultTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-lg border p-8 text-center">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onDelete={activeTab === 'current' && order.isCartItem ? handleDeleteOrder : undefined}
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
}
