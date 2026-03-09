import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, IconButton } from 'react-native-paper';
import { SubStep } from '../../types/task';
import { palette } from '../../utils/colors';

interface Props {
  step: SubStep;
  onToggle: (id: string, taskId: string, isComplete: boolean) => void;
  onDelete: (id: string, taskId: string) => void;
}

export function SubStepItem({ step, onToggle, onDelete }: Props) {
  return (
    <View style={styles.row}>
      <Checkbox.Android
        status={step.isComplete ? 'checked' : 'unchecked'}
        onPress={() => onToggle(step.id, step.taskId, !step.isComplete)}
        color={palette.primary}
      />
      <TouchableOpacity onPress={() => onToggle(step.id, step.taskId, !step.isComplete)} style={styles.label}>
        <Text style={[styles.text, step.isComplete && styles.done]}>{step.title}</Text>
      </TouchableOpacity>
      <IconButton
        icon="close"
        size={16}
        iconColor={palette.textDisabled}
        onPress={() => onDelete(step.id, step.taskId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  label: { flex: 1 },
  text: {
    fontSize: 15,
    color: palette.textPrimary,
  },
  done: {
    textDecorationLine: 'line-through',
    color: palette.textDisabled,
  },
});
