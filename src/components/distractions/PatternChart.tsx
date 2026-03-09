import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { palette } from '../../utils/colors';

const screenWidth = Dimensions.get('window').width;

interface Props {
  data: { date: string; count: number }[];
}

export function PatternChart({ data }: Props) {
  if (!data.length) return null;

  const labels = data.map((d) => {
    const date = new Date(d.date + 'T00:00:00');
    return date.toLocaleDateString([], { weekday: 'short' });
  });

  const chartData = {
    labels,
    datasets: [{ data: data.map((d) => d.count) }],
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        width={screenWidth - 48}
        height={160}
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundColor: palette.surface,
          backgroundGradientFrom: palette.surface,
          backgroundGradientTo: palette.surface,
          decimalPlaces: 0,
          color: () => palette.primary,
          labelColor: () => palette.textSecondary,
          style: { borderRadius: 12 },
          barPercentage: 0.6,
          propsForLabels: { fontSize: 11 },
        }}
        style={styles.chart}
        yAxisLabel=""
        yAxisSuffix=""
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chart: {
    borderRadius: 12,
  },
});
