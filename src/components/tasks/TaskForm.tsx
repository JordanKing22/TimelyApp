import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Task, SubStep, Priority } from '../../types/task';
import { DurationPicker } from './DurationPicker';
import { SubStepList } from './SubStepList';
import { palette, priorityColor } from '../../utils/colors';

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

interface Props {
  initialTask?: Partial<Task>;
  initialSubSteps?: SubStep[];
  onSave: (data: {
    title: string;
    notes: string | null;
    priority: Priority;
    estimatedMinutes: number;
    dueDate: string | null;
  }) => void;
  onAddSubStep?: (title: string) => void;
  onToggleSubStep?: (id: string, taskId: string, isComplete: boolean) => void;
  onDeleteSubStep?: (id: string, taskId: string) => void;
  onAutoChunk?: () => void;
  saving?: boolean;
}

export function TaskForm({
  initialTask,
  initialSubSteps = [],
  onSave,
  onAddSubStep,
  onToggleSubStep,
  onDeleteSubStep,
  onAutoChunk,
  saving = false,
}: Props) {
  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [notes, setNotes] = useState(initialTask?.notes ?? '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? 'medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(initialTask?.estimatedMinutes ?? 25);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      notes: notes.trim() || null,
      priority,
      estimatedMinutes,
      dueDate: initialTask?.dueDate ?? null,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <TextInput
        label="Task title *"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
        autoFocus
        returnKeyType="next"
      />

      <TextInput
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={[styles.input, styles.notesInput]}
      />

      <Text style={styles.fieldLabel}>Estimated time</Text>
      <DurationPicker value={estimatedMinutes} onChange={setEstimatedMinutes} />

      <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Priority</Text>
      <View style={styles.priorityRow}>
        {PRIORITIES.map((p) => {
          const selected = priority === p.value;
          const color = priorityColor(p.value);
          return (
            <TouchableOpacity
              key={p.value}
              style={[styles.priorityBtn, { borderColor: color }, selected && { backgroundColor: color }]}
              onPress={() => setPriority(p.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.priorityLabel, { color: selected ? '#fff' : color }]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {onAddSubStep && onToggleSubStep && onDeleteSubStep && (
        <SubStepList
          subSteps={initialSubSteps}
          onAdd={onAddSubStep}
          onToggle={onToggleSubStep}
          onDelete={onDeleteSubStep}
          onAutoChunk={onAutoChunk}
        />
      )}

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.saveBtn}
        contentStyle={styles.saveBtnContent}
        disabled={!title.trim() || saving}
        loading={saving}
      >
        Save Task
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  input: {
    marginBottom: 12,
    backgroundColor: palette.surface,
  },
  notesInput: {
    height: 90,
  },
  fieldLabel: {
    fontWeight: '600',
    color: palette.textSecondary,
    fontSize: 13,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityBtn: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  priorityLabel: {
    fontWeight: '700',
    fontSize: 13,
  },
  saveBtn: {
    marginTop: 24,
    borderRadius: 24,
  },
  saveBtnContent: {
    paddingVertical: 6,
  },
});
