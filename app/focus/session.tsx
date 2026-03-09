import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useFocusContext } from '../../src/store/FocusContext';
import { useDistractionsContext } from '../../src/store/DistractionsContext';
import { useTasksContext } from '../../src/store/TasksContext';
import { TimerRing } from '../../src/components/focus/TimerRing';
import { PhaseLabel } from '../../src/components/focus/PhaseLabel';
import { SessionControls } from '../../src/components/focus/SessionControls';
import { DistractionButton } from '../../src/components/focus/DistractionButton';
import { DistractionCategory } from '../../src/types/distraction';
import { palette } from '../../src/utils/colors';
import { Phase } from '../../src/types/focus';

function totalSecondsForPhase(phase: Phase, workMin: number, breakMin: number, longBreakMin: number): number {
  if (phase === 'work') return workMin * 60;
  if (phase === 'short_break') return breakMin * 60;
  if (phase === 'long_break') return longBreakMin * 60;
  return workMin * 60;
}

export default function SessionScreen() {
  const router = useRouter();
  const { taskId } = useLocalSearchParams<{ taskId?: string }>();
  const { state, startSession, pause, resume, skipPhase, endSession } = useFocusContext();
  const { logDistraction } = useDistractionsContext();
  const { state: tasksState } = useTasksContext();
  const prevPhaseRef = useRef<Phase | null>(null);
  const sessionStarted = useRef(false);

  const linkedTask = taskId ? tasksState.tasks.find((t) => t.id === taskId) ?? null : null;

  // Start session on mount
  useEffect(() => {
    if (!sessionStarted.current) {
      sessionStarted.current = true;
      startSession(taskId ?? null);
    }
  }, []);

  // Haptic feedback on phase change
  useEffect(() => {
    const phase = state.active?.phase;
    if (phase && prevPhaseRef.current && prevPhaseRef.current !== phase) {
      try {
        Haptics.notificationAsync(
          phase === 'complete'
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Warning
        );
      } catch {
        // Haptics not available — silent fail
      }
    }
    prevPhaseRef.current = phase ?? null;
  }, [state.active?.phase]);

  // Auto-navigate away on complete
  useEffect(() => {
    if (state.active?.phase === 'complete') {
      const timer = setTimeout(() => {
        endSession(false).then(() => router.back());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.active?.phase]);

  if (!state.active) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Starting session...</Text>
      </View>
    );
  }

  const { phase, secondsRemaining, currentCycle, isPaused, config, sessionId } = state.active;
  const totalSecs = totalSecondsForPhase(phase, config.workMinutes, config.breakMinutes, config.longBreakMinutes);

  const handleEnd = () => {
    Alert.alert('End Session?', 'Your progress for this cycle will be saved.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Session',
        style: 'destructive',
        onPress: () => endSession(true).then(() => router.back()),
      },
    ]);
  };

  const handleLogDistraction = (category: DistractionCategory, note?: string) => {
    logDistraction(sessionId, category, note);
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Linked task label */}
      {linkedTask && (
        <View style={styles.taskBanner}>
          <Text style={styles.taskBannerLabel}>Focusing on</Text>
          <Text style={styles.taskBannerTitle} numberOfLines={1}>{linkedTask.title}</Text>
        </View>
      )}

      {/* Timer */}
      <TimerRing secondsRemaining={secondsRemaining} totalSeconds={totalSecs} phase={phase} />

      {/* Phase label */}
      <PhaseLabel phase={phase} cycle={currentCycle} totalCycles={config.cyclesBeforeLongBreak} />

      {/* Controls */}
      {phase !== 'complete' && (
        <View style={styles.controls}>
          <SessionControls
            isPaused={isPaused}
            onPause={pause}
            onResume={resume}
            onSkip={skipPhase}
            onEnd={handleEnd}
          />
        </View>
      )}

      {/* Distraction FAB */}
      {phase === 'work' && !isPaused && (
        <DistractionButton onLog={handleLogDistraction} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskBanner: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  taskBannerLabel: {
    fontSize: 12,
    color: palette.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
    marginTop: 2,
    textAlign: 'center',
  },
  controls: {
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 24,
  },
});
