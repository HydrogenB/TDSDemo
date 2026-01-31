import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { CountryCode, HistoricalEvent } from './types';
import { countries, defaultCountries } from './data/countries';
import { getEventsByCountry } from './data/events';
import { useTimelinePhysics } from './hooks/useTimelinePhysics';
import { useIdleDetection } from './hooks/useIdleDetection';
import { GoldenThread } from './components/GoldenThread';
import { CountryColumn } from './components/CountryColumn';
import { CountrySelector } from './components/CountrySelector';
import { EventDetailModal } from './components/EventDetailModal';
import { AttractMode } from './components/AttractMode';
import './App.css';

const START_YEAR = 1500;
const MIN_YEAR = 1500;
const MAX_YEAR = 2025;

function App() {
  // Selected countries state
  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>(defaultCountries);

  // Modal states
  const [isCountrySelectorOpen, setIsCountrySelectorOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  // Timeline physics hook
  const {
    currentYear,
    velocity,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    setYear,
  } = useTimelinePhysics(START_YEAR, MIN_YEAR, MAX_YEAR, {
    friction: 0.97, // Heavy flywheel - slow decay
    yearPerPixel: 0.3,
  });

  // Idle detection for attract mode
  const { isIdle, resetIdleTimer } = useIdleDetection({
    idleTimeout: 30000, // 30 seconds
    onIdle: () => console.log('User is idle - entering attract mode'),
    onActive: () => console.log('User is active - exiting attract mode'),
  });

  // Get events for each selected country
  const countryEvents = useMemo(() => {
    const events: Record<CountryCode, HistoricalEvent[]> = {} as Record<CountryCode, HistoricalEvent[]>;
    selectedCountries.forEach(code => {
      events[code] = getEventsByCountry(code);
    });
    return events;
  }, [selectedCountries]);

  // Handle adding a country
  const handleAddCountry = useCallback((code: CountryCode) => {
    if (!selectedCountries.includes(code)) {
      setSelectedCountries(prev => [...prev, code]);
    }
    resetIdleTimer();
  }, [selectedCountries, resetIdleTimer]);

  // Handle removing a country
  const handleRemoveCountry = useCallback((code: CountryCode) => {
    setSelectedCountries(prev => prev.filter(c => c !== code));
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Handle event card expansion
  const handleEventExpand = useCallback((event: HistoricalEvent) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Handle closing event detail
  const handleCloseEventDetail = useCallback(() => {
    setIsEventDetailOpen(false);
    setSelectedEvent(null);
  }, []);

  // Handle interaction from attract mode
  const handleAttractInteraction = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Determine if timeline is moving
  const isMoving = Math.abs(velocity) > 0.5 || isDragging;

  return (
    <div className="app">
      {/* Main Timeline Area */}
      <main
        className="timeline-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={isDragging ? handleTouchMove : undefined}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Header with Year Display */}
        <header className="app-header">
          <div className="header-brand">
            <h1 className="brand-title">TimeFlow</h1>
            <span className="brand-subtitle">The Chrono-Monolith</span>
          </div>
          <div className="header-controls">
            <button
              className="btn-add-country"
              onClick={() => setIsCountrySelectorOpen(true)}
              aria-label="Add country"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span>เพิ่มประเทศ</span>
            </button>
          </div>
        </header>

        {/* Country Columns */}
        <div className="columns-container">
          <AnimatePresence mode="popLayout">
            {selectedCountries.map(code => (
              <CountryColumn
                key={code}
                country={countries[code]}
                events={countryEvents[code] || []}
                currentYear={currentYear}
                onRemove={handleRemoveCountry}
                onEventExpand={handleEventExpand}
              />
            ))}
          </AnimatePresence>

          {/* Add Country Button (at the end of columns) */}
          {selectedCountries.length < 10 && (
            <button
              className="add-column-btn"
              onClick={() => setIsCountrySelectorOpen(true)}
            >
              <span className="add-column-icon">+</span>
              <span className="add-column-text">เพิ่มประเทศ</span>
            </button>
          )}
        </div>

        {/* Golden Thread - The Time Lens */}
        <GoldenThread currentYear={currentYear} isHighlighted={isMoving} />
      </main>

      {/* Bottom Bar - Year Indicator (Mobile-friendly) */}
      <footer className="app-footer">
        <div className="footer-year">
          <span className="footer-year-ad">ค.ศ. {currentYear}</span>
          <span className="footer-year-be">พ.ศ. {currentYear + 543}</span>
        </div>
        <div className="footer-hint">
          <span>เลื่อนขึ้น-ลงเพื่อเดินทางข้ามเวลา</span>
        </div>
      </footer>

      {/* Country Selector Modal */}
      <CountrySelector
        isOpen={isCountrySelectorOpen}
        onClose={() => setIsCountrySelectorOpen(false)}
        onSelect={handleAddCountry}
        selectedCountries={selectedCountries}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isEventDetailOpen}
        onClose={handleCloseEventDetail}
      />

      {/* Attract Mode (Idle State) */}
      <AttractMode
        isActive={isIdle && !isCountrySelectorOpen && !isEventDetailOpen}
        onInteraction={handleAttractInteraction}
        setYear={setYear}
      />
    </div>
  );
}

export default App;
