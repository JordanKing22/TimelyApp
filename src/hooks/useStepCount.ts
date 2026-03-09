import { useEffect, useState } from 'react';
import { Pedometer } from 'expo-sensors';

interface StepCountState {
  available: boolean;
  steps: number | null;
  loading: boolean;
}

export function useStepCount(): StepCountState {
  const [state, setState] = useState<StepCountState>({ available: false, steps: null, loading: true });

  useEffect(() => {
    let subscription: ReturnType<typeof Pedometer.watchStepCount> | null = null;

    async function init() {
      try {
        const available = await Pedometer.isAvailableAsync();
        if (!available) {
          setState({ available: false, steps: null, loading: false });
          return;
        }

        // Get today's steps
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();

        try {
          const result = await Pedometer.getStepCountAsync(start, end);
          setState({ available: true, steps: result.steps, loading: false });
        } catch {
          setState({ available: true, steps: 0, loading: false });
        }

        // Subscribe to live updates
        subscription = Pedometer.watchStepCount((result) => {
          setState((prev) => ({ ...prev, steps: result.steps }));
        });
      } catch {
        setState({ available: false, steps: null, loading: false });
      }
    }

    init();

    return () => {
      subscription?.remove();
    };
  }, []);

  return state;
}
