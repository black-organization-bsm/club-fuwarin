import { StyleSheet, View } from 'react-native';

import { SoftCard } from '@/components/soft-card';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { convert } from '@/features/spending/opportunity';
import { useTheme } from '@/hooks/use-theme';

type OpportunityCardProps = {
  title: string;
  amount: number;
};

/** 금액을 일상 단위(치킨/스벅/영화...)로 환산해 보여주는 카드 */
export function OpportunityCard({ title, amount }: OpportunityCardProps) {
  const theme = useTheme();
  const items = convert(amount).filter((i) => i.count >= 1);

  return (
    <SoftCard>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {title}
      </ThemedText>

      {items.length === 0 ? (
        <ThemedText type="small" themeColor="textTertiary">
          아직 환산할 지출이 없어요. 가챠는 잠시 참아볼까요? 😌
        </ThemedText>
      ) : (
        <View style={styles.grid}>
          {items.map((item) => (
            <View key={item.key} style={[styles.pill, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
              <ThemedText type="small" style={styles.count}>
                {item.label} {item.count}
                {item.unit}
              </ThemedText>
            </View>
          ))}
        </View>
      )}
    </SoftCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Brand.pillRadius,
  },
  emoji: {
    fontSize: 16,
  },
  count: {
    color: Brand.primaryText,
    fontWeight: '700',
  },
});
