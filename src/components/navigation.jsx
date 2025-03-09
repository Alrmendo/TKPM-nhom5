// src/components/Navigation.jsx
import React from 'react';
import logo from '../assets/LOGO.svg'; // Điều chỉnh đường dẫn nếu cần
import profileIcon from '../assets/profile.svg';
import searchIcon from '../assets/search.svg';
import cartIcon from '../assets/cart.svg';

const Navigation = () => {
  return (
    <nav className="flex z-10 items-center justify-start px-8 py-4 space-x-20 w-10/11">
      <img className="w-1/5 h-auto" src={logo} alt="Enchanted Weddings Logo" />

      {/* Container chứa menu và icon */}
      <div className="flex flex-1 items-center gap-x-70 bg-[#fdfcf9] border border-[#EAEAEA] w-3/5 sm:w-2/5 md:w-2/5 h-[50px] rounded-lg">
        {/* Cột bên trái (có thể để trống hoặc thêm logo nhỏ) */}
        <div></div>
        {/* Cột giữa: Menu */}
        <ul className="flex flex-grow space-x-8">
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">Home</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">About</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">Services</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">Blog</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer">Contact</li>
        </ul>
        {/* Cột bên phải: Icon */}
        <div className="flex items-center space-x-4 ml-4 mr-4">
          <img className="w-6 h-8 cursor-pointer" src={searchIcon} alt="Search Icon" />
          <img className="w-5 h-8 cursor-pointer" src={profileIcon} alt="Profile Icon" />
          <img className="w-6 h-8 cursor-pointer" src={cartIcon} alt="Cart Icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
