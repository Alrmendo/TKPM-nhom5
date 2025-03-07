import { Truck, CheckCircle, Search, User, ShoppingBag, Check, CreditCard, Info, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import PaymentErrorModal from '../../components/payment-error-modal';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
const Payment = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const handlePayNow = () => {
    if (cardNumber.trim() === '') {
      setShowErrorModal(true);
    } else {
      navigate('/payment-successful');
    }
  };
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
            <div className="w-12 h-12 rounded-full bg-[#000000] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Information</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#000000] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Shipping</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#c3937c] flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Payment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column - Payment Form */}
          <div className="md:col-span-3">
            {/* Payment Methods */}
            <div className="border border-gray-200 rounded-md mb-8">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <input type="radio" id="credit-card" name="payment-method" className="w-4 h-4 accent-[#c3937c]" defaultChecked />
                  <label htmlFor="credit-card" className="ml-2">
                    Credit or Debit Card
                  </label>
                  <div className="ml-auto flex items-center space-x-2">
                    <img src="/placeholder.svg?height=24&width=40" alt="Visa" width="40" height="24" className="h-6 w-auto" />
                    <img src="/placeholder.svg?height=24&width=40" alt="Mastercard" width="40" height="24" className="h-6 w-auto" />
                    <img src="/placeholder.svg?height=24&width=40" alt="American Express" width="40" height="24" className="h-6 w-auto" />
                    <span className="text-sm text-gray-600">+2</span>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                <div className="relative">
                  <label className="text-xs text-gray-500 mb-1 block">Label</label>
                  <div className="flex">
                    <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} type="text" placeholder="Enter card number" className="w-full border border-gray-300 rounded-md p-2 pr-10" />
                    <div className="absolute right-3 top-8">
                      <Lock className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Label</label>
                    <input type="text" placeholder="ehsan" className="w-full border border-gray-300 rounded-md p-2" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Label</label>
                    <input type="text" placeholder="ehsan" className="w-full border border-gray-300 rounded-md p-2" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Label</label>
                  <input type="text" placeholder="ehsan" className="w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                  <input type="radio" id="paypal" name="payment-method" className="w-4 h-4 accent-[#c3937c]" />
                  <label htmlFor="paypal" className="ml-2">
                    More Payment Options
                  </label>
                  <div className="ml-auto">
                    <img src="/placeholder.svg?height=24&width=80" alt="PayPal" width="80" height="24" className="h-6 w-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-2">Billing Address</h2>
              <p className="text-gray-600 text-sm mb-4">Select the address that matches your card or payment method.</p>

              <div className="bg-[#fbf8f1] border border-[#c3937c] rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <input type="radio" id="same-address" name="billing-address" className="w-4 h-4 mt-1 accent-[#c3937c]" defaultChecked />
                  <label htmlFor="same-address" className="ml-2 text-[#c3937c]">
                    Same as shipping address
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex items-start">
                  <input type="radio" id="different-address" name="billing-address" className="w-4 h-4 mt-1 accent-[#c3937c]" />
                  <label htmlFor="different-address" className="ml-2">
                    Use a different billing address
                  </label>
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Remember me</h2>

              <div className="bg-[#fbf8f1] border border-[#c3937c] rounded-md p-4 mb-4">
                <div className="flex items-start">
                  <input type="radio" id="save-info" name="remember-me" className="w-4 h-4 mt-1 accent-[#c3937c]" defaultChecked />
                  <label htmlFor="save-info" className="ml-2 text-[#c3937c]">
                    Save my information for a faster checkout with a Shop account
                  </label>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md p-4 flex items-center">
                <div className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                    <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"></path>
                    <path d="M8 21v-4h8v4"></path>
                    <path d="M8 3v4"></path>
                    <path d="M16 3v4"></path>
                    <path d="M12 14v.01"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block">Mobile phone number</label>
                  <div className="flex items-center">
                    <span className="text-sm">+1-249-9897446</span>
                    <img src="/placeholder.svg?height=20&width=30" alt="Canada" width="30" height="20" className="h-4 w-auto ml-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="text-xs text-gray-600 mb-8">
              <p>
                By clicking below and placing your order, you agree to make your purchase from OX bride as merchant of record for this transaction, subject to OX bride{' '}
                <a href="#" className="text-[#c3937c] underline">
                  Terms &amp; Conditions
                </a>
                ; that your information will be handled by Global-e in accordance with the Global- e{' '}
                <a href="#" className="text-[#c3937c] underline">
                  Privacy Policy
                </a>{' '}
                and that your information (excluding the payment details) will be shared with OX bride.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  navigate('/payment-shipping');
                }}
                className="flex items-center text-[#c3937c]">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to information
              </button>
              <button onClick={handlePayNow} className="bg-[#c3937c] text-white px-8 py-3 rounded-md flex items-center">
                Pay now
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-white p-6">
              {/* Product */}
              <div className="flex mb-6">
                <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden mr-4">
                  <img src="/placeholder.svg?height=128&width=96" alt="Eliza Satin" width="96" height="128" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Eliza Satin</h3>
                  <p className="text-gray-600">M / White / 3 Nights</p>
                </div>
                <div className="ml-auto">
                  <span className="font-medium">$1050</span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex">
                  <input type="text" placeholder="Discount code or gift card" className="flex-1 border border-gray-300 rounded-l-md p-2 text-sm" defaultValue="•••••••••" />
                  <button className="bg-gray-100 text-gray-500 px-4 rounded-r-md">Apply</button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">$1050</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">TAX %13</span>
                  <span className="font-medium">$136.5</span>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-gray-600">Shipping</span>
                    <Info className="w-4 h-4 text-gray-400 ml-1" />
                  </div>
                  <span className="text-gray-600">Enter shipping address</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-medium">Total</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">CAD</span>
                    <span className="text-xl font-bold ml-1">1186.5$</span>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-gray-100 p-4 rounded-md">
                <div className="flex items-start mb-2">
                  <Info className="w-5 h-5 mr-2 mt-0.5" />
                  <p className="text-sm">We guarantee no additional charges on delivery.</p>
                </div>
                <p className="text-sm ml-7">We also send an agreement for you based on our rules and regulations which should be signed on behalf of you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showErrorModal && <PaymentErrorModal onClose={() => setShowErrorModal(false)} />}
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Payment;
