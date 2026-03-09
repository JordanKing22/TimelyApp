import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDistractionStats } from '../src/hooks/useDistractions';
import { PatternChart } from '../src/components/distractions/PatternChart';
import { ReframeMessage } from '../src/components/distractions/ReframeMessage';
import { SectionHeader } from '../src/components/common/SectionHeader';
import { categoryColor, palette } from '../src/utils/colors';
import { DistractionCategory } from '../src/types/distraction';

const ALL_CATEGORIES: DistractionCategory[] = ['phone', 'thought', 'environment', 'other'];
const CATEGORY_ICONS: Record<DistractionCategory, string> = {
  phone: '📱',
  thought: '💭',
  environment: '🌿',
  other: '✦',
};

export default function InsightsScreen() {
  const stats = useDistractionStats(30);

  if (!stats) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading insights...</Text>
      </View>
    );
  }

  const topCategory = (Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])[0]?.[0] as DistractionCategory | undefined) ?? 'other';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <Surface style={styles.summaryCard} elevation={1}>
          <Text style={styles.summaryNum}>{stats.total}</Text>
          <Text style={styles.summaryLabel}>Total distractions (30 days)</Text>
        </Surface>

        {/* Category breakdown */}
        <View style={styles.section}>
          <SectionHeader title="By Category" />
          <View style={styles.catGrid}>
            {ALL_CATEGORIES.map((cat) => {
              const count = stats.byCategory[cat];
              const color = categoryColor(cat);
              const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <View key={cat} style={[styles.catCard, { borderColor: color + '44' }]}>
                  <Text style={styles.catIcon}>{CATEGORY_ICONS[cat]}</Text>
                  <Text style={[styles.catCount, { color }]}>{count}</Text>
                  <Text style={styles.catName}>{cat}</Text>
                  <Text style={styles.catPct}>{pct}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* 30-day trend */}
        {stats.byDate.some((d) => d.count > 0) && (
          <View style={styles.section}>
            <SectionHeader title="Last 30 Days" />
            <PatternChart data={stats.byDate.slice(-14)} />
          </View>
        )}

        {/* Reframe tips for top categories */}
        <View style={styles.section}>
          <SectionHeader title="Tips for You" />
          {ALL_CATEGORIES.filter((c) => stats.byCategory[c] > 0).slice(0, 2).map((cat) => (
            <View key={cat} style={{ marginBottom: 10 }}>
              <ReframeMessage category={cat} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { padding: 16, paddingBottom: 40 },
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryNum: {
    fontSize: 48,
    fontWeight: '900',
    color: palette.primary,
    lineHeight: 56,
  },
  summaryLabel: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: 4,
  },
  section: { marginBottom: 20 },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catCard: {
    width: '47%',
    backgroundColor: palette.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  catIcon: { fontSize: 28, marginBottom: 6 },
  catCount: { fontSize: 28, fontWeight: '800' },
  catName: {
    fontSize: 12,
    textTransform: 'capitalize',
    color: palette.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  catPct: {
    fontSize: 13,
    color: palette.textDisabled,
    marginTop: 2,
  },
});
