// pages/Home/sections/HeroSection.jsx
import React from 'react';
import SatisfiedCounterBox from '../components/SatisfiedCounterBox';
import RentedCounterBox from '../components/RentedCounterBox';

const HeroSection = () => {
  return (
    <section className="flex flex-row items-center justify-between px-8 py-16 bg-gray-50">
        {/* Text content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-[#C3937C] mb-4">
            Here. Begins The <br/> Journey
          </h1>
          <p className="text-gray-600 mb-6">
            {/* Đoạn mô tả ngắn về dịch vụ hoặc giới thiệu */}
            We have a diverse selection of dresses for everyone,<br/> 
            providing you with ample choices at affordable prices.
          </p>
        </div>

        {/* Image placeholder (Hero Dress) */}
        <div className="flex flex-col justify-center md:w-1/2 mt-8 md:mt-0 ">
          
          <div className="absolute top-0">
            <SatisfiedCounterBox end={2564} />
          </div>
          <div className='absolute top-0 right-35'>
          <img
              src="./pic3.jpg"
              alt="Wedding Dress"
              className="
                w-[300px] h-[200px] object-cover
                rounded-br-[80px]
              "
            />
          </div>
          
          <div className="pt-[120px]">
            <img
              src="./pic4.jpg"
              alt="Wedding Dress"
              className="
                w-[300px] h-[500px] object-cover
                rounded-tl-[80px]
                rounded-tr-none
                rounded-bl-[80px]
                rounded-br-[80px]
              "
            />
          </div>                     
        </div>
        <div className='absolute top-60 right-35'>
            <img
              src="./pic1.jpg"
              alt="Wedding Dress"
              className="
                w-[300px] h-[300px] object-cover
                rounded-tl-[80px]
                rounded-br-[80px]
              "
            /> 
        </div>
           
        <div className="absolute top-150 right-35">
            <RentedCounterBox end={1884} />
        </div>
        
      </section>
  );
};

export default HeroSection;
