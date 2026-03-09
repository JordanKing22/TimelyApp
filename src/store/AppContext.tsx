import React from 'react';
import { TasksProvider } from './TasksContext';
import { FocusProvider } from './FocusContext';
import { DistractionsProvider } from './DistractionsContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <TasksProvider>
      <FocusProvider>
        <DistractionsProvider>
          {children}
        </DistractionsProvider>
      </FocusProvider>
    </TasksProvider>
  );
}
