import { motion, AnimatePresence } from 'framer-motion';
import type { HistoricalEvent } from '../types';
import { adToBe } from '../types';
import { countries } from '../data/countries';
import './EventDetailModal.css';

interface EventDetailModalProps {
  event: HistoricalEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailModal({ event, isOpen, onClose }: EventDetailModalProps) {
  if (!event) return null;

  const country = countries[event.country_code];
  const yearBE = adToBe(event.year_ad);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="event-detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="event-detail-modal"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button className="detail-close" onClick={onClose}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>

            {/* Hero Image */}
            {event.image_url && (
              <div className="detail-hero">
                <img src={event.image_url} alt={event.title} />
                <div className="detail-hero-overlay" />
              </div>
            )}

            {/* Content */}
            <div className="detail-content">
              {/* Country and Year Badge */}
              <div className="detail-meta">
                <div className="detail-country">
                  <span className="detail-flag">{country.flag_emoji}</span>
                  <span className="detail-country-name">{country.name_th}</span>
                </div>
                <div className="detail-year-badge">
                  <span className="detail-year-ad">ค.ศ. {event.year_ad}</span>
                  <span className="detail-year-separator">|</span>
                  <span className="detail-year-be">พ.ศ. {yearBE}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="detail-title">{event.title}</h1>

              {/* Importance */}
              <div className="detail-importance">
                <span className="importance-label">ระดับความสำคัญ</span>
                <div className="importance-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`importance-star ${i < event.importance_level ? 'active' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="detail-description">
                <p>{event.description}</p>
              </div>

              {/* Additional Info Section - Placeholder for future expansion */}
              <div className="detail-additional">
                <h3>เหตุการณ์ในช่วงเวลาเดียวกัน</h3>
                <p className="detail-hint">
                  กลับไปที่ไทม์ไลน์เพื่อดูเหตุการณ์อื่นๆ ที่เกิดขึ้นในปี {event.year_ad}
                </p>
              </div>

              {/* Close hint */}
              <div className="detail-close-hint">
                <p>แตะที่ใดก็ได้เพื่อปิด</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
