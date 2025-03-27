import { useState } from 'react';

export default function ColorSelector() {
  const [selectedColor, setSelectedColor] = useState('white');

  const colors = [
    { id: 'white', name: 'White', color: '#ffffff', border: true },
    { id: 'golden', name: 'Golden', color: '#cdc78c' },
    { id: 'black', name: 'Black', color: '#000000' },
    { id: 'pink', name: 'Pink', color: '#fec4f1' },
  ];

  return (
    <div className="flex space-x-2">
      {colors.map(color => (
        <button
          key={color.id}
          className={`relative rounded-full p-0.5 ${selectedColor === color.id ? 'ring-2 ring-[#c3937c]' : ''}`}
          onClick={() => setSelectedColor(color.id)}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              color.border ? 'border border-[#d9d9d9]' : ''
            }`}
            style={{ backgroundColor: color.color }}
          >
            {selectedColor === color.id && (
              <div className="absolute -bottom-6 w-full text-xs text-center font-medium text-[#333333]">
                {color.name}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
