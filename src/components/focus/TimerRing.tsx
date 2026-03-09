import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ProgressRing } from '../common/ProgressRing';
import { formatSeconds } from '../../utils/time';
import { Phase } from '../../types/focus';
import { palette } from '../../utils/colors';

const PHASE_COLORS: Record<Phase, string> = {
  idle: palette.border,
  work: palette.primary,
  short_break: palette.success,
  long_break: palette.accent,
  complete: palette.success,
};

interface Props {
  secondsRemaining: number;
  totalSeconds: number;
  phase: Phase;
}

export function TimerRing({ secondsRemaining, totalSeconds, phase }: Props) {
  const progress = totalSeconds > 0 ? secondsRemaining / totalSeconds : 0;
  const color = PHASE_COLORS[phase];

  return (
    <View style={styles.container}>
      <ProgressRing
        progress={progress}
        size={240}
        strokeWidth={14}
        color={color}
        trackColor={color + '33'}
      >
        <View style={styles.inner}>
          <Text style={[styles.time, { color }]}>{formatSeconds(secondsRemaining)}</Text>
        </View>
      </ProgressRing>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontSize: 52,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },
});
