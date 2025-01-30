import { endOfYear, startOfYear } from 'date-fns';
import React, { useState } from 'react';

interface YearPickerProps {
  onYearChange: React.Dispatch<React.SetStateAction<{ startDate: Date, endDate: Date }>>;
}

const YearPicker: React.FC<YearPickerProps> = ({ onYearChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => {
    const year = currentYear - 10 + i;
    return {
      label: year.toString(),
      date: new Date(year, 0, 1)
    };
  });

  const handleYearSelect = (date: Date) => {
    const year = date.getFullYear();
    setSelectedYear(year);
    
    const startDate = startOfYear(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = endOfYear(date);
    endDate.setHours(23, 59, 59, 999);

    onYearChange({
      startDate,
      endDate
    });

    console.log('Year Range:', {
      startDate: startDate.toString(),
      endDate: endDate.toString()
    });
    
    setIsOpen(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-1">
        Year Picker
      </h3>
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 border rounded-md text-left flex justify-between items-center"
        >
          {selectedYear || "Select Year"}
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg">
            {years.map((year) => (
              <button
                key={year.label}
                onClick={() => handleYearSelect(year.date)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {year.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedYear && (
        <div className="mt-4 text-sm">
          <div>Selected: {selectedYear}</div>
          <div className="mt-2 text-gray-600">
            Range: {startOfYear(new Date(selectedYear, 0, 1)).toLocaleDateString()} - {endOfYear(new Date(selectedYear, 0, 1)).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearPicker;