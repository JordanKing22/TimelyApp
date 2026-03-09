import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDistractions, useDistractionStats } from '../../src/hooks/useDistractions';
import { DistractionCard } from '../../src/components/distractions/DistractionCard';
import { PatternChart } from '../../src/components/distractions/PatternChart';
import { ReframeMessage } from '../../src/components/distractions/ReframeMessage';
import { EmptyState } from '../../src/components/common/EmptyState';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { palette } from '../../src/utils/colors';
import { getSummaryReframe } from '../../src/utils/reframe';
import { todayISO } from '../../src/utils/time';
import { DistractionCategory } from '../../src/types/distraction';

export default function DistractionsScreen() {
  const router = useRouter();
  const { state, deleteDistraction, todayCount } = useDistractions();
  const stats = useDistractionStats(7);

  const today = todayISO();
  const todayDistractions = state.distractions.filter((d) => d.loggedAt.startsWith(today));

  // Find most common category
  const topCategory = stats
    ? (Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] as DistractionCategory | undefined)
    : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={todayDistractions}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Summary headline */}
            <Text style={styles.headline}>{getSummaryReframe(todayCount)}</Text>

            {/* Reframe message */}
            {topCategory && (
              <View style={styles.section}>
                <ReframeMessage category={topCategory} />
              </View>
            )}

            {/* 7-day chart */}
            {stats && stats.byDate.some((d) => d.count > 0) && (
              <View style={styles.section}>
                <SectionHeader title="Last 7 Days" />
                <PatternChart data={stats.byDate} />
              </View>
            )}

            {/* Today's log */}
            <View style={styles.section}>
              <SectionHeader
                title="Today's Log"
                subtitle={todayCount > 0 ? `${todayCount} logged` : undefined}
                right={
                  <Button
                    compact
                    onPress={() => router.push('/insights')}
                    textColor={palette.primary}
                    icon="chart-bar"
                  >
                    Full Insights
                  </Button>
                }
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="lightning-bolt-outline"
            title="No distractions logged today"
            message="During a focus session, tap the distraction button to log what broke your focus. It's data, not failure."
          />
        }
        renderItem={({ item }) => (
          <DistractionCard distraction={item} onDelete={deleteDistraction} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { padding: 16, paddingBottom: 40 },
  headline: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 14,
    lineHeight: 26,
  },
  section: {
    marginBottom: 16,
  },
});
