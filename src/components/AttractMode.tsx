import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { historicalEvents } from '../data/events';
import { countries } from '../data/countries';
import type { HistoricalEvent } from '../types';
import { adToBe } from '../types';
import './AttractMode.css';

interface AttractModeProps {
  isActive: boolean;
  onInteraction: () => void;
  setYear: (year: number) => void;
}

export function AttractMode({ isActive, onInteraction, setYear }: AttractModeProps) {
  const [currentEvent, setCurrentEvent] = useState<HistoricalEvent | null>(null);
  const [, setAutoScrollYear] = useState(1500);

  // Get random important events (importance level 4-5)
  const getRandomEvent = useCallback((): HistoricalEvent => {
    const importantEvents = historicalEvents.filter(e => e.importance_level >= 4);
    return importantEvents[Math.floor(Math.random() * importantEvents.length)];
  }, []);

  // Auto-scroll timeline when idle
  useEffect(() => {
    if (!isActive) return;

    // Set initial random event
    const initialEvent = getRandomEvent();
    setCurrentEvent(initialEvent);
    setAutoScrollYear(initialEvent.year_ad);
    setYear(initialEvent.year_ad);

    // Slowly drift through time
    const driftInterval = setInterval(() => {
      setAutoScrollYear(prev => {
        const next = prev + 1;
        if (next > 2020) {
          // Jump to new random event when reaching end
          const newEvent = getRandomEvent();
          setCurrentEvent(newEvent);
          setYear(newEvent.year_ad);
          return newEvent.year_ad;
        }
        setYear(next);
        return next;
      });
    }, 500); // Slow drift - 0.5 seconds per year

    // Change featured event periodically
    const eventInterval = setInterval(() => {
      const newEvent = getRandomEvent();
      setCurrentEvent(newEvent);
      setAutoScrollYear(newEvent.year_ad);
      setYear(newEvent.year_ad);
    }, 15000); // Change every 15 seconds

    return () => {
      clearInterval(driftInterval);
      clearInterval(eventInterval);
    };
  }, [isActive, getRandomEvent, setYear]);

  if (!isActive || !currentEvent) return null;

  const country = countries[currentEvent.country_code];

  return (
    <AnimatePresence>
      <motion.div
        className="attract-mode"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        onClick={onInteraction}
      >
        {/* Background gradient */}
        <div className="attract-bg" />

        {/* Featured Event Preview */}
        <motion.div
          className="attract-featured"
          key={currentEvent.event_id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="attract-event-image">
            {currentEvent.image_url && (
              <img src={currentEvent.image_url} alt={currentEvent.title} />
            )}
            <div className="attract-image-overlay" />
          </div>
          <div className="attract-event-info">
            <div className="attract-country">
              <span className="attract-flag">{country.flag_emoji}</span>
              <span className="attract-country-name">{country.name_th}</span>
            </div>
            <div className="attract-year">
              <span className="attract-year-ad">{currentEvent.year_ad}</span>
              <span className="attract-year-be">พ.ศ. {adToBe(currentEvent.year_ad)}</span>
            </div>
            <h2 className="attract-title">{currentEvent.title}</h2>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="attract-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="attract-cta-text">
            <span className="attract-touch-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a5 5 0 0 0-10 0c0 1.56.79 2.93 2 3.74zm3 4.26c-3.87 0-7 3.13-7 7h2c0-2.76 2.24-5 5-5s5 2.24 5 5h2c0-3.87-3.13-7-7-7z"/>
              </svg>
            </span>
            <p className="attract-instruction">แตะหน้าจอเพื่อสำรวจประวัติศาสตร์</p>
            <p className="attract-instruction-en">Touch to explore history</p>
          </div>
        </motion.div>

        {/* Brand/Title */}
        <div className="attract-brand">
          <h1 className="attract-brand-title">TimeFlow</h1>
          <p className="attract-brand-subtitle">The Chrono-Monolith</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
