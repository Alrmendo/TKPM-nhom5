import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function WeddingDressRental() {
  const navigate = useNavigate()
  const { clearCookie } = useAuth()

  // State for active tab
  const [activeTab, setActiveTab] = useState("Contact")

  // State for active sidebar item
  const [activeSidebarItem, setActiveSidebarItem] = useState("Order")

  // State for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    note: "",
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
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

  // Secondary tabs data
  // const secondaryTabs = ["Photography", "Wedding Dress"]

  // Calendar data
  // const calendarData = {
  //   months: ["July 2024", "August 2024", "September 2024"],
  //   days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  //   dates: [
  //     // July dates (last week)
  //     ["29", "30", "31", "1", "2", "3", "4"],
  //     // August dates (first 4 weeks)
  //     ["5", "6", "7", "8", "9", "10", "11"],
  //     ["12", "13", "14", "15", "16", "17", "18"],
  //     ["19", "20", "21", "22", "23", "24", "25"],
  //     ["26", "27", "28", "29", "30", "31", "1"],
  //   ],
  // }

  // Handle date selection
  // const handleDateSelect = (appointmentType, date) => {
  //   setSelectedDates((prev) => ({
  //     ...prev,
  //     [appointmentType]: date,
  //   }))
  // }

  // Handle time selection
  // const handleTimeChange = (appointmentType, field, value) => {
  //   setSelectedTimes((prev) => ({
  //     ...prev,
  //     [appointmentType]: {
  //       ...prev[appointmentType],
  //       [field]: value,
  //     },
  //   }))
  // }

  // Handle month change
  // const handleMonthChange = (appointmentType, month) => {
  //   setActiveMonth((prev) => ({
  //     ...prev,
  //     [appointmentType]: month,
  //   }))
  // }

  // Handle tab click with navigation
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
      <div className="flex-1 p-6 flex flex-col h-screen">
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

        {/* Contact Form */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#eaeaea] flex-1">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <h2 className="text-lg font-normal mb-8">Fill in the following information.</h2>

            {/* Profile Section */}
            <div className="mb-8">
              <h3 className="text-[#c3937c] font-medium mb-4">Profile</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm mb-2">First name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Ex: Anjela"
                    className="w-full px-4 py-3 rounded-lg border border-[#ededed] focus:outline-none focus:border-[#c3937c]"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm mb-2">Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Ex: Mattuew"
                    className="w-full px-4 py-3 rounded-lg border border-[#ededed] focus:outline-none focus:border-[#c3937c]"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Email */}
                <div>
                  <label className="block text-sm mb-2">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ex: Anjela.mw85@gmail.com"
                    className="w-full px-4 py-3 rounded-lg border border-[#ededed] focus:outline-none focus:border-[#c3937c]"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm mb-2">Phone number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Ex: 246-094-5746"
                    className="w-full px-4 py-3 rounded-lg border border-[#ededed] focus:outline-none focus:border-[#c3937c]"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="mb-6">
                <label className="block text-sm mb-2">Date of birth</label>
                <input
                  type="text"
                  name="dateOfBirth"
                  placeholder="dd/mm/yyyy"
                  className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-[#ededed] focus:outline-none focus:border-[#c3937c]"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Note Section */}
            <div className="mb-8">
              <h3 className="text-[#c3937c] font-medium mb-4">Note</h3>
              <textarea
                name="note"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-[#ededed] focus:outline-none focus:border-[#c3937c] resize-none"
                value={formData.note}
                onChange={handleInputChange}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#fbf8f1] hover:bg-[#f5efe3] text-[#c3937c] px-6 py-3 rounded-full transition-colors"
              >
                <span>Create</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}