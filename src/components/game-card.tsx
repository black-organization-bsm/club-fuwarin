import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { formatWon } from '@/features/spending/format';
import type { Game } from '@/features/spending/types';
import { useTheme } from '@/hooks/use-theme';

type GameCardProps = {
  game: Game;
  total: number;
  onPress: () => void;
};

export function GameCard({ game, total, onPress }: GameCardProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${game.name}, 누적 지출 ${formatWon(total)}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.emojiCircle, { backgroundColor: Brand.primarySoft }]}>
        <ThemedText style={styles.emoji}>{game.emoji}</ThemedText>
      </View>
      <View style={styles.info}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {game.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          누적 지출
        </ThemedText>
      </View>
      <ThemedText type="smallBold" style={styles.total}>
        {formatWon(total)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Brand.cardRadius,
  },
  pressed: {
    opacity: 0.8,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  total: {
    color: Brand.primary,
    fontSize: 16,
  },
});
