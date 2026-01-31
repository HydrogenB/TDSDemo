import { motion } from 'framer-motion';
import { adToBe } from '../types';
import './GoldenThread.css';

interface GoldenThreadProps {
  currentYear: number;
  isHighlighted?: boolean;
}

export function GoldenThread({ currentYear, isHighlighted = false }: GoldenThreadProps) {
  const yearBE = adToBe(currentYear);

  return (
    <div className="golden-thread-container">
      {/* The Golden Thread Line */}
      <motion.div
        className={`golden-thread-line ${isHighlighted ? 'highlighted' : ''}`}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Left arrow indicator */}
        <div className="thread-arrow left" />
        {/* Right arrow indicator */}
        <div className="thread-arrow right" />
      </motion.div>

      {/* Year Display - Floating above the thread */}
      <motion.div
        className="year-badge"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="year-badge-inner">
          <span className="year-ad">{currentYear}</span>
          <span className="year-separator">|</span>
          <span className="year-be">พ.ศ. {yearBE}</span>
        </div>
      </motion.div>

      {/* Glow effect */}
      <div className="thread-glow" />
    </div>
  );
}
