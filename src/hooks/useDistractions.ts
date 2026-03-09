import { useEffect } from 'react';
import { useDistractionsContext } from '../store/DistractionsContext';
import { getDatabase } from '../db/database';
import { getDistractionStats } from '../db/distractions';
import { useState } from 'react';
import { DistractionStats } from '../types/distraction';

export function useDistractions() {
  const ctx = useDistractionsContext();

  useEffect(() => {
    ctx.loadDistractions();
  }, []);

  return ctx;
}

export function useDistractionStats(days = 7) {
  const [stats, setStats] = useState<DistractionStats | null>(null);

  useEffect(() => {
    getDatabase().then((db) => getDistractionStats(db, days)).then(setStats);
  }, [days]);

  return stats;
}
