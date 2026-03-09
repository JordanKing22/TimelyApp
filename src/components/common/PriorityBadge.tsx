import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Priority } from '../../types/task';
import { priorityColor } from '../../utils/colors';

const LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

interface Props {
  priority: Priority;
  compact?: boolean;
}

export function PriorityBadge({ priority, compact = false }: Props) {
  const color = priorityColor(priority);
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }, compact && styles.compact]}>
      <Text style={[styles.label, { color }]} variant="labelSmall">
        {LABELS[priority]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    fontWeight: '600',
    fontSize: 11,
  },
});
