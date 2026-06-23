import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Divider } from '@/components/divider';
import { EmptyState } from '@/components/empty-state';
import { ExpenseListItem } from '@/components/expense-list-item';
import { OpportunityCard } from '@/components/opportunity-card';
import { Screen } from '@/components/screen';
import { SoftButton } from '@/components/soft-button';
import { SoftCard } from '@/components/soft-card';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { sum } from '@/features/spending/aggregate';
import { formatWon } from '@/features/spending/format';
import { useSpending } from '@/features/spending/SpendingProvider';

export default function GameDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { games, expenses, removeExpense, removeGame } = useSpending();

  const game = useMemo(() => games.find((g) => g.id === id), [games, id]);
  const gameExpenses = useMemo(
    () => expenses.filter((e) => e.gameId === id).sort((a, b) => b.spentAt.localeCompare(a.spentAt)),
    [expenses, id],
  );
  const total = useMemo(() => sum(gameExpenses), [gameExpenses]);

  if (!game) {
    return (
      <Screen withTabInset={false}>
        <Stack.Screen options={{ title: '' }} />
        <EmptyState emoji="❓" title="게임을 찾을 수 없어요" />
      </Screen>
    );
  }

  function confirmDeleteExpense(expenseId: string) {
    Alert.alert('지출 삭제', '이 지출 기록을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => removeExpense(expenseId) },
    ]);
  }

  function confirmDeleteGame() {
    Alert.alert('게임 삭제', `'${game!.name}'과(와) 모든 지출 기록을 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await removeGame(game!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen withTabInset={false}>
      <Stack.Screen options={{ title: game.name }} />

      <SoftCard accent>
        <ThemedText style={styles.emoji}>{game.emoji}</ThemedText>
        <ThemedText type="smallBold" style={styles.accentText}>
          {game.name} 누적 지출
        </ThemedText>
        <ThemedText style={styles.bigAmount}>{formatWon(total)}</ThemedText>
      </SoftCard>

      <OpportunityCard title="이 게임에 쓴 돈이면" amount={total} />

      <SoftButton
        label="＋ 이 게임에 지출 추가"
        onPress={() => router.push({ pathname: '/add-expense', params: { gameId: game.id } })}
      />

      <View style={styles.listSection}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          지출 내역
        </ThemedText>
        {gameExpenses.length === 0 ? (
          <EmptyState emoji="🫧" title="아직 지출 기록이 없어요" />
        ) : (
          <SoftCard>
            {gameExpenses.map((e, i) => (
              <View key={e.id}>
                {i > 0 ? <Divider /> : null}
                <ExpenseListItem expense={e} onLongPress={() => confirmDeleteExpense(e.id)} />
              </View>
            ))}
            <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
              길게 눌러 삭제
            </ThemedText>
          </SoftCard>
        )}
      </View>

      <SoftButton label="게임 삭제" variant="ghost" onPress={confirmDeleteGame} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emoji: {
    fontSize: 40,
  },
  accentText: {
    color: Brand.primaryDark,
  },
  bigAmount: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
    color: Brand.primaryDark,
  },
  listSection: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 16,
  },
  hint: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
});
