import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { formatKRW } from '@/features/spending/format';
import type { Game } from '@/features/spending/types';
import { useTheme } from '@/hooks/use-theme';

type GameCardProps = {
  game: Game;
  /** 표시 금액 (이번 달 또는 누적) */
  total: number;
  /** 건수 — 배너 좌상단 뱃지 */
  count?: number;
  onPress: () => void;
};

/**
 * 홈의 가로 스크롤용 게임 카드.
 * 상단은 게임 대표색 배너(저작권 포스터 대신 색+이모지 플레이스홀더),
 * 하단은 이름과 금액.
 */
export function GameCard({ game, total, count, onPress }: GameCardProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${game.name}, ${formatKRW(total)}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.banner, { backgroundColor: game.color }]}>
        {count != null ? (
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>{count}건</ThemedText>
          </View>
        ) : null}
        <ThemedText style={styles.emoji}>{game.emoji}</ThemedText>
      </View>
      <View style={styles.body}>
        <ThemedText type="small" themeColor="text" numberOfLines={1} style={styles.name}>
          {game.name}
        </ThemedText>
        <ThemedText style={styles.amount}>{formatKRW(total)}</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 128,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  banner: {
    height: 74,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 9,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 9,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  emoji: {
    fontSize: 30,
  },
  body: {
    padding: Spacing.two,
    paddingTop: 10,
    gap: 5,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: Brand.primaryText,
  },
});
