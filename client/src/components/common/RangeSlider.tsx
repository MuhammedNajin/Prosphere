import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from "@/lib/utils";

const SalaryRangeSlider = ({ 
  value = [0, 10000],
  onValueChange,
  min = 0,
  max = 10000,
  step = 1000,
  className,
}: {
  value?: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}) => {

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(value);
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{formatSalary(value[0])}</span>
        <span>{formatSalary(value[1])}</span>
      </div>

      <SliderPrimitive.Root
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={onValueChange}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-100">
          <SliderPrimitive.Range className="absolute h-full bg-orange-700" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block h-5 w-5 rounded-full border-2 border-orange-700 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-orange-50"
        />
        <SliderPrimitive.Thumb
          className="block h-5 w-5 rounded-full border-2 border-orange-700 bg-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-orange-50"
        />
      </SliderPrimitive.Root>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
        <div>Min Salary</div>
        <div className="text-right">Max Salary</div>
      </div>
    </div>
  );
};

export default SalaryRangeSlider;