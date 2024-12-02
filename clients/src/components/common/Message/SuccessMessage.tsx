import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import React from "react";

interface SuccessMessageProps {
    message: string
    className?: string
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  className
}) => {
  return (
    <div className="flex justify-center items-center gap-4">
      <CircleCheck className={cn('w-10 h-10 text-green-600', className && `${className}`)} />
      <h1>{message}</h1>
    </div>
  );
};

export default SuccessMessage;
