import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Divider } from '@/components/divider';
import { EmptyState } from '@/components/empty-state';
import { ExpenseListItem } from '@/components/expense-list-item';
import { OpportunityCard } from '@/components/opportunity-card';
import { Screen } from '@/components/screen';
import { SoftButton } from '@/components/soft-button';
import { SoftCard } from '@/components/soft-card';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { monthSpent, sum } from '@/features/spending/aggregate';
import { formatWon } from '@/features/spending/format';
import { useSpending } from '@/features/spending/SpendingProvider';

export default function HomeScreen() {
  const router = useRouter();
  const { games, expenses } = useSpending();

  const thisMonth = useMemo(() => monthSpent(expenses), [expenses]);
  const total = useMemo(() => sum(expenses), [expenses]);

  const recent = useMemo(
    () => [...expenses].sort((a, b) => b.spentAt.localeCompare(a.spentAt)).slice(0, 5),
    [expenses],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <ThemedText type="small" themeColor="textSecondary">
          클럽 말랑말랑
        </ThemedText>
        <ThemedText type="subtitle">너 가챠에{'\n'}얼마 썼니?</ThemedText>
      </View>

      <SoftCard accent>
        <ThemedText type="smallBold" style={styles.accentText}>
          이번 달 지출
        </ThemedText>
        <ThemedText style={styles.bigAmount}>{formatWon(thisMonth)}</ThemedText>
        <ThemedText type="small" style={styles.accentText}>
          누적 총 {formatWon(total)}
        </ThemedText>
      </SoftCard>

      <OpportunityCard title="이번 달, 이만큼 질렀어요" amount={thisMonth} />

      <SoftButton label="＋ 지출 추가하기" onPress={() => router.push('/add-expense')} />

      <View style={styles.recentSection}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          최근 지출
        </ThemedText>
        {recent.length === 0 ? (
          <EmptyState
            emoji="🫧"
            title="아직 기록이 없어요"
            description="첫 지출을 기록하고 기회비용을 확인해보세요."
          />
        ) : (
          <SoftCard>
            {recent.map((e, i) => (
              <View key={e.id}>
                {i > 0 ? <Divider /> : null}
                <ExpenseListItem
                  expense={e}
                  emoji={games.find((g) => g.id === e.gameId)?.emoji ?? '🎮'}
                />
              </View>
            ))}
          </SoftCard>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  accentText: {
    color: Brand.primaryDark,
  },
  bigAmount: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '800',
    color: Brand.primaryDark,
  },
  recentSection: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
  },
});
