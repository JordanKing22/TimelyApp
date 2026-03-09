import { useEffect } from 'react';
import { useTasksContext } from '../store/TasksContext';
import { todayISO } from '../utils/time';
import { Task } from '../types/task';

export function useTasks() {
  const ctx = useTasksContext();

  useEffect(() => {
    ctx.loadTasks();
  }, []);

  const today = todayISO();
  const todayTasks = ctx.state.tasks.filter((t) => t.dueDate === today);
  const incompleteTasks = ctx.state.tasks.filter((t) => !t.isComplete);
  const completedTodayCount = todayTasks.filter((t) => t.isComplete).length;

  const getSubSteps = (taskId: string) => ctx.state.subSteps[taskId] ?? [];

  const nextFocusTask: Task | null = incompleteTasks.find(
    (t) => t.priority === 'urgent'
  ) ?? incompleteTasks.find(
    (t) => t.priority === 'high'
  ) ?? incompleteTasks[0] ?? null;

  return {
    ...ctx,
    tasks: ctx.state.tasks,
    todayTasks,
    incompleteTasks,
    completedTodayCount,
    totalTodayCount: todayTasks.length,
    getSubSteps,
    nextFocusTask,
    loading: ctx.state.loading,
  };
}
