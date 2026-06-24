import { StyleSheet, View, type ViewProps } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SoftCardProps = ViewProps & {
  /** 강조 카드 — 액센트 soft 톤 배경 */
  accent?: boolean;
  /** 패딩 없이 컨테이너만 (리스트 카드 등) */
  flush?: boolean;
};

/** 둥근 다크 표면 카드 (테두리 포함) */
export function SoftCard({ accent = false, flush = false, style, children, ...rest }: SoftCardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: accent ? Brand.primarySoft : theme.backgroundElement,
          borderColor: theme.border,
        },
        flush ? styles.flush : styles.padded,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Brand.cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  padded: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  flush: {
    gap: 0,
  },
});
