import { DistractionCategory } from '../types/distraction';

interface ReframeEntry {
  message: string;
  tip: string;
}

const reframeMap: Record<DistractionCategory, ReframeEntry[]> = {
  phone: [
    {
      message: 'Phone distractions often signal your brain needs a quick break.',
      tip: 'Try keeping your phone face-down or in another room during focus blocks.',
    },
    {
      message: 'Noticing you reached for your phone is the first step to changing the habit.',
      tip: 'Set a "phone check" time at the end of each break — your messages will still be there.',
    },
  ],
  thought: [
    {
      message: 'Random thoughts during focus are a sign of an active, creative mind.',
      tip: 'Keep a "brain dump" notepad nearby. Jot the thought down and return to it at break time.',
    },
    {
      message: 'Your brain is doing its job — generating ideas non-stop.',
      tip: 'Schedule a 5-minute "worry/idea" slot at the end of the day to process loose thoughts.',
    },
  ],
  environment: [
    {
      message: 'Environment distractions are external — they\'re not a reflection of your focus ability.',
      tip: 'Noise-cancelling headphones or a white-noise app can create a consistent focus zone.',
    },
    {
      message: 'Noticing your environment is the first step to optimizing it.',
      tip: 'Try a "focus corner" — a specific spot you only use for work, signalling to your brain it\'s time.',
    },
  ],
  other: [
    {
      message: 'Every distraction you log is data, not failure.',
      tip: 'Review your weekly patterns to spot the times of day when you focus best.',
    },
    {
      message: 'Catching yourself drifting means your awareness is working.',
      tip: 'Experiment with shorter focus blocks (15–20 min) if longer sessions feel hard to sustain.',
    },
  ],
};

/**
 * Returns a reframe message and tip for the given distraction category.
 * Rotates through entries based on the current hour to add variety.
 */
export function getReframe(category: DistractionCategory): ReframeEntry {
  const entries = reframeMap[category];
  const index = new Date().getHours() % entries.length;
  return entries[index];
}

/**
 * Returns a summary reframe based on total distraction count.
 */
export function getSummaryReframe(count: number): string {
  if (count === 0) return 'Excellent focus session — zero distractions logged!';
  if (count <= 2) return `You logged ${count} distraction${count > 1 ? 's' : ''} — that\'s a strong session.`;
  if (count <= 5) return `${count} distractions noticed and logged. Awareness is the superpower.`;
  return `${count} distractions logged today. Your brain is telling you something — check your reframe tips.`;
}
