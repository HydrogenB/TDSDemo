import { useState, useCallback, useRef, useEffect } from 'react';

interface PhysicsConfig {
  friction: number;      // Friction coefficient (0-1, higher = more friction)
  minVelocity: number;   // Minimum velocity before stopping
  maxVelocity: number;   // Maximum velocity cap
  yearPerPixel: number;  // How many years per pixel of scroll
}

const DEFAULT_CONFIG: PhysicsConfig = {
  friction: 0.95,        // Heavy flywheel effect - slow decay
  minVelocity: 0.1,
  maxVelocity: 50,
  yearPerPixel: 0.5,
};

interface UseTimelinePhysicsReturn {
  currentYear: number;
  velocity: number;
  isDragging: boolean;
  handleTouchStart: (e: React.TouchEvent | React.MouseEvent) => void;
  handleTouchMove: (e: React.TouchEvent | React.MouseEvent) => void;
  handleTouchEnd: () => void;
  handleWheel: (e: React.WheelEvent) => void;
  setYear: (year: number) => void;
  stopMomentum: () => void;
}

export function useTimelinePhysics(
  startYear: number = 1500,
  minYear: number = 1500,
  maxYear: number = 2025,
  config: Partial<PhysicsConfig> = {}
): UseTimelinePhysicsReturn {
  const settings = { ...DEFAULT_CONFIG, ...config };

  const [currentYear, setCurrentYear] = useState(startYear);
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const lastY = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const animationFrame = useRef<number | null>(null);
  const velocityRef = useRef<number>(0);
  const yearRef = useRef<number>(startYear);

  // Clamp year within bounds
  const clampYear = useCallback((year: number) => {
    return Math.max(minYear, Math.min(maxYear, year));
  }, [minYear, maxYear]);

  // Update year with physics
  const updateYear = useCallback((deltaY: number) => {
    const deltaYears = deltaY * settings.yearPerPixel;
    const newYear = clampYear(yearRef.current + deltaYears);
    yearRef.current = newYear;
    setCurrentYear(Math.round(newYear));
  }, [clampYear, settings.yearPerPixel]);

  // Animation loop for momentum
  const animateMomentum = useCallback(() => {
    if (Math.abs(velocityRef.current) < settings.minVelocity) {
      velocityRef.current = 0;
      setVelocity(0);
      return;
    }

    // Apply friction (heavy flywheel effect)
    velocityRef.current *= settings.friction;

    // Update position based on velocity
    updateYear(velocityRef.current);
    setVelocity(velocityRef.current);

    // Continue animation
    animationFrame.current = requestAnimationFrame(animateMomentum);
  }, [settings.friction, settings.minVelocity, updateYear]);

  // Stop any ongoing momentum
  const stopMomentum = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    velocityRef.current = 0;
    setVelocity(0);
  }, []);

  // Handle touch/mouse start
  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    stopMomentum();
    setIsDragging(true);

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    lastY.current = clientY;
    lastTime.current = performance.now();
  }, [stopMomentum]);

  // Handle touch/mouse move
  const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const currentTime = performance.now();

    const deltaY = lastY.current - clientY;
    const deltaTime = currentTime - lastTime.current;

    // Calculate velocity (pixels per frame)
    if (deltaTime > 0) {
      const instantVelocity = (deltaY / deltaTime) * 16; // Normalize to ~60fps
      velocityRef.current = Math.max(
        -settings.maxVelocity,
        Math.min(settings.maxVelocity, instantVelocity)
      );
    }

    updateYear(deltaY);

    lastY.current = clientY;
    lastTime.current = currentTime;
  }, [isDragging, settings.maxVelocity, updateYear]);

  // Handle touch/mouse end
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);

    // Start momentum animation if there's velocity
    if (Math.abs(velocityRef.current) > settings.minVelocity) {
      animationFrame.current = requestAnimationFrame(animateMomentum);
    }
  }, [animateMomentum, settings.minVelocity]);

  // Handle mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    stopMomentum();

    // Apply wheel delta directly
    const deltaY = e.deltaY * 0.5;
    updateYear(deltaY);

    // Add some velocity for smooth stop
    velocityRef.current = deltaY * 0.3;
    setVelocity(velocityRef.current);

    // Start gentle momentum
    animationFrame.current = requestAnimationFrame(animateMomentum);
  }, [stopMomentum, updateYear, animateMomentum]);

  // Set year directly (for programmatic control)
  const setYear = useCallback((year: number) => {
    stopMomentum();
    const clampedYear = clampYear(year);
    yearRef.current = clampedYear;
    setCurrentYear(clampedYear);
  }, [stopMomentum, clampYear]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    currentYear,
    velocity,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    setYear,
    stopMomentum,
  };
}
