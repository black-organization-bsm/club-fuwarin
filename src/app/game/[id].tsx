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
import { useEntrySheet } from '@/features/spending/EntrySheetProvider';
import { formatKRW } from '@/features/spending/format';
import { useSpending } from '@/features/spending/SpendingProvider';

/** ISO -> "6.21" */
function shortDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

export default function GameDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { games, expenses, removeGame } = useSpending();
  const { openNew, openEdit } = useEntrySheet();

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

      <SoftCard>
        <View style={[styles.emojiBadge, { backgroundColor: game.color }]}>
          <ThemedText style={styles.emoji}>{game.emoji}</ThemedText>
        </View>
        <ThemedText type="smallBold" themeColor="textSecondary">
          {game.name} 누적 지출
        </ThemedText>
        <ThemedText style={styles.bigAmount}>{formatKRW(total)}</ThemedText>
      </SoftCard>

      <OpportunityCard title="이 게임에 쓴 돈이면" amount={total} />

      <SoftButton label="＋ 이 게임에 지출 추가" onPress={() => openNew(game.id)} />

      <View style={styles.listSection}>
        <ThemedText style={styles.sectionTitle}>지출 내역</ThemedText>
        {gameExpenses.length === 0 ? (
          <EmptyState emoji="🫧" title="아직 지출 기록이 없어요" />
        ) : (
          <SoftCard flush style={styles.listCard}>
            {gameExpenses.map((e, i) => (
              <View key={e.id}>
                {i > 0 ? <Divider /> : null}
                <ExpenseListItem
                  expense={e}
                  gameName={e.memo ?? '기록'}
                  subtitle={`${e.source === 'auto' ? '자동 감지' : '직접 기록'} · ${shortDay(e.spentAt)}`}
                  onPress={() => openEdit(e)}
                />
              </View>
            ))}
          </SoftCard>
        )}
      </View>

      <SoftButton label="게임 삭제" variant="danger" onPress={confirmDeleteGame} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emojiBadge: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  bigAmount: {
    marginTop: 2,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Brand.primaryText,
  },
  listSection: {
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  listCard: {
    paddingHorizontal: 15,
  },
});
