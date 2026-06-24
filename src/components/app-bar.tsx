import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BellIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { AppBarHeight } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LOGO = require('@/assets/images/club-fuwarin-logo-dark.png');

type AppBarProps = {
  /** 종 아이콘 탭 — 결제 감지 오버레이를 띄운다. */
  onBellPress: () => void;
};

/** 상단 고정 앱바: 로고 · 타이틀 · 알림 종 · 아바타 */
export function AppBar({ onBellPress }: AppBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingTop: insets.top,
          height: AppBarHeight + insets.top,
          backgroundColor: theme.appBar,
          borderBottomColor: theme.appBarBorder,
        },
      ]}>
      <View style={styles.left}>
        <Image source={LOGO} style={styles.logo} contentFit="contain" />
        <View style={[styles.sep, { backgroundColor: theme.border }]} />
        <ThemedText style={styles.title}>클럽 말랑말랑</ThemedText>
      </View>

      <View style={styles.right}>
        <Pressable
          onPress={onBellPress}
          accessibilityRole="button"
          accessibilityLabel="결제 감지 미리보기"
          hitSlop={8}
          style={({ pressed }) => pressed && styles.pressed}>
          <BellIcon size={19} color={theme.textSecondary} width={1.7} />
        </Pressable>
        <View style={[styles.avatar, { backgroundColor: theme.backgroundSelected }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logo: {
    height: 20,
    width: 54,
  },
  sep: {
    width: 1,
    height: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 999,
  },
  pressed: {
    opacity: 0.6,
  },
});
