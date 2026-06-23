import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { GameCard } from '@/components/game-card';
import { Screen } from '@/components/screen';
import { SoftButton } from '@/components/soft-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { gamesByTotal } from '@/features/spending/aggregate';
import { useSpending } from '@/features/spending/SpendingProvider';

export default function GamesScreen() {
  const router = useRouter();
  const { games, expenses } = useSpending();

  const ranked = useMemo(() => gamesByTotal(games, expenses), [games, expenses]);

  return (
    <Screen>
      <ThemedText type="subtitle">게임별 지출</ThemedText>

      <SoftButton label="＋ 게임 추가" variant="soft" onPress={() => router.push('/add-game')} />

      {ranked.length === 0 ? (
        <EmptyState
          emoji="🎮"
          title="등록된 게임이 없어요"
          description="플레이 중인 가챠 게임을 추가해보세요."
        />
      ) : (
        <View style={styles.list}>
          {ranked.map(({ game, total }) => (
            <GameCard
              key={game.id}
              game={game}
              total={total}
              onPress={() => router.push({ pathname: '/game/[id]', params: { id: game.id } })}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
});
