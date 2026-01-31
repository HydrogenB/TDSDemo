// TimeFlow Data Types

export interface HistoricalEvent {
  event_id: number;
  country_code: CountryCode;
  year_ad: number;
  title: string;
  description: string;
  image_url: string;
  importance_level: 1 | 2 | 3 | 4 | 5;
}

export type CountryCode = 'TH' | 'US' | 'CN' | 'JP' | 'KR' | 'GB' | 'FR' | 'DE' | 'IT' | 'ES' | 'RU' | 'IN' | 'EG' | 'GR';

export interface Country {
  code: CountryCode;
  name_en: string;
  name_th: string;
  flag_emoji: string;
  color: string;
}

export interface TimelineState {
  currentYear: number;
  selectedCountries: CountryCode[];
  isIdle: boolean;
  scrollVelocity: number;
}

export interface EventCardProps {
  event: HistoricalEvent;
  isHighlighted: boolean;
  onExpand: (event: HistoricalEvent) => void;
}

export interface CountryColumnProps {
  country: Country;
  events: HistoricalEvent[];
  currentYear: number;
  onRemove: (code: CountryCode) => void;
}

// Year conversion utilities
export const adToBe = (yearAD: number): number => yearAD + 543;
export const beToAd = (yearBE: number): number => yearBE - 543;
