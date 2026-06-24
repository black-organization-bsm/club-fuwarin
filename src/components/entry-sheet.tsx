import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { formatNumber } from '@/features/spending/format';
import type { Game } from '@/features/spending/types';
import { useTheme } from '@/hooks/use-theme';

export type EntryValues = { gameId: string; amount: number; memo: string };

type EntrySheetProps = {
  visible: boolean;
  mode: 'new' | 'edit';
  games: Game[];
  initial: EntryValues;
  onSave: (values: EntryValues) => void;
  onDelete: () => void;
  onClose: () => void;
};

function parseAmount(text: string): number {
  return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
}

/** 직접 기록(new) / 내역 수정(edit) 겸용 바텀시트 */
export function EntrySheet({ visible, mode, games, initial, onSave, onDelete, onClose }: EntrySheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // 폼은 열릴 때의 초기값으로 시작한다. 매번 새 값으로 리셋하기 위해
  // 호출부에서 열 때마다 다른 key를 줘 컴포넌트를 리마운트한다(아래 Provider 참고).
  const [gameId, setGameId] = useState(initial.gameId);
  const [amount, setAmount] = useState(initial.amount);
  const [memo, setMemo] = useState(initial.memo);

  const isEdit = mode === 'edit';
  const canSave = gameId !== '' && amount > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[
              styles.sheet,
              {
                backgroundColor: theme.appBar,
                borderColor: theme.appBarBorder,
                paddingBottom: insets.bottom + Spacing.four,
              },
            ]}
            onPress={() => {}}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />

            <ThemedText style={styles.title}>{isEdit ? '내역 수정' : '직접 기록'}</ThemedText>
            <ThemedText type="small" themeColor="textTertiary" style={styles.subtitle}>
              {isEdit ? '금액·항목을 고치거나 삭제할 수 있어요' : 'iOS는 결제 감지가 어려워 직접 남겨요'}
            </ThemedText>

            <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
              게임
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.chips}>
              {games.map((g) => {
                const selected = g.id === gameId;
                return (
                  <Pressable
                    key={g.id}
                    onPress={() => setGameId(g.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[
                      styles.chip,
                      {
                        borderColor: selected ? Brand.primary : theme.border,
                        backgroundColor: selected ? Brand.primarySoft : theme.backgroundElement,
                      },
                    ]}>
                    <ThemedText style={styles.chipEmoji}>{g.emoji}</ThemedText>
                    <ThemedText
                      type="small"
                      style={[styles.chipText, { color: selected ? Brand.primarySoftText : theme.text }]}
                      numberOfLines={1}>
                      {g.name}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>

            <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
              금액
            </ThemedText>
            <View style={[styles.field, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <ThemedText style={styles.won}>₩</ThemedText>
              <TextInput
                value={amount > 0 ? formatNumber(amount) : ''}
                onChangeText={(t) => setAmount(parseAmount(t))}
                placeholder="0"
                placeholderTextColor={theme.textTertiary}
                keyboardType="number-pad"
                style={[styles.amountInput, { color: theme.text }]}
              />
            </View>

            <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
              항목
            </ThemedText>
            <View style={[styles.field, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <TextInput
                value={memo}
                onChangeText={setMemo}
                placeholder="예: 월간 패키지"
                placeholderTextColor={theme.textTertiary}
                style={[styles.memoInput, { color: theme.text }]}
              />
            </View>

            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="취소"
                style={[styles.cancel, { backgroundColor: theme.backgroundSelected, borderColor: theme.border }]}>
                <ThemedText style={[styles.cancelText, { color: theme.text }]}>취소</ThemedText>
              </Pressable>
              <Pressable
                onPress={() => canSave && onSave({ gameId, amount, memo })}
                disabled={!canSave}
                accessibilityRole="button"
                accessibilityLabel={isEdit ? '수정 완료' : '저장'}
                style={[styles.save, !canSave && styles.disabled]}>
                <ThemedText style={styles.saveText}>{isEdit ? '수정 완료' : '저장'}</ThemedText>
              </Pressable>
            </View>

            {isEdit ? (
              <Pressable
                onPress={onDelete}
                accessibilityRole="button"
                accessibilityLabel="이 내역 삭제"
                style={styles.delete}>
                <ThemedText style={styles.deleteText}>이 내역 삭제</ThemedText>
              </Pressable>
            ) : null}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8,9,12,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Brand.sheetRadius,
    borderTopRightRadius: Brand.sheetRadius,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 12.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  chips: {
    gap: Spacing.one,
    paddingRight: Spacing.three,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 13.5,
    fontWeight: '700',
    maxWidth: 110,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 15,
    minHeight: 50,
  },
  won: {
    fontSize: 18,
    fontWeight: '800',
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    paddingVertical: 12,
  },
  memoInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  cancel: {
    width: 88,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  save: {
    flex: 1,
    backgroundColor: Brand.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.45,
  },
  delete: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  deleteText: {
    color: Brand.danger,
    fontSize: 13.5,
    fontWeight: '600',
  },
});
