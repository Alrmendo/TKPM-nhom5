import { CheckCircle, Truck, CreditCard, ChevronDown, Check, Search, User, ShoppingCart, Info, CircleHelp, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';

const Information = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Progress Tracker */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#000000] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Reserve a time</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#c3937c]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#000000] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Order overview</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#c3937c] flex items-center justify-center">
              <Info className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm text-[#404040]">Information</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#ededed] flex items-center justify-center">
              <Truck className="w-6 h-6 text-[#cbcbcb]" />
            </div>
            <span className="mt-2 text-sm text-[#404040]">Shipping</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#ededed] flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#cbcbcb]" />
            </div>
            <span className="mt-2 text-sm text-[#404040]">Payment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Delivery Form */}
          <div className="lg:w-3/5 border-r border-[#eaeaea] pr-8">
            <h2 className="text-2xl font-medium mb-6">Delivery</h2>

            <div className="space-y-4">
              {/* Country/Region */}
              <div>
                <label className="block text-xs text-[#868686] mb-1">Country/ Region</label>
                <div className="relative">
                  <input type="text" className="w-full border border-[#dfdfdf] rounded p-3 pr-10" defaultValue="ehsan" />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#868686]">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#868686] mb-1">First Name</label>
                  <input type="text" className="w-full border border-[#dfdfdf] rounded p-3" defaultValue="ehsan" />
                </div>
                <div>
                  <label className="block text-xs text-[#868686] mb-1">Last Name</label>
                  <input type="text" className="w-full border border-[#dfdfdf] rounded p-3" defaultValue="ehsan" />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs text-[#868686] mb-1">Company (optional)</label>
                <input type="text" className="w-full border border-[#dfdfdf] rounded p-3" defaultValue="ehsan" />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs text-[#868686] mb-1">Address</label>
                <div className="relative">
                  <input type="text" className="w-full border border-[#dfdfdf] rounded p-3 pr-10" defaultValue="ehsan" />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#868686]">
                    <Search size={18} />
                  </div>
                </div>
              </div>

              {/* Apartment */}
              <div>
                <label className="block text-xs text-[#868686] mb-1">Apartment, Suite,etc (optional)</label>
                <div className="relative">
                  <input type="text" className="w-full border border-[#dfdfdf] rounded p-3 pr-10" defaultValue="ehsan" />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#868686]">
                    <Check size={18} />
                  </div>
                </div>
              </div>

              {/* Supporting Text */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#868686]">Supporting Text</span>
                <span className="text-xs text-[#868686]">0/360</span>
              </div>

              {/* City, Province, Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#868686] mb-1">City</label>
                  <input type="text" className="w-full border border-[#dfdfdf] rounded p-3" defaultValue="ehsan" />
                </div>
                <div>
                  <label className="block text-xs text-[#868686] mb-1">Province</label>
                  <input type="text" className="w-full border border-[#dfdfdf] rounded p-3" defaultValue="ehsan" />
                </div>
                <div>
                  <label className="block text-xs text-[#868686] mb-1">Postal code</label>
                  <input type="text" className="w-full border border-[#dfdfdf] rounded p-3" defaultValue="ehsan" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs text-[#868686] mb-1">Phone</label>
                <input type="text" className="w-full border border-[#dfdfdf] rounded p-3" defaultValue="ehsan" />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => {
                  navigate('/payment-review');
                }}
                className="text-[#c3937c] flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to cart
              </button>
              <button
                onClick={() => {
                  navigate('/payment-shipping');
                }}
                className="bg-[#c3937c] text-white px-6 py-3 rounded flex items-center">
                Continue to shipping
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-2/5">
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-[#f5f5f5] rounded-lg w-16 h-20 overflow-hidden">
                <img src="/placeholder.svg?height=80&width=64" alt="Eliza Satin Dress" width={64} height={80} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Eliza Satin</h3>
                  <span className="font-medium">$1050</span>
                </div>
                <p className="text-sm text-[#868686]">M / White / 3 Nights</p>
              </div>
            </div>

            {/* Discount Code */}
            <div className="flex space-x-2 mb-6">
              <input type="text" placeholder="Discount code or gift card" className="flex-1 border border-[#dfdfdf] rounded p-3 text-sm" defaultValue="********" />
              <button className="bg-[#f5f5f5] text-[#868686] px-4 py-2 rounded">Apply</button>
            </div>

            {/* Price Summary */}
            <div className="space-y-3 border-b border-[#eaeaea] pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-[#0c0c0c]">Subtotal</span>
                <span className="font-medium">$1050</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0c0c0c]">TAX %13</span>
                <span className="font-medium">$136.5</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-[#0c0c0c] mr-1">Shipping</span>
                  <CircleHelp size={16} className="text-[#868686]" />
                </div>
                <span className="text-[#868686]">Enter shipping address</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium">Total</span>
              <div className="text-right">
                <span className="text-sm text-[#868686] mr-1">CAD</span>
                <span className="text-xl font-bold">1186.5$</span>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-[#f5f5f5] p-4 rounded-lg">
              <div className="flex items-start mb-2">
                <div className="mr-2 mt-1">
                  <Info size={18} className="text-[#868686]" />
                </div>
                <p className="text-sm">We guarantee no additional charges on delivery.</p>
              </div>
              <p className="text-sm">We also send an agreement for you based on our rules and regulations which should be signed on behalf of you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default Information;
