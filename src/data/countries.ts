import type { Country, CountryCode } from '../types';

export const countries: Record<CountryCode, Country> = {
  TH: {
    code: 'TH',
    name_en: 'Thailand',
    name_th: 'ไทย',
    flag_emoji: '🇹🇭',
    color: '#1E3A8A', // Deep blue
  },
  US: {
    code: 'US',
    name_en: 'United States',
    name_th: 'สหรัฐอเมริกา',
    flag_emoji: '🇺🇸',
    color: '#DC2626', // Red
  },
  CN: {
    code: 'CN',
    name_en: 'China',
    name_th: 'จีน',
    flag_emoji: '🇨🇳',
    color: '#EF4444', // Chinese red
  },
  JP: {
    code: 'JP',
    name_en: 'Japan',
    name_th: 'ญี่ปุ่น',
    flag_emoji: '🇯🇵',
    color: '#BE123C', // Crimson
  },
  KR: {
    code: 'KR',
    name_en: 'Korea',
    name_th: 'เกาหลี',
    flag_emoji: '🇰🇷',
    color: '#1D4ED8', // Blue
  },
  GB: {
    code: 'GB',
    name_en: 'United Kingdom',
    name_th: 'อังกฤษ',
    flag_emoji: '🇬🇧',
    color: '#7C3AED', // Purple
  },
  FR: {
    code: 'FR',
    name_en: 'France',
    name_th: 'ฝรั่งเศส',
    flag_emoji: '🇫🇷',
    color: '#2563EB', // French blue
  },
  DE: {
    code: 'DE',
    name_en: 'Germany',
    name_th: 'เยอรมนี',
    flag_emoji: '🇩🇪',
    color: '#1F2937', // Dark gray
  },
  IT: {
    code: 'IT',
    name_en: 'Italy',
    name_th: 'อิตาลี',
    flag_emoji: '🇮🇹',
    color: '#16A34A', // Green
  },
  ES: {
    code: 'ES',
    name_en: 'Spain',
    name_th: 'สเปน',
    flag_emoji: '🇪🇸',
    color: '#EA580C', // Orange
  },
  RU: {
    code: 'RU',
    name_en: 'Russia',
    name_th: 'รัสเซีย',
    flag_emoji: '🇷🇺',
    color: '#0284C7', // Sky blue
  },
  IN: {
    code: 'IN',
    name_en: 'India',
    name_th: 'อินเดีย',
    flag_emoji: '🇮🇳',
    color: '#F59E0B', // Saffron
  },
  EG: {
    code: 'EG',
    name_en: 'Egypt',
    name_th: 'อียิปต์',
    flag_emoji: '🇪🇬',
    color: '#D97706', // Gold
  },
  GR: {
    code: 'GR',
    name_en: 'Greece',
    name_th: 'กรีซ',
    flag_emoji: '🇬🇷',
    color: '#0891B2', // Cyan
  },
};

export const defaultCountries: CountryCode[] = ['US', 'CN', 'JP', 'KR', 'GB', 'FR', 'TH'];

export const allCountryCodes = Object.keys(countries) as CountryCode[];
