import { CheckCircle, FileText, Info, Truck, CreditCard, Calendar, ChevronRight } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';
const Review = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
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
            <div className="w-12 h-12 rounded-full bg-[#ead9c9] flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Order overview</span>
          </div>

          <div className="hidden md:block w-16 h-[1px] bg-[#cbcbcb]"></div>

          <div className="flex flex-col items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-[#ededed] flex items-center justify-center">
              <Info className="w-6 h-6 text-[#cbcbcb]" />
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
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="max-w-4xl mx-auto bg-white rounded-lg border border-[#ededed] p-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 bg-[#f8f0ff] rounded-lg overflow-hidden">
            <img src="/placeholder.svg?height=400&width=300" alt="Eliza Satin Wedding Dress" width="300" height="400" className="w-full h-full object-cover" />
          </div>

          <div className="md:w-2/3">
            <h1 className="text-2xl font-semibold mb-4">Eliza Satin</h1>

            <div className="space-y-2 mb-4">
              <p>
                <span className="font-medium">Size:</span> M
              </p>
              <p>
                <span className="font-medium">Color:</span> White
              </p>
              <p>
                <span className="font-medium">Price:</span> 350 $ per night
              </p>
              <p>
                <span className="font-medium">Rental fee for 3 nights:</span> $1050
              </p>
              <p>
                <span className="font-medium">Quantity:</span> 1
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="bg-[#ededed] px-4 py-2 rounded-full">
                <span className="text-sm">
                  Time left to complete reservation <span className="text-[#c3937c] font-medium">12:32</span>
                </span>
              </div>

              <button className="px-4 py-2 border border-[#c3937c] text-[#c3937c] rounded-full text-sm hover:bg-[#c3937c] hover:text-white transition-colors">Change details</button>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="max-w-4xl mx-auto mt-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 border border-[#ededed] rounded-full p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Arrives by 25/10/2024</p>
              <p className="text-sm text-[#404040]">Time: 8 to 10 am</p>
            </div>
            <Calendar className="w-5 h-5 text-[#404040]" />
          </div>

          <div className="flex-1 border border-[#ededed] rounded-full p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Returns by 28/10/2024</p>
              <p className="text-sm text-[#404040]">Time: 8 to 10 am</p>
            </div>
            <Calendar className="w-5 h-5 text-[#404040]" />
          </div>

          <button className="px-6 py-4 border border-[#c3937c] text-[#c3937c] rounded-full text-sm hover:bg-[#c3937c] hover:text-white transition-colors">Change Date</button>
        </div>

        {/* CTA Button */}
        <div className="max-w-4xl mx-auto mt-8 flex justify-end">
          <button
            onClick={() => {
              navigate('/payment-information');
            }}
            className="px-6 py-3 bg-[#c3937c] text-white rounded-full flex items-center gap-2 hover:bg-[#b3836c] transition-colors">
            Complete reservation
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Review;
