import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { DistractionCategory } from '../../types/distraction';
import { getReframe } from '../../utils/reframe';
import { palette } from '../../utils/colors';

interface Props {
  category: DistractionCategory;
}

export function ReframeMessage({ category }: Props) {
  const { message, tip } = getReframe(category);
  return (
    <Surface style={styles.card} elevation={0}>
      <Text style={styles.emoji}>💡</Text>
      <View style={styles.content}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.tip}>{tip}</Text>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 14,
    backgroundColor: palette.primary + '12',
    borderWidth: 1,
    borderColor: palette.primary + '30',
    gap: 10,
    alignItems: 'flex-start',
  },
  emoji: { fontSize: 22, marginTop: 2 },
  content: { flex: 1 },
  message: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textPrimary,
    marginBottom: 6,
    lineHeight: 20,
  },
  tip: {
    fontSize: 13,
    color: palette.textSecondary,
    lineHeight: 19,
  },
});
