import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, Button, TextInput, FAB } from 'react-native-paper';
import { DistractionCategory } from '../../types/distraction';
import { palette, categoryColor } from '../../utils/colors';

const CATEGORIES: { value: DistractionCategory; label: string; icon: string }[] = [
  { value: 'phone', label: 'Phone', icon: '📱' },
  { value: 'thought', label: 'Thought', icon: '💭' },
  { value: 'environment', label: 'Environment', icon: '🌿' },
  { value: 'other', label: 'Other', icon: '✦' },
];

interface Props {
  onLog: (category: DistractionCategory, note?: string) => void;
}

export function DistractionButton({ onLog }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DistractionCategory | null>(null);
  const [note, setNote] = useState('');

  const handleLog = () => {
    if (!selected) return;
    onLog(selected, note.trim() || undefined);
    setOpen(false);
    setSelected(null);
    setNote('');
  };

  return (
    <>
      <FAB
        icon="plus"
        label="Distraction"
        size="small"
        onPress={() => setOpen(true)}
        style={styles.fab}
        color="#fff"
      />
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.sheet}>
          <Text variant="titleMedium" style={styles.sheetTitle}>What distracted you?</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map((c) => {
              const isSelected = selected === c.value;
              const color = categoryColor(c.value);
              return (
                <TouchableOpacity
                  key={c.value}
                  style={[styles.catBtn, { borderColor: color }, isSelected && { backgroundColor: color }]}
                  onPress={() => setSelected(c.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.catIcon}>{c.icon}</Text>
                  <Text style={[styles.catLabel, { color: isSelected ? '#fff' : color }]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TextInput
            placeholder="Optional note..."
            value={note}
            onChangeText={setNote}
            mode="outlined"
            dense
            style={styles.noteInput}
          />
          <Button
            mode="contained"
            onPress={handleLog}
            disabled={!selected}
            style={styles.logBtn}
            contentStyle={{ paddingVertical: 4 }}
          >
            Log & Continue
          </Button>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: palette.accent,
    position: 'absolute',
    bottom: 32,
    left: 24,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetTitle: {
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  catRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  catBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 4,
  },
  catIcon: { fontSize: 20 },
  catLabel: { fontWeight: '700', fontSize: 12 },
  noteInput: {
    marginBottom: 16,
    backgroundColor: palette.surface,
  },
  logBtn: {
    borderRadius: 24,
  },
});
