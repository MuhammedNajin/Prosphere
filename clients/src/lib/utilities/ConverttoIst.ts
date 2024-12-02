import { parseISO, format } from 'date-fns';

/**
 * Converts a UTC date string to Indian Standard Time (IST) and formats it.
 * Uses modern JavaScript Intl API instead of external libraries.
 * @param {string} dateString - The date string in UTC (e.g., "2024-11-29T03:53:55.176Z")
 * @returns {string} - The formatted time in IST (e.g., "9:23 AM")
 */

export const convertToIST = (dateString) => {

  const date = parseISO(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export default convertToIST;