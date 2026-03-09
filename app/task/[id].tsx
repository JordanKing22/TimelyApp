import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTasksContext } from '../../src/store/TasksContext';
import { TaskForm } from '../../src/components/tasks/TaskForm';
import { Priority } from '../../src/types/task';
import { chunkTask } from '../../src/utils/adhd';
import { palette } from '../../src/utils/colors';

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, updateTask, createSubStep, toggleSubStep, deleteSubStep, bulkCreateSubSteps } = useTasksContext();
  const [saving, setSaving] = useState(false);

  const task = state.tasks.find((t) => t.id === id);
  const subSteps = state.subSteps[id ?? ''] ?? [];

  if (!task) {
    return <View style={styles.loading}><ActivityIndicator size="large" /></View>;
  }

  const handleSave = async (data: {
    title: string;
    notes: string | null;
    priority: Priority;
    estimatedMinutes: number;
    dueDate: string | null;
  }) => {
    setSaving(true);
    try {
      await updateTask(id!, data);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubStep = async (title: string) => {
    await createSubStep(id!, title);
  };

  const handleAutoChunk = async () => {
    const chunks = chunkTask(task.title, task.estimatedMinutes, id!);
    await bulkCreateSubSteps(chunks);
  };

  return (
    <TaskForm
      initialTask={task}
      initialSubSteps={subSteps}
      onSave={handleSave}
      onAddSubStep={handleAddSubStep}
      onToggleSubStep={toggleSubStep}
      onDeleteSubStep={deleteSubStep}
      onAutoChunk={handleAutoChunk}
      saving={saving}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background,
  },
});
