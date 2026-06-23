import { StyleSheet, View } from 'react-native';

/** 리스트 항목 사이 얇은 구분선 */
export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(128,128,128,0.2)',
  },
});
