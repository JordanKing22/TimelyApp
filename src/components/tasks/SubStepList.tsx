import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { SubStep } from '../../types/task';
import { SubStepItem } from './SubStepItem';
import { SectionHeader } from '../common/SectionHeader';
import { palette } from '../../utils/colors';

interface Props {
  subSteps: SubStep[];
  onAdd: (title: string) => void;
  onToggle: (id: string, taskId: string, isComplete: boolean) => void;
  onDelete: (id: string, taskId: string) => void;
  onAutoChunk?: () => void;
}

export function SubStepList({ subSteps, onAdd, onToggle, onDelete, onAutoChunk }: Props) {
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewTitle('');
  };

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Sub-steps"
        subtitle={subSteps.length > 0 ? `${subSteps.filter((s) => s.isComplete).length}/${subSteps.length} done` : undefined}
        right={
          onAutoChunk ? (
            <Button compact onPress={onAutoChunk} icon="auto-fix" textColor={palette.primary}>
              Auto-chunk
            </Button>
          ) : undefined
        }
      />
      {subSteps.length === 0 && (
        <Text style={styles.empty}>Break this task into smaller steps</Text>
      )}
      {subSteps.map((step) => (
        <SubStepItem key={step.id} step={step} onToggle={onToggle} onDelete={onDelete} />
      ))}
      <View style={styles.addRow}>
        <TextInput
          value={newTitle}
          onChangeText={setNewTitle}
          placeholder="Add a step..."
          mode="outlined"
          dense
          style={styles.input}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Button mode="contained-tonal" onPress={handleAdd} disabled={!newTitle.trim()} style={styles.addBtn}>
          Add
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  empty: {
    color: palette.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  addRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  addBtn: {
    borderRadius: 8,
  },
});
