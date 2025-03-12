import { Truck, CheckCircle, ChevronLeft, ChevronRight, CreditCard, HelpCircle, Info } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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
            <div className="w-12 h-12 rounded-full bg-[#000000] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Information</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#c3937c] flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Left Column - Shipping Information */}
          <div className="flex-1">
            {/* Contact Information */}
            <div className="border border-[#eaeaea] rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#868686]">Contact</span>
                <span className="text-[#0c0c0c]">Shabnam.mn85@gmail.com</span>
                <button className="text-[#c3937c] text-sm">Change</button>
              </div>
              <div className="border-t border-[#eaeaea] my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-[#868686]">Ship to</span>
                <span className="text-[#0c0c0c]">6 Parisan crescent ,Ontario,L4N0Y9,Canada</span>
                <button className="text-[#c3937c] text-sm">Change</button>
              </div>
            </div>

            {/* Shipping Methods */}
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">Shipping Methods</h2>
              <div className="space-y-4">
                <div className="border border-[#eaeaea] bg-[#fbf8f1] rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input id="express" name="shipping" type="radio" className="h-4 w-4 accent-[#c3937c]" defaultChecked />
                    </div>
                    <div className="ml-3 flex-1">
                      <label htmlFor="express" className="font-medium text-[#c3937c]">
                        Express Courier (Air)
                      </label>
                      <p className="text-sm text-[#868686]">(1 Business day)</p>
                    </div>
                    <div className="text-[#c3937c] font-medium">$37.12</div>
                  </div>
                </div>

                <div className="border border-[#eaeaea] rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input id="normal" name="shipping" type="radio" className="h-4 w-4 accent-[#c3937c]" />
                    </div>
                    <div className="ml-3 flex-1">
                      <label htmlFor="normal" className="font-medium text-[#0c0c0c]">
                        Normal Shipping
                      </label>
                      <p className="text-sm text-[#868686]">(3 to 5 Business days)</p>
                    </div>
                    <div className="text-[#0c0c0c] font-medium">Above $500 is free</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Duties and Taxes */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Duties and Taxes</h2>
              <div className="space-y-4">
                <div className="border border-[#eaeaea] bg-[#fbf8f1] rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input id="paynow" name="payment" type="radio" className="h-4 w-4 accent-[#c3937c]" defaultChecked />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="paynow" className="font-medium text-[#c3937c]">
                        Pay Now
                      </label>
                      <p className="text-sm text-[#868686]">No additional fee on delivery</p>
                    </div>
                  </div>
                </div>

                <div className="border border-[#eaeaea] rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-1">
                      <input id="paydelivery" name="payment" type="radio" className="h-4 w-4 accent-[#c3937c]" />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="paydelivery" className="font-medium text-[#0c0c0c]">
                        Pay on delivery
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  navigate('/payment-information');
                }}
                className="flex items-center text-[#c3937c]">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to information
              </button>
              <button
                onClick={() => {
                  navigate('/payment-checkout');
                }}
                className="bg-[#c3937c] text-white px-6 py-3 rounded-full flex items-center">
                Continue to payment
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full md:w-[400px] border-l border-[#eaeaea] pl-8">
            <div className="flex items-start mb-6">
              <div className="relative w-16 h-20 bg-[#f5f5f5] rounded-md overflow-hidden">
                <img src="/placeholder.svg?height=80&width=64" alt="Eliza Satin dress" width={64} height={80} className="object-cover" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">Eliza Satin</h3>
                  <span className="font-medium">$1050</span>
                </div>
                <p className="text-sm text-[#868686] mt-1">M / White / 3 Nights</p>
              </div>
            </div>

            {/* Discount Code */}
            <div className="flex mb-6">
              <input type="text" placeholder="Discount code or gift card" className="flex-1 border border-[#eaeaea] rounded-l-lg px-4 py-3 text-sm" defaultValue="********" />
              <button className="bg-[#f5f5f5] text-[#868686] px-6 py-3 rounded-r-lg">Apply</button>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
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
                  <span className="text-[#0c0c0c]">Shipping</span>
                  <HelpCircle className="w-4 h-4 ml-1 text-[#868686]" />
                </div>
                <span className="text-[#868686]">Enter shipping address</span>
              </div>
              <div className="border-t border-[#eaeaea] pt-4">
                <div className="flex justify-between">
                  <span className="font-medium text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-sm text-[#868686]">CAD</span>
                    <span className="font-bold text-lg ml-1">1186.5$</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-[#f5f5f5] rounded-lg p-4 mt-6">
              <div className="flex items-start">
                <HelpCircle className="w-5 h-5 text-[#0c0c0c] mt-1" />
                <div className="ml-3">
                  <p className="text-sm font-medium">We guarantee no additional charges on delivery.</p>
                  <p className="text-sm text-[#606060] mt-2">We also send an agreement for you based on our rules and regulations which should be signed on behalf of you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};
export default Shipping;
