import { StyleSheet, View } from 'react-native';

import { Divider } from '@/components/divider';
import { EmptyState } from '@/components/empty-state';
import { ExpenseListItem } from '@/components/expense-list-item';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Brand } from '@/constants/theme';
import { currentMonthKey, monthKey, monthSpent } from '@/features/spending/aggregate';
import { formatKRW } from '@/features/spending/format';
import { useEntrySheet } from '@/features/spending/EntrySheetProvider';
import { useSpending } from '@/features/spending/SpendingProvider';
import type { Expense } from '@/features/spending/types';

const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

type DayGroup = { dayKey: string; label: string; weekday: string; items: Expense[] };

/** 이번 달 지출을 날짜별로 묶는다 (최신 날짜 우선) */
function groupByDay(expenses: Expense[]): DayGroup[] {
  const map = new Map<string, Expense[]>();
  for (const e of expenses) {
    const d = new Date(e.spentAt);
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    (map.get(dayKey) ?? map.set(dayKey, []).get(dayKey)!).push(e);
  }
  return [...map.entries()]
    .map(([dayKey, items]) => {
      const d = new Date(items[0].spentAt);
      return {
        dayKey,
        label: `${d.getMonth() + 1}월 ${d.getDate()}일`,
        weekday: WEEKDAYS[d.getDay()],
        items: items.sort((a, b) => b.spentAt.localeCompare(a.spentAt)),
      };
    })
    .sort((a, b) => b.items[0].spentAt.localeCompare(a.items[0].spentAt));
}

export default function LogScreen() {
  const { games, expenses } = useSpending();
  const { openEdit } = useEntrySheet();
  const now = new Date();
  const key = currentMonthKey(now);

  // React Compiler 자동 메모이즈에 맡기고 그대로 파생한다.
  const monthExpenses = expenses.filter((e) => monthKey(e.spentAt) === key);
  const groups = groupByDay(monthExpenses);
  const total = monthSpent(expenses, key);

  const gameName = (id: string) => games.find((g) => g.id === id)?.name ?? '게임';

  const subtitle = (e: Expense) => (
    <>
      {e.memo ?? '기록'} ·{' '}
      <ThemedText type="small" style={e.source === 'auto' ? styles.tagAuto : styles.tagManual}>
        {e.source === 'auto' ? '자동 감지' : '직접 기록'}
      </ThemedText>
    </>
  );

  return (
    <Screen>
      <View>
        <ThemedText style={styles.title}>지출 내역</ThemedText>
        <ThemedText type="small" themeColor="textTertiary" style={styles.meta}>
          {now.getFullYear()}년 {now.getMonth() + 1}월 · {monthExpenses.length}건 · {formatKRW(total)}
        </ThemedText>
      </View>

      {groups.length === 0 ? (
        <EmptyState emoji="🫧" title="이번 달 기록이 없어요" description="＋ 버튼으로 첫 지출을 남겨보세요." />
      ) : (
        groups.map((group) => (
          <View key={group.dayKey} style={styles.group}>
            <ThemedText style={styles.dayHeader}>
              {group.label} <ThemedText style={styles.weekday}>{group.weekday}</ThemedText>
            </ThemedText>
            {group.items.map((e) => (
              <View key={e.id}>
                <Divider />
                <ExpenseListItem
                  expense={e}
                  gameName={gameName(e.gameId)}
                  subtitle={subtitle(e)}
                  onPress={() => openEdit(e)}
                />
              </View>
            ))}
          </View>
        ))
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
  group: {
    gap: 0,
  },
  dayHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8a8d97',
    marginBottom: 8,
  },
  weekday: {
    color: '#6c6f79',
    fontWeight: '500',
  },
  tagAuto: {
    fontSize: 12,
    color: Brand.primaryText,
    fontWeight: '600',
  },
  tagManual: {
    fontSize: 12,
    color: '#9b9ea8',
    fontWeight: '600',
  },
});
