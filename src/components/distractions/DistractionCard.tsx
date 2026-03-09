import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Distraction } from '../../types/distraction';
import { formatTime } from '../../utils/time';
import { categoryColor, palette } from '../../utils/colors';

const CATEGORY_ICONS: Record<string, string> = {
  phone: '📱',
  thought: '💭',
  environment: '🌿',
  other: '✦',
};

interface Props {
  distraction: Distraction;
  onDelete?: (id: string) => void;
}

export function DistractionCard({ distraction, onDelete }: Props) {
  const color = categoryColor(distraction.category);
  return (
    <View style={styles.card}>
      <View style={[styles.dot, { backgroundColor: color }]}>
        <Text style={styles.icon}>{CATEGORY_ICONS[distraction.category] ?? '✦'}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.category}>{distraction.category}</Text>
        {distraction.note ? <Text style={styles.note}>{distraction.note}</Text> : null}
        <Text style={styles.time}>{formatTime(distraction.loggedAt)}</Text>
      </View>
      {onDelete && (
        <IconButton
          icon="close"
          size={16}
          iconColor={palette.textDisabled}
          onPress={() => onDelete(distraction.id)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: 12,
    marginBottom: 8,
    paddingVertical: 10,
    paddingLeft: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    opacity: 0.85,
  },
  icon: { fontSize: 16 },
  content: { flex: 1 },
  category: {
    fontWeight: '600',
    fontSize: 14,
    color: palette.textPrimary,
    textTransform: 'capitalize',
  },
  note: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: palette.textDisabled,
    marginTop: 2,
  },
});
