import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type Segment = { key: string; value: number; color: string };

type SegmentBarProps = {
  segments: Segment[];
  height?: number;
};

/** 게임별 비중을 한 줄로 보여주는 다색 진행 바 (홈 월 지출 카드) */
export function SegmentBar({ segments, height = 8 }: SegmentBarProps) {
  const theme = useTheme();
  const total = segments.reduce((acc, s) => acc + s.value, 0);

  return (
    <View style={[styles.track, { height, backgroundColor: theme.backgroundSelected }]}>
      {total > 0 &&
        segments.map((s) => (
          <View key={s.key} style={{ flex: s.value, backgroundColor: s.color }} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: 999,
    overflow: 'hidden',
  },
});
