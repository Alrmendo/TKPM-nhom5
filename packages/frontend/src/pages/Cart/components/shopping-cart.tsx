import { useState } from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/button';
import { Separator } from '../../../components/separator';
import { EmptyCart } from './empty-cart';

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
  rentalDays: number;
}

export const ShoppingCart: React.FC = () => {
  // Dữ liệu mẫu cho giỏ hàng
  const [cartItems, setCartItems] = useState<Product[]>([
    {
      id: '1',
      name: 'Eliza Satin',
      price: 350,
      image: '/placeholder.svg?height=200&width=150',
      quantity: 1,
      size: 'M',
      color: 'White',
      rentalDays: 3,
    },
    {
      id: '2',
      name: 'Aurora Lace',
      price: 420,
      image: '/placeholder.svg?height=200&width=150',
      quantity: 1,
      size: 'S',
      color: 'Ivory',
      rentalDays: 2,
    },
  ]);

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Tính tổng tiền hàng
  const calculateTotal = (item: Product) => {
    return item.price * item.rentalDays;
  };

  // Tính tổng thanh toán
  const total = cartItems.reduce((sum, item) => sum + calculateTotal(item), 0);

  // Hiển thị trạng thái giỏ hàng trống
  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mt-10 space-y-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/4 bg-[#f8f3ee] p-4 flex items-center justify-center">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="h-full max-h-[200px] object-cover"
                />
              </div>

              <div className="w-full md:w-3/4 p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div>
                    <h3 className="text-2xl font-serif">{item.name}</h3>
                    <div className="mt-4 space-y-1 text-[#404040]">
                      <p>Size: {item.size}</p>
                      <p>Color: {item.color}</p>
                      <p>Price: ${item.price} per night</p>
                      <p>
                        Rental fee for {item.rentalDays} nights: $
                        {calculateTotal(item)}
                      </p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <button
                      className="text-[#c3937c] hover:text-[#a67563] font-medium"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2 bg-[#f8f3ee] rounded-full px-4 py-2">
                    <CalendarIcon className="h-4 w-4 text-[#c3937c]" />
                    <span>Arrives by 25/10/2024</span>
                    <span className="mx-2">|</span>
                    <Clock className="h-4 w-4 text-[#c3937c]" />
                    <span>Time: 8 to 10 am</span>
                  </div>

                  <div className="flex items-center gap-2 bg-[#f8f3ee] rounded-full px-4 py-2">
                    <CalendarIcon className="h-4 w-4 text-[#c3937c]" />
                    <span>Returns by 28/10/2024</span>
                    <span className="mx-2">|</span>
                    <Clock className="h-4 w-4 text-[#c3937c]" />
                    <span>Time: 8 to 10 am</span>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="text-[#c3937c] hover:text-[#a67563] font-medium">
                    Change Date
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-serif mb-4">Summary of orders</h2>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.name} ({item.rentalDays} nights)
              </span>
              <span>${calculateTotal(item)}</span>
            </div>
          ))}
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          className="bg-[#c3937c] hover:bg-[#a67563] text-white rounded-full px-8 py-6 h-auto font-medium"
          to="/payment-review"
        >
          Continue payment
        </Link>
      </div>

      <div className="mt-4 text-center">
        <div className="inline-flex items-center bg-[#f8f3ee] rounded-full px-4 py-2">
          <span className="text-[#c3937c] font-medium">
            Time left to complete reservation:
          </span>
          <span className="ml-2 font-bold">12:32</span>
        </div>
      </div>
    </div>
  );
};
