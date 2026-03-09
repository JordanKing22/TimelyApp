import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { humanizeDuration } from '../../utils/time';
import { palette } from '../../utils/colors';

interface Props {
  minutes: number;
}

export function TimeChip({ minutes }: Props) {
  return (
    <View style={styles.chip}>
      <MaterialCommunityIcons name="clock-outline" size={12} color={palette.textSecondary} />
      <Text style={styles.label} variant="labelSmall">
        {humanizeDuration(minutes)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: palette.surfaceVariant,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  label: {
    color: palette.textSecondary,
    fontSize: 11,
  },
});
