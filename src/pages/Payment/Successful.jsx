import { CheckCircle } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
const Successful = () => {
  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-12">
          {['Reserve a time', 'Order overview', 'Information', 'Shipping', 'Payment'].map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#000000] flex items-center justify-center border-2 border-[#000000]">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                {index < 4 && <div className="absolute top-1/2 left-full w-full h-[1px] bg-[#000000] -translate-y-1/2"></div>}
              </div>
              <span className="mt-2 text-sm text-[#0c0c0c]">{step}</span>
            </div>
          ))}
        </div>

        {/* Payment Success Card */}
        <div className="border border-[#cbcbcb] rounded-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-2">
            <div className="text-[#c3937c] text-2xl font-medium flex items-center gap-2">
              Payment Successful
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#c3937c] bg-opacity-20">
                <CheckCircle className="w-5 h-5 text-white" />
              </span>
            </div>
          </div>
          <p className="mb-2">Thank you for choosing OX Bridal Group, Your order will be generated based on your delivery request.</p>
          <p className="mb-2">The receipt has been sent to your email</p>
          <p className="text-[#707070]">Your transaction number #12096437</p>
        </div>

        {/* Order Tracking */}
        <div className="border border-[#cbcbcb] rounded-lg p-8">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#d6d6d6]">
            <h2 className="text-xl font-medium">Track your order</h2>
            <div className="text-[#707070]">Order code: 4351DKP0961</div>
          </div>

          {/* Order Status Progress */}
          <div className="flex justify-between items-center mb-12 px-12">
            {[
              { number: 1, label: 'Order placed', active: true },
              { number: 2, label: 'Packed', active: false },
              { number: 3, label: 'Shipped', active: false },
              { number: 4, label: 'Delivered', active: false },
            ].map((status, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status.active ? 'bg-[#000000] text-white' : 'bg-white border border-[#cbcbcb] text-[#707070]'}`}>
                  {status.active ? <CheckCircle className="w-5 h-5" /> : status.number}
                </div>
                <span className={`mt-2 text-sm ${status.active ? 'text-[#0c0c0c]' : 'text-[#707070]'}`}>{status.label}</span>

                {index < 3 && <div className={`absolute top-4 left-14 w-[calc(100%-2rem)] h-[1px] ${index === 0 ? 'bg-[#000000]' : 'bg-[#d6d6d6]'}`}></div>}
              </div>
            ))}
          </div>

          {/* Order Details */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-1">Your ordered has been Placed</h3>
            <p className="text-[#707070] mb-8">Purolator (Tracking Number #3409512849)</p>
          </div>

          {/* Orders Table */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your orders</h3>
              <button className="px-4 py-2 border border-[#cbcbcb] rounded-full text-sm">Track your order</button>
            </div>

            <div className="border-t border-b border-[#d6d6d6]">
              <div className="grid grid-cols-5 py-3 text-[#707070] text-sm">
                <div>Order Code</div>
                <div>Product Name</div>
                <div>Qty</div>
                <div>Price</div>
                <div>Delivery Status</div>
              </div>

              <div className="grid grid-cols-5 py-4 border-t border-[#d6d6d6]">
                <div className="text-[#707070]">4351DKP0961</div>
                <div>Bridal dress</div>
                <div>1</div>
                <div>$1186.5</div>
                <div>Pending</div>
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
export default Successful;
