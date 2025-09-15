import { ScheduleItem } from "./types";

export const groupRecordsByDate = (records: ScheduleItem[]) => {
  const grouped: Record<string, ScheduleItem[]> = {};
  records
    .sort((a: ScheduleItem, b: ScheduleItem) => {
      const dateA = new Date(`${a.date}T${a.start}`);
      const dateB = new Date(`${b.date}T${b.start}`);
      return dateA.getTime() - dateB.getTime();
    })
    .forEach((record) => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });
  return grouped;
};

// Format a date to string in YYYY-MM-DD format
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Calculate the number of days between two dates
export const daysBetween = (date1: string | Date, date2: string | Date): number => {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Add days to a date and return a new date
export const addDays = (date: string | Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Creates a mapping of source dates to target dates based on date range
export const createDateMapping = (
  sourceItems: ScheduleItem[],
  targetStartDate: string,
): Map<string, string> => {
  const dateMap = new Map<string, string>();
  
  // Sort source items by date
  const sortedItems = [...sourceItems].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  if (sortedItems.length === 0) return dateMap;
  
  // Get the first date from the source
  const sourceStartDate = sortedItems[0].date;
  
  // Set up the target start date
  const targetStart = new Date(targetStartDate);
  
  // Create mapping
  const uniqueDates = Array.from(new Set(sortedItems.map(item => item.date)));
  uniqueDates.forEach((date, index) => {
    const targetDate = addDays(targetStart, index);
    const formattedTargetDate = targetDate.toISOString().split('T')[0];
    dateMap.set(date, formattedTargetDate);
  });
  
  return dateMap;
};

