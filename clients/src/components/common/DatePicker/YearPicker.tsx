import React, { useState } from 'react';

const YearPicker = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isOpen, setIsOpen] = useState(false);

  // Generate array of years (current year ± 50 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

  const handleYearSelect = (year) => {
    setSelectedYear(year);
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
                key={year}
                onClick={() => handleYearSelect(year)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedYear && (
        <div className="mt-1 text-sm">
          Selected: {selectedYear}
        </div>
      )}
    </div>
  );
};

export default YearPicker;