import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTasksContext } from '../../src/store/TasksContext';
import { TaskForm } from '../../src/components/tasks/TaskForm';
import { Priority } from '../../src/types/task';
import { chunkTask } from '../../src/utils/adhd';

export default function NewTaskScreen() {
  const router = useRouter();
  const { createTask, createSubStep, bulkCreateSubSteps } = useTasksContext();
  const [saving, setSaving] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [localSubSteps, setLocalSubSteps] = useState<import('../../src/types/task').SubStep[]>([]);

  const handleSave = async (data: {
    title: string;
    notes: string | null;
    priority: Priority;
    estimatedMinutes: number;
    dueDate: string | null;
  }) => {
    setSaving(true);
    try {
      const task = await createTask(data);
      if (localSubSteps.length > 0) {
        const withTaskId = localSubSteps.map((s) => ({ ...s, taskId: task.id }));
        await bulkCreateSubSteps(withTaskId);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubStep = (title: string) => {
    const { generateId } = require('../../src/utils/id');
    const { nowISO } = require('../../src/utils/time');
    setLocalSubSteps((prev) => [
      ...prev,
      { id: generateId(), taskId: '', title, isComplete: false, sortOrder: prev.length, createdAt: nowISO() },
    ]);
  };

  const handleToggleSubStep = (id: string, _taskId: string, isComplete: boolean) => {
    setLocalSubSteps((prev) => prev.map((s) => (s.id === id ? { ...s, isComplete } : s)));
  };

  const handleDeleteSubStep = (id: string) => {
    setLocalSubSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAutoChunk = () => {
    const { generateId } = require('../../src/utils/id');
    const { nowISO } = require('../../src/utils/time');
    // Use a placeholder title/duration for preview; will be finalized on save
    const chunks = chunkTask('New Task', 25, '').map((s) => ({
      ...s,
      id: generateId(),
      taskId: '',
      createdAt: nowISO(),
    }));
    setLocalSubSteps(chunks);
  };

  return (
    <TaskForm
      onSave={handleSave}
      onAddSubStep={handleAddSubStep}
      onToggleSubStep={handleToggleSubStep}
      onDeleteSubStep={handleDeleteSubStep}
      onAutoChunk={handleAutoChunk}
      initialSubSteps={localSubSteps}
      saving={saving}
    />
  );
}
