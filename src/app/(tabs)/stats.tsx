import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { MonthlyBarChart } from '@/components/monthly-bar-chart';
import { OpportunityCard } from '@/components/opportunity-card';
import { Screen } from '@/components/screen';
import { SoftCard } from '@/components/soft-card';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { gamesByTotal, recentMonths, sum } from '@/features/spending/aggregate';
import { formatWon } from '@/features/spending/format';
import { useSpending } from '@/features/spending/SpendingProvider';

export default function StatsScreen() {
  const { games, expenses } = useSpending();

  const months = useMemo(() => recentMonths(expenses, 6), [expenses]);
  const total = useMemo(() => sum(expenses), [expenses]);
  const ranked = useMemo(
    () => gamesByTotal(games, expenses).filter((r) => r.total > 0),
    [games, expenses],
  );

  if (expenses.length === 0) {
    return (
      <Screen>
        <ThemedText type="subtitle">월간 통계</ThemedText>
        <EmptyState
          emoji="📊"
          title="보여줄 통계가 없어요"
          description="지출을 기록하면 월별 추세와 기회비용을 보여드려요."
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ThemedText type="subtitle">월간 통계</ThemedText>

      <SoftCard>
        <ThemedText type="smallBold">최근 6개월 지출</ThemedText>
        <MonthlyBarChart data={months} />
      </SoftCard>

      <OpportunityCard title={`누적 ${formatWon(total)}, 이만큼이에요`} amount={total} />

      {ranked.length > 0 && (
        <SoftCard>
          <ThemedText type="smallBold">게임별 비중</ThemedText>
          <View style={styles.breakdown}>
            {ranked.map(({ game, total: gameTotal }) => {
              const pct = total > 0 ? Math.round((gameTotal / total) * 100) : 0;
              return (
                <View key={game.id} style={styles.breakdownRow}>
                  <ThemedText style={styles.emoji}>{game.emoji}</ThemedText>
                  <View style={styles.barWrap}>
                    <ThemedText type="small" numberOfLines={1}>
                      {game.name}
                    </ThemedText>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${Math.max(pct, 3)}%` }]} />
                    </View>
                  </View>
                  <ThemedText type="smallBold" style={styles.pct}>
                    {pct}%
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </SoftCard>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  breakdown: {
    gap: Spacing.three,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 22,
  },
  barWrap: {
    flex: 1,
    gap: 4,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Brand.primarySoft,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Brand.primary,
  },
  pct: {
    width: 44,
    textAlign: 'right',
    color: Brand.primary,
  },
});
