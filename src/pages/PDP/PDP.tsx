import { Heart, ChevronRight, Plus, Minus, Instagram, Send, Mail } from 'lucide-react';
import ProductGallery from './pdp/product-gallery';
import ColorSelector from './pdp/color-selector';
import SizeSelector from './pdp/size-selector';
import DatePicker from './pdp/date-picker';
import AccordionSection from './pdp/accordion-section';
import ReviewItem from './pdp/review-item';
import ProductCarousel from './pdp/product-carousel';
import { JSX } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function ProductDetailPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Gallery */}
          <ProductGallery />

          {/* Product Info */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-medium text-[#333333]">Eliza Satin</h1>
              <button className="text-[#333333]">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= 5 ? 'text-[#f4b740] fill-[#f4b740]' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-[#333333]">4.9</span>
              <span className="text-sm text-[#868686]">59 review</span>
              <span className="text-sm text-[#868686]">24 Rented</span>
            </div>

            {/* Price */}
            <div className="text-xl font-medium text-[#333333]">350$/ per day</div>

            {/* Color Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-[#333333]">Color</h3>
              <ColorSelector />
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#333333]">Size</h3>
                <a href="#" className="text-xs text-[#c3937c] flex items-center">
                  Size &amp; Fit Guide <ChevronRight className="w-3 h-3 ml-1" />
                </a>
              </div>
              <SizeSelector />
            </div>

            {/* Date Selection */}
            <button className="w-full border border-[#d9d9d9] rounded-md py-3 px-4 text-[#868686] text-left flex justify-between items-center">
              Tap to Select a Date
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Calendar */}
            <DatePicker />

            {/* Booking Info */}
            <div className="text-xs text-[#868686] italic">
              *Tip to select Start Date, preferably 1 month before you plan to wear it
            </div>

            {/* Book Button */}
            <button className="w-full bg-[#ead9c9] text-[#333333] py-3 rounded-md flex items-center justify-center">
              Request to Book
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            {/* Accordion Sections */}
            <div className="space-y-4 pt-4">
              <AccordionSection
                title="Product Detail"
                icon={<Plus className="w-5 h-5" />}
                iconOpen={<Minus className="w-5 h-5" />}
              >
                <p className="text-sm text-[#333333]">
                  Detailed information about the Eliza Satin wedding dress would go here, including materials, features,
                  and other important details.
                </p>
              </AccordionSection>

              <AccordionSection
                title="Size &amp; Fit"
                icon={<Plus className="w-5 h-5" />}
                iconOpen={<Minus className="w-5 h-5" />}
              >
                <p className="text-sm text-[#333333]">
                  Size and fit information for the Eliza Satin wedding dress would go here, including measurements and
                  sizing recommendations.
                </p>
              </AccordionSection>

              <AccordionSection
                title="Description"
                icon={<Plus className="w-5 h-5" />}
                iconOpen={<Minus className="w-5 h-5" />}
              >
                <p className="text-sm text-[#333333]">
                  A detailed description of the Eliza Satin wedding dress would go here, including its style, design
                  elements, and ideal occasions.
                </p>
              </AccordionSection>

              <AccordionSection
                title="Review"
                defaultOpen={true}
                icon={<Plus className="w-5 h-5" />}
                iconOpen={<Minus className="w-5 h-5" />}
              >
                <div className="space-y-4">
                  <ReviewItem
                    name="Jane Cooper"
                    date="24-8-2024"
                    rating={5}
                    review="Lorem ipsum dolor sit amet consectetur. Pulvinar facilisis consequat facilisis dignissim augue vulputate ullamcorper. Laoreet potenti urna sed justo."
                  />
                  <ReviewItem
                    name="Jane Cooper"
                    date="24-9-2024"
                    rating={4}
                    review="Lorem ipsum dolor sit amet consectetur. Pulvinar facilisis consequat facilisis dignissim augue vulputate ullamcorper. Laoreet potenti urna sed justo."
                  />
                </div>
              </AccordionSection>
            </div>

            {/* Share */}
            <div className="flex items-center space-x-4 pt-4">
              <span className="text-sm font-medium text-[#333333]">Share</span>
              <div className="flex items-center space-x-3">
                <a href="#" className="text-[#333333]">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-[#333333]">
                  <Send className="w-5 h-5" />
                </a>
                <a href="#" className="text-[#333333]">
                  <Mail className="w-5 h-5" />
                </a>
                <a href="#" className="text-[#333333]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          <h2 className="text-xl font-medium text-[#c3937c] text-center mb-8">You May Also Like</h2>
          <ProductCarousel />
        </div>
      </main>
      <Footer />
    </div>
  );
}
