import { ChevronDown, ChevronRight, Search, ShoppingCart, User } from 'lucide-react';
import Footer from '../../components/footer';
import logo from '../../assets/LOGO.svg';

export default function PCP() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fbf8f1]">
      {/* Announcement Bar */}
      <div className="w-full bg-[#fbf8f1] text-[#c3937c] text-center py-3 border-b border-[#ead9c9]">25% discount for your first order!</div>

      {/* Header */}
      <header className="bg-white py-4 px-6 border-b border-[#ead9c9]">
        <div className="container mx-auto flex items-center justify-between">
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-[#606060] hover:text-[#c3937c]">
              Home
            </a>
            <a href="#" className="text-[#606060] hover:text-[#c3937c]">
              Category
            </a>
            <a href="#" className="text-[#606060] hover:text-[#c3937c]">
              Services
            </a>
          </nav>

          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img src={logo} alt="Enchanted Wildness" className="h-16 w-auto" />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-[#606060] hover:text-[#c3937c]">
              About
            </a>
            <a href="#" className="text-[#606060] hover:text-[#c3937c]">
              Blog
            </a>
            <a href="#" className="text-[#606060] hover:text-[#c3937c]">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-[#606060] hover:text-[#c3937c]">
              <Search className="h-5 w-5" />
            </button>
            <button className="text-[#606060] hover:text-[#c3937c]">
              <User className="h-5 w-5" />
            </button>
            <button className="text-[#606060] hover:text-[#c3937c] relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-[#c3937c] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-4">
          <a href="#" className="text-[#c3937c]">
            Category
          </a>
          <ChevronRight className="h-4 w-4 mx-1 text-[#adadad]" />
          <span className="text-[#606060]">Wedding Dress</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold text-[#0c0c0c] mb-6">Wedding Dress</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            {/* Style Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-[#0c0c0c]">Style</h3>
                <ChevronDown className="h-4 w-4 text-[#606060]" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Dress for Moms</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Wedding Guest</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Short Tie</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Cocktail</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Prom</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Formal & Evening</span>
                </label>
              </div>
            </div>

            {/* Rental Price Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-[#0c0c0c]">Rental Price</h3>
                <ChevronDown className="h-4 w-4 text-[#606060]" />
              </div>
              <div className="px-1">
                <div className="flex justify-between text-sm text-[#606060] mb-2">
                  <span>250$</span>
                  <span>to</span>
                  <span>650$</span>
                </div>
                <div className="relative h-1 bg-[#ededed] rounded-full mb-4">
                  <div className="absolute left-0 right-0 h-1 bg-[#c3937c] rounded-full" style={{ left: '20%', right: '20%' }}></div>
                  <div className="absolute w-4 h-4 bg-white border-2 border-[#c3937c] rounded-full -mt-1.5" style={{ left: '20%' }}></div>
                  <div className="absolute w-4 h-4 bg-white border-2 border-[#c3937c] rounded-full -mt-1.5" style={{ right: '20%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-[#adadad]">
                  <span>0</span>
                  <span>6,500</span>
                </div>
              </div>
            </div>

            {/* Colors Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-[#0c0c0c]">Colors</h3>
                <ChevronDown className="h-4 w-4 text-[#606060]" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">White</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Gray</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Beige</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Cream</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">Pink</span>
                </label>
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-[#0c0c0c]">Size</h3>
                <ChevronDown className="h-4 w-4 text-[#606060]" />
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">XS</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">S</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">M</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">L</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">XL</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-[#c3937c] rounded border-[#adadad]" />
                  <span className="ml-2 text-[#606060]">XXL</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-grow">
            {/* Sort Controls */}
            <div className="flex justify-end mb-6">
              <div className="relative">
                <button className="flex items-center space-x-2 border border-[#dfdfdf] rounded-full px-4 py-1.5 text-sm">
                  <span>Sort by</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white border border-[#dfdfdf] rounded-lg shadow-lg z-10 hidden">
                  <div className="py-1">
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-[#fbf8f1]">
                      Best selling
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-[#fbf8f1]">
                      Price low to high
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-[#fbf8f1]">
                      Price high to low
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-[#fbf8f1]">
                      Latest model
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-[#fbf8f1]">
                      Last chance
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm hover:bg-[#fbf8f1]">
                      Clearance
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product Card 1 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="V-Neck Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.7</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">Almost Booked</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">V-Neck</h3>
                      <p className="text-sm text-[#606060]">Inspire</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $250 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#f294f4]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="Ivory Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.4</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">Available</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">Ivory</h3>
                      <p className="text-sm text-[#606060]">Flora</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $450 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#f294f4]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="Oleg Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.8</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">Available</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">Oleg</h3>
                      <p className="text-sm text-[#606060]">Cassini</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $420 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#f294f4]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 4 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="Viola Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.7</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">The Most Rented</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">Viola</h3>
                      <p className="text-sm text-[#606060]">Chain</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $400 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#f294f4]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 5 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="Strapless Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.9</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">Last Promotion</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">Strapless</h3>
                      <p className="text-sm text-[#606060]">Alia</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $400 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#f294f4]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 6 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="Sunshine Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.7</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">Available</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">Sunshine</h3>
                      <p className="text-sm text-[#606060]">Sani</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $380 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#f294f4]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 7 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="Saint Lura Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.6</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">Last Promotion</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">Saint Lura</h3>
                      <p className="text-sm text-[#606060]">Rosy</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $200 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#f294f4]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 8 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="Pelerin Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.9</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">Almost Booked</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">Pelerin</h3>
                      <p className="text-sm text-[#606060]">Satin</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $450 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#5201ff]"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Card 9 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=400&width=300" alt="Balon Wedding Dress" width={300} height={400} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.7</span>
                    <svg className="w-4 h-4 text-[#f4b740]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-2 right-2 bg-[#fbf8f1] text-[#606060] text-xs px-2 py-1 rounded-full">Available</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[#0c0c0c]">Balon</h3>
                      <p className="text-sm text-[#606060]">Orla</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $650 <span className="text-xs font-normal">/Per Day</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ead9c9]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#ffffff]"></div>
                    </button>
                    <button className="w-8 h-8 rounded-full border border-[#dfdfdf] flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#f294f4]"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-10">
              <button className="px-6 py-2 border border-[#dfdfdf] rounded-md text-[#606060] hover:bg-[#fbf8f1]">Load more</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
