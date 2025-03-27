import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/header';
import ProfileSidebar from '../../components/profile/sidebar';
import { ChevronLeft, CheckCircle, Clock, Hourglass, XCircle } from 'lucide-react';
import type { OrderItem } from '../../components/profile/order-card';
import Footer from '../../components/footer';

// Mock data cho orders
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
    id: '2',
    name: 'Sophia Lace',
    image: '/placeholder.svg?height=120&width=80',
    size: 'S',
    color: 'Ivory',
    rentalDuration: '2 Nights',
    arrivalDate: '15/11/2024',
    returnDate: '17/11/2024',
    status: 'pending',
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

// Mock data cho user
const mockUserData = {
  firstName: 'Anjela',
  lastName: 'Mattuew',
};

const OrderDetailsPage: React.FC = () => {
  const { id: orderId } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderItem | undefined>();

  useEffect(() => {
    const foundOrder = mockOrders.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  const getStatusIcon = () => {
    if (!order) return null;
    switch (order.status) {
      case 'done':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'under-review':
        return <Hourglass className="h-5 w-5 text-amber-500" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    if (!order) return '';
    switch (order.status) {
      case 'done':
        return 'Done';
      case 'pending':
        return 'Pending';
      case 'under-review':
        return 'Under review';
      case 'canceled':
        return 'Canceled';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    if (!order) return '';
    switch (order.status) {
      case 'done':
        return 'text-green-600';
      case 'canceled':
        return 'text-red-500';
      default:
        return 'text-amber-500';
    }
  };

  const getBackLink = () => {
    if (!order) return '/order-history';
    if (order.status === 'done') {
      return '/order-history';
    } else if (order.status === 'canceled') {
      return '/order-history?tab=canceled';
    } else {
      return '/current-orders';
    }
  };

  const getActiveTab = () => {
    if (!order) return 'order-history';
    if (order.status === 'done' || order.status === 'canceled') {
      return 'order-history';
    } else {
      return 'current-orders';
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProfileSidebar
                activeTab="order-history"
                userName={`${mockUserData.firstName} ${mockUserData.lastName}`}
                userImage="/placeholder.svg?height=100&width=100"
              />
            </div>

            <div className="md:col-span-2 bg-white rounded-lg border p-6">
              <Link to="/order-history" className="flex items-center text-gray-600 mb-6">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Order History
              </Link>

              <div className="text-center p-8">
                <p className="text-gray-500">Order not found.</p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileSidebar
              activeTab={getActiveTab()}
              userName={`${mockUserData.firstName} ${mockUserData.lastName}`}
              userImage="/placeholder.svg?height=100&width=100"
            />
          </div>

          <div className="md:col-span-2 bg-white rounded-lg border p-6">
            <Link to={getBackLink()} className="flex items-center text-gray-600 mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to {order.status === 'done' || order.status === 'canceled' ? 'Order History' : 'Current Orders'}
            </Link>

            <div className="flex justify-between items-start mb-6">
              <h1 className="text-xl font-medium">Order Details</h1>
              <div className="flex items-center">
                {getStatusIcon()}
                <span className={`ml-1 ${getStatusColor()}`}>{getStatusText()}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {/* Sử dụng thẻ img thay thế cho next/image */}
                <img
                  src={order.image || '/placeholder.svg'}
                  alt={order.name}
                  width={300}
                  height={450}
                  className="rounded-md object-cover w-full"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-medium">{order.name}</h2>
                  <p className="text-gray-600">
                    {order.size} / {order.color} / {order.rentalDuration}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Delivery Information</h3>
                  <p className="text-gray-600">Arrives by {order.arrivalDate}</p>
                  <p className="text-gray-600">Returns by {order.returnDate}</p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="flex justify-between text-gray-600">
                    <span>Rental Fee</span>
                    <span>$120.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Insurance</span>
                    <span>$15.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>$145.00</span>
                  </div>
                </div>

                {(order.status === 'pending' || order.status === 'under-review') && (
                  <div className="pt-4">
                    <button className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;
