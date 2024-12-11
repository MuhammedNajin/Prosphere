import React, { useState } from 'react';

const WeekPicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getWeekRange = (date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return { weekStart, weekEnd };
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(date);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Week Picker</h3>
      
      <input
        type="date"
        onChange={handleDateChange}
        className="w-full p-2 border rounded-md mb-4"
        value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
      />

      {selectedDate && (
        <div className="space-y-2 text-sm">
          <div>
            Week {getWeekNumber(selectedDate)} of {selectedDate.getFullYear()}
          </div>
          <div>
            {formatDate(getWeekRange(selectedDate).weekStart)} - {formatDate(getWeekRange(selectedDate).weekEnd)}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekPicker;