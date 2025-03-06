import { ChevronRight, Plus, Search, ShoppingCart, User } from 'lucide-react';

export default function WeddingDressPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="w-full bg-[#fbf8f1] text-[#c3937c] text-center py-3">25% discount for your first order!</div>

      {/* Header */}
      <header className="bg-white py-4 px-6 border-b border-[#ead9c9]">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-shrink-0">
            <img src="/placeholder.svg?height=60&width=180" alt="Enchanted Wildness" width={180} height={60} className="h-12 w-auto" />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-[#c3937c] hover:text-[#c3937c]">
              Home
            </a>
            <a href="#" className="text-[#606060] hover:text-[#c3937c]">
              Category
            </a>
            <a href="#" className="text-[#606060] hover:text-[#c3937c]">
              Services
            </a>
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

      {/* Search Bar */}
      <div className="border-b border-[#ead9c9] py-4">
        <div className="container mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c3937c] h-4 w-4" />
            <input type="text" placeholder="Mermaid Dress" className="w-full md:w-96 pl-10 pr-4 py-2 border-b border-[#c3937c] focus:outline-none text-[#606060]" />
          </div>
        </div>
      </div>

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

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Simplified */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-4">
            <button className="w-full flex items-center justify-between px-5 py-3 border border-[#ead9c9] rounded-full text-[#606060]">
              <span>Style</span>
              <Plus className="h-4 w-4" />
            </button>

            <button className="w-full flex items-center justify-between px-5 py-3 border border-[#ead9c9] rounded-full text-[#606060]">
              <span>Rental Price</span>
              <Plus className="h-4 w-4" />
            </button>

            <button className="w-full flex items-center justify-between px-5 py-3 border border-[#ead9c9] rounded-full text-[#606060]">
              <span>Colors</span>
              <Plus className="h-4 w-4" />
            </button>

            <button className="w-full flex items-center justify-between px-5 py-3 border border-[#ead9c9] rounded-full text-[#606060]">
              <span>Size</span>
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Products Grid */}
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Card 1 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=500&width=400" alt="Strapless Wedding Dress" width={400} height={500} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">5</span>
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
                      <p className="text-sm text-[#606060]">Azalia</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $550 <span className="text-xs font-normal">/Per Day</span>
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
                  <img src="/placeholder.svg?height=500&width=400" alt="Strapless Wedding Dress" width={400} height={500} className="w-full h-auto" />
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
                      <p className="text-sm text-[#606060]">Alin</p>
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

              {/* Product Card 3 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=500&width=400" alt="Strapless Wedding Dress" width={400} height={500} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.5</span>
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
                      <p className="text-sm text-[#606060]">Bella</p>
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

              {/* Product Card 4 */}
              <div className="bg-[#f2eaff] rounded-lg overflow-hidden">
                <div className="relative">
                  <img src="/placeholder.svg?height=500&width=400" alt="Strapless Wedding Dress" width={400} height={500} className="w-full h-auto" />
                  <div className="absolute top-2 left-2 flex items-center space-x-1">
                    <span className="text-[#606060] font-medium">4.8</span>
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
                      <p className="text-sm text-[#606060]">Wender</p>
                    </div>
                    <div className="text-[#5201ff] font-semibold">
                      $600 <span className="text-xs font-normal">/Per Day</span>
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
          </div>
        </div>
      </main>
    </div>
  );
}
