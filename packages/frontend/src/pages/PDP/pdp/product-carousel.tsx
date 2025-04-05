import { JSX, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './product-card';
import { Dress } from '../../../api/dress';
import { useNavigate } from 'react-router-dom';

interface ProductCarouselProps {
  dresses?: Dress[];
}

export default function ProductCarousel({ dresses }: ProductCarouselProps): JSX.Element {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Default products if no dresses are provided
  const defaultProducts = [
    {
      id: "1",
      image: '/placeholder.svg?height=400&width=300',
      title: 'French Lace',
      category: 'Modern',
      price: '$300 /Per Day',
      rating: 4.6,
      badge: 'The Most Rented',
    },
    {
      id: "2",
      image: '/placeholder.svg?height=400&width=300',
      title: 'Sparkling flowers',
      category: 'Romance',
      price: '$550 /Per Day',
      rating: 4.9,
      badge: 'The Most Rented',
    },
    {
      id: "3",
      image: '/placeholder.svg?height=400&width=300',
      title: 'Elegant',
      category: 'Paris',
      price: '$400 /Per Day',
      rating: 4.7,
      badge: 'Almost Booked',
    },
    {
      id: "4",
      image: '/placeholder.svg?height=400&width=300',
      title: 'Classic White',
      category: 'Vintage',
      price: '$450 /Per Day',
      rating: 4.8,
      badge: 'The Most Rented',
    },
    {
      id: "5",
      image: '/placeholder.svg?height=400&width=300',
      title: 'Bohemian Dream',
      category: 'Boho',
      price: '$380 /Per Day',
      rating: 4.5,
      badge: 'Almost Booked',
    },
  ];

  // Map dress data to product format if available
  const products = dresses ? dresses.map(dress => ({
    id: dress._id,
    image: dress.images[0] || '/placeholder.svg?height=400&width=300',
    title: dress.name,
    category: dress.style || 'Wedding Dress',
    price: `$${dress.dailyRentalPrice} /Per Day`,
    rating: dress.avgRating || dress.ratings.reduce((sum, rating) => sum + rating.rate, 0) / (dress.ratings.length || 1),
    badge: dress.reviews.length > 5 ? 'The Most Rented' : 'Available',
  })) : defaultProducts;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/pdp/${productId}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative">
      {/* Nút kéo sang trái */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#333333]"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Danh sách sản phẩm */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto py-4 px-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map(product => (
          <div 
            key={product.id} 
            className="flex-shrink-0 w-64 cursor-pointer"
            onClick={() => handleProductClick(product.id)}
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      {/* Nút kéo sang phải */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-[#333333]"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
