import { useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import 'react-native-get-random-values';
import { ActivityIndicator } from 'react-native-paper';

export default function EntryScreen() {
    const { isLoaded, isSignedIn } = useAuth()
    const checkOfflineLogin = async () => {
        const loggedIn = await AsyncStorage.getItem("is_logged_in");
        if (loggedIn === "true") {
            return <Redirect href={'/chat'} />;
        }
    };
    checkOfflineLogin();
    if (isLoaded && !isSignedIn) {
        return <Redirect href={'/auth'} />
    }
    if (isLoaded && isSignedIn) {
        return <Redirect href={'/chat'} />
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
        </View>
    )
}