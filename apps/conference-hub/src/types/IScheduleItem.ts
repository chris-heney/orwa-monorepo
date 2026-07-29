export interface ScheduleItem {
  id: number;
  date: string;
  start: string;
  end: string;
  location: string;
  event: string;
  description: string;
  speaker: string;
  company: string;
  training_hours?: string;
}
