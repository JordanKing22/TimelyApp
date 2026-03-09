import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { ProgressRing } from '../common/ProgressRing';
import { palette } from '../../utils/colors';

interface Props {
  completed: number;
  total: number;
}

export function DailyProgressCard({ completed, total }: Props) {
  const progress = total > 0 ? completed / total : 0;
  const percent = Math.round(progress * 100);

  return (
    <Surface style={styles.card} elevation={1}>
      <ProgressRing progress={progress} size={88} strokeWidth={8} color={palette.primary}>
        <Text style={styles.percent}>{percent}%</Text>
      </ProgressRing>
      <View style={styles.info}>
        <Text variant="titleMedium" style={styles.title}>Today's Progress</Text>
        <Text variant="bodyMedium" style={styles.sub}>
          {completed} of {total} task{total !== 1 ? 's' : ''} done
        </Text>
        {completed === total && total > 0 && (
          <Text style={styles.congrats}>All done! Great work!</Text>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
    marginBottom: 12,
  },
  percent: {
    fontWeight: '800',
    fontSize: 16,
    color: palette.primary,
  },
  info: { flex: 1 },
  title: {
    fontWeight: '700',
    color: palette.textPrimary,
  },
  sub: {
    color: palette.textSecondary,
    marginTop: 2,
  },
  congrats: {
    marginTop: 4,
    color: palette.success,
    fontWeight: '600',
    fontSize: 13,
  },
});
