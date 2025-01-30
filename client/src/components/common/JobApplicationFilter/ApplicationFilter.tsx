import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";

const statusOptions = [
  { value: 'all', label: 'Filter' },
  { value: 'applied', label: 'Applied' },
  { value: 'inreview', label: 'In Review' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'selected', label: 'Selected' }
] as const;

interface StatusFilterProps {
  onFilterChange: (value: string) => void;
}

const StatusFilter = ({ onFilterChange }: StatusFilterProps) => {
  return (
    <Select onValueChange={onFilterChange} defaultValue="all">
      <SelectTrigger className="w-[180px] bg-white">
        <div className="flex items-center space-x-2">
          <ListFilter size={18} />
          <SelectValue placeholder="Filter" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;