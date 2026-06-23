import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Rect, Text as SvgText } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import type { MonthlyPoint } from '@/features/spending/aggregate';
import { formatNumber } from '@/features/spending/format';
import { useTheme } from '@/hooks/use-theme';

type MonthlyBarChartProps = {
  data: MonthlyPoint[];
  height?: number;
};

/** 최근 N개월 월별 지출 막대 그래프 (react-native-svg) */
export function MonthlyBarChart({ data, height = 180 }: MonthlyBarChartProps) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);

  const max = Math.max(1, ...data.map((d) => d.total));
  const labelArea = 24; // 하단 월 라벨 영역
  const topPad = 18; // 상단 금액 라벨 영역
  const chartH = height - labelArea - topPad;
  const slot = data.length > 0 ? width / data.length : 0;
  const barW = Math.min(36, slot * 0.55);

  return (
    <View style={styles.wrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Svg width={width} height={height}>
          {data.map((d, i) => {
            const ratio = d.total / max;
            const barH = Math.max(d.total > 0 ? 4 : 0, ratio * chartH);
            const x = i * slot + (slot - barW) / 2;
            const y = topPad + (chartH - barH);
            const isCurrent = i === data.length - 1;
            return (
              <G key={d.key}>
                {d.total > 0 && (
                  <SvgText
                    x={i * slot + slot / 2}
                    y={y - 5}
                    fontSize={10}
                    fontWeight="600"
                    fill={theme.textSecondary}
                    textAnchor="middle">
                    {formatNumber(d.total)}
                  </SvgText>
                )}
                <Rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={8}
                  fill={isCurrent ? Brand.primary : Brand.primarySoft}
                />
                <SvgText
                  x={i * slot + slot / 2}
                  y={height - 6}
                  fontSize={11}
                  fontWeight={isCurrent ? '700' : '500'}
                  fill={isCurrent ? Brand.primary : theme.textSecondary}
                  textAnchor="middle">
                  {d.label}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      )}
      {data.every((d) => d.total === 0) && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          최근 6개월 지출 기록이 없어요.
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    minHeight: 180,
    justifyContent: 'center',
  },
  empty: {
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: Spacing.five,
  },
});
