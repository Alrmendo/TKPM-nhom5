import React, { useState } from 'react';

// Định nghĩa interface cho props
interface DropdownPanelProps {
  items: string[];          // Mảng các chuỗi
  imageUrl: string;         // Chuỗi cho URL hình ảnh
  altText: string;          // Chuỗi cho văn bản thay thế
  isMobile?: boolean;       // Boolean, optional với giá trị mặc định là false
}

// Component với kiểu dữ liệu props đã định nghĩa
const DropdownPanel: React.FC<DropdownPanelProps> = ({ items, imageUrl, altText, isMobile = false }) => {
  // State với kiểu number | null
  const [activeItem, setActiveItem] = useState<number | null>(null);

  // Hàm xử lý click với tham số index kiểu number
  const handleItemClick = (index: number) => {
    setActiveItem(index);
    console.log(`Clicked on: ${items[index]}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isMobile ? 'w-full' : 'w-80 md:w-96 lg:w-120'}`}>
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {/* Left section - Menu items */}
        <div className={`${isMobile ? 'w-full' : 'w-1/2'} p-4`}>
          <ul>
            {items.map((item, index) => (
              <li 
                key={index} 
                className={`py-2 cursor-pointer transition-all duration-200
                          hover:text-[#C3937C] hover:pl-2
                          active:bg-[#f8f1e8] 
                          ${activeItem === index ? 'text-[#C3937C] pl-2 font-medium' : 'text-gray-700'}`}
                onClick={() => handleItemClick(index)}
              >
                {item}
                {index < items.length - 1 && (
                  <div className="border-b border-gray-200 mt-2"></div>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Right section - Image */}
        <div className={`${isMobile ? 'w-full h-48' : 'w-1/2 h-full'}`}>
          <img 
            src={imageUrl}
            alt={altText}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/api/placeholder/400/400";   // Gán ảnh placeholder khi lỗi
              target.alt = "Placeholder image";          // Cập nhật alt text
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DropdownPanel;