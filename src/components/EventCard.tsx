import { motion } from 'framer-motion';
import type { HistoricalEvent } from '../types';
import { adToBe } from '../types';
import './EventCard.css';

interface EventCardProps {
  event: HistoricalEvent;
  isHighlighted: boolean;
  isNearFocus: boolean;
  onExpand: (event: HistoricalEvent) => void;
  distanceFromFocus: number;
}

export function EventCard({
  event,
  isHighlighted,
  isNearFocus,
  onExpand,
  distanceFromFocus,
}: EventCardProps) {
  // Calculate opacity based on distance from focus
  const opacity = isHighlighted ? 1 : Math.max(0.3, 1 - Math.abs(distanceFromFocus) * 0.1);

  // Calculate scale based on importance and highlight
  const scale = isHighlighted ? 1.05 : isNearFocus ? 1 : 0.95;

  return (
    <motion.div
      className={`event-card-wrapper ${isHighlighted ? 'highlighted' : ''} ${isNearFocus ? 'near-focus' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity,
        y: 0,
        scale,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      onClick={() => onExpand(event)}
      style={{
        '--importance': event.importance_level,
      } as React.CSSProperties}
    >
      <div className="event-card-inner">
        {/* Year indicator */}
        <div className="event-year">
          <span className="event-year-ad">{event.year_ad}</span>
          <span className="event-year-be">พ.ศ. {adToBe(event.year_ad)}</span>
        </div>

        {/* Event image */}
        {event.image_url && (
          <div className="event-image-container">
            <img
              src={event.image_url}
              alt={event.title}
              className="event-image"
              loading="lazy"
            />
            <div className="event-image-overlay" />
          </div>
        )}

        {/* Event content */}
        <div className="event-content">
          <h3 className="event-title">{event.title}</h3>

          {/* Show description only when highlighted */}
          {isHighlighted && (
            <motion.p
              className="event-description"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {event.description}
            </motion.p>
          )}
        </div>

        {/* Importance indicator */}
        <div className="event-importance">
          {Array.from({ length: event.importance_level }).map((_, i) => (
            <span key={i} className="importance-dot" />
          ))}
        </div>

        {/* Tap hint when highlighted */}
        {isHighlighted && (
          <motion.div
            className="tap-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            แตะเพื่อดูรายละเอียด
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
