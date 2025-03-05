import React, { useState, useEffect  }  from 'react';
import RentedCounterBox from './RentedCounterBox';
import SatisfiedCounterBox from './SatisfiedCounterBox';
import CategoryCard from './CategoryCard';
import DressCard from './DressCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import FAQSection from './FAQSection';
import logo from '../../assets/LOGO.svg';

const Home = () => {

  const cards = [
    {
      imageUrl: "pic1.jpg",
      alt: "Wedding Dress",
      rating: 4.8,
      status: "Available",
      statusColor:"#6DE588",
      title: "French Lace",
      subtitle: "Modern",
      price: 300,
    },
    {
      imageUrl: "pic2.jpg",
      alt: "Wedding Dress",
      rating: 4.6,
      status: "Unavailable",
      statusColor:"#e81535",
      title: "Sparkling Flowers",
      subtitle: "Romance",
      price: 550,
    },
    {
      imageUrl: "pic3.jpg",
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
      imageUrl: "pic13.jpg",
      alt: "Wedding Dress",
      rating: 4.8,
      status: "Unavailable",
      statusColor:"#e81535",
      title: "Luxury Lace",
      subtitle: "Classic",
      price: 450,
    },
  ];

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

  const testimonials = [
    {
      id: 1,
      name: "Roselina Stepheny",
      feedback:
        "I just wanted to share a quick note and let you know that your company did a really good job. I'm glad I decided to choose or bride as my wedding day, it's really great how easy your website is to update and manage. I never have any problem at all during choosing my dress, receive it and then returned it to you back, in addition whatever you said in your website as a consultation, online ... comes true, I really recommended you to everyone. I never have any problem at all during choosing my dress, receive it and then returned it to you back, in addition whatever you said in your website as a consultation, online ... comes true, I really recommended you to everyone.I never have any problem at all during choosing my dress, receive it and then returned it to you back, in addition whatever you said in your website as a consultation, online ... comes true, I really recommended you to everyone.",
      // Tạm để link ảnh placeholder, bạn thay link ảnh thật sau:
      avatar: "avt1.jpg",
    },
    {
      id: 2,
      name: "John Doe",
      feedback:
        "Working with this company has been an absolute pleasure. Their attention to detail and commitment to customer satisfaction is top-notch. Highly recommended!",
      avatar: "avt2.jpg",
    },
    {
      id: 3,
      name: "Jane Smith",
      feedback:
        "The process was super easy and straightforward. The team was very supportive, and the result exceeded my expectations. Will definitely come back again!",
      avatar: "avt3.jpg",
    },
    {
      id: 4,
      name: "Citadel",
      feedback:
        "The process was super easy and straightforward. The team was very supportive, and the result exceeded my expectations. Will definitely come back again!",
      avatar: "avt3.jpg",
    },
    {
      id: 5,
      name: "Citadel5",
      feedback:
        "The process was super easy and straightforward. The team was very supportive, and the result exceeded my expectations. Will definitely come back again!",
      avatar: "avt3.jpg",
    },
    {
      id: 6,
      name: "Citadel6",
      feedback:
        "The process was super easy and straightforward. The team was very supportive, and the result exceeded my expectations. Will definitely come back again!",
      avatar: "avt3.jpg",
    },
    {
      id: 7,
      name: "John Doe7",
      feedback:
        "Working with this company has been an absolute pleasure. Their attention to detail and commitment to customer satisfaction is top-notch. Highly recommended!",
      avatar: "avt2.jpg",
    },
    {
      id: 8,
      name: "Jane Smith8",
      feedback:
        "The process was super easy and straightforward. The team was very supportive, and the result exceeded my expectations. Will definitely come back again!",
      avatar: "avt3.jpg",
    },
    {
      id: 9,
      name: "Citadel9",
      feedback:
        "The process was super easy and straightforward. The team was very supportive, and the result exceeded my expectations. Will definitely come back again!",
      avatar: "avt3.jpg",
    },
    {
      id: 10,
      name: "Citadel10",
      feedback:
        "The process was super easy and straightforward. The team was very supportive, and the result exceeded my expectations. Will definitely come back again!",
      avatar: "avt3.jpg",
    },
    {
      id: 11,
      name: "Citadel11",
      feedback:
        "The process was super easy and straightforward. The team was very supportive, and the result exceeded my expectations. Will definitely come back again!",
      avatar: "avt3.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [readMore, setReadMore] = useState(false);

  // Reset lại trạng thái readMore mỗi khi chuyển testimonial mới
  useEffect(() => {
    setReadMore(false);
  }, [currentIndex]);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const { name, feedback, avatar } = testimonials[currentIndex];

  const TRUNCATE_LENGTH = 200;
  const isLongFeedback = feedback.length > TRUNCATE_LENGTH;
  const displayedFeedback =
    !readMore && isLongFeedback
      ? feedback.slice(0, TRUNCATE_LENGTH) + "..."
      : feedback;

  

  return (
    <div className="relative flex flex-col min-h-screen">
      <nav className="flex z-10 items-center justify-start px-8 py-4 space-x-20 w-10/11">
        <img className="w-1/5 h-auto" src={logo} alt="Enchanted Weddings Logo" />

        {/* Container chứa menu và icon: sử dụng inline-grid để co lại theo nội dung */}
        <div className="flex flex-1 items-center gap-x-70 bg-[#fdfcf9] border border-[#EAEAEA] w-3/5 sm:w-2/5 md:w-2/5 h-[50px] rounded-lg">
          {/* Cột bên trái: khoảng trống lớn (có thể bỏ nếu không cần) */}
          <div></div>
          {/* Cột giữa: Nhóm chữ canh giữa */}
            <ul className="flex flex-grow space-x-8">
              <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">Home</li>
              <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">About</li>
              <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">Services</li>
              <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">Blog</li>
              <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">Contact</li>
            </ul>
          {/* Cột bên phải: Nhóm icon canh bên phải */}
          <div className="flex items-center space-x-4 ml-4 mr-4">
            <img className="w-5 h-8" src="./profile.svg" alt="Profile Icon" />
            <img className="w-6 h-8" src="./search.svg" alt="Search Icon" />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
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

      {/* LATEST BRIDAL DRESS SECTION */}
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

      {/* Category */}
      <section
        className="py-16 px-8 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/05/anh-co-dau.jpg')",
        }}
      >
        {/* Overlay (nếu cần)
        <div className="absolute inset-0 bg-[#fef6dc] bg-opacity-40"></div> */}

        <div className="max-w-6xl mx-auto">
          {/* Tiêu đề */}
          <h1 className="text-center text-4xl font-bold text-white mb-12">
            Our Categories
          </h1>

          {/* Grid chia card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CategoryCard
              icon={
                <img
                  src="pic7.png" // Hoặc link URL
                  alt="Dress Icon"
                  className="w-30 h-30 object-contain"
                />
              }
              title="Dress for Moms"
              description="What to wear & other tips"
              buttonText="See 283 models"
            />

            <CategoryCard
              icon={
                <img
                  src="pic8.png" // Hoặc link URL
                  alt="Dress Icon"
                  className="w-30 h-30 object-contain"
                />
              }
              title="Wedding Guest"
              description="Forever look good on these category"
              buttonText="See 356 models"
            />

            <CategoryCard
              icon={
                <img
                  src="pic9.png" // Hoặc link URL
                  alt="Dress Icon"
                  className="w-30 h-30 object-contain"
                />
              }
              title="Short Tie"
              description="Unique & unusual dress"
              buttonText="See 221 models"
            />
            <CategoryCard
              icon={
                <img
                  src="pic10.png" // Hoặc link URL
                  alt="Dress Icon"
                  className="w-30 h-30 object-contain"
                />
              }
              title="Short Tie"
              description="Style is a good way to say who you are"
              buttonText="See 221 models"
            />
            <CategoryCard
              icon={
                <img
                  src="pic11.png" // Hoặc link URL
                  alt="Dress Icon"
                  className="w-30 h-30 object-contain"
                />
              }
              title="Short Tie"
              description="A classy dress is never get old"
              buttonText="See 221 model"
            />
            <CategoryCard
              icon={
                <img
                  src="pic12.png" // Hoặc link URL
                  alt="Dress Icon"
                  className="w-30 h-30 object-contain"
                />
              }
              title="Short Tie"
              description="Dress how you want to be addressed"
              buttonText="See 221 models"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-8 bg-cover bg-center">
        <div className="max-w-6xl mx-auto">
          {/* Tiêu đề */}
          <h1 className="text-center text-[32px] font-[600] text-[#C3937C] mb-3">
            Our Services
          </h1>
          <p className="text-center text-[16px] text-[#0C0C0C]">
            We work hard to gain a trust on you
          </p>

          {/* Grid 4 cột trên desktop, 2 cột trên tablet, 1 cột trên mobile */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-tl-[50px] rounded-tr-[50px] overflow-hidden h-[600px] grid grid-rows-[minmax(150px,2fr)_1fr]">
              {/* Ảnh */}
              <div className="overflow-hidden">
                <img
                  src="pic1.jpg"
                  alt="Service 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nội dung */}
              <div className="flex flex-col justify-between p-4">
                <h3 className="text-lg text-center font-semibold text-[#0C0C0C]">
                  Personalized dress for you
                </h3>
                <p className="text-[#0C0C0C] text-sm text-center overflow-auto">
                  Đây là đoạn text dài. We offer a large assortment of clothing for you, with which you can create whatever you desire on your mind. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                </p>
                <button className="border border-[#C3937C] bg-white text-[#C3937C] flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-lg hover:bg-[#C3937C] hover:text-white transition cursor-pointer">
                  <img src="/icon3.png" alt="icon" className="w-4 h-4" />
                  Learn more &gt;
                </button>
              </div>
            </div>





            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-tl-[50px] rounded-tr-[50px] overflow-hidden h-[600px] grid grid-rows-[minmax(150px,auto)_1fr]">
              {/* Nội dung */}
              <div className="flex flex-col justify-between p-4">
                <h3 className="text-lg text-center font-semibold text-[#0C0C0C]">
                  Customize your dress size
                </h3>
                <p className="text-[#0C0C0C] text-sm text-center">
                  All sewing patterns are made to measure for your size measurements by our expert designers according to the unique technologies. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                </p>
                <button className="border border-[#C3937C] bg-white text-[#C3937C] flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-lg hover:bg-[#C3937C] hover:text-white transition cursor-pointer">
                  <img src="/icon3.png" alt="icon" className="w-4 h-4" />
                  Learn more &gt;
                </button>
              </div>

              {/* Ảnh */}
              <div className="overflow-hidden">
                <img
                  src="pic2.jpg"
                  alt="Service 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>



            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-tl-[50px] rounded-tr-[50px] overflow-hidden h-[600px] grid grid-rows-[minmax(150px,2fr)_1fr]">
              {/* Ảnh */}
              <div className="overflow-hidden">
                <img
                  src="pic3.jpg"
                  alt="Service 1"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Nội dung */}
              <div className="flex flex-col justify-between p-4">
                <h3 className="text-lg text-center font-semibold text-[#0C0C0C]">
                  Virtual outfit try-on with AI
                </h3>
                <p className="text-[#0C0C0C] text-sm text-center overflow-auto">
                  Instantly see how clothes look on you without the need for physical fitting. Our AI models adapt to various body types and sizes to provide a realistic fitting experience.
                </p>
                <button className="border border-[#C3937C] bg-white text-[#C3937C] flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-lg hover:bg-[#C3937C] hover:text-white transition cursor-pointer">
                  <img src="/icon3.png" alt="icon" className="w-4 h-4" />
                  Learn more &gt;
                </button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white shadow-lg rounded-tl-[50px] rounded-tr-[50px] overflow-hidden h-[600px] grid grid-rows-[minmax(150px,auto)_1fr]">
              {/* Nội dung */}
              <div className="flex flex-col justify-between p-4">
                <h3 className="text-lg text-center font-semibold text-[#0C0C0C]">
                  Professional consultation
                </h3>
                <p className="text-[#0C0C0C] text-sm text-center">
                  Your dress consultation give you a chance to try on all different dress styles with the help of a professional consultant. Your dress consultation give you a chance to try on all different dress styles with the help of a professional consultant.
                </p>
                <button className="border border-[#C3937C] bg-white text-[#C3937C] flex items-center justify-center gap-2 mt-2 px-4 py-2 rounded-lg hover:bg-[#C3937C] hover:text-white transition cursor-pointer">
                  <img src="/icon3.png" alt="icon" className="w-4 h-4" />
                  Learn more &gt;
                </button>
              </div>

              {/* Ảnh */}
              <div className="overflow-hidden">
                <img
                  src="pic4.jpg"
                  alt="Service 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/*Most Popular*/}
      <section className="py-16 px-8 bg-cover bg-center">
        <div className="max-w-6xl mx-auto">
          {/* Tiêu đề */}
          <h1 className="text-center text-[32px] font-[600] text-[#C3937C] mb-8">
            Most Popular
          </h1>
          <Swiper
            spaceBetween={20}
            slidesPerView={'auto'}
            grabCursor={true}
          >
            {cards.map((card, index) => (
              <SwiperSlide key={index} style={{ width: '300px' }}>
                <DressCard {...card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
    </section>

      {/*How to rent a dress*/}
      <section className="py-16 px-4 bg-cover bg-center">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Cột bên trái: Ảnh + text overlay */}
          <div className="relative w-full h-[600px]">
            {/* Ảnh nền */}
            <img
              src="pic1.jpg"
              alt="dress placeholder"
              className="w-full h-full object-cover rounded-md"
            />
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-center p-8">
              <h2 className="text-3xl font-semibold text-white mb-4">
                How to Rent a Dress
              </h2>
              <p className="text-white max-w-md mb-6">
                This platform provides a variety of dresses, from elegant gowns 
                to modern silhouettes. Follow these steps to easily rent your 
                perfect dress for any occasion.
              </p>
              <button className="bg-[#C3937C] border border-[#000000] text-white py-2 px-4 rounded-[100px] w-fit flex items-center gap-2 hover:bg-[#a97c64] transition-colors cursor-pointer">
                <span>Get Started</span>
                <ArrowRightIcon className="w-5 h-5 inline-block align-middle" />
              </button>
            </div>
          </div>

          {/* Cột bên phải: 4 ô, mỗi ô có icon + tiêu đề + mô tả */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[600px]">
            {/* Ô 1 */}
            <div className="p-4 bg-[#F9F9F9] shadow rounded-lg flex flex-col">
              <img
                src="icon4.png"
                alt="icon placeholder"
                className="mb-2 w-12 h-12"
              />
              <h3 className="text-lg font-semibold mb-1">Desire Time</h3>
              <p className="text-gray-600 text-sm">
                Select your preferred rental period based on the item's availability. 
                Book to have the item added to your cart.
              </p>
            </div>

            {/* Ô 2 */}
            <div className="p-4 bg-white shadow rounded-lg flex flex-col">
              <img
                src="icon5.png"
                alt="icon placeholder"
                className="mb-2 w-12 h-12"
              />
              <h3 className="text-lg font-semibold mb-1">Payment Order</h3>
              <p className="text-gray-600 text-sm">
                Securely process payments through your chosen payment gateway, 
                ensuring compliance with security standards.
              </p>
            </div>

            {/* Ô 3 */}
            <div className="p-4 bg-white shadow rounded-lg flex flex-col">
              <img
                src="icon6.png"
                alt="icon placeholder"
                className="mb-2 w-12 h-12"
              />
              <h3 className="text-lg font-semibold mb-1">Complete Information</h3>
              <p className="text-gray-600 text-sm">
                You’ll want to gather details on various aspects to ensure the 
                item meets your needs (both fit and style).
              </p>
            </div>

            {/* Ô 4 */}
            <div className="p-4 bg-[#F9F9F9] shadow rounded-lg flex flex-col">
              <img
                src="icon7.png"
                alt="icon placeholder"
                className="mb-2 w-12 h-12"
              />
              <h3 className="text-lg font-semibold mb-1">Receive Dress</h3>
              <p className="text-gray-600 text-sm">
                Carefully package dresses to avoid any wrinkling or damage during 
                transit, and include any accessories necessary for your look.
              </p>
            </div>
          </div>
        </div>
    </section>

    {/*Last chance*/}
    <section className="py-16 px-8 bg-cover bg-center">
        <div className="max-w-6xl mx-auto">
          {/* Tiêu đề */}
          <h1 className="text-center text-[32px] font-[600] text-[#C3937C] mb-8">
            Last Chance
          </h1>
          <Swiper
            spaceBetween={20}
            slidesPerView={'auto'}
            grabCursor={true}
          >
            {cardsLastChance.map((card, index) => (
              <SwiperSlide key={index} style={{ width: '300px' }}>
                <DressCard {...card} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
    </section>

    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-8">
          What Our Customers Are Saying
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              &larr;
            </button>

            <div className="flex-1 text-center">
              <div className="max-w-2xl mx-auto">
                <p className="text-gray-600 text-lg mb-2 min-h-[160px] flex flex-col items-center justify-center">
                  {displayedFeedback}
                  {isLongFeedback && (
                    <span
                      onClick={() => setReadMore((prev) => !prev)}
                      className="text-blue-500 cursor-pointer mt-2"
                    >
                      {readMore ? "Read less" : "Read more"}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 object-cover rounded-full mb-2"
                />
                <p className="font-semibold text-gray-800">{name}</p>
              </div>
            </div>

            <button
              onClick={nextTestimonial}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <FAQSection/>

    <footer className="bg-[#EAD9C9]">
      <div className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img className="w-1/5 h-auto" src={logo} alt="Enchanted Weddings Logo" />
        </div>

        {/* Nội dung chính */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          {/* 4 cột (text-left) */}
          <div className="grid grid-cols-2 md:grid-cols-4 ml-20 gap-4">
            <div className="text-left">
              <h3 className="font-semibold mb-4 text-gray-800">The Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className='cursor-pointer hover:text-[#6164bc]'>How it works</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>FAQ</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Our cleansing process</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Professional consultation</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Personalized dress for you</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Return policy</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Customize your dress size</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-4 text-gray-800">The Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className='cursor-pointer hover:text-[#6164bc]'>Privacy policy</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Personal information</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Terms of service</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Contact us</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Community</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-4 text-gray-800">About us</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className='cursor-pointer hover:text-[#6164bc]'>Our story</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Sustainability</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Careers</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="font-semibold mb-4 text-gray-800">Supports</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className='cursor-pointer hover:text-[#6164bc]'>Email us</li>
                <li className='cursor-pointer hover:text-[#6164bc]'>Help and contact</li>
              </ul>
            </div>
          </div>

          {/* 3 khối bên phải (ta có thể để text-left hoặc text-center) */}
          <div className=" flex flex-col items-start gap-8 md:flex-row md:items-center lg:flex-col lg:items-start justify-center">
            <div className="text-left">
              <h4 className="font-semibold mb-4 text-[#000000]">Mobile app</h4>
              <button className="bg-[#C3937C] px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2">
                <img src="icon9.png" alt="AppleIcon"/>
                <span className='text-[#FFFFFF] text-[16px]'>Download on the</span>
                <span className='text-[#FFFFFF] text-[16px] font-[600]'>App Store</span>
              </button>
            </div>

            <div className="text-left">
              <h4 className="font-semibold mb-4 text-gray-800">Get 5% off</h4>
              <button className="bg-[#C3937C] text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200 text-sm">
                Subscribe Now
              </button>
            </div>

            <div className="text-left">
              <h4 className="font-semibold mb-4 text-gray-800">
                Stay connected with
              </h4>
              <div className="flex items-center gap-3">
                <img src="icon10.png" alt="AppleIcon"/>
                <img src="icon11.png" alt="AppleIcon"/>
                <img src="icon12.png" alt="AppleIcon"/>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Copyright © 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Home;
