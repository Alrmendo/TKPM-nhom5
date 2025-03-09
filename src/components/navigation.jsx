import React, { useState } from 'react';
import logo from '../assets/LOGO.svg';
import profileIcon from '../assets/profile.svg';
import searchIcon from '../assets/search.svg';
import cartIcon from '../assets/cart.svg';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex flex-col z-10 px-4 md:px-8 py-4 relative">
      <div className="flex items-center justify-between w-full">
        <img className="w-32 md:w-1/5 h-auto" src={logo} alt="Enchanted Weddings Logo" />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 flex-wrap items-center justify-between bg-[#fdfcf9] border border-[#EAEAEA] rounded-lg ml-8 px-4 py-2">
          <div></div>
          {/* Điều chỉnh gap khi ở kích thước màn hình khác nhau */}
          <ul className="flex flex-wrap items-center gap-3 xl:gap-20 lg:gap-10 md:gap-6">
            <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base">Home</li>
            <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base">Category</li>
            <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base">Services</li>
            <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base">About</li>
            <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base">Blog</li>
            <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base">Contact</li>
          </ul>
          {/* Giảm khoảng cách giữa các icon khi màn hình hẹp hơn */}
          <div className="flex items-center gap-2 lg:gap-4">
            <img className="w-5 h-8 cursor-pointer" src={searchIcon} alt="Search Icon" />
            <img className="w-4 h-8 cursor-pointer lg:w-5" src={profileIcon} alt="Profile Icon" />
            <img className="w-5 h-8 cursor-pointer" src={cartIcon} alt="Cart Icon" />
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-[#C3937C] transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-[#C3937C] transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-[#C3937C] transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown - Positioned Absolutely */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-[#fdfcf9] border border-[#EAEAEA] rounded-lg mt-2 shadow-lg transition-all duration-300 overflow-hidden z-50 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } mx-4`}
      >
        {/* Icons at the top */}
        <div className="flex items-center justify-center gap-8 py-4 border-b border-[#EAEAEA]">
          <img className="w-6 h-8 cursor-pointer" src={searchIcon} alt="Search Icon" />
          <img className="w-5 h-8 cursor-pointer" src={profileIcon} alt="Profile Icon" />
          <img className="w-6 h-8 cursor-pointer" src={cartIcon} alt="Cart Icon" />
        </div>
        
        {/* Navigation links */}
        <ul className="flex flex-col items-center py-4">
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3">Home</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3">Category</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3">Services</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3">About</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3">Blog</li>
          <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3">Contact</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;