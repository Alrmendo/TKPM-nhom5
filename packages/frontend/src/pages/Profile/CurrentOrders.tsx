import { useState, useEffect } from 'react';
import Header from '../../components/header';
import ProfileSidebar from './profile/sidebar';
import { OrderFilterTabs } from './profile/order-filter-tabs';
import { OrderCard, type OrderItem } from './profile/order-card';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile } from '../../api/user';
import { getUserOrders } from '../../api/order';
import { UserProfile } from '../../api/user';

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
    'done': 'done'
  };
  
  console.log(`Mapping backend status "${backendStatus}" to frontend status "${statusMap[backendStatus] || 'pending'}"`);
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
        
        if (!ordersData || ordersData.length === 0) {
          console.log('No orders returned from API');
          setOrders([]);
          setLoading(false);
          return;
        }
        
        // Transform the orders data to match OrderItem structure
        console.log('Transforming orders data to match UI requirements');
        const formattedOrders: OrderItem[] = ordersData.map(order => {
          console.log('Processing order:', order._id);
          console.log('Order status:', order.status);
          
          // Check if order has items
          if (!order.items || order.items.length === 0) {
            console.warn('Order has no items:', order._id);
            return null;
          }
          
          const firstItem = order.items[0];
          console.log('First item in order:', firstItem);
          
          // Map backend status to frontend status
          const mappedStatus = mapOrderStatus(order.status);
          console.log(`Mapped status from "${order.status}" to "${mappedStatus}"`);
          
          return {
            id: order._id,
            name: firstItem.name, // Assuming the first item's name as the main order name
            image: firstItem.image,
            size: firstItem.size,
            color: firstItem.color,
            rentalDuration: `${Math.ceil((new Date(order.endDate).getTime() - new Date(order.startDate).getTime()) / (1000 * 60 * 60 * 24))} Nights`,
            arrivalDate: new Date(order.arrivalDate || order.startDate).toLocaleDateString(),
            returnDate: new Date(order.returnDate || order.endDate).toLocaleDateString(),
            status: mappedStatus,
          };
        }).filter(Boolean) as OrderItem[];
        
        console.log('Formatted orders:', formattedOrders);
        setOrders(formattedOrders);
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
  }, [isAuthenticated]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'current') {
      const isCurrent = order.status === 'pending' || order.status === 'under-review';
      console.log(`Order ${order.id} status: ${order.status}, isCurrent: ${isCurrent}`);
      return isCurrent;
    }
    if (activeTab === 'previous') return order.status === 'done';
    if (activeTab === 'canceled') return order.status === 'canceled';
    return true;
  });

  console.log('Active tab:', activeTab);
  console.log('Number of filtered orders:', filteredOrders.length);

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
};

export default CurrentOrdersPage;
