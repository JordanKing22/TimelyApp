import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Phase } from '../../types/focus';
import { palette } from '../../utils/colors';

const LABELS: Record<Phase, string> = {
  idle: 'Ready',
  work: 'Focus Time',
  short_break: 'Short Break',
  long_break: 'Long Break',
  complete: 'Session Complete!',
};

const DESCRIPTIONS: Record<Phase, string> = {
  idle: 'Select a task and start a session',
  work: 'Stay focused — you\'ve got this',
  short_break: 'Step away, stretch, breathe',
  long_break: 'Take a proper break — you earned it',
  complete: 'Great work! Review your session.',
};

interface Props {
  phase: Phase;
  cycle: number;
  totalCycles: number;
}

export function PhaseLabel({ phase, cycle, totalCycles }: Props) {
  return (
    <>
      <Text style={styles.label}>{LABELS[phase]}</Text>
      {phase === 'work' && (
        <Text style={styles.cycle}>Session {cycle + 1} of {totalCycles}</Text>
      )}
      <Text style={styles.description}>{DESCRIPTIONS[phase]}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.textPrimary,
    textAlign: 'center',
  },
  cycle: {
    fontSize: 14,
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 24,
  },
});
