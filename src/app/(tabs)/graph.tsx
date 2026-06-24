import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { MonthlyBarChart } from '@/components/monthly-bar-chart';
import { Screen } from '@/components/screen';
import { SoftCard } from '@/components/soft-card';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { recentMonths } from '@/features/spending/aggregate';
import { useSpending } from '@/features/spending/SpendingProvider';

export default function GraphScreen() {
  const { expenses } = useSpending();
  const months = useMemo(() => recentMonths(expenses, 6), [expenses]);

  // 코멘트: 이번 달이 6개월 중 최고치인지 판단
  const current = months[months.length - 1];
  const peak = Math.max(...months.map((m) => m.total));
  const isPeak = current && current.total > 0 && current.total === peak;

  const hasData = months.some((m) => m.total > 0);

  return (
    <Screen>
      <View>
        <ThemedText style={styles.title}>월간 지출 추이</ThemedText>
        <ThemedText type="small" themeColor="textTertiary" style={styles.meta}>
          최근 6개월
        </ThemedText>
      </View>

      {!hasData ? (
        <EmptyState emoji="📊" title="보여줄 추이가 없어요" description="지출을 기록하면 월별 추세를 그려드려요." />
      ) : (
        <>
          <SoftCard style={styles.chartCard}>
            <MonthlyBarChart data={months} height={188} />
          </SoftCard>

          <SoftCard style={styles.comment}>
            <View style={[styles.dot, { backgroundColor: isPeak ? Brand.danger : Brand.primary }]} />
            <ThemedText type="small" style={styles.commentText}>
              {isPeak ? (
                <>
                  이번 달은 최근 6개월 중 <ThemedText style={styles.hi}>가장 높은 지출</ThemedText>이에요.
                  한 박자 쉬어가도 좋아요.
                </>
              ) : (
                <>최근 6개월 지출 흐름이에요. 이번 달은 평소 범위 안에 있어요.</>
              )}
            </ThemedText>
          </SoftCard>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  meta: {
    marginTop: 5,
    fontSize: 12.5,
  },
  chartCard: {
    padding: Spacing.three,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginTop: 6,
  },
  commentText: {
    flex: 1,
    lineHeight: 20,
    color: '#b6b9c1',
  },
  hi: {
    color: Brand.dangerText,
    fontWeight: '700',
  },
});
