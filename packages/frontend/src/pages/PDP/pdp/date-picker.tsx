import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  startDate?: Date | string;
  endDate?: Date | string;
  onDateChange?: (date: Date) => void;
}

export default function DatePicker({ startDate, endDate, onDateChange }: DatePickerProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  
  // Initialize with provided start date if available
  useEffect(() => {
    if (startDate) {
      // Convert string to Date if needed
      const startDateObj = startDate instanceof Date ? startDate : new Date(startDate);
      
      // Check if date is valid before using it
      if (!isNaN(startDateObj.getTime())) {
        setCurrentMonth(startDateObj.getMonth());
        setCurrentYear(startDateObj.getFullYear());
        setSelectedDate(startDateObj.getDate());
      }
    }
  }, [startDate]);

  // Convert endDate to Date object if it's a string
  const endDateObj = endDate ? (endDate instanceof Date ? endDate : new Date(endDate)) : undefined;
  
  // Only use endDate if it's a valid date
  const validEndDate = endDateObj && !isNaN(endDateObj.getTime()) ? endDateObj : undefined;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    if (onDateChange) {
      onDateChange(new Date(currentYear, currentMonth, day));
    }
  };

  // Check if a date is available (not in the past and not after endDate)
  const isDateAvailable = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth, day);
    const isPast = date < new Date(today.setHours(0, 0, 0, 0));
    const isAfterEndDate = validEndDate ? date > validEndDate : false;
    
    return !isPast && !isAfterEndDate;
  };

  // Rest of the component remains unchanged
  return (
    <div className="border border-[#ededed] rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="text-[#333333]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex space-x-4">
          {[currentMonth - 1, currentMonth, currentMonth + 1].map((monthIndex, i) => {
            let month = monthIndex;
            let year = currentYear;
            
            if (month < 0) {
              month = 11;
              year -= 1;
            } else if (month > 11) {
              month = 0;
              year += 1;
            }
            
            return (
              <button
                key={i}
                className={`px-4 py-1 rounded-md ${currentMonth === month && currentYear === year ? 'bg-[#333333] text-white' : 'text-[#333333]'}`}
                onClick={() => {
                  setCurrentMonth(month);
                  setCurrentYear(year);
                }}
              >
                {months[month]} {year}
              </button>
            );
          })}
        </div>
        <button onClick={handleNextMonth} className="text-[#333333]">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-medium text-[#868686] py-1">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const isAvailable = day !== null && isDateAvailable(day);
          
          return (
            <button
              key={index}
              className={`aspect-square flex items-center justify-center text-sm rounded-md ${
                day === null
                  ? 'invisible'
                  : day === selectedDate
                  ? 'bg-[#c3937c] text-white'
                  : !isAvailable
                  ? 'bg-[#f2f2f2] text-[#c3c3c3] cursor-not-allowed'
                  : 'hover:bg-[#f2f2f2] text-[#333333]'
              }`}
              onClick={() => day !== null && isAvailable && handleDateSelect(day)}
              disabled={day === null || !isAvailable}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}