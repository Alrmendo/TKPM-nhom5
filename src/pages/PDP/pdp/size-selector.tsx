import { useState } from 'react';

export default function SizeSelector() {
  const [selectedSize, setSelectedSize] = useState('L');

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => (
        <button
          key={size}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
            selectedSize === size ? 'bg-[#333333] text-white' : 'bg-[#f2f2f2] text-[#333333]'
          }`}
          onClick={() => setSelectedSize(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
