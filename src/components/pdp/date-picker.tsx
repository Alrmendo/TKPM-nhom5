import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DatePicker() {
  const [currentMonth, setCurrentMonth] = useState(7); // August
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

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

  return (
    <div className="border border-[#ededed] rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="text-[#333333]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-1 rounded-md ${currentMonth === 6 ? 'bg-[#333333] text-white' : 'text-[#333333]'}`}
          >
            July 2024
          </button>
          <button
            className={`px-4 py-1 rounded-md ${currentMonth === 7 ? 'bg-[#333333] text-white' : 'text-[#333333]'}`}
          >
            August 2024
          </button>
          <button
            className={`px-4 py-1 rounded-md ${currentMonth === 8 ? 'bg-[#333333] text-white' : 'text-[#333333]'}`}
          >
            September 2024
          </button>
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

        {calendarDays.map((day, index) => (
          <button
            key={index}
            className={`aspect-square flex items-center justify-center text-sm rounded-md ${
              day === null
                ? 'invisible'
                : day === selectedDate
                ? 'bg-[#c3937c] text-white'
                : day === 9
                ? 'bg-[#eee6ff] text-[#5201ff]'
                : day === 10 || day === 11
                ? 'bg-[#fff2f2] text-[#333333]'
                : 'hover:bg-[#f2f2f2] text-[#333333]'
            }`}
            onClick={() => day !== null && setSelectedDate(day)}
            disabled={day === null}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}
