import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Country, HistoricalEvent, CountryCode } from '../types';
import { EventCard } from './EventCard';
import './CountryColumn.css';

interface CountryColumnProps {
  country: Country;
  events: HistoricalEvent[];
  currentYear: number;
  onRemove: (code: CountryCode) => void;
  onEventExpand: (event: HistoricalEvent) => void;
}

export function CountryColumn({
  country,
  events,
  currentYear,
  onRemove,
  onEventExpand,
}: CountryColumnProps) {
  // Sort events and determine which are near the current year
  const processedEvents = useMemo(() => {
    return events
      .sort((a, b) => a.year_ad - b.year_ad)
      .map(event => ({
        event,
        distanceFromFocus: event.year_ad - currentYear,
        isHighlighted: Math.abs(event.year_ad - currentYear) <= 2,
        isNearFocus: Math.abs(event.year_ad - currentYear) <= 10,
      }));
  }, [events, currentYear]);

  return (
    <motion.div
      className="country-column"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      style={{
        '--country-color': country.color,
      } as React.CSSProperties}
    >
      {/* Column Header */}
      <div className="column-header">
        <div className="column-header-content">
          <span className="column-flag">{country.flag_emoji}</span>
          <div className="column-name-group">
            <span className="column-name-en">{country.name_en}</span>
            <span className="column-name-th">{country.name_th}</span>
          </div>
        </div>
        <button
          className="column-remove-btn"
          onClick={() => onRemove(country.code)}
          aria-label={`Remove ${country.name_en}`}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 8.586L15.293 3.293a1 1 0 111.414 1.414L11.414 10l5.293 5.293a1 1 0 01-1.414 1.414L10 11.414l-5.293 5.293a1 1 0 01-1.414-1.414L8.586 10 3.293 4.707a1 1 0 011.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>

      {/* Events List */}
      <div className="column-events">
        {processedEvents.length === 0 ? (
          <div className="column-empty">
            <p>ไม่มีเหตุการณ์ในช่วงเวลานี้</p>
          </div>
        ) : (
          processedEvents.map(({ event, isHighlighted, isNearFocus, distanceFromFocus }) => (
            <EventCard
              key={event.event_id}
              event={event}
              isHighlighted={isHighlighted}
              isNearFocus={isNearFocus}
              distanceFromFocus={distanceFromFocus}
              onExpand={onEventExpand}
            />
          ))
        )}
      </div>

      {/* Column accent line */}
      <div className="column-accent-line" />
    </motion.div>
  );
}
