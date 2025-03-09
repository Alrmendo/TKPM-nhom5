// pages/Home/sections/BridalDressSection.jsx
import React from 'react';

const BridalDressSection = () => {

  return (
    <section className="flex flex-row justify-between bg-[#FBF8F1] py-16 px-8">
          {/* Dress Card 1 */}
          <div className="relative flex-1 rounded-lg w-full h-[600px] md:w-1/3">
            {/* Badge container - góc trên trái */}
            <div className="absolute top-8 left-10 flex space-x-2">
              <div className="flex items-center bg-white rounded-full px-3 py-1 shadow text-sm font-medium">
                4.8 <span className="text-yellow-500 ml-1">⭐</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-3 py-1 shadow text-sm font-medium">
                <span className="w-2 h-2 bg-[#6DE588] rounded-full mr-1"></span>
                Available
              </div>
            </div>
            
            {/* Phần hiển thị hình ảnh */}
            <div className="w-full h-[500px] overflow-hidden">
              <img
                src="pic1.jpg"
                alt="wedding dress"
                className="w-full h-full object-cover rounded-tl-[80px] rounded-tr-[80px]"
              />
            </div>
            
            {/* Phần nội dung bên dưới */}
            <div className="flex flex-row justify-between bg-[#FFFFFF] rounded-bl-[30px] rounded-br-[30px] p-4 items-center">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold">Floral Lace</h3>
                <h5 className="text-gray-600">Diana</h5>
              </div>
              <p className="text-gray-600">
                Price: <span className="text-[#C3937C]">$450</span> /Per Day
              </p>
            </div>
          </div>

          {/* Middle Card for information */}
          <div className="flex-1 text-center mt-30 mb-8">
            <h2 className="text-3xl text-gray-800">Our Latest</h2>
             <h2 className='text-[#C3937C] text-[40px] font-[600]'>Bridal Dress</h2>
            <div className="flex items-center justify-center h-48 mx-8">
              <p>Discover the latest in dresses trends with our stunning collection must have been pieces. from sleek modern designs to  classics, these trending products are sure to elevate your special </p>
            </div>

             <button className="border border-[#C3937C] bg-white text-[#C3937C] px-4 py-2 rounded-lg hover:bg-[#C3937C] hover:text-white transition cursor-pointer">
                  Explore more &gt;
            </button>
          </div>  

          {/* Dress Card 2 */}
          <div className="relative flex-1 rounded-lg w-full h-[600px] md:w-1/3">
            {/* Badge container - góc trên trái */}
            <div className="absolute top-8 left-10 flex space-x-2">
              <div className="flex items-center bg-white rounded-full px-3 py-1 shadow text-sm font-medium">
                4.7 <span className="text-yellow-500 ml-1">⭐</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-3 py-1 shadow text-sm font-medium">
                <span className="w-2 h-2 bg-[#6DE588] rounded-full mr-1"></span>
                Available
              </div>
            </div>
            
            {/* Phần hiển thị hình ảnh */}
            <div className="w-full h-[500px] overflow-hidden">
              <img
                src="pic2.jpg"
                alt="wedding dress"
                className="w-full h-full object-cover rounded-tl-[80px] rounded-tr-[80px]"
              />
            </div>
            
            {/* Phần nội dung bên dưới */}
            <div className="flex flex-row justify-between bg-[#FFFFFF] rounded-bl-[30px] rounded-br-[30px] p-4 items-center">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold">Self Portrait</h3>
                <h5 className="text-gray-600">Orla</h5>
              </div>
              <p className="text-gray-600">
                Price: <span className="text-[#C3937C]">$350</span> /Per Day
              </p>
            </div>
          </div>
      </section>
  );
};

export default BridalDressSection;
