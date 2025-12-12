import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import 'react-native-get-random-values';
import { ActivityIndicator } from 'react-native-paper';

export default function EntryScreen() {
    const { isLoaded, isSignedIn } = useAuth();
    const [offlineLoggedIn, setOfflineLoggedIn] = React.useState<boolean | null>(null);

    // Check offline login first
    React.useEffect(() => {
        (async () => {
            const loggedIn = await AsyncStorage.getItem("is_logged_in");
            setOfflineLoggedIn(loggedIn === "true");
        })();
    }, []);

    // Still loading offline status
    if (offlineLoggedIn === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
            </View>
        );
    }

    // If offline login is true → ALWAYS redirect to chat
    if (offlineLoggedIn === true) {
        return <Redirect href="/main" />;
    }

    // No offline login → fallback to Clerk auth
    if (isLoaded) {
        if (!isSignedIn) return <Redirect href="/onboarding" />;
        if (isSignedIn) return <Redirect href="/main" />;
    }

    // Still loading Clerk
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
        </View>
    );
}
