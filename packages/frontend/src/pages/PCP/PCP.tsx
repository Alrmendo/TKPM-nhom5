import { useState } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import ProductCard from './pcp/product-card';
import FilterSection from './pcp/filter-section';
import SortDropdown from './pcp/sort-dropdown';
import { Link } from 'react-router-dom';
import SearchBar from './pcp/search-bar';

// Sample data for wedding dresses
const weddingDresses = [
  {
    id: '1',
    name: 'V-Neck',
    designer: 'Inspire',
    price: 250,
    rating: 4.7,
    status: 'Almost Booked' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
  {
    id: '2',
    name: 'Ivory',
    designer: 'Flora',
    price: 450,
    rating: 4.4,
    status: 'Available' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
  {
    id: '3',
    name: 'Oleg',
    designer: 'Cassini',
    price: 420,
    rating: 4.8,
    status: 'Available' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
  {
    id: '4',
    name: 'Viola',
    designer: 'Chain',
    price: 400,
    rating: 4.7,
    status: 'The Most Rented' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
  {
    id: '5',
    name: 'Strapless',
    designer: 'Alin',
    price: 400,
    rating: 4.9,
    status: 'Last Promotion' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
  {
    id: '6',
    name: 'Sunshine',
    designer: 'Sani',
    price: 380,
    rating: 4.7,
    status: 'Available' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
  {
    id: '7',
    name: 'Saint Lura',
    designer: 'Rosy',
    price: 200,
    rating: 4.5,
    status: 'Last Promotion' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
  {
    id: '8',
    name: 'Pelerin',
    designer: 'Satin',
    price: 450,
    rating: 4.9,
    status: 'Almost Booked' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
  {
    id: '9',
    name: 'Balon',
    designer: 'Orla',
    price: 650,
    rating: 4.7,
    status: 'Available' as const,
    mainImage: '/placeholder.svg?height=500&width=400',
    thumbnails: [
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
      '/placeholder.svg?height=40&width=40',
    ],
  },
];

// Style filter options
const styleOptions = [
  { id: 'dress-for-moms', label: 'Dress for Moms' },
  { id: 'wedding-guest', label: 'Wedding Guest' },
  { id: 'short-tie', label: 'Short Tie' },
  { id: 'cocktail', label: 'Cocktail' },
  { id: 'prom', label: 'Prom' },
  { id: 'formal-evening', label: 'Formal & Evening' },
];

// Color filter options
const colorOptions = [
  { id: 'white', label: 'White', color: '#ffffff' },
  { id: 'gray', label: 'Gray', color: '#808080' },
  { id: 'beige', label: 'Beige', color: '#f5f5dc' },
  { id: 'cream', label: 'Cream', color: '#fffdd0' },
  { id: 'pink', label: 'Pink', color: '#ffc0cb' },
];

// Size filter options
const sizeOptions = [
  { id: 'xs', label: 'XS' },
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
  { id: 'xl', label: 'XL' },
  { id: 'xxl', label: 'XXL' },
];

// Sort options
const sortOptions = [
  { id: 'default', label: 'Default sorting' },
  { id: 'best-selling', label: 'Best selling' },
  { id: 'price-low-high', label: 'Price low to high' },
  { id: 'price-high-low', label: 'Price high to low' },
  { id: 'latest', label: 'Latest model' },
  { id: 'last-chance', label: 'Last chance' },
  { id: 'clearance', label: 'Clearance' },
];

export default function WeddingDressPage(): JSX.Element {
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (optionId: string) => {
    setSortBy(optionId);
    // Thực hiện logic sắp xếp tại đây
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Thực hiện logic tìm kiếm tại đây
  };

  return (
    <div>
      <Header />
      <SearchBar placeholder="Mermaid Dress" onSearch={handleSearch} />
      <main className="container-custom py-8">
        <div className="flex items-center text-sm mb-6">
          <Link to="/category" className="text-gray-500 hover:text-primary">
            Category
          </Link>
          <span className="mx-2">&gt;</span>
          <span>Wedding Dress</span>
        </div>

        <h1 className="text-2xl font-medium mb-8">Wedding Dress</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4">
              <FilterSection title="Style" type="checkbox" options={styleOptions} />
              <FilterSection title="Rental Price" type="range" minPrice={250} maxPrice={650} />
              <FilterSection title="Colors" type="color" options={colorOptions} />
              <FilterSection title="Size" type="checkbox" options={sizeOptions} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-end mb-6">
              <SortDropdown options={sortOptions} onSort={handleSort} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddingDresses.map(dress => (
                <ProductCard key={dress.id} {...dress} />
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <button className="border border-gray-300 rounded-md px-6 py-2 text-sm hover:bg-gray-50">
                Load more
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
