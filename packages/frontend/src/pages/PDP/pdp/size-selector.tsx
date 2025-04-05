import { useState, useEffect } from 'react';

interface Size {
  _id: string;
  name: string;
  description?: string;
}

interface SizeSelectorProps {
  sizes?: Size[];
}

export default function SizeSelector({ sizes = [] }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Default sizes if none provided
  const defaultSizes: Size[] = [
    { _id: 'XS', name: 'XS', description: 'Extra Small' },
    { _id: 'S', name: 'S', description: 'Small' },
    { _id: 'M', name: 'M', description: 'Medium' },
    { _id: 'L', name: 'L', description: 'Large' },
    { _id: 'XL', name: 'XL', description: 'Extra Large' },
    { _id: 'XXL', name: 'XXL', description: 'Double Extra Large' },
  ];

  // Remove duplicate sizes by _id
  const uniqueSizes = sizes.length > 0 
    ? [...new Map(sizes.map(size => [size._id, size])).values()]
    : defaultSizes;

  // Initialize selected size if not set
  useEffect(() => {
    if (!selectedSize && uniqueSizes.length > 0) {
      setSelectedSize(uniqueSizes[0]._id);
    }
  }, [uniqueSizes]);

  return (
    <div className="flex flex-wrap gap-2">
      {uniqueSizes.map(size => (
        <button
          key={size._id}
          className={`min-w-10 h-10 px-3 rounded-full flex items-center justify-center text-sm ${
            selectedSize === size._id ? 'bg-[#333333] text-white' : 'bg-[#f2f2f2] text-[#333333]'
          }`}
          onClick={() => setSelectedSize(size._id)}
          title={size.description || size.name}
        >
          {size.name}
        </button>
      ))}
    </div>
  );
}