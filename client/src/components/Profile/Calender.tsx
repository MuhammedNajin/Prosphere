import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";

const EnhancedCalendar = ({ selected, onSelect, disabled }: {
    selected: Date | undefined;
    onSelect: (date: Date | undefined) => void;
    disabled?: (date: Date) => boolean;
  }) => {
    const [date, setDate] = useState(selected || new Date());
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
    
    const handleYearChange = (year: string) => {
      const newDate = new Date(date);
      newDate.setFullYear(parseInt(year));
      setDate(newDate);
    };
  
    const handleMonthChange = (increment: number) => {
      const newDate = new Date(date);
      newDate.setMonth(date.getMonth() + increment);
      setDate(newDate);
    };
  
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => handleMonthChange(-1)}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Select
            value={date.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent className="max-h-56 overflow-y-auto">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => handleMonthChange(1)}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
  
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={disabled}
          initialFocus
          month={date}
          onMonthChange={setDate}
        />
      </div>
    );
  };


  export default EnhancedCalendar