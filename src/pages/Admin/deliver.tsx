"use client"

import { useState } from "react"
import { Clock, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

// Interfaces
interface Time {
  hour: string;
  minute: string;
  period: "AM" | "PM";
}

interface SelectedTimes {
  firstFitting: Time;
  measurement: Time;
  pickup: Time;
  return: Time;
}

interface SelectedDates {
  firstFitting: string;
  measurement: string;
  pickup: string;
  return: string;
}

interface ActiveMonth {
  firstFitting: string;
  measurement: string;
  pickup: string;
  return: string;
}

interface CalendarData {
  days: string[];
  dates: string[][];
}

interface AppointmentSectionProps {
  title: string;
  calendarData: CalendarData;
  selectedDate: string;
  selectedTime: Time;
  activeMonth: string;
  activeYear: string;
  onDateSelect: (date: string) => void;
  onTimeChange: (field: keyof Time, value: string) => void;
  onMonthChange: (month: string) => void;
  onYearChange: (year: string) => void;
  months: string[];
}

export default function WeddingDressRental() {
  const navigate = useNavigate()

  // Months array
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  // State for active tab
  const [activeTab, setActiveTab] = useState("Deliver")

  // State for active sidebar item
  const [activeSidebarItem, setActiveSidebarItem] = useState("Order")

  // State for active secondary tab
  const [activeSecondaryTab, setActiveSecondaryTab] = useState("Wedding Dress")

  // Get current date
  const currentDate = new Date()
  const currentDay = currentDate.getDate().toString()
  const currentMonth = months[currentDate.getMonth()]
  const currentYear = currentDate.getFullYear().toString()

  // State for selected dates
  const [selectedDates, setSelectedDates] = useState<SelectedDates>({
    firstFitting: currentDay,
    measurement: currentDay,
    pickup: currentDay,
    return: currentDay,
  })

  // State for selected times
  const [selectedTimes, setSelectedTimes] = useState<SelectedTimes>({
    firstFitting: { hour: "", minute: "00", period: "AM" },
    measurement: { hour: "", minute: "00", period: "AM" },
    pickup: { hour: "", minute: "00", period: "AM" },
    return: { hour: "", minute: "00", period: "AM" },
  })

  // State for active month
  const [activeMonth, setActiveMonth] = useState<ActiveMonth>({
    firstFitting: currentMonth,
    measurement: currentMonth,
    pickup: currentMonth,
    return: currentMonth,
  })

  // State for active year
  const [activeYear, setActiveYear] = useState(currentYear)

  // Calendar data
  const [calendarData, setCalendarData] = useState<CalendarData>({
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    dates: [
      ["29", "30", "31", "1", "2", "3", "4"],
      ["5", "6", "7", "8", "9", "10", "11"],
      ["12", "13", "14", "15", "16", "17", "18"],
      ["19", "20", "21", "22", "23", "24", "25"],
      ["26", "27", "28", "29", "30", "31", "1"],
    ],
  })

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
  const tabs = ["Basic measurements", "Style", "Photography", "Deliver", "Contact"]

  // Secondary tabs data
  const secondaryTabs = ["Photography", "Wedding Dress"]

  // Generate calendar data for a specific month and year
  const generateCalendarData = (month: string, year: string) => {
    const monthIndex = months.indexOf(month)
    const firstDay = new Date(parseInt(year), monthIndex, 1).getDay()
    const lastDate = new Date(parseInt(year), monthIndex + 1, 0).getDate()
    const prevMonthLastDate = new Date(parseInt(year), monthIndex, 0).getDate()

    // Generate dates array
    const dates: string[][] = []
    let currentWeek: string[] = []

    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      currentWeek.push((prevMonthLastDate - i).toString())
    }

    // Add days from current month
    for (let i = 1; i <= lastDate; i++) {
      currentWeek.push(i.toString())
      if (currentWeek.length === 7) {
        dates.push([...currentWeek])
        currentWeek = []
      }
    }

    // Add days from next month
    if (currentWeek.length > 0 && currentWeek.length < 7) {
      for (let i = 1; i <= 7 - currentWeek.length; i++) {
        currentWeek.push(i.toString())
      }
      dates.push(currentWeek)
    }

    return {
      days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
      dates
    }
  }

  // Handle date selection
  const handleDateSelect = (appointmentType: keyof SelectedDates, date: string) => {
    setSelectedDates((prev) => ({
      ...prev,
      [appointmentType]: date,
    }))
  }

  // Handle time selection
  const handleTimeChange = (appointmentType: keyof SelectedTimes, field: keyof Time, value: string) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [appointmentType]: {
        ...prev[appointmentType],
        [field]: value,
      },
    }))
  }

  // Handle month change
  const handleMonthChange = (appointmentType: keyof ActiveMonth, month: string) => {
    setActiveMonth((prev) => ({
      ...prev,
      [appointmentType]: month,
    }))
    setCalendarData(generateCalendarData(month, activeYear))
  }

  // Handle year change
  const handleYearChange = (year: string) => {
    setActiveYear(year)
    setCalendarData(generateCalendarData(activeMonth.firstFitting, year))
  }

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
    }
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
          <button className="flex items-center text-[#c30000] font-medium hover:text-[#ff0000] transition-colors">
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
        <div className="flex justify-center mb-4">
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

        {/* Secondary Tabs */}
        <div className="flex mb-4 gap-2">
          {secondaryTabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeSecondaryTab === tab
                  ? "bg-[#c3937c] text-white"
                  : "bg-[#f8f8f8] text-[#868686] hover:bg-[#eaeaea]"
              }`}
              onClick={() => setActiveSecondaryTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#eaeaea] flex-1 flex flex-col overflow-auto">
          {activeSecondaryTab === "Wedding Dress" ? (
            <>
              {/* First Fitting Appointment */}
              <AppointmentSection
                title="First Fitting Appointment"
                calendarData={calendarData}
                selectedDate={selectedDates.firstFitting}
                selectedTime={selectedTimes.firstFitting}
                activeMonth={activeMonth.firstFitting}
                activeYear={activeYear}
                onDateSelect={(date) => handleDateSelect("firstFitting", date)}
                onTimeChange={(field, value) => handleTimeChange("firstFitting", field, value)}
                onMonthChange={(month) => handleMonthChange("firstFitting", month)}
                onYearChange={handleYearChange}
                months={months}
              />

              {/* Measurement & Alteration Appointment */}
              <AppointmentSection
                title="Measurement & Alteration Appointment"
                calendarData={calendarData}
                selectedDate={selectedDates.measurement}
                selectedTime={selectedTimes.measurement}
                activeMonth={activeMonth.measurement}
                activeYear={activeYear}
                onDateSelect={(date) => handleDateSelect("measurement", date)}
                onTimeChange={(field, value) => handleTimeChange("measurement", field, value)}
                onMonthChange={(month) => handleMonthChange("measurement", month)}
                onYearChange={handleYearChange}
                months={months}
              />

              {/* Dress Pickup Appointment */}
              <AppointmentSection
                title="Dress Pickup Appointment"
                calendarData={calendarData}
                selectedDate={selectedDates.pickup}
                selectedTime={selectedTimes.pickup}
                activeMonth={activeMonth.pickup}
                activeYear={activeYear}
                onDateSelect={(date) => handleDateSelect("pickup", date)}
                onTimeChange={(field, value) => handleTimeChange("pickup", field, value)}
                onMonthChange={(month) => handleMonthChange("pickup", month)}
                onYearChange={handleYearChange}
                months={months}
              />

              {/* Dress Return Appointment */}
              <AppointmentSection
                title="Dress Return Appointment (for rentals)"
                calendarData={calendarData}
                selectedDate={selectedDates.return}
                selectedTime={selectedTimes.return}
                activeMonth={activeMonth.return}
                activeYear={activeYear}
                onDateSelect={(date) => handleDateSelect("return", date)}
                onTimeChange={(field, value) => handleTimeChange("return", field, value)}
                onMonthChange={(month) => handleMonthChange("return", month)}
                onYearChange={handleYearChange}
                months={months}
              />
            </>
          ) : (
            // Photography content
            <AppointmentSection
              title="Photography Appointment"
              calendarData={calendarData}
              selectedDate={selectedDates.firstFitting}
              selectedTime={selectedTimes.firstFitting}
              activeMonth={activeMonth.firstFitting}
              activeYear={activeYear}
              onDateSelect={(date) => handleDateSelect("firstFitting", date)}
              onTimeChange={(field, value) => handleTimeChange("firstFitting", field, value)}
              onMonthChange={(month) => handleMonthChange("firstFitting", month)}
              onYearChange={handleYearChange}
              months={months}
            />
          )}

          {/* Create Button */}
          <div className="mt-8 flex justify-center">
            <button className="flex items-center justify-center gap-2 bg-white border border-[#c3937c] text-[#c3937c] hover:bg-[#f8f8f8] rounded-full py-3 w-[600px] transition-colors">
              <span>Create</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppointmentSection({
  title,
  calendarData,
  selectedDate,
  selectedTime,
  activeMonth,
  activeYear,
  onDateSelect,
  onTimeChange,
  onMonthChange,
  onYearChange,
  months,
}: AppointmentSectionProps) {
  // Years array (current year and next 5 years)
  const years = Array.from({ length: 6 }, (_, i) => (new Date().getFullYear() + i).toString())

  return (
    <div className="mb-8 border-b border-[#ededed] pb-6">
      <h2 className="text-[#c3937c] font-medium mb-4">{title}</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Day Selection */}
        <div className="flex-1">
          <div className="mb-2 text-sm text-[#868686]">Day</div>
          <div className="bg-white rounded-lg border border-[#ededed] overflow-hidden">
            {/* Month and Year Selection */}
            <div className="flex border-b border-[#ededed]">
              {/* Month Selection */}
              <div className="flex-1 border-r border-[#ededed]">
                <select
                  className="w-full py-2 text-sm text-[#c3937c] font-medium bg-transparent border-none focus:outline-none cursor-pointer text-center"
                  value={activeMonth}
                  onChange={(e) => onMonthChange(e.target.value)}
                >
                  {months.map((month) => (
                    <option key={month} value={month} className="text-center">
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              {/* Year Selection */}
              <div className="flex-1">
                <select
                  className="w-full py-2 text-sm text-[#c3937c] font-medium bg-transparent border-none focus:outline-none cursor-pointer text-center"
                  value={activeYear}
                  onChange={(e) => onYearChange(e.target.value)}
                >
                  {years.map((year) => (
                    <option key={year} value={year} className="text-center">
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calendar */}
            <div className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {calendarData.days.map((day) => (
                  <div key={day} className="text-center text-xs text-[#868686]">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Dates */}
              {calendarData.dates.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 mb-2">
                  {week.map((date, dateIndex) => (
                    <div
                      key={`${weekIndex}-${dateIndex}`}
                      className={`
                        text-center py-1 text-sm cursor-pointer
                        ${selectedDate === date ? "bg-[#f0d4c9] text-[#c3937c] rounded-md" : "hover:bg-[#f8f8f8]"}
                        ${date === "1" && weekIndex === 0 ? "text-[#aaaaaa]" : ""}
                        ${date === "1" && weekIndex === 4 ? "text-[#aaaaaa]" : ""}
                      `}
                      onClick={() => onDateSelect(date)}
                    >
                      {date}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Selection */}
        <div className="w-full md:w-64">
          <div className="mb-2 text-sm text-[#868686]">Time</div>
          <div className="bg-white rounded-lg border border-[#ededed] p-4">
            <div className="text-xs text-[#868686] mb-2">ENTER TIME</div>

            <div className="flex items-center gap-1 mb-4">
              {/* Hour Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full border border-[#c3937c] rounded-md p-2 text-center"
                  placeholder="Hour"
                  value={selectedTime.hour}
                  onChange={(e) => onTimeChange("hour", e.target.value)}
                />
              </div>

              <span className="text-xl font-light">:</span>

              {/* Minute Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full border border-[#ededed] rounded-md p-2 text-center"
                  value={selectedTime.minute}
                  readOnly
                />
              </div>

              {/* AM/PM Selection */}
              <div className="flex flex-col ml-2">
                <button
                  className={`px-2 py-1 text-xs rounded-t-md ${selectedTime.period === "AM" ? "bg-[#c3937c] text-white" : "bg-[#f8f8f8] text-[#868686]"}`}
                  onClick={() => onTimeChange("period", "AM")}
                >
                  AM
                </button>
                <button
                  className={`px-2 py-1 text-xs rounded-b-md ${selectedTime.period === "PM" ? "bg-[#c3937c] text-white" : "bg-[#f8f8f8] text-[#868686]"}`}
                  onClick={() => onTimeChange("period", "PM")}
                >
                  PM
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-[#868686]">
                <Clock size={16} />
              </div>
              <div className="flex gap-4">
                <button className="text-[#868686] text-sm hover:text-[#c3937c]">CANCEL</button>
                <button className="text-[#c3937c] text-sm font-medium">OK</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}