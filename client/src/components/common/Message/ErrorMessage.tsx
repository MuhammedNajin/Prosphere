import { cn } from "@/lib/utils";
import { CircleX } from "lucide-react";
import React from "react";

interface SuccessMessageProps {
    message: string
    className?: string
}

const ErrorMessage: React.FC<SuccessMessageProps> = ({
  message,
  className
}) => {
  return (
    <div className="flex justify-center  items-center gap-4">
      <CircleX className={cn('w-10 h-10 text-white', className && `${className}`)} />
      <h1 className="text-white">{message}</h1>
    </div>
  );
};

export default ErrorMessage;
