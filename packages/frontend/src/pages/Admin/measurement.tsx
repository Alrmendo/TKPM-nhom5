import { Input } from "./components/input"
import { Button } from "./components/button"
import { Textarea } from "./components/textarea"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../context/AuthContext'

export default function MeasurementForm() {
  const navigate = useNavigate()
  const { clearCookie } = useAuth()
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("Basic measurements")
  
  // State for active sidebar item
  const [activeSidebarItem, setActiveSidebarItem] = useState("Order")

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

        {/* Form Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#eaeaea] flex-1 overflow-auto">
          <h2 className="text-[#292d32] text-lg mb-4">Fill in the following information.</h2>

          <div className="mb-6">
            <h3 className="text-[#c3937c] mb-4">Detailed measurements</h3>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-[#292d32] mb-2">Height</label>
                <Input type="text" placeholder="1.7 m" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Chest</label>
                <Input type="text" placeholder="35 cm" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Neck</label>
                <Input type="text" placeholder="35 cm" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Weight</label>
                <Input type="text" placeholder="52 kg" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Waist</label>
                <Input type="text" placeholder="60 cm" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Hip</label>
                <Input type="text" placeholder="35 cm" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Calf</label>
                <Input type="text" placeholder="35 cm" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Wrist</label>
                <Input type="text" placeholder="15 cm" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Thigh</label>
                <Input type="text" placeholder="55 cm" className="border-[#dfdfdf] rounded-md" />
              </div>
              <div>
                <label className="block text-[#292d32] mb-2">Upper arm</label>
                <Input type="text" placeholder="30 cm" className="border-[#dfdfdf] rounded-md" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[#c3937c] mb-4">Note</h3>
            <Textarea className="w-full h-48 border-[#dfdfdf] rounded-md" />
          </div>

          <div className="flex justify-end mt-6">
            <Button className="bg-[#fbf8f1] text-[#c3937c] hover:bg-[#f0ece5] px-6">
              Create
              <span className="ml-1">→</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

