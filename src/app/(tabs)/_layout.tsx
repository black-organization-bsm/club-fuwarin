import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppBar } from '@/components/app-bar';
import { BottomNav } from '@/components/bottom-nav';
import { Fab } from '@/components/fab';
import { useEntrySheet } from '@/features/spending/EntrySheetProvider';
import { useTheme } from '@/hooks/use-theme';

/**
 * 앱바(상단) + 탭 콘텐츠 + 커스텀 하단 내비 + FAB를 쌓는 다크 셸.
 * 시트/오버레이 컨텍스트(EntrySheetProvider)는 루트에 있으므로 여기선 사용만 한다.
 */
export default function TabLayout() {
  const theme = useTheme();
  const { openNew, openDetection } = useEntrySheet();

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <AppBar onBellPress={openDetection} />
      <View style={styles.body}>
        <Tabs
          tabBar={(props) => <BottomNav {...props} />}
          screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: theme.background } }}>
          <Tabs.Screen name="index" />
          <Tabs.Screen name="log" />
          <Tabs.Screen name="graph" />
          <Tabs.Screen name="cost" />
        </Tabs>
      </View>
      <Fab onPress={() => openNew()} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});
