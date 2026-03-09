import React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Button } from 'react-native-paper';
import { palette } from '../../utils/colors';

interface Props {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onEnd: () => void;
}

export function SessionControls({ isPaused, onPause, onResume, onSkip, onEnd }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <IconButton
          icon={isPaused ? 'play-circle' : 'pause-circle'}
          size={72}
          iconColor={palette.primary}
          onPress={isPaused ? onResume : onPause}
          style={styles.mainBtn}
        />
      </View>
      <View style={styles.secondaryRow}>
        <Button
          mode="outlined"
          onPress={onSkip}
          icon="skip-next"
          style={styles.secondaryBtn}
          textColor={palette.textSecondary}
        >
          Skip
        </Button>
        <Button
          mode="outlined"
          onPress={onEnd}
          icon="stop-circle-outline"
          style={styles.secondaryBtn}
          textColor={palette.error}
        >
          End
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  row: {
    alignItems: 'center',
  },
  mainBtn: {
    margin: 0,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    borderRadius: 24,
    minWidth: 100,
  },
});
