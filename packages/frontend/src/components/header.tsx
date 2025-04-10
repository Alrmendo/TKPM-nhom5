import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/LOGO.svg';
import profileIcon from '../assets/profile.svg';
import searchIcon from '../assets/search.svg';
import cartIcon from '../assets/cart.svg';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DropdownPanel from './dropDownPanel';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  isSticky?: boolean;
}

const Header: React.FC<NavigationProps> = ({ isSticky = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuth();

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
    // Close any active dropdowns when toggling mobile menu
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown: string): void => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const goToSearchPage = (): void => {
    navigate('/search');
  };
  
  const goToProfilePage = (): void => {
    if (isAuthenticated) {
      if (role === 'admin') {
        navigate('/admin/measurement');
      } else {
        navigate('/profile', { replace: false });
      }
    } else {
      navigate('/signin');
    }
  };

  const goToHomePage = (): void => {
    navigate('/');
  };

  const goToCartPage = (): void => {
    navigate('/cart');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Category dropdown content
  const categoryItems: string[] = [
    'Wedding dress',
    'Wedding guest',
    'Formal & evening',
    'Groom Dresses',
    'BridesMaid Dresses',
    'Cocktail Dress',
  ];

  // Services dropdown content (example)
  const servicesItems: string[] = [
    'Wedding Planning',
    'Photography',
    'Venue Booking',
    'Catering Services',
    'Decoration',
    'Wedding Cars',
  ];

  return (
    <>
      <nav
        className={`flex flex-col z-50 ${isSticky ? 'sticky top-0' : ''} px-4 md:px-8 py-4`}
        ref={navRef}
      >
        <div className="flex items-center justify-between w-full">
          <img
            className="w-[80px] md:w-1/5 h-[80px]"
            src={logo}
            alt="Enchanted Weddings Logo"
          />

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 flex-wrap items-center justify-between bg-[#fdfcf9] border border-[#EAEAEA] rounded-lg ml-8 px-4 py-2 relative">
            <div></div>
            {/* Điều chỉnh gap khi ở kích thước màn hình khác nhau */}
            <ul className="flex flex-wrap items-center gap-3 xl:gap-20 lg:gap-10 md:gap-6">
              <li
                className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base"
                onClick={goToHomePage}
              >
                Home
              </li>
              <li
                className="flex items-center text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base relative"
                onClick={() => toggleDropdown('category')}
              >
                <span>Category</span>
                {activeDropdown === 'category' ? (
                  <ChevronUp className="ml-1 w-4 h-4" />
                ) : (
                  <ChevronDown className="ml-1 w-4 h-4" />
                )}

                {/* Category dropdown panel for desktop */}
                {activeDropdown === 'category' && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
                    <DropdownPanel
                      items={categoryItems}
                      imageUrl="./pic16.jpg"
                      altText="Category image"
                      onItemClick={(item) => {
                        if (item === 'Wedding dress') {
                          navigate('/pcp');
                        }
                        setActiveDropdown(null);
                      }}
                    />
                  </div>
                )}
              </li>
              <li
                className="flex items-center text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base relative"
                onClick={() => toggleDropdown('services')}
              >
                <span>Services</span>
                {activeDropdown === 'services' ? (
                  <ChevronUp className="ml-1 w-4 h-4" />
                ) : (
                  <ChevronDown className="ml-1 w-4 h-4" />
                )}

                {/* Services dropdown panel for desktop */}
                {activeDropdown === 'services' && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50">
                    <DropdownPanel
                      items={servicesItems}
                      imageUrl="./pic16.jpg"
                      altText="Services image"
                    />
                  </div>
                )}
              </li>
              <li
                className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base"
                onClick={() => navigate('/about')}
              >
                About
              </li>
              <li className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base">
                Blog
              </li>
              <li
                className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer text-sm lg:text-base"
                onClick={() => navigate('/contact')}
              >
                Contact
              </li>
            </ul>

            <div className="flex items-center gap-2 lg:gap-4">
              <img
                className="w-5 h-8 cursor-pointer"
                src={searchIcon}
                alt="Search Icon"
                onClick={goToSearchPage}
              />
              <img
                className="w-4 h-8 cursor-pointer lg:w-5"
                src={profileIcon}
                alt="Profile Icon"
                onClick={goToProfilePage}
              />
              <img
                className="w-5 h-8 cursor-pointer"
                src={cartIcon}
                alt="Cart Icon"
                onClick={goToCartPage}
              />
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-[#C3937C] transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-[#C3937C] transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-[#C3937C] transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu Dropdown - Positioned Absolutely */}
        <div
          className={`md:hidden absolute top-25 left-0 right-0 bg-[#fdfcf9] border border-[#EAEAEA] rounded-lg mt-2 shadow-lg transition-all duration-300 overflow-hidden z-50 ${
            isMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
          } mx-4`}
        >
          {/* Icons at the top */}
          <div className="flex items-center justify-center gap-8 py-4 border-b border-[#EAEAEA]">
            <img
              className="w-6 h-8 cursor-pointer"
              src={searchIcon}
              alt="Search Icon"
              onClick={() => {
                goToSearchPage();
                setIsMenuOpen(false);
              }}
            />
            <img
              className="w-5 h-8 cursor-pointer"
              src={profileIcon}
              alt="Profile Icon"
            />
            <img
              className="w-6 h-8 cursor-pointer"
              src={cartIcon}
              alt="Cart Icon"
              onClick={() => navigate('/cart')}
            />
          </div>

          {/* Navigation links for mobile */}
          <ul className="flex flex-col items-center py-4">
            <li
              className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3 w-full text-center 
                          active:bg-[#f8f1e8] transition-colors duration-200"
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
            >
              Home
            </li>

            {/* Category dropdown for mobile */}
            <li className="w-full">
              <div
                className="flex items-center justify-center text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3
                          active:bg-[#f8f1e8] transition-colors duration-200"
                onClick={() => toggleDropdown('category-mobile')}
              >
                <span>Category</span>
                {activeDropdown === 'category-mobile' ? (
                  <ChevronUp className="ml-1 w-4 h-4" />
                ) : (
                  <ChevronDown className="ml-1 w-4 h-4" />
                )}
              </div>

              {/* Mobile Category dropdown content */}
              {activeDropdown === 'category-mobile' && (
                <div className="px-4 py-2 bg-white rounded-lg mt-1 mb-2 shadow-inner mx-4">
                  <DropdownPanel
                    items={categoryItems}
                    imageUrl="./pic14.jpg"
                    altText="Category image"
                    isMobile={true}
                    onItemClick={(item) => {
                      if (item === 'Wedding dress') {
                        navigate('/pcp');
                      }
                      setIsMenuOpen(false);
                      setActiveDropdown(null);
                    }}
                  />
                </div>
              )}
            </li>

            {/* Services dropdown for mobile */}
            <li className="w-full">
              <div
                className="flex items-center justify-center text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3
                          active:bg-[#f8f1e8] transition-colors duration-200"
                onClick={() => toggleDropdown('services-mobile')}
              >
                <span>Services</span>
                {activeDropdown === 'services-mobile' ? (
                  <ChevronUp className="ml-1 w-4 h-4" />
                ) : (
                  <ChevronDown className="ml-1 w-4 h-4" />
                )}
              </div>

              {/* Mobile Services dropdown content */}
              {activeDropdown === 'services-mobile' && (
                <div className="px-4 py-2 bg-white rounded-lg mt-1 mb-2 shadow-inner mx-4">
                  <DropdownPanel
                    items={servicesItems}
                    imageUrl="./pic14.jpg"
                    altText="Services image"
                    isMobile={true}
                  />
                </div>
              )}
            </li>

            <li
              className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3 w-full text-center
                          active:bg-[#f8f1e8] transition-colors duration-200"
            >
              About
            </li>
            <li
              className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3 w-full text-center
                          active:bg-[#f8f1e8] transition-colors duration-200"
            >
              Blog
            </li>
            <li
              className="text-[#C3937C] hover:text-[#6164bc] cursor-pointer py-3 w-full text-center
                          active:bg-[#f8f1e8] transition-colors duration-200"
              onClick={() => {
                navigate('/contact');
                setIsMenuOpen(false);
              }}
            >
              Contact
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
