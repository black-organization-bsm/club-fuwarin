import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChartIcon, ConvertIcon, HomeIcon, ListIcon } from '@/components/icons';
import { ThemedText } from '@/components/themed-text';
import { Brand, BottomNavHeight } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconCmp = typeof HomeIcon;

/**
 * expo-router Tabs의 tabBar가 넘겨주는 props 중 우리가 쓰는 부분만 추린 타입.
 * (@react-navigation/bottom-tabs는 expo-router 내부 의존이라 직접 import하지 않는다)
 */
type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

/** 라우트 이름 → 라벨 + 아이콘 매핑 */
const TABS: Record<string, { label: string; Icon: IconCmp }> = {
  index: { label: '홈', Icon: HomeIcon },
  log: { label: '내역', Icon: ListIcon },
  graph: { label: '그래프', Icon: ChartIcon },
  cost: { label: '환산', Icon: ConvertIcon },
};

/** expo-router Tabs의 커스텀 tabBar. 디자인의 다크 하단 내비를 그린다. */
export function BottomNav({ state, navigation }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          height: BottomNavHeight + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: theme.bottomNav,
          borderTopColor: theme.bottomNavBorder,
        },
      ]}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;

        const focused = state.index === index;
        const color = focused ? Brand.primary : theme.textTertiary;
        const { Icon } = tab;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            style={styles.item}>
            <Icon size={21} color={color} width={1.7} />
            <ThemedText style={[styles.label, { color }]}>{tab.label}</ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    paddingHorizontal: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
