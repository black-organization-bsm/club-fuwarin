import { DarkTheme, Stack, ThemeProvider } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { EntrySheetProvider } from '@/features/spending/EntrySheetProvider';
import { SpendingProvider } from '@/features/spending/SpendingProvider';

export default function RootLayout() {
  // 디자인은 단일 다크 테마 — 시스템 설정과 무관하게 항상 DarkTheme.
  return (
    <ThemeProvider value={DarkTheme}>
      <SpendingProvider>
        <EntrySheetProvider>
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="add-game"
              options={{ presentation: 'modal', headerShown: true, title: '게임 추가' }}
            />
            <Stack.Screen name="game/[id]" options={{ headerShown: true, title: '' }} />
          </Stack>
        </EntrySheetProvider>
      </SpendingProvider>
    </ThemeProvider>
  );
}
