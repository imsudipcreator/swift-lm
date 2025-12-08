import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Linking from "expo-linking";
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  
    useEffect(() => {
      const sub = Linking.addEventListener("url", (event) => {
        const url = event.url; // ✓ correct typing

        if (url.includes("oauth-native-callback")) {
          // Ignore this deep link so Expo Router doesn’t show "unmatched route"
          return;
        }
      });

      return () => sub.remove();
    }, []);

    return (
      <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <PaperProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack initialRouteName='index'>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="models" options={{ title: 'Models Store' }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="chat" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </GestureHandlerRootView>
        </PaperProvider>
      </ClerkProvider>
    );
  }
