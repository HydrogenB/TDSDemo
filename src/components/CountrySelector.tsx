import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Country, CountryCode } from '../types';
import { countries, allCountryCodes } from '../data/countries';
import './CountrySelector.css';

interface CountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: CountryCode) => void;
  selectedCountries: CountryCode[];
}

export function CountrySelector({
  isOpen,
  onClose,
  onSelect,
  selectedCountries,
}: CountrySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter available countries (not already selected)
  const availableCountries = useMemo(() => {
    return allCountryCodes
      .filter(code => !selectedCountries.includes(code))
      .map(code => countries[code])
      .filter(country => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          country.name_en.toLowerCase().includes(query) ||
          country.name_th.includes(searchQuery)
        );
      });
  }, [selectedCountries, searchQuery]);

  const handleSelect = (country: Country) => {
    onSelect(country.code);
    onClose();
    setSearchQuery('');
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setSearchQuery('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="country-selector-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}
        >
          <motion.div
            className="country-selector-modal"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="selector-header">
              <h2 className="selector-title">เลือกประเทศ</h2>
              <p className="selector-subtitle">Select a country to add</p>
              <button className="selector-close" onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="selector-search">
              <input
                type="text"
                placeholder="ค้นหาประเทศ / Search country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            {/* Country Grid */}
            <div className="selector-grid">
              {availableCountries.length === 0 ? (
                <div className="selector-empty">
                  <p>ไม่พบประเทศที่ค้นหา</p>
                  <p>No countries found</p>
                </div>
              ) : (
                availableCountries.map((country) => (
                  <motion.button
                    key={country.code}
                    className="country-option"
                    onClick={() => handleSelect(country)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      '--country-color': country.color,
                    } as React.CSSProperties}
                  >
                    <span className="option-flag">{country.flag_emoji}</span>
                    <span className="option-name-en">{country.name_en}</span>
                    <span className="option-name-th">{country.name_th}</span>
                  </motion.button>
                ))
              )}
            </div>

            {/* Info */}
            <div className="selector-info">
              <p>เลือกประเทศเพื่อเปรียบเทียบประวัติศาสตร์</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
