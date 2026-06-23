import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { PaymentInterventionOverlay } from '@/components/payment-intervention-overlay';
import { Screen } from '@/components/screen';
import { SoftButton } from '@/components/soft-button';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { monthSpent } from '@/features/spending/aggregate';
import { formatNumber } from '@/features/spending/format';
import { useSpending } from '@/features/spending/SpendingProvider';
import { useTheme } from '@/hooks/use-theme';

const QUICK_ADD = [10000, 30000, 50000, 100000];

function parseAmount(text: string): number {
  return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
}

export default function AddExpenseScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { games, expenses, addExpense } = useSpending();
  const params = useLocalSearchParams<{ gameId?: string }>();

  // 선택은 사용자가 고른 값(picked)만 저장하고, 실제 gameId는 파생한다.
  // 이렇게 하면 게임이 비동기로 늦게 로드돼도 기본 선택이 자동으로 채워진다(effect 불필요).
  const [picked, setPicked] = useState<string | null>(params.gameId ?? null);
  const gameId = picked ?? games[0]?.id ?? '';

  // 금액은 숫자 하나를 단일 출처로 둔다 (문자열↔숫자 왕복 없음).
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const monthAfter = useMemo(() => monthSpent(expenses) + amount, [expenses, amount]);
  const canSubmit = gameId !== '' && amount > 0;

  async function confirmPurchase() {
    if (submitting) return;
    setSubmitting(true);
    try {
      await addExpense({ gameId, amount, memo });
      setOverlayVisible(false);
      router.back();
    } finally {
      setSubmitting(false);
    }
  }

  if (games.length === 0) {
    return (
      <Screen withTabInset={false}>
        <EmptyState
          emoji="🎮"
          title="먼저 게임을 추가하세요"
          description="지출을 기록하려면 게임이 하나 이상 필요해요."
        />
        <SoftButton label="게임 추가하러 가기" onPress={() => router.replace('/add-game')} />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen withTabInset={false}>
        <ThemedText type="smallBold" style={styles.label}>
          어떤 게임에 질렀나요?
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.chips}>
          {games.map((g) => (
            <Pressable
              key={g.id}
              onPress={() => setPicked(g.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: gameId === g.id }}
              accessibilityLabel={`게임 ${g.name}`}
              style={[
                styles.chip,
                { backgroundColor: theme.backgroundElement },
                gameId === g.id && styles.chipSelected,
              ]}>
              <ThemedText>{g.emoji}</ThemedText>
              <ThemedText type="small" style={gameId === g.id ? styles.chipTextSelected : undefined}>
                {g.name}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>

        <ThemedText type="smallBold" style={styles.label}>
          금액
        </ThemedText>
        <View style={[styles.amountBox, { backgroundColor: theme.backgroundElement }]}>
          <TextInput
            value={amount > 0 ? formatNumber(amount) : ''}
            onChangeText={(text) => setAmount(parseAmount(text))}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="number-pad"
            style={[styles.amountInput, { color: theme.text }]}
          />
          <ThemedText type="subtitle" style={styles.won}>
            원
          </ThemedText>
        </View>
        <View style={styles.quickRow}>
          {QUICK_ADD.map((q) => (
            <Pressable
              key={q}
              onPress={() => setAmount((a) => a + q)}
              accessibilityRole="button"
              accessibilityLabel={`${formatNumber(q)}원 추가`}
              style={[styles.quickChip, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small">+{formatNumber(q / 10000)}만</ThemedText>
            </Pressable>
          ))}
        </View>

        <ThemedText type="smallBold" style={styles.label}>
          메모 (선택)
        </ThemedText>
        <TextInput
          value={memo}
          onChangeText={setMemo}
          placeholder="예: 신규 캐릭터 천장"
          placeholderTextColor={theme.textSecondary}
          style={[styles.memoInput, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />

        <SoftButton
          label="결제하기"
          variant="danger"
          disabled={!canSubmit}
          onPress={() => setOverlayVisible(true)}
        />

        <PaymentInterventionOverlay
          visible={overlayVisible}
          amount={amount}
          monthTotalAfter={monthAfter}
          confirming={submitting}
          onCancel={() => setOverlayVisible(false)}
          onConfirm={confirmPurchase}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  label: {
    fontSize: 15,
  },
  chips: {
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Brand.pillRadius,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipSelected: {
    borderColor: Brand.primary,
    backgroundColor: Brand.primarySoft,
  },
  chipTextSelected: {
    color: Brand.primaryDark,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Brand.cardRadius,
    paddingHorizontal: Spacing.four,
    minHeight: 72,
  },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '800',
  },
  won: {
    marginLeft: Spacing.two,
  },
  quickRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  quickChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderRadius: Brand.pillRadius,
  },
  memoInput: {
    minHeight: 52,
    borderRadius: Brand.cardRadius,
    paddingHorizontal: Spacing.four,
    fontSize: 16,
  },
});
