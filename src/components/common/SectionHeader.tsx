import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { palette } from '../../utils/colors';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function SectionHeader({ title, subtitle, right }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text variant="titleSmall" style={styles.title}>{title}</Text>
        {subtitle ? <Text variant="bodySmall" style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  text: { flex: 1 },
  title: {
    fontWeight: '700',
    color: palette.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  subtitle: {
    color: palette.textSecondary,
    marginTop: 2,
  },
});
