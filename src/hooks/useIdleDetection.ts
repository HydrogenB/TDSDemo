import { useState, useEffect, useCallback, useRef } from 'react';

interface UseIdleDetectionOptions {
  idleTimeout?: number;      // Time in ms before considered idle (default: 30000)
  onIdle?: () => void;       // Callback when user becomes idle
  onActive?: () => void;     // Callback when user becomes active
}

interface UseIdleDetectionReturn {
  isIdle: boolean;
  resetIdleTimer: () => void;
  lastActivityTime: number;
}

export function useIdleDetection(options: UseIdleDetectionOptions = {}): UseIdleDetectionReturn {
  const {
    idleTimeout = 30000, // 30 seconds default
    onIdle,
    onActive,
  } = options;

  const [isIdle, setIsIdle] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const timerRef = useRef<number | null>(null);
  const isIdleRef = useRef(false);

  const resetIdleTimer = useCallback(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Update last activity time
    setLastActivityTime(Date.now());

    // If was idle, mark as active
    if (isIdleRef.current) {
      isIdleRef.current = false;
      setIsIdle(false);
      onActive?.();
    }

    // Set new idle timer
    timerRef.current = window.setTimeout(() => {
      isIdleRef.current = true;
      setIsIdle(true);
      onIdle?.();
    }, idleTimeout);
  }, [idleTimeout, onIdle, onActive]);

  // Set up event listeners for user activity
  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'touchstart',
      'touchmove',
      'keydown',
      'wheel',
      'scroll',
    ];

    const handleActivity = () => {
      resetIdleTimer();
    };

    // Add listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timer
    resetIdleTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resetIdleTimer]);

  return {
    isIdle,
    resetIdleTimer,
    lastActivityTime,
  };
}
