import { Search, User, ShoppingCart } from 'lucide-react';
import logo from '../assets/LOGO.svg';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="border-b border-[#eaeaea] py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex-1">
          <Link to="/">
            <img src={logo} alt="Enchanted Weddings" className="h-16 w-auto" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center justify-center flex-1">
          <ul className="flex space-x-8">
            <li>
              <Link to="/" className="text-[#b19e8d] hover:text-[#c3937c]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-[#b19e8d] hover:text-[#c3937c]">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-[#b19e8d] hover:text-[#c3937c]">
                Services
              </Link>
            </li>
            <li>
              <Link to="/blog" className="text-[#b19e8d] hover:text-[#c3937c]">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-[#b19e8d] hover:text-[#c3937c]">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center space-x-4 flex-1 justify-end">
          <button className="text-[#606060] hover:text-[#c3937c] relative">
            <User className="h-5 w-5" />
          </button>
          <button className="text-[#606060] hover:text-[#c3937c] relative">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-[#606060] hover:text-[#c3937c] relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-[#c3937c] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
          </button>
        </div>
      </div>
    </header>
  );
}
