import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MonthYearPicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange = (date) => {
    setSelectedDate(date);
    console.log(new Date(date).getDate())
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Month and Year Picker
      </h3>
      
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        className="w-full p-2 border rounded-md"
        placeholderText="Select Month and Year"
        isClearable
      />

      {selectedDate && (
        <div className="mt-4 text-sm">
          Selected: {selectedDate.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;