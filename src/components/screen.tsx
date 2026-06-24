import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavHeight, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: React.ReactNode;
  /** 탭 화면 여부 — true면 하단 커스텀 내비/FAB를 피하도록 아래 여백을 둔다. */
  withTabInset?: boolean;
  contentStyle?: ViewStyle;
};

/**
 * 화면 공통 스크롤 컨테이너.
 * 상단 앱바와 하단 내비는 셸((tabs)/_layout)이 그리므로, 여기서는 상단
 * 세이프에어리어를 다루지 않고 콘텐츠 여백만 책임진다.
 */
export function Screen({ children, withTabInset = true, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const paddingBottom = withTabInset
    ? insets.bottom + BottomNavHeight + Spacing.five // 내비 + FAB 여유
    : insets.bottom + Spacing.four;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.outer}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}>
      <View style={[styles.inner, { paddingBottom }, contentStyle]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  outer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },
});
