import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button, Surface, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTasks } from '../../src/hooks/useTasks';
import { useFocusContext } from '../../src/store/FocusContext';
import { Task } from '../../src/types/task';
import { PriorityBadge } from '../../src/components/common/PriorityBadge';
import { TimeChip } from '../../src/components/common/TimeChip';
import { palette } from '../../src/utils/colors';

const WORK_PRESETS = [15, 20, 25, 30, 45, 50];
const BREAK_PRESETS = [5, 10, 15];

function PresetPicker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: number[];
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.presetGroup}>
      <Text style={styles.presetLabel}>{label}</Text>
      <View style={styles.presetRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.presetChip, value === opt && styles.presetChipActive]}
            onPress={() => onChange(opt)}
            activeOpacity={0.7}
          >
            <Text style={[styles.presetChipLabel, value === opt && styles.presetChipLabelActive]}>
              {opt}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function FocusScreen() {
  const router = useRouter();
  const { incompleteTasks } = useTasks();
  const { state, updateConfig } = useFocusContext();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const config = state.config;

  const handleStart = () => {
    router.push({
      pathname: '/focus/session',
      params: selectedTaskId ? { taskId: selectedTaskId } : {},
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.heading}>Set Up Your Session</Text>

        {/* Timer config */}
        <Surface style={styles.configCard} elevation={1}>
          <PresetPicker
            label="Work"
            value={config.workMinutes}
            options={WORK_PRESETS}
            onChange={(v) => updateConfig({ ...config, workMinutes: v })}
          />
          <Divider style={styles.divider} />
          <PresetPicker
            label="Break"
            value={config.breakMinutes}
            options={BREAK_PRESETS}
            onChange={(v) => updateConfig({ ...config, breakMinutes: v })}
          />
        </Surface>

        {/* Task selector */}
        <Text style={styles.sectionLabel}>Focus on (optional)</Text>
        <FlatList
          data={incompleteTasks.slice(0, 8)}
          keyExtractor={(t) => t.id}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <TouchableOpacity
              style={[styles.taskRow, !selectedTaskId && styles.taskRowSelected]}
              onPress={() => setSelectedTaskId(null)}
              activeOpacity={0.7}
            >
              <Text style={[styles.taskTitle, !selectedTaskId && styles.taskTitleSelected]}>
                No specific task
              </Text>
            </TouchableOpacity>
          }
          renderItem={({ item: task }: { item: Task }) => (
            <TouchableOpacity
              style={[styles.taskRow, selectedTaskId === task.id && styles.taskRowSelected]}
              onPress={() => setSelectedTaskId(task.id)}
              activeOpacity={0.7}
            >
              <View style={styles.taskInfo}>
                <Text
                  style={[styles.taskTitle, selectedTaskId === task.id && styles.taskTitleSelected]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
                <View style={styles.taskMeta}>
                  <PriorityBadge priority={task.priority} compact />
                  <TimeChip minutes={task.estimatedMinutes} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <Button
          mode="contained"
          onPress={handleStart}
          style={styles.startBtn}
          contentStyle={styles.startBtnContent}
          icon="timer-play-outline"
          labelStyle={{ fontSize: 16, fontWeight: '700' }}
        >
          Start Focus Session
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: 16 },
  heading: {
    fontWeight: '800',
    color: palette.textPrimary,
    marginBottom: 14,
  },
  configCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  presetGroup: { marginBottom: 4 },
  presetLabel: {
    fontWeight: '700',
    fontSize: 12,
    color: palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  presetChipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  presetChipLabel: {
    fontWeight: '600',
    fontSize: 13,
    color: palette.textSecondary,
  },
  presetChipLabelActive: { color: '#fff' },
  divider: { marginVertical: 12 },
  sectionLabel: {
    fontWeight: '700',
    fontSize: 12,
    color: palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  taskList: { paddingBottom: 16 },
  taskRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: palette.surface,
    borderWidth: 1.5,
    borderColor: palette.border,
  },
  taskRowSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.primary + '12',
  },
  taskInfo: { gap: 4 },
  taskTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: palette.textPrimary,
  },
  taskTitleSelected: { color: palette.primary },
  taskMeta: { flexDirection: 'row', gap: 6 },
  startBtn: {
    borderRadius: 28,
    marginTop: 4,
  },
  startBtnContent: { paddingVertical: 8 },
});
