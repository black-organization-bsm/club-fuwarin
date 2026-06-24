import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlusIcon } from '@/components/icons';
import { Brand, BottomNavHeight } from '@/constants/theme';

type FabProps = {
  onPress: () => void;
};

/** 직접 기록 시트를 여는 + 플로팅 버튼. 하단 내비 바로 위에 떠 있다. */
export function Fab({ onPress }: FabProps) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="지출 직접 기록"
      style={({ pressed }) => [
        styles.fab,
        { bottom: insets.bottom + BottomNavHeight + 14 },
        pressed && styles.pressed,
      ]}>
      <PlusIcon size={26} color="#ffffff" width={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 18,
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // 은은한 그림자
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
