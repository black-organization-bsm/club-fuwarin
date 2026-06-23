import { Modal, StyleSheet, View } from 'react-native';

import { SoftButton } from '@/components/soft-button';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { formatWon } from '@/features/spending/format';
import { headlineConvert } from '@/features/spending/opportunity';
import { useTheme } from '@/hooks/use-theme';

type PaymentInterventionOverlayProps = {
  visible: boolean;
  /** 이번에 결제하려는 금액 */
  amount: number;
  /** 이 결제까지 포함한 이번 달 누적액 */
  monthTotalAfter: number;
  /** 저장 진행 중 — 버튼 잠금 */
  confirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * 결제 확정 직전 한 번 멈칫하게 만드는 개입 팝업.
 * "이거 치킨 N마리인데 진짜요?" — 클럽 말랑말랑의 핵심 트리거.
 */
export function PaymentInterventionOverlay({
  visible,
  amount,
  monthTotalAfter,
  confirming = false,
  onCancel,
  onConfirm,
}: PaymentInterventionOverlayProps) {
  const theme = useTheme();
  const headline = headlineConvert(amount);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <ThemedText style={styles.emoji}>{headline.emoji}</ThemedText>

          <ThemedText type="subtitle" style={styles.headline}>
            이거 {headline.label} {headline.count}
            {headline.unit}인데{'\n'}진짜 결제할까요?
          </ThemedText>

          <View style={styles.amountRow}>
            <ThemedText type="small" themeColor="textSecondary">
              이번 결제
            </ThemedText>
            <ThemedText type="smallBold">{formatWon(amount)}</ThemedText>
          </View>
          <View style={styles.amountRow}>
            <ThemedText type="small" themeColor="textSecondary">
              이번 달 누적
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: Brand.danger }}>
              {formatWon(monthTotalAfter)}
            </ThemedText>
          </View>

          <View style={styles.actions}>
            <SoftButton
              label="그만둘게요 🙅"
              variant="soft"
              onPress={onCancel}
              disabled={confirming}
              style={styles.flex}
            />
            <SoftButton
              label="그래도 결제"
              variant="danger"
              onPress={onConfirm}
              loading={confirming}
              style={styles.flex}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    borderRadius: Brand.cardRadius,
    padding: Spacing.five,
    gap: Spacing.three,
    alignItems: 'stretch',
  },
  emoji: {
    fontSize: 56,
    textAlign: 'center',
  },
  headline: {
    textAlign: 'center',
    fontSize: 26,
    lineHeight: 34,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  flex: {
    flex: 1,
  },
});
