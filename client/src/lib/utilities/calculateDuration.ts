import { format, formatDistanceToNow } from "date-fns";

export function calculateDuration(startDate: Date, endDate: Date = new Date()): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
  
    if (months < 0) {
      years -= 1;
      months += 12;
    }
  
    const yearText = years === 1 ? "1 year" : `${years} years`;
    const monthText = months === 1 ? "1 month" : `${months} months`;
  
    if (years > 0 && months > 0) return `${yearText} ${monthText}`;
    if (years > 0) return yearText;
    if (months > 0) return monthText;
  
    return "Less than a month";
  }

  export const formatDateTime = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (diffInHours < 48) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a');
    }
  };