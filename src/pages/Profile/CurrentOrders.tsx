import { useState } from 'react';
import Header from '../../components/header';
import ProfileSidebar from './profile/sidebar';
import { OrderFilterTabs } from './profile/order-filter-tabs';
import { OrderCard, type OrderItem } from './profile/order-card';
import Footer from '../../components/footer';
// Mock data for orders
const mockOrders: OrderItem[] = [
  {
    id: '1',
    name: 'Eliza Satin',
    image: '/placeholder.svg?height=120&width=80',
    size: 'M',
    color: 'White',
    rentalDuration: '3 Nights',
    arrivalDate: '25/10/2024',
    returnDate: '28/10/2024',
    status: 'under-review',
  },
  {
    id: '3',
    name: 'Victoria Chiffon',
    image: '/placeholder.svg?height=120&width=80',
    size: 'L',
    color: 'Blush',
    rentalDuration: '4 Nights',
    arrivalDate: '10/12/2024',
    returnDate: '14/12/2024',
    status: 'pending',
  },
];

// Mock data for user
const mockUserData = {
  firstName: 'Anjela',
  lastName: 'Mattuew',
};

type OrderFilterTab = 'current' | 'previous' | 'canceled';

const CurrentOrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('current');

  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter(order => {
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
              activeTab="current-orders"
              userName={`${mockUserData.firstName} ${mockUserData.lastName}`}
              userImage="/placeholder.svg?height=100&width=100"
            />
          </div>

          <div className="md:col-span-2">
            <OrderFilterTabs defaultTab={activeTab} onTabChange={setActiveTab} />

            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
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
