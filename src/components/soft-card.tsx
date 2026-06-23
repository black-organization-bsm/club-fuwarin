import { StyleSheet, View, type ViewProps } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SoftCardProps = ViewProps & {
  /** 강조 카드(브랜드 소프트 배경) 여부 */
  accent?: boolean;
};

/** 둥글고 말랑한 카드 컨테이너 */
export function SoftCard({ accent = false, style, children, ...rest }: SoftCardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: accent ? Brand.primarySoft : theme.backgroundElement },
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
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
