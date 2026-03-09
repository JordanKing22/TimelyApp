import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, IconButton } from 'react-native-paper';
import { Task } from '../../types/task';
import { PriorityBadge } from '../common/PriorityBadge';
import { TimeChip } from '../common/TimeChip';
import { palette } from '../../utils/colors';

interface Props {
  task: Task;
  subStepCount?: number;
  completedSubStepCount?: number;
  onToggle: (id: string, isComplete: boolean) => void;
  onPress: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, subStepCount = 0, completedSubStepCount = 0, onToggle, onPress, onDelete }: Props) {
  return (
    <TouchableOpacity onPress={() => onPress(task)} activeOpacity={0.7} style={[styles.card, task.isComplete && styles.complete]}>
      <Checkbox.Android
        status={task.isComplete ? 'checked' : 'unchecked'}
        onPress={() => onToggle(task.id, !task.isComplete)}
        color={palette.primary}
      />
      <View style={styles.content}>
        <Text
          variant="bodyLarge"
          style={[styles.title, task.isComplete && styles.strikethrough]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        <View style={styles.meta}>
          <PriorityBadge priority={task.priority} compact />
          <TimeChip minutes={task.estimatedMinutes} />
          {subStepCount > 0 && (
            <View style={styles.steps}>
              <Text style={styles.stepsText}>{completedSubStepCount}/{subStepCount} steps</Text>
            </View>
          )}
        </View>
      </View>
      <IconButton
        icon="trash-can-outline"
        size={18}
        iconColor={palette.textDisabled}
        onPress={() => onDelete(task.id)}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 12,
    marginBottom: 8,
    paddingRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  complete: {
    opacity: 0.55,
  },
  content: {
    flex: 1,
    paddingVertical: 12,
  },
  title: {
    fontWeight: '600',
    color: palette.textPrimary,
    marginBottom: 6,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: palette.textDisabled,
  },
  meta: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  steps: {
    backgroundColor: palette.surfaceVariant,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stepsText: {
    fontSize: 11,
    color: palette.textSecondary,
  },
});
