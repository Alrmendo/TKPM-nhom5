import React, { useState, useEffect, useRef } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';

// Dummy data for demonstration
const dummyDresses = [
  {
    id: 1,
    imageUrl: "./pic14.jpg",
    rating: 4.8,
    status: "Available",
    statusColor: "#6DE588",
    title: "Floral Lace",
    subtitle: "Diana",
    price: 450,
    priceUnit: "Per Day"
  },
  {
    id: 2,
    imageUrl: "./pic16.jpg",
    rating: 4.6,
    status: "Popular",
    statusColor: "#F5A623",
    title: "Elegant Silk",
    subtitle: "Victoria",
    price: 580,
    priceUnit: "Per Day"
  },
  {
    id: 3,
    imageUrl: "./pic14.jpg",
    rating: 4.7,
    status: "Limited",
    statusColor: "#FF6B6B",
    title: "Classic White",
    subtitle: "Elizabeth",
    price: 520,
    priceUnit: "Per Day"
  },
  {
    id: 4,
    imageUrl: "./pic16.jpg",
    rating: 4.9,
    status: "Available",
    statusColor: "#6DE588",
    title: "Modern Minimalist",
    subtitle: "Sophia",
    price: 490,
    priceUnit: "Per Day"
  },
  {
    id: 5,
    imageUrl: "./pic14.jpg",
    rating: 4.5,
    status: "Available",
    statusColor: "#6DE588",
    title: "Vintage Lace",
    subtitle: "Charlotte",
    price: 420,
    priceUnit: "Per Day"
  },
  {
    id: 6,
    imageUrl: "./pic16.jpg",
    rating: 4.7,
    status: "Popular",
    statusColor: "#F5A623",
    title: "Pearl Embellished",
    subtitle: "Rose",
    price: 550,
    priceUnit: "Per Day"
  }
];

// DressCard component reused from the provided code
const DressCard = ({
  imageUrl, 
  alt = "Wedding Dress", 
  rating = 4.8, 
  status = "Available", 
  statusColor = "#6DE588",
  title = "Floral Lace", 
  subtitle = "Diana", 
  price = 450, 
  priceUnit = "Per Day"
}) => {
  return (
    <div className="relative rounded-lg w-full">
      {/* Badge container - góc trên trái */}
      <div className="absolute top-8 left-10 flex space-x-2">
        <div className="flex items-center bg-white rounded-full px-3 py-1 shadow text-sm font-medium">
          {rating} <span className="text-yellow-500 ml-1">⭐</span>
        </div>
        <div className="flex items-center bg-white rounded-full px-3 py-1 shadow text-sm font-medium">
          <span className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: statusColor }}  
          />
          {status}
        </div>
      </div>
      
      {/* Phần hiển thị hình ảnh */}
      <div className="w-full h-[500px] overflow-hidden">
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover rounded-tl-[80px] rounded-tr-[80px]"
        />
      </div>
      
      {/* Phần nội dung bên dưới */}
      <div className="flex flex-row justify-between bg-[#FFFFFF] rounded-bl-[30px] rounded-br-[30px] p-4 items-center">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold">{title}</h3>
          <h5 className="text-gray-600">{subtitle}</h5>
        </div>
        <p className="text-gray-600">
          Price: <span className="text-[#C3937C]">${price}</span>/{priceUnit}
        </p>
      </div>
    </div>
  );
};

// Loading component
const LoadingPanel = () => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center justify-center">
      <p className="text-lg text-gray-700 mb-4">This might take a few seconds</p>
      <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-[#C3937C] rounded-full animate-spin"></div>
    </div>
  );
};

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const searchInputRef = useRef(null);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate search delay
    setTimeout(() => {
      const filteredResults = dummyDresses.filter(dress => 
        dress.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1500); // Simulate 1.5s loading time
  };

  // Focus the search input when the overlay opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Prevent scrolling when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 overflow-y-auto flex flex-col items-center pt-20">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 text-white hover:text-gray-300 transition"
        aria-label="Close search"
      >
        <X size={30} />
      </button>
      
      {/* Search input area */}
      <div className="w-full max-w-2xl px-4">
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border-b-2 border-white bg-transparent text-white placeholder-gray-300 focus:outline-none focus:border-[#C3937C] text-lg"
              placeholder="Search"
            />
          </div>
        </form>
      </div>
      
      {/* Loading indicator */}
      {isSearching && (
        <div className="flex justify-center my-12">
          <LoadingPanel />
        </div>
      )}
      
      {/* Search results */}
      {!isSearching && hasSearched && (
        <div className="w-full px-6 md:px-12 max-w-7xl pb-20">
          {searchResults.length > 0 ? (
            <>
              <h2 className="text-white text-2xl mb-8">Search Results ({searchResults.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {searchResults.map(dress => (
                  <DressCard key={dress.id} {...dress} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-white text-xl">No results found for "{searchTerm}"</p>
              <p className="text-gray-300 mt-2">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOverlay;