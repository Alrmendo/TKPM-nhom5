import { CheckCircle } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';

interface SuccessfulProps {}

const Successful: React.FC<SuccessfulProps> = () => {
  const navigate = useNavigate();

  const handleContinueShopping = (): void => {
    navigate('/');
  };

  const handleViewOrder = (): void => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleContinueShopping}
              className="bg-[#c3937c] text-white px-8 py-3 rounded-md hover:bg-[#b17e66]"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleViewOrder}
              className="border border-[#c3937c] text-[#c3937c] px-8 py-3 rounded-md hover:bg-[#faf6f3]"
            >
              View Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Successful; 