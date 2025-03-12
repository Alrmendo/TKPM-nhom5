// pages/Home/sections/LastChanceSection.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import DressCard from '../components/DressCard';

const LastChanceSection = () => {
  const cardsLastChance = [
    {
      imageUrl: "pic14.jpg",
      alt: "Wedding Dress",
      rating: 4.8,
      status: "Available",
      statusColor:"#6DE588",
      title: "French Lace",
      subtitle: "Modern",
      price: 300,
    },
    {
      imageUrl: "pic15.jpg",
      alt: "Wedding Dress",
      rating: 4.6,
      status: "Unavailable",
      statusColor:"#e81535",
      title: "Sparkling Flowers",
      subtitle: "Romance",
      price: 550,
    },
    {
      imageUrl: "pic16.jpg",
      alt: "Wedding Dress",
      rating: 4.7,
      status: "The Most Rented",
      statusColor:"#7715e8",
      title: "Elegant",
      subtitle: "Paris",
      price: 400,
    },
    {
      imageUrl: "pic4.jpg",
      alt: "Wedding Dress",
      rating: 4.9,
      status: "The Most Rented",
      statusColor:"#7715e8",
      title: "The Most Rented",
      subtitle: "Premium",
      price: 600,
    },
    {
      imageUrl: "pic3.jpg",
      alt: "Wedding Dress",
      rating: 4.8,
      status: "Unavailable",
      statusColor:"#e81535",
      title: "Luxury Lace",
      subtitle: "Classic",
      price: 450,
    },
  ];

  return (
    <section className="py-16 px-8 bg-cover bg-center">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-[32px] font-[600] text-[#C3937C] mb-8">
          Last Chance
        </h1>
        <Swiper spaceBetween={20} slidesPerView={'auto'} grabCursor={true}>
          {cardsLastChance.map((card, index) => (
            <SwiperSlide key={index} style={{ width: '300px' }}>
              <DressCard {...card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default LastChanceSection;
