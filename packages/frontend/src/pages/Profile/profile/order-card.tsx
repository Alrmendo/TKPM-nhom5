import { CheckCircle, XCircle, Clock, Hourglass } from 'lucide-react';
import { JSX } from 'react';
import { Link } from 'react-router-dom';

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  rentalDuration: string;
  arrivalDate: string;
  returnDate: string;
  status: 'done' | 'pending' | 'under-review' | 'canceled';
  isCartItem?: boolean;
}

interface OrderCardProps {
  order: OrderItem;
}

export function OrderCard({ order }: OrderCardProps): JSX.Element {
  const getStatusIcon = () => {
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
    switch (order.status) {
      case 'done':
        return 'Done';
      case 'pending':
        return order.isCartItem ? 'In Cart' : 'Pending';
      case 'under-review':
        return 'Under review';
      case 'canceled':
        return 'Canceled';
      default:
        return '';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-4">
          <img
            src={order.image || '/placeholder.svg'}
            alt={order.name}
            width={80}
            height={120}
            className="rounded-md object-cover"
          />
        </div>

        <div className="flex-grow">
          <h3 className="font-medium text-lg">{order.name}</h3>
          <p className="text-gray-600 text-sm">
            {order.size} / {order.color} / {order.rentalDuration}
          </p>
          <div className="mt-1 text-sm text-gray-600">
            <p>Arrives by {order.arrivalDate}</p>
            <p>Returns by {order.returnDate}</p>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3">
          <div className="flex items-center">
            {getStatusIcon()}
            <span
              className={`ml-1 ${
                order.status === 'done'
                  ? 'text-green-600'
                  : order.status === 'canceled'
                  ? 'text-red-500'
                  : 'text-amber-500'
              }`}
            >
              {getStatusText()}
            </span>
          </div>

          {order.isCartItem ? (
            <Link
              to="/cart"
              className="px-4 py-1 border rounded-full text-sm text-amber-600 hover:bg-amber-50 border-amber-200"
            >
              Go to Cart
            </Link>
          ) : (
            <a
              href={`/order-details/${order.id}`}
              className="px-4 py-1 border rounded-full text-sm text-gray-600 hover:bg-gray-50"
            >
              More details
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
