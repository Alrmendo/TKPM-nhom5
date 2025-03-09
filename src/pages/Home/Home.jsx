import React from 'react';
import 'swiper/css';
import FAQSection from './sections/FAQSection';
import Footer from '../../components/footer';
import Navigation from '../../components/navigation';
import HeroSection from './sections/HeroSection';
import BridalDressSection from './sections/BridalDressSection';
import CategorySection from './sections/CategorySection';
import ServicesSection from './sections/ServicesSection';
import MostPopularSection from './sections/MostPopularSection';
import RentDressSection from './sections/RentDressSection';
import LastChanceSection from './sections/LastChanceSection';
import TestimonialsSection from './sections/TestimonialsSection';

const Home = () => {
  return (
    <div className="relative flex flex-col min-h-screen">
      
      <Navigation />

      <HeroSection/>

      <BridalDressSection/>

      <CategorySection/>

      <ServicesSection/>
      
      <MostPopularSection/>

      <RentDressSection/>

      <LastChanceSection/>

      <TestimonialsSection/>
      
      <FAQSection/>

      <Footer/>
    </div>
  );
};

export default Home;
