import { OrderProgress } from './profile/progress';
import { Button } from '../../components/button';
import { Input } from '../../components/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/table';
import { useState } from 'react';
import Header from '../../components/header';
import ProfileSidebar from './profile/sidebar';
import Footer from '../../components/footer';

// Mock data for user
const mockUserData = {
  firstName: 'Anjela',
  lastName: 'Mattuew',
};

// Mock order data
const mockOrderData = {
  orderCode: '4351DKP0961',
  status: 'packed' as const,
  trackingNumber: '3409512849',
  carrier: 'Purolator',
  items: [
    {
      id: '1',
      orderCode: '4351DKP0961',
      productName: 'Bridal dress',
      quantity: 1,
      price: 1186.5,
      status: 'Pending',
    },
  ],
};

const TrackOrderPage: React.FC = () => {
  const [orderCode, setOrderCode] = useState('');

  const handleTrackOrder = () => {
    console.log('Tracking order:', orderCode);
    // Logic to fetch order tracking information would go here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ProfileSidebar
              activeTab="track-order"
              userName={`${mockUserData.firstName} ${mockUserData.lastName}`}
              userImage="/placeholder.svg?height=100&width=100"
            />
          </div>

          <div className="md:col-span-2 bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-medium">Track your order</h1>
              <span className="text-gray-600">Order code: {mockOrderData.orderCode}</span>
            </div>

            <div className="border-t border-b py-4">
              <OrderProgress currentStatus={mockOrderData.status} />
            </div>

            <div className="py-6">
              <h2 className="text-lg font-medium mb-2">Your order has been delivered</h2>
              <p className="text-gray-600">
                {mockOrderData.carrier} (Tracking Number #{mockOrderData.trackingNumber})
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium mb-4">Your orders</h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order Code</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Delivery Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrderData.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.orderCode}</TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.price.toFixed(1)}</TableCell>
                        <TableCell>{item.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Enter order code"
                  value={orderCode}
                  onChange={e => setOrderCode(e.target.value)}
                />
                <Button onClick={handleTrackOrder} className="whitespace-nowrap">
                  Track your order
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackOrderPage;
