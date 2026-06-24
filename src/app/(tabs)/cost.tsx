import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { Screen } from '@/components/screen';
import { SoftCard } from '@/components/soft-card';
import { ThemedText } from '@/components/themed-text';
import { Brand } from '@/constants/theme';
import { currentMonthKey, monthSpent } from '@/features/spending/aggregate';
import { formatKRW } from '@/features/spending/format';
import { convert, headlineConvert } from '@/features/spending/opportunity';
import { useSpending } from '@/features/spending/SpendingProvider';
import { useTheme } from '@/hooks/use-theme';

/** 20000 -> "2만원", 4500 -> "4,500원" (단가 설명용 친근 표기) */
function unitLabel(price: number): string {
  if (price >= 10000 && price % 10000 === 0) return `${price / 10000}만원`;
  if (price >= 10000) return `${(price / 10000).toFixed(1)}만원`;
  return `${price.toLocaleString('ko-KR')}원`;
}

export default function CostScreen() {
  const theme = useTheme();
  const { expenses } = useSpending();
  const total = useMemo(() => monthSpent(expenses, currentMonthKey()), [expenses]);

  const items = useMemo(() => convert(total).filter((i) => i.count >= 1), [total]);
  const headline = headlineConvert(total);

  return (
    <Screen>
      <View>
        <ThemedText style={styles.title}>이 돈이면…</ThemedText>
        <ThemedText type="small" themeColor="textTertiary" style={styles.meta}>
          {formatKRW(total)}으로 할 수 있던 것들
        </ThemedText>
      </View>

      {items.length === 0 ? (
        <EmptyState emoji="😌" title="환산할 지출이 없어요" description="이번 달은 아직 가벼워요." />
      ) : (
        <>
          <View>
            {items.map((item) => (
              <View key={item.key} style={[styles.row, { borderTopColor: theme.divider }]}>
                <View style={[styles.iconBox, { backgroundColor: Brand.primarySoft }]}>
                  <ThemedText style={styles.emoji}>{item.emoji}</ThemedText>
                </View>
                <View style={styles.info}>
                  <ThemedText style={styles.label}>{item.label}</ThemedText>
                  <ThemedText type="small" themeColor="textTertiary" style={styles.unitMeta}>
                    {item.unit}당 약 {unitLabel(item.unitPrice)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.count}>
                  {item.count}
                  <ThemedText style={styles.unit}> {item.unit}</ThemedText>
                </ThemedText>
              </View>
            ))}
          </View>

          <SoftCard>
            <ThemedText type="small" style={styles.note}>
              다음 결제 전에 한 번 더 떠올려봐요. {headline.label}{' '}
              <ThemedText style={styles.noteHi}>
                {headline.count}
                {headline.unit}
              </ThemedText>
              는 가볍지 않으니까요.
            </ThemedText>
          </SoftCard>
        </>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  label: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  unitMeta: {
    fontSize: 12,
  },
  count: {
    fontSize: 24,
    fontWeight: '800',
  },
  unit: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7e818b',
  },
  note: {
    lineHeight: 20,
    color: '#b6b9c1',
  },
  noteHi: {
    color: Brand.primaryText,
    fontWeight: '700',
  },
});
