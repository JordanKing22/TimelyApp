import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../../utils/colors';

const PRESETS = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120];

interface Props {
  value: number;
  onChange: (minutes: number) => void;
}

export function DurationPicker({ value, onChange }: Props) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PRESETS.map((preset) => {
          const selected = preset === value;
          return (
            <TouchableOpacity
              key={preset}
              style={[styles.chip, selected && styles.selected]}
              onPress={() => onChange(preset)}
              activeOpacity={0.7}
            >
              <Text style={[styles.label, selected && styles.selectedLabel]}>
                {preset < 60 ? `${preset}m` : `${preset / 60}h`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    minWidth: 52,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: palette.textSecondary,
  },
  selectedLabel: {
    color: '#fff',
  },
});
