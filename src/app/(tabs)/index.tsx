import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Divider } from '@/components/divider';
import { EmptyState } from '@/components/empty-state';
import { ExpenseListItem } from '@/components/expense-list-item';
import { GameCard } from '@/components/game-card';
import { Screen } from '@/components/screen';
import { SegmentBar } from '@/components/segment-bar';
import { SoftCard } from '@/components/soft-card';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { currentMonthKey, gamesByMonth, monthChangePct, monthKey, monthSpent } from '@/features/spending/aggregate';
import { formatKRW, shortDay } from '@/features/spending/format';
import { useSpending } from '@/features/spending/SpendingProvider';

export default function HomeScreen() {
  const router = useRouter();
  const { games, expenses } = useSpending();
  const now = new Date();
  const key = currentMonthKey(now);

  // React Compiler가 자동 메모이즈하므로 수동 useMemo 없이 그대로 파생한다.
  const thisMonth = monthSpent(expenses, key);
  const changePct = monthChangePct(expenses, now);
  const byGame = gamesByMonth(games, expenses, key);

  const recent = expenses
    .filter((e) => monthKey(e.spentAt) === key)
    .sort((a, b) => b.spentAt.localeCompare(a.spentAt))
    .slice(0, 3);

  const gameName = (id: string) => games.find((g) => g.id === id)?.name ?? '게임';

  return (
    <Screen>
      {/* 이번 달 지출 카드 */}
      <SoftCard>
        <View style={styles.rowBetween}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {now.getFullYear()}년 {now.getMonth() + 1}월 지출
          </ThemedText>
          {changePct != null ? (
            <View style={[styles.deltaBadge, changePct >= 0 ? styles.deltaUp : styles.deltaDown]}>
              <ThemedText style={[styles.deltaText, changePct >= 0 ? styles.deltaUpText : styles.deltaDownText]}>
                {changePct >= 0 ? '▲' : '▼'} {Math.abs(changePct)}%
              </ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText style={styles.bigAmount}>{formatKRW(thisMonth)}</ThemedText>
        <SegmentBar segments={byGame.map((r) => ({ key: r.game.id, value: r.total, color: r.game.color }))} />
        {byGame.length > 0 ? (
          <ThemedText type="small" themeColor="textTertiary">
            {byGame.map((r) => r.game.name).join(' · ')} 합산
          </ThemedText>
        ) : null}
      </SoftCard>

      {/* 게임별 지출 (이번 달) */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <ThemedText style={styles.sectionTitle}>게임별 지출</ThemedText>
          <ThemedText type="small" themeColor="textTertiary">
            이번 달
          </ThemedText>
        </View>
        {byGame.length === 0 ? (
          <EmptyState emoji="🫧" title="이번 달 지출이 없어요" description="아래 ＋ 버튼으로 기록해보세요." />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cards}>
            {byGame.map((r) => (
              <GameCard
                key={r.game.id}
                game={r.game}
                total={r.total}
                count={r.count}
                onPress={() => router.push({ pathname: '/game/[id]', params: { id: r.game.id } })}
              />
            ))}
          </ScrollView>
        )}
      </View>

      {/* 최근 내역 */}
      {recent.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <ThemedText style={styles.sectionTitle}>최근 내역</ThemedText>
            <ThemedText type="linkPrimary" onPress={() => router.navigate('/log')}>
              더 보기
            </ThemedText>
          </View>
          <SoftCard flush style={styles.listCard}>
            {recent.map((e, i) => (
              <View key={e.id}>
                {i > 0 ? <Divider /> : null}
                <ExpenseListItem
                  expense={e}
                  gameName={gameName(e.gameId)}
                  subtitle={`${e.memo ?? '기록'} · ${shortDay(e.spentAt)}`}
                />
              </View>
            ))}
          </SoftCard>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bigAmount: {
    marginTop: 4,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  deltaUp: {
    backgroundColor: 'rgba(240,102,77,0.15)',
  },
  deltaDown: {
    backgroundColor: Brand.primarySoft,
  },
  deltaText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  deltaUpText: {
    color: Brand.danger,
  },
  deltaDownText: {
    color: Brand.primaryText,
  },
  section: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cards: {
    gap: Spacing.two,
    paddingVertical: 2,
  },
  listCard: {
    paddingHorizontal: 15,
  },
});
