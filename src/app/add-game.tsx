import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Screen } from '@/components/screen';
import { SoftButton } from '@/components/soft-button';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing } from '@/constants/theme';
import { useSpending } from '@/features/spending/SpendingProvider';
import { useTheme } from '@/hooks/use-theme';

const EMOJIS = ['🎮', '🗡️', '🧙', '🐉', '⚔️', '🎲', '🃏', '🏰', '🚀', '🌸', '⭐️', '💎'];

export default function AddGameScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addGame } = useSpending();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && !saving;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      await addGame({ name, emoji });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen withTabInset={false}>
        <ThemedText type="smallBold" style={styles.label}>
          게임 이름
        </ThemedText>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="예: 원신, 블루아카이브"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <ThemedText type="smallBold" style={styles.label}>
          아이콘
        </ThemedText>
        <View style={styles.emojiGrid}>
          {EMOJIS.map((e) => (
            <Pressable
              key={e}
              onPress={() => setEmoji(e)}
              accessibilityRole="button"
              accessibilityState={{ selected: emoji === e }}
              accessibilityLabel={`아이콘 ${e}`}
              style={[
                styles.emojiCell,
                { backgroundColor: theme.backgroundElement },
                emoji === e && styles.emojiSelected,
              ]}>
              <ThemedText style={styles.emoji}>{e}</ThemedText>
            </Pressable>
          ))}
        </View>

        <SoftButton label="게임 추가하기" onPress={handleSave} disabled={!canSave} loading={saving} />
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  label: {
    fontSize: 15,
  },
  input: {
    minHeight: 52,
    borderRadius: Brand.cardRadius,
    paddingHorizontal: Spacing.four,
    fontSize: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  emojiCell: {
    width: 56,
    height: 56,
    borderRadius: Brand.cardRadius,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiSelected: {
    borderColor: Brand.primary,
    backgroundColor: Brand.primarySoft,
  },
  emoji: {
    fontSize: 26,
  },
});
