export interface Era {
  id: string;
  label: string;
  start: number;
  end: number;
  color: string;
}

export interface Polity {
  id: string;
  name: string;
  color: string;
  coords: [number, number][]; // [lng, lat] pairs
}

export interface TerritorySnapshot {
  year: number;
  polities: Polity[];
}

export interface HistoricalEvent {
  id: string;
  year: number;
  label: string;
  lat: number;
  lng: number;
  era: string;
  summary: string;
  tags: string[];
  causes: string[];
  effects: string[];
  sourceUrl?: string;
}

export interface DatasetFocus {
  lat: number;
  lng: number;
  zoom?: number;
}

export interface LayerState {
  territory: boolean;
  capital: boolean;
  religion: boolean;
}

export interface HistoryDataset {
  id: string;
  label: string;
  range: [number, number];
  focus: DatasetFocus;
  eras: Era[];
  events: HistoricalEvent[];
  territoriesByYear?: TerritorySnapshot[];
}
