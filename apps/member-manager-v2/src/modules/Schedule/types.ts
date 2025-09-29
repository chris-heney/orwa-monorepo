export interface ScheduleItem {
    id: string | number;
    date: string;
    start: string;
    end: string;
    location: string;
    event: string;
    description: string;
    speaker: string;
    company: string;
    training_hours?: number;
  }
  