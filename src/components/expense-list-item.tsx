import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { formatDay, formatWon } from '@/features/spending/format';
import type { Expense } from '@/features/spending/types';

type ExpenseListItemProps = {
  expense: Expense;
  /** 게임 이모지 (게임 컨텍스트 밖에서 표시할 때) */
  emoji?: string;
  onLongPress?: () => void;
};

export function ExpenseListItem({ expense, emoji, onLongPress }: ExpenseListItemProps) {
  return (
    <Pressable
      onLongPress={onLongPress}
      accessibilityRole={onLongPress ? 'button' : 'text'}
      accessibilityHint={onLongPress ? '길게 눌러 삭제' : undefined}
      accessibilityLabel={`${formatWon(expense.amount)}, ${expense.memo ?? '메모 없음'}, ${formatDay(expense.spentAt)}`}
      style={({ pressed }) => [styles.row, pressed && onLongPress ? styles.pressed : null]}>
      {emoji ? <ThemedText style={styles.emoji}>{emoji}</ThemedText> : null}
      <View style={styles.info}>
        <ThemedText type="smallBold">{formatWon(expense.amount)}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {expense.memo ? expense.memo : '메모 없음'}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {formatDay(expense.spentAt)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pressed: {
    opacity: 0.6,
    backgroundColor: Brand.primarySoft,
    borderRadius: Spacing.three,
  },
  emoji: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
