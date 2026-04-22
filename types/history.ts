export type EventCategory =
  | 'war'
  | 'dynasty'
  | 'culture'
  | 'religion'
  | 'discovery';

export type Importance = 1 | 2 | 3;

export interface HistoricalEvent {
  id: string;
  year: number;
  endYear?: number;
  title: string;
  description: string;
  category: EventCategory;
  location: { lat: number; lng: number; name: string };
  importance: Importance;
  sources?: string[];
  verified: boolean;
}

export interface HistoryDataset {
  id: string;
  label: string;
  region: string;
  focus: { lng: number; lat: number };
  range: [number, number];
  events: HistoricalEvent[];
}
