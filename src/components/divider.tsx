import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/** 리스트 항목 사이 얇은 구분선 (다크 표면용) */
export function Divider() {
  const theme = useTheme();
  return <View style={[styles.divider, { backgroundColor: theme.divider }]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
