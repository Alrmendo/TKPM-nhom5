import { JSX, useState, useEffect } from 'react';
import Header from '../../components/header';
import ProfileSidebar from './profile/sidebar';
import { OrderFilterTabs } from './profile/order-filter-tabs';
import { OrderCard, type OrderItem } from './profile/order-card';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../api/user';
import { getUserOrders } from '../../api/order';
import { getUserPhotographyBookings, PhotographyBooking } from '../../api/photography';
import { UserProfile } from '../../api/user';
import { format, differenceInDays } from 'date-fns';

type OrderFilterTab = 'current' | 'previous' | 'canceled';

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
    'paid': 'done'  // Add paid status to be shown in order history
  };
  
  return statusMap[backendStatus.toLowerCase()] || 'pending'; // Default to pending if status unknown
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
          ordersData.forEach(order => {
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
              rentalDuration: order.startDate && order.endDate 
                ? `${Math.ceil((new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60 * 24))} Nights`
                : 'N/A',
              arrivalDate: order.arrivalDate ? new Date(order.arrivalDate).toLocaleDateString() : 
                           order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A',
              returnDate: order.returnDate ? new Date(order.returnDate).toLocaleDateString() : 
                          order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A',
              status: mappedStatus,
              isPaid: order.status.toLowerCase() === 'paid'
            });
          });
        }
        
        // Fetch photography bookings
        try {
          const photographyBookings = await getUserPhotographyBookings();
          
          if (photographyBookings && photographyBookings.length > 0) {
            // Filter only bookings with payment details
            photographyBookings
              .filter(booking => booking.paymentDetails)
              .forEach(booking => {
                formattedOrders.push({
                  id: booking._id,
                  name: booking.serviceId?.name || 'Photography Service',
                  image: booking.serviceId?.coverImage || '/placeholder-photography.jpg',
                  size: booking.serviceId?.packageType || 'Standard Package',
                  color: booking.shootingLocation || 'Studio',
                  rentalDuration: 'Photography Service',
                  arrivalDate: new Date(booking.shootingDate).toLocaleDateString(),
                  returnDate: new Date(booking.shootingDate).toLocaleDateString(),
                  status: mapPhotographyStatus(booking.status),
                  isPhotographyService: true,
                  purchaseType: 'service',
                  additionalDetails: booking.additionalRequests
                });
              });
          }
        } catch (photoErr) {
          console.error('Error fetching photography bookings:', photoErr);
        }
        
        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, activeTab]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    // For photography services, use the original backend status
    if (order.isPhotographyService) {
      if (activeTab === 'current') return order.status === 'Pending' || order.status === 'Confirmed';
      if (activeTab === 'previous') return order.status === 'Completed';
      if (activeTab === 'canceled') return order.status === 'Cancelled';
      return true;
    }
    
    // For regular orders, use the existing logic
    if (activeTab === 'current') return order.status === 'pending' || order.status === 'under-review';
    if (activeTab === 'previous') return order.status === 'done';
    if (activeTab === 'canceled') return order.status === 'canceled';
    return true;
  });

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
                filteredOrders.map(order => <OrderCard key={order.id} order={order} />)
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
