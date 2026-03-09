import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { Task } from '../../types/task';
import { PriorityBadge } from '../common/PriorityBadge';
import { TimeChip } from '../common/TimeChip';
import { palette } from '../../utils/colors';

interface Props {
  task: Task | null;
  onStartFocus: (task: Task) => void;
}

export function FocusBlockPreview({ task, onStartFocus }: Props) {
  if (!task) {
    return (
      <Surface style={styles.card} elevation={1}>
        <Text variant="bodyMedium" style={styles.empty}>
          No pending tasks — add one to start focusing!
        </Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.card} elevation={1}>
      <Text variant="labelSmall" style={styles.eyebrow}>NEXT UP</Text>
      <Text variant="titleMedium" style={styles.title} numberOfLines={2}>
        {task.title}
      </Text>
      <View style={styles.meta}>
        <PriorityBadge priority={task.priority} compact />
        <TimeChip minutes={task.estimatedMinutes} />
      </View>
      <Button
        mode="contained"
        onPress={() => onStartFocus(task)}
        style={styles.btn}
        contentStyle={styles.btnContent}
        icon="timer-outline"
      >
        Start Focus Session
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  eyebrow: {
    color: palette.primary,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  btn: {
    borderRadius: 24,
  },
  btnContent: {
    paddingVertical: 4,
  },
  empty: {
    color: palette.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
