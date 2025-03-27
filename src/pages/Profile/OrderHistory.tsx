import { JSX, useState } from 'react';
import Header from '../../components/header';
import ProfileSidebar from '../../components/profile/sidebar';
import { OrderFilterTabs } from '../../components/profile/order-filter-tabs';
import { OrderCard, type OrderItem } from '../../components/profile/order-card';
import Footer from '../../components/footer';
// Mock data for orders
const mockOrders: OrderItem[] = [
  {
    id: '1',
    name: 'Eliza Satin',
    image: '/placeholder.svg',
    size: 'M',
    color: 'White',
    rentalDuration: '3 Nights',
    arrivalDate: '25/10/2024',
    returnDate: '28/10/2024',
    status: 'done',
  },
  {
    id: '2',
    name: 'Sophia Lace',
    image: '/placeholder.svg',
    size: 'S',
    color: 'Ivory',
    rentalDuration: '2 Nights',
    arrivalDate: '15/11/2024',
    returnDate: '17/11/2024',
    status: 'pending',
  },
];

// Mock data for user
const mockUserData = {
  firstName: 'Anjela',
  lastName: 'Mattuew',
};

type OrderFilterTab = 'current' | 'previous' | 'canceled';

export default function OrderHistory(): JSX.Element {
  const [activeTab, setActiveTab] = useState<OrderFilterTab>('previous');

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
              activeTab="order-history"
              userName={`${mockUserData.firstName} ${mockUserData.lastName}`}
              userImage="/placeholder.svg"
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
}
