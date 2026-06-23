import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenProps = {
  children: React.ReactNode;
  /** 하단 탭 인셋 적용 여부 (탭 화면은 true) */
  withTabInset?: boolean;
  contentStyle?: ViewStyle;
};

/** 탭/상세 화면 공통 스크롤 컨테이너 (세이프에어리어 + 중앙 정렬 + 최대 폭) */
export function Screen({ children, withTabInset = true, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const bottom =
    insets.bottom + (withTabInset ? BottomTabInset : 0) + Spacing.four;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.outer}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive">
      <View
        style={[
          styles.inner,
          {
            paddingTop: Platform.OS === 'android' ? insets.top + Spacing.three : Spacing.three,
            paddingBottom: bottom,
          },
          contentStyle,
        ]}>
        {children}
      </View>
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
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
});
