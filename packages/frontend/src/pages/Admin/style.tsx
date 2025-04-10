import { useState, useRef, useEffect } from "react"
import { Star, Plus, Minus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

interface DressCardProps {
  image: string;
  rating: number;
  status: string;
  name: string;
  designer: string;
  price: number;
  thumbnails: number[];
}

interface OpenSections {
  style: boolean;
  colors: boolean;
  price: boolean;
  size: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

interface DraggingRef {
  left: boolean;
  right: boolean;
}

export default function WeddingDressRental() {
  const navigate = useNavigate()
  const { clearCookie } = useAuth()

  // State for active tab
  const [activeTab, setActiveTab] = useState("Style")

  // State for active sidebar item
  const [activeSidebarItem, setActiveSidebarItem] = useState("Order")

  // State for open/closed filter sections
  const [openSections, setOpenSections] = useState<OpenSections>({
    style: true,
    colors: true,
    price: true,
    size: true,
  })

  // State for price slider
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 250, max: 650 })
  const sliderRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef<DraggingRef>({ left: false, right: false })

  // Toggle section open/closed
  const toggleSection = (section: keyof OpenSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Handle mouse down on slider handles
  const handleMouseDown = (e: React.MouseEvent, handle: keyof DraggingRef) => {
    e.preventDefault()
    isDraggingRef.current[handle] = true
    document.addEventListener("mousemove", handleMouseMove as EventListener)
    document.addEventListener("mouseup", handleMouseUp as EventListener)
  }

  // Handle mouse move for slider
  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!sliderRef.current) return

    const sliderRect = sliderRef.current.getBoundingClientRect()
    const sliderWidth = sliderRect.width
    const offsetX = e.clientX - sliderRect.left

    // Calculate percentage (0-100)
    const percentage = Math.max(0, Math.min(100, (offsetX / sliderWidth) * 100))

    // Calculate price value (0-6500)
    const price = Math.round((percentage / 100) * 6500)

    if (isDraggingRef.current.left) {
      // Ensure min doesn't exceed max
      const newMin = Math.min(price, priceRange.max - 50)
      setPriceRange((prev) => ({ ...prev, min: newMin }))
    } else if (isDraggingRef.current.right) {
      // Ensure max doesn't go below min
      const newMax = Math.max(price, priceRange.min + 50)
      setPriceRange((prev) => ({ ...prev, max: newMax }))
    }
  }

  // Handle mouse up for slider
  const handleMouseUp = () => {
    isDraggingRef.current = { left: false, right: false }
    document.removeEventListener("mousemove", handleMouseMove as EventListener)
    document.removeEventListener("mouseup", handleMouseUp as EventListener)
  }

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove as EventListener)
      document.removeEventListener("mouseup", handleMouseUp as EventListener)
    }
  }, [])

  // Sidebar items data
  const sidebarItems = [
    {
      name: "Order",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      ),
    },
    {
      name: "Current orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      name: "Calender",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      ),
    },
    {
      name: "Customer list",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      name: "Statistics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      name: "Settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ]

  // Tabs data
  const tabs = ["Basic measurements", "Style", "Photography", "Deliver", "Contact", "Dresses"]

  // Handle tab click
  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    if (tab === "Style") {
      navigate("/admin/style")
    } else if (tab === "Basic measurements") {
      navigate("/admin/measurement")
    } else if (tab === "Photography") {
      navigate("/admin/photography")
    } else if (tab === "Deliver") {
      navigate("/admin/deliver")
    } else if (tab === "Contact") {
      navigate("/admin/contact")
    } else if (tab === "Dresses") {
      navigate("/admin/dresses")
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await clearCookie()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-[220px] bg-[#fbf8f1] border-r border-[#ededed] flex flex-col">
        <div className="flex flex-col items-center py-8">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
            <img src="/placeholder.svg?height=96&width=96" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-medium text-[#0c0c0c]">Anjela Mattuew</h3>
        </div>

        <div className="border-t border-[#ededed] my-2 mx-4"></div>

        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-4">
            {sidebarItems.map((item) => (
              <li
                key={item.name}
                className={`flex items-center ${activeSidebarItem === item.name ? "text-[#db5c1f]" : "text-[#606060]"} 
                  hover:text-[#db5c1f] transition-colors cursor-pointer`}
                onClick={() => setActiveSidebarItem(item.name)}
              >
                <span className="w-6 h-6 mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-4 py-6">
          <button 
            className="flex items-center text-[#c30000] font-medium hover:text-[#ff0000] transition-colors"
            onClick={handleLogout}
          >
            <span className="w-6 h-6 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-md p-1 flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  activeTab === tab ? "bg-[#c3937c] text-white" : "text-[#868686] hover:bg-[#f8f8f8]"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#eaeaea] flex-1 overflow-hidden flex flex-col">
          <h2 className="font-medium mb-6">CATEGORIES</h2>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Style Filter */}
            <div className="space-y-3">
              <div
                className="flex items-center justify-between bg-[#f8f8f8] rounded-lg p-4 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                onClick={() => toggleSection("style")}
              >
                <span>Style</span>
                <span>{openSections.style ? <Minus size={16} /> : <Plus size={16} />}</span>
              </div>
              {openSections.style && (
                <div className="pl-4 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" defaultChecked />
                    <span className="text-sm">Dress for Moms</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">Wedding Guest</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">Short Tie</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">Cocktail</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">Prom</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">Formal & Evening</span>
                  </label>
                </div>
              )}
            </div>

            {/* Colors Filter */}
            <div className="space-y-3">
              <div
                className="flex items-center justify-between bg-[#f8f8f8] rounded-lg p-4 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                onClick={() => toggleSection("colors")}
              >
                <span>Colors</span>
                <span>{openSections.colors ? <Minus size={16} /> : <Plus size={16} />}</span>
              </div>
              {openSections.colors && (
                <div className="pl-4 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                    <span className="text-sm">White</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    <span className="text-sm">Gray</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <div className="w-4 h-4 rounded-full bg-[#bcb7a5]"></div>
                    <span className="text-sm">Bej</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <div className="w-4 h-4 rounded-full bg-[#f1d22e]"></div>
                    <span className="text-sm">Cream</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <div className="w-4 h-4 rounded-full bg-[#f294f4]"></div>
                    <span className="text-sm">Pink</span>
                  </label>
                </div>
              )}
            </div>

            {/* Rental Price Filter */}
            <div className="space-y-3">
              <div
                className="flex items-center justify-between bg-[#f8f8f8] rounded-lg p-4 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                onClick={() => toggleSection("price")}
              >
                <span>Rental Price</span>
                <span>{openSections.price ? <Minus size={16} /> : <Plus size={16} />}</span>
              </div>
              {openSections.price && (
                <div className="pl-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-10 border border-[#eaeaea] rounded-lg flex items-center justify-center bg-white">
                      <span>{priceRange.min}$</span>
                    </div>
                    <span>to</span>
                    <div className="w-20 h-10 border border-[#eaeaea] rounded-lg flex items-center justify-center bg-white">
                      <span>{priceRange.max}$</span>
                    </div>
                  </div>
                  <div ref={sliderRef} className="relative w-full h-2 bg-[#eaeaea] rounded-full cursor-pointer">
                    <div
                      className="absolute top-0 left-0 h-2 bg-[#c3937c] rounded-full"
                      style={{
                        left: `${(priceRange.min / 6500) * 100}%`,
                        width: `${((priceRange.max - priceRange.min) / 6500) * 100}%`,
                      }}
                    ></div>
                    <div
                      className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[#c3937c] rounded-full -translate-y-1/2 cursor-grab active:cursor-grabbing"
                      style={{ left: `${(priceRange.min / 6500) * 100}%` }}
                      onMouseDown={(e) => handleMouseDown(e, "left")}
                    ></div>
                    <div
                      className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[#c3937c] rounded-full -translate-y-1/2 cursor-grab active:cursor-grabbing"
                      style={{ left: `${(priceRange.max / 6500) * 100}%` }}
                      onMouseDown={(e) => handleMouseDown(e, "right")}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-[#868686]">
                    <span>0</span>
                    <span>6,500</span>
                  </div>
                </div>
              )}
            </div>

            {/* Size Filter */}
            <div className="space-y-3">
              <div
                className="flex items-center justify-between bg-[#f8f8f8] rounded-lg p-4 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
                onClick={() => toggleSection("size")}
              >
                <span>Size</span>
                <span>{openSections.size ? <Minus size={16} /> : <Plus size={16} />}</span>
              </div>
              {openSections.size && (
                <div className="pl-4 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">XS</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">S</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">M</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">L</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">XL</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#c3937c]" />
                    <span className="text-sm">XXL</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Dress Cards */}
          <div className="h-[600px] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DressCard
                image="/placeholder.svg"
                rating={4.7}
                status="Almost Booked"
                name="V-Neck"
                designer="Inspire"
                price={250}
                thumbnails={[1, 2, 3]}
              />

              <DressCard
                image="/placeholder.svg"
                rating={4.4}
                status="Available"
                name="Ivory"
                designer="Flora"
                price={450}
                thumbnails={[1, 2, 3]}
              />

              <DressCard
                image="/placeholder.svg"
                rating={4.8}
                status="Available"
                name="Oleg"
                designer="Cassini"
                price={420}
                thumbnails={[1, 2, 3]}
              />

              <DressCard
                image="/placeholder.svg"
                rating={4.7}
                status="The Most Rented"
                name="Elegant Lace"
                designer="Vera Wang"
                price={550}
                thumbnails={[1, 2, 3]}
              />

              <DressCard
                image="/placeholder.svg"
                rating={4.9}
                status="Last Promotion"
                name="Mermaid Style"
                designer="Pronovias"
                price={480}
                thumbnails={[1, 2, 3]}
              />

              <DressCard
                image="/placeholder.svg"
                rating={4.7}
                status="Available"
                name="Princess Cut"
                designer="Monique Lhuillier"
                price={600}
                thumbnails={[1, 2, 3]}
              />

              <DressCard
                image="/placeholder.svg"
                rating={4.6}
                status="Almost Booked"
                name="Ball Gown"
                designer="Elie Saab"
                price={520}
                thumbnails={[1, 2, 3]}
              />

              <DressCard
                image="/placeholder.svg"
                rating={4.8}
                status="Available"
                name="A-Line"
                designer="Oscar de la Renta"
                price={490}
                thumbnails={[1, 2, 3]}
              />

              <DressCard
                image="/placeholder.svg"
                rating={4.5}
                status="Available"
                name="Sheath"
                designer="Carolina Herrera"
                price={470}
                thumbnails={[1, 2, 3]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DressCard({ image, rating, status, name, designer, price, thumbnails }: DressCardProps) {
  const getStatusColor = (status: string): string => {
    if (status === "Available") return "bg-[#6de588]"
    if (status === "Almost Booked") return "bg-[#f4b740]"
    if (status === "The Most Rented") return "bg-[#f4b740]"
    if (status === "Last Promotion") return "bg-[#ed2e2e]"
    return "bg-[#6de588]"
  }

  return (
    <div className="bg-[#f0e6ff] rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={name || "Wedding dress"}
          className="w-full h-80 object-cover"
        />

        {/* Rating */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/80 rounded-full px-2 py-1">
          <span>{rating}</span>
          <Star className="w-4 h-4 fill-[#f4b740] text-[#f4b740]" />
        </div>

        {/* Status */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/80 rounded-full px-2 py-1">
          <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></span>
          <span className="text-xs">{status}</span>
        </div>

        {/* Thumbnails */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {thumbnails.map((_: number, i: number) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-[#c3937c]/80 flex items-center justify-center text-white text-xs"
            >
              {i === 2 ? "+3" : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-[#868686]">{designer}</p>
        </div>
        {price > 0 && (
          <div className="text-right">
            <p className="text-[#db5c1f] font-medium">${price}</p>
            <p className="text-xs text-[#868686]">/Per Day</p>
          </div>
        )}
      </div>
    </div>
  )
}

