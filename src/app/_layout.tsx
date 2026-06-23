import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SpendingProvider } from '@/features/spending/SpendingProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SpendingProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="add-game"
            options={{ presentation: 'modal', headerShown: true, title: '게임 추가' }}
          />
          <Stack.Screen
            name="add-expense"
            options={{ presentation: 'modal', headerShown: true, title: '지출 추가' }}
          />
          <Stack.Screen name="game/[id]" options={{ headerShown: true, title: '' }} />
        </Stack>
      </SpendingProvider>
    </ThemeProvider>
  );
}
