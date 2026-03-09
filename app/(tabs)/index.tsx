import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTasks } from '../../src/hooks/useTasks';
import { useStepCount } from '../../src/hooks/useStepCount';
import { useAppUsage } from '../../src/hooks/useAppUsage';
import { DailyProgressCard } from '../../src/components/dashboard/DailyProgressCard';
import { FocusBlockPreview } from '../../src/components/dashboard/FocusBlockPreview';
import { StreakBadge } from '../../src/components/dashboard/StreakBadge';
import { TaskCard } from '../../src/components/tasks/TaskCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { palette } from '../../src/utils/colors';
import { Task } from '../../src/types/task';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function computeStreak(tasks: Task[]): number {
  // Simple streak: count consecutive days with at least one completed task
  const completedDays = new Set(
    tasks.filter((t) => t.completedAt).map((t) => t.completedAt!.split('T')[0])
  );
  let streak = 0;
  const date = new Date();
  while (true) {
    const key = date.toISOString().split('T')[0];
    if (!completedDays.has(key)) break;
    streak++;
    date.setDate(date.getDate() - 1);
  }
  return streak;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { tasks, todayTasks, completedTodayCount, totalTodayCount, getSubSteps, nextFocusTask, toggleTask, deleteTask } = useTasks();
  const steps = useStepCount();
  const { foregroundMinutes } = useAppUsage();
  const streak = computeStreak(tasks);

  const handleStartFocus = (task: Task) => {
    router.push({ pathname: '/focus/session', params: { taskId: task.id } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.greeting}>{getGreeting()} 👋</Text>
          <StreakBadge streak={streak} />
        </View>

        {/* Progress */}
        <DailyProgressCard completed={completedTodayCount} total={totalTodayCount} />

        {/* Next focus task */}
        <FocusBlockPreview task={nextFocusTask} onStartFocus={handleStartFocus} />

        {/* Step count */}
        {steps.available && steps.steps !== null && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{steps.steps.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Steps today</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{foregroundMinutes}m</Text>
              <Text style={styles.statLabel}>In-app time</Text>
            </View>
          </View>
        )}

        {/* Today's tasks */}
        <View style={styles.section}>
          <SectionHeader
            title="Today's Tasks"
            subtitle={totalTodayCount === 0 ? 'No tasks due today' : undefined}
          />
          {todayTasks.length === 0 ? (
            <EmptyState
              icon="calendar-check-outline"
              title="Nothing due today"
              message="Add a task and set today as the due date to see it here."
              actionLabel="Add Task"
              onAction={() => router.push('/task/new')}
            />
          ) : (
            todayTasks.map((task) => {
              const subSteps = getSubSteps(task.id);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  subStepCount={subSteps.length}
                  completedSubStepCount={subSteps.filter((s) => s.isComplete).length}
                  onToggle={toggleTask}
                  onPress={(t) => router.push({ pathname: '/task/[id]', params: { id: t.id } })}
                  onDelete={deleteTask}
                />
              );
            })
          )}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/task/new')}
        label="Add Task"
        variant="surface"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { padding: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  greeting: {
    fontWeight: '800',
    color: palette.textPrimary,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.primary,
  },
  statLabel: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 2,
  },
  section: { marginTop: 8 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: palette.primary,
  },
});
