import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { Task, SubStep, Priority } from '../types/task';
import { getDatabase } from '../db/database';
import * as TasksDB from '../db/tasks';

interface TasksState {
  tasks: Task[];
  subSteps: Record<string, SubStep[]>;
  loading: boolean;
}

type TasksAction =
  | { type: 'LOAD_TASKS'; payload: { tasks: Task[]; subSteps: Record<string, SubStep[]> } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: { id: string; isComplete: boolean } }
  | { type: 'SET_SUB_STEPS'; payload: { taskId: string; subSteps: SubStep[] } }
  | { type: 'ADD_SUB_STEP'; payload: SubStep }
  | { type: 'TOGGLE_SUB_STEP'; payload: { id: string; taskId: string; isComplete: boolean } }
  | { type: 'DELETE_SUB_STEP'; payload: { id: string; taskId: string } }
  | { type: 'SET_LOADING'; payload: boolean };

function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case 'LOAD_TASKS':
      return { ...state, tasks: action.payload.tasks, subSteps: action.payload.subSteps, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)) };
    case 'DELETE_TASK': {
      const { [action.payload]: _, ...rest } = state.subSteps;
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload), subSteps: rest };
    }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, isComplete: action.payload.isComplete } : t
        ),
      };
    case 'SET_SUB_STEPS':
      return { ...state, subSteps: { ...state.subSteps, [action.payload.taskId]: action.payload.subSteps } };
    case 'ADD_SUB_STEP':
      return {
        ...state,
        subSteps: {
          ...state.subSteps,
          [action.payload.taskId]: [...(state.subSteps[action.payload.taskId] ?? []), action.payload],
        },
      };
    case 'TOGGLE_SUB_STEP':
      return {
        ...state,
        subSteps: {
          ...state.subSteps,
          [action.payload.taskId]: (state.subSteps[action.payload.taskId] ?? []).map((s) =>
            s.id === action.payload.id ? { ...s, isComplete: action.payload.isComplete } : s
          ),
        },
      };
    case 'DELETE_SUB_STEP':
      return {
        ...state,
        subSteps: {
          ...state.subSteps,
          [action.payload.taskId]: (state.subSteps[action.payload.taskId] ?? []).filter(
            (s) => s.id !== action.payload.id
          ),
        },
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

interface TasksContextValue {
  state: TasksState;
  loadTasks: () => Promise<void>;
  createTask: (data: { title: string; notes?: string | null; priority: Priority; estimatedMinutes: number; dueDate?: string | null }) => Promise<Task>;
  updateTask: (id: string, data: { title?: string; notes?: string | null; priority?: Priority; estimatedMinutes?: number; dueDate?: string | null }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string, isComplete: boolean) => Promise<void>;
  createSubStep: (taskId: string, title: string) => Promise<SubStep>;
  toggleSubStep: (id: string, taskId: string, isComplete: boolean) => Promise<void>;
  deleteSubStep: (id: string, taskId: string) => Promise<void>;
  bulkCreateSubSteps: (subSteps: SubStep[]) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, { tasks: [], subSteps: {}, loading: true });

  const loadTasks = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const db = await getDatabase();
    const tasks = await TasksDB.getAllTasks(db);
    const subSteps: Record<string, SubStep[]> = {};
    for (const task of tasks) {
      subSteps[task.id] = await TasksDB.getSubStepsForTask(db, task.id);
    }
    dispatch({ type: 'LOAD_TASKS', payload: { tasks, subSteps } });
  }, []);

  const createTask = useCallback(async (data: Parameters<TasksContextValue['createTask']>[0]) => {
    const db = await getDatabase();
    const task = await TasksDB.createTask(db, { ...data, estimatedMinutes: data.estimatedMinutes ?? 25 });
    dispatch({ type: 'ADD_TASK', payload: task });
    return task;
  }, []);

  const updateTask = useCallback(async (id: string, data: Parameters<TasksContextValue['updateTask']>[1]) => {
    const db = await getDatabase();
    await TasksDB.updateTask(db, id, data);
    const updated = await TasksDB.getTaskById(db, id);
    if (updated) dispatch({ type: 'UPDATE_TASK', payload: updated });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const db = await getDatabase();
    await TasksDB.deleteTask(db, id);
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const toggleTask = useCallback(async (id: string, isComplete: boolean) => {
    dispatch({ type: 'TOGGLE_TASK', payload: { id, isComplete } }); // optimistic
    const db = await getDatabase();
    await TasksDB.toggleTaskComplete(db, id, isComplete);
  }, []);

  const createSubStep = useCallback(async (taskId: string, title: string) => {
    const db = await getDatabase();
    const existing = state.subSteps[taskId] ?? [];
    const step = await TasksDB.createSubStep(db, taskId, title, existing.length);
    dispatch({ type: 'ADD_SUB_STEP', payload: step });
    return step;
  }, [state.subSteps]);

  const toggleSubStep = useCallback(async (id: string, taskId: string, isComplete: boolean) => {
    dispatch({ type: 'TOGGLE_SUB_STEP', payload: { id, taskId, isComplete } }); // optimistic
    const db = await getDatabase();
    await TasksDB.toggleSubStep(db, id, isComplete);
  }, []);

  const deleteSubStep = useCallback(async (id: string, taskId: string) => {
    const db = await getDatabase();
    await TasksDB.deleteSubStep(db, id);
    dispatch({ type: 'DELETE_SUB_STEP', payload: { id, taskId } });
  }, []);

  const bulkCreateSubSteps = useCallback(async (subSteps: SubStep[]) => {
    const db = await getDatabase();
    await TasksDB.bulkCreateSubSteps(db, subSteps);
    if (subSteps.length > 0) {
      dispatch({ type: 'SET_SUB_STEPS', payload: { taskId: subSteps[0].taskId, subSteps } });
    }
  }, []);

  return (
    <TasksContext.Provider value={{ state, loadTasks, createTask, updateTask, deleteTask, toggleTask, createSubStep, toggleSubStep, deleteSubStep, bulkCreateSubSteps }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasksContext(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasksContext must be used within TasksProvider');
  return ctx;
}
