import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatKRW } from '@/features/spending/format';
import type { Expense } from '@/features/spending/types';
import { useTheme } from '@/hooks/use-theme';

type ExpenseListItemProps = {
  expense: Expense;
  /** 행 제목으로 쓸 게임 이름 */
  gameName: string;
  /** 부제: 항목 + 메타(날짜 또는 자동/수동). 미지정 시 항목만. */
  subtitle?: React.ReactNode;
  /** 탭 동작 — 주어지면 우측에 셰브론을 표시한다. */
  onPress?: () => void;
  onLongPress?: () => void;
};

/** 내역/홈에서 공통으로 쓰는 지출 한 줄 */
export function ExpenseListItem({ expense, gameName, subtitle, onPress, onLongPress }: ExpenseListItemProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${gameName} ${formatKRW(expense.amount)}`}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}>
      <View style={styles.info}>
        <ThemedText style={styles.name}>{gameName}</ThemedText>
        {subtitle != null ? (
          <ThemedText type="small" themeColor="textTertiary" style={styles.sub} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <ThemedText style={styles.amount}>{formatKRW(expense.amount)}</ThemedText>
      {onPress ? <ChevronIcon size={17} color={theme.textTertiary} width={2} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: 14,
  },
  pressed: {
    opacity: 0.6,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  sub: {
    fontSize: 12,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
