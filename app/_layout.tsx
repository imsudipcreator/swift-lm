import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import * as Linking from "expo-linking";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { DATABASE_NAME } from '@/db/db';
import { initDb } from '@/db/init';
import { DMSerifText_400Regular, DMSerifText_400Regular_Italic, useFonts } from '@expo-google-fonts/dm-serif-text';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from "expo-sqlite";
import { ActivityIndicator } from 'react-native';


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  let [fontsLoaded] = useFonts({
    DMSerifText_400Regular,
    DMSerifText_400Regular_Italic,
    Pacifico_400Regular
  });

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

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      (async () => {
        await initDb()
      })();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
      >
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack initialRouteName='index'>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="models" options={{ title: 'Models Store' }} />
              <Stack.Screen name="main" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </ThemeProvider>
      </SQLiteProvider>
    </ClerkProvider >
  );
}
