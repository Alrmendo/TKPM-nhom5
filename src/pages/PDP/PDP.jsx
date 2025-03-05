import '../styles/PDP.css';
import { Link } from 'react-router-dom';
import { Heart, Search, User, ChevronRight, Instagram, Send, Mail, Facebook } from 'lucide-react';
import ProductGallery from '../../components/product-gallery';
import DateSelector from '../../components/date-selector';
import ColorSelector from '../../components/color-selector';
import SizeSelector from '../../components/size-selector';
import ProductAccordion from '../../components/product-accordion';
import RecommendedProducts from '../../components/recommended-products';
import Footer from '../../components/footer';

const PDP = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#eaeaea] py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex-1">
            <Link to="/">
              <img src="/placeholder.svg?height=60&width=200" alt="Enchanted Weddings" width={200} height={60} className="h-[60px] w-auto" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex space-x-8">
              <li>
                <Link to="/" className="text-[#b19e8d] hover:text-[#c3937c]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#b19e8d] hover:text-[#c3937c]">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-[#b19e8d] hover:text-[#c3937c]">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#b19e8d] hover:text-[#c3937c]">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#b19e8d] hover:text-[#c3937c]">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4 flex-1 justify-end">
            <button aria-label="User account">
              <User className="h-5 w-5 text-[#292d32]" />
            </button>
            <button aria-label="Search">
              <Search className="h-5 w-5 text-[#292d32]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <ProductGallery />

          {/* Product Details */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-medium">Eliza Satin</h1>
              <button aria-label="Add to favorites">
                <Heart className="h-6 w-6 text-[#292d32]" />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className="w-5 h-5 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium">4.9</span>
              <span className="text-sm text-[#868686]">(98 review</span>
              <span className="text-sm text-[#868686]">24 Rented)</span>
            </div>

            {/* Price */}
            <div className="text-2xl font-medium">350$/ per day</div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-medium mb-3">Color</h3>
              <ColorSelector />
            </div>

            {/* Size Selection */}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Size</h3>
              <Link to="#" className="text-sm text-[#b19e8d]">
                Size &amp; Fit Guide +
              </Link>
            </div>
            <SizeSelector />

            {/* Date Selection */}
            <button className="w-full border border-[#b19e8d] rounded-full py-3 px-4 flex justify-between items-center text-[#b19e8d]">
              <span>Tap to Select a Date</span>
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Calendar */}
            <DateSelector />

            {/* Booking Note */}
            <p className="text-sm text-[#868686]">*Tap to select Start Date, preferably 1 month before you plan to wear it</p>

            {/* Book Button */}
            <button className="w-full bg-[#ead9c9] text-[#292d32] rounded-full py-4 flex justify-between items-center px-6">
              <span className="font-medium">Request to Book</span>
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Accordion Sections */}
            <ProductAccordion />

            {/* Share */}
            <div className="flex items-center justify-between pt-4 border-t border-[#eaeaea]">
              <span className="font-medium">Share</span>
              <div className="flex space-x-4">
                <button aria-label="Share on Instagram">
                  <Instagram className="h-5 w-5 text-[#292d32]" />
                </button>
                <button aria-label="Share on Telegram">
                  <Send className="h-5 w-5 text-[#292d32]" />
                </button>
                <button aria-label="Share via Email">
                  <Mail className="h-5 w-5 text-[#292d32]" />
                </button>
                <button aria-label="Share on Facebook">
                  <Facebook className="h-5 w-5 text-[#292d32]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-medium text-center text-[#c3937c] mb-10">You May Also Like</h2>
          <RecommendedProducts />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default PDP;
