import { useState } from 'react';

type DatePickerProps = {
  onDateChange: (date: Date) => void;
  startDate?: Date | null;
};

export default function DatePicker({ onDateChange, startDate }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get day of week of first day in month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
  };
  
  // Change month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Check if date is in the past or before startDate (if provided)
  const isDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable dates in the past
    if (date < today) return true;
    
    // Disable dates before startDate if provided
    if (startDate && date < startDate) return true;
    
    return false;
  };
  
  // Generate calendar
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const days = [];
  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const disabled = isDisabled(date);
    
    days.push(
      <button
        key={`day-${day}`}
        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
          ${disabled 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'hover:bg-[#ead9c9] text-[#333333] cursor-pointer'}`}
        onClick={() => !disabled && onDateChange(date)}
        disabled={disabled}
      >
        {day}
      </button>
    );
  }
  
  // Create rows for the calendar
  const rows = [];
  let cells = [];
  
  days.forEach((day, i) => {
    if (i % 7 === 0 && i > 0) {
      rows.push(<div key={`row-${i}`} className="grid grid-cols-7 gap-1">{cells}</div>);
      cells = [];
    }
    cells.push(day);
  });
  
  // Add the last row
  if (cells.length > 0) {
    rows.push(<div key={`row-last`} className="grid grid-cols-7 gap-1">{cells}</div>);
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-[#333333]">
          &lt;
        </button>
        <div className="text-[#333333] font-medium">{formatMonth(currentMonth)}</div>
        <button onClick={nextMonth} className="text-[#333333]">
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="h-8 w-8 flex items-center justify-center text-xs text-[#868686]">
            {day}
          </div>
        ))}
      </div>
      
      <div className="space-y-1">
        {rows}
      </div>
    </div>
  );
}