import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Tracks total foreground (in-app) time for today.
 * This is a proxy for "screen time" since iOS/Android restrict
 * cross-app usage data for third-party apps.
 */
export function useAppUsage(): { foregroundMinutes: number } {
  const [foregroundSeconds, setForegroundSeconds] = useState(0);
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    // Mark session start
    sessionStartRef.current = Date.now();

    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (status === 'background' || status === 'inactive') {
        // Accumulate foreground time
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        setForegroundSeconds((prev) => prev + elapsed);
      } else if (status === 'active') {
        sessionStartRef.current = Date.now();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return { foregroundMinutes: Math.floor(foregroundSeconds / 60) };
}
