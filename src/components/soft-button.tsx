import { ActivityIndicator, Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'primary' | 'soft' | 'danger' | 'ghost';

type SoftButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

/** 다크 셸용 버튼. primary=블루 채움, soft=표면, danger=삭제 텍스트, ghost=투명 */
export function SoftButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: SoftButtonProps) {
  const theme = useTheme();

  const bg: Record<Variant, string> = {
    primary: Brand.primary,
    soft: theme.backgroundSelected,
    danger: 'transparent',
    ghost: 'transparent',
  };
  const fg: Record<Variant, string> = {
    primary: '#ffffff',
    soft: theme.text,
    danger: Brand.danger,
    ghost: theme.textSecondary,
  };
  const border: Record<Variant, string> = {
    primary: Brand.primary,
    soft: theme.border,
    danger: 'transparent',
    ghost: 'transparent',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg[variant], borderColor: border[variant] },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg[variant]} />
      ) : (
        <ThemedText type="smallBold" style={[styles.label, { color: fg[variant] }]}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  label: {
    fontSize: 14.5,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.85,
  },
});
