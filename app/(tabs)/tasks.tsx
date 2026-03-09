import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, FAB, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTasks } from '../../src/hooks/useTasks';
import { TaskCard } from '../../src/components/tasks/TaskCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { palette } from '../../src/utils/colors';
import { Task, Priority } from '../../src/types/task';
import { todayISO } from '../../src/utils/time';

type Filter = 'all' | 'today' | 'low' | 'medium' | 'high' | 'urgent';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

function applyFilter(tasks: Task[], filter: Filter, query: string): Task[] {
  let result = tasks;
  if (filter === 'today') {
    const today = todayISO();
    result = result.filter((t) => t.dueDate === today);
  } else if (['low', 'medium', 'high', 'urgent'].includes(filter)) {
    result = result.filter((t) => t.priority === (filter as Priority));
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(q));
  }
  return result;
}

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, getSubSteps, toggleTask, deleteTask, loading } = useTasks();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filtered = applyFilter(tasks, filter, query);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search tasks..."
          value={query}
          onChangeText={setQuery}
          style={styles.search}
          inputStyle={{ fontSize: 15 }}
        />

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, filter === f.key && styles.chipActive]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipLabel, filter === f.key && styles.chipLabelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(t) => t.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            loading ? null : (
              <EmptyState
                icon="checkbox-multiple-blank-outline"
                title={query || filter !== 'all' ? 'No matching tasks' : 'No tasks yet'}
                message={
                  query || filter !== 'all'
                    ? 'Try a different filter or search term.'
                    : 'Tap + to add your first task and start making progress.'
                }
                actionLabel={!query && filter === 'all' ? 'Add Task' : undefined}
                onAction={() => router.push('/task/new')}
              />
            )
          }
          renderItem={({ item: task }) => {
            const subSteps = getSubSteps(task.id);
            return (
              <TaskCard
                task={task}
                subStepCount={subSteps.length}
                completedSubStepCount={subSteps.filter((s) => s.isComplete).length}
                onToggle={toggleTask}
                onPress={(t) => router.push({ pathname: '/task/[id]', params: { id: t.id } })}
                onDelete={deleteTask}
              />
            );
          }}
        />
      </View>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/task/new')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  search: {
    marginBottom: 10,
    backgroundColor: palette.surface,
    borderRadius: 12,
    elevation: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'nowrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  chipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.textSecondary,
  },
  chipLabelActive: {
    color: '#fff',
  },
  list: {
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: palette.primary,
  },
});
