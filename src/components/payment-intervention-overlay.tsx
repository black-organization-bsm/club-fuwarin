import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BellIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { formatKRW } from '@/features/spending/format';
import { headlineConvert } from '@/features/spending/opportunity';
import { useTheme } from '@/hooks/use-theme';

type PaymentInterventionOverlayProps = {
  visible: boolean;
  /** 결제가 감지된 게임 이름 */
  gameName: string;
  /** 이번에 감지된 결제 금액 */
  amount: number;
  /** 이 결제까지 포함한 이번 달 누적액 */
  monthTotalAfter: number;
  confirming?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Android 결제 알림을 감지해 "이미 결제된 내역"을 자동 기록하기 직전,
 * 기회비용(치킨 N마리)을 비춰 한 번 멈칫하게 만드는 개입 바텀시트.
 * (디자인 프로토타입의 'Android 결제 알림 감지' 오버레이)
 */
export function PaymentInterventionOverlay({
  visible,
  gameName,
  amount,
  monthTotalAfter,
  confirming = false,
  onConfirm,
  onClose,
}: PaymentInterventionOverlayProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const headline = headlineConvert(amount);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* 시트 본문 탭은 닫히지 않도록 전파 차단 */}
        <Pressable
          style={[
            styles.sheet,
            { backgroundColor: theme.appBar, borderColor: theme.appBarBorder, paddingBottom: insets.bottom + Spacing.four },
          ]}
          onPress={() => {}}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          <View style={[styles.badge, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
            <BellIcon size={13} color={theme.textSecondary} width={1.8} />
            <ThemedText style={[styles.badgeText, { color: theme.textSecondary }]}>
              Android 결제 알림 감지
            </ThemedText>
          </View>

          <ThemedText type="small" themeColor="textSecondary" style={styles.detected}>
            방금 <ThemedText style={styles.detectedGame}>{gameName}</ThemedText>에서 결제했어요
          </ThemedText>
          <ThemedText style={styles.amount}>{formatKRW(amount)}</ThemedText>

          <View style={[styles.convert, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
            <ThemedText type="small" style={styles.convertText}>
              = {headline.emoji} {headline.label}{' '}
              <ThemedText style={styles.convertHi}>
                {headline.count}
                {headline.unit}
              </ThemedText>{' '}
              · 이번 달 누적 {formatKRW(monthTotalAfter)}
            </ThemedText>
          </View>

          <ThemedText type="small" themeColor="textTertiary" style={styles.note}>
            이미 결제된 내역이라 자동으로 기록돼요.
          </ThemedText>

          <Pressable
            onPress={onConfirm}
            disabled={confirming}
            accessibilityRole="button"
            accessibilityLabel="기록 완료"
            style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed, confirming && styles.ctaDisabled]}>
            <ThemedText style={styles.ctaText}>기록 완료</ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8,9,12,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Brand.sheetRadius,
    borderTopRightRadius: Brand.sheetRadius,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detected: {
    marginTop: 16,
  },
  detectedGame: {
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    marginTop: 8,
    fontSize: 33,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  convert: {
    marginTop: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  convertText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  convertHi: {
    color: Brand.primaryText,
    fontWeight: '700',
  },
  note: {
    marginTop: 16,
    fontSize: 12,
  },
  cta: {
    marginTop: 12,
    backgroundColor: Brand.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  ctaPressed: {
    opacity: 0.9,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
