import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { palette } from '../../utils/colors';

interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  if (streak === 0) return null;
  return (
    <View style={styles.badge}>
      <MaterialCommunityIcons name="fire" size={18} color={palette.warning} />
      <Text style={styles.text}>
        {streak} day streak
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.warning + '22',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    color: palette.warning,
    fontWeight: '700',
    fontSize: 14,
  },
});
