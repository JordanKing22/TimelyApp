import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { DistractionCategory } from '../../types/distraction';
import { categoryColor, palette } from '../../utils/colors';

const CATEGORIES: { value: DistractionCategory; label: string; icon: string }[] = [
  { value: 'phone', label: 'Phone', icon: '📱' },
  { value: 'thought', label: 'Thought', icon: '💭' },
  { value: 'environment', label: 'Environment', icon: '🌿' },
  { value: 'other', label: 'Other', icon: '✦' },
];

interface Props {
  selected: DistractionCategory | null;
  onSelect: (cat: DistractionCategory) => void;
}

export function CategoryPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {CATEGORIES.map((c) => {
        const isSelected = selected === c.value;
        const color = categoryColor(c.value);
        return (
          <TouchableOpacity
            key={c.value}
            style={[styles.btn, { borderColor: color }, isSelected && { backgroundColor: color }]}
            onPress={() => onSelect(c.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{c.icon}</Text>
            <Text style={[styles.label, { color: isSelected ? '#fff' : color }]}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  btn: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 3,
  },
  icon: { fontSize: 18 },
  label: {
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
  },
});
