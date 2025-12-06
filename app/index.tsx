import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import 'react-native-get-random-values';
import { ActivityIndicator } from 'react-native-paper';

export default function EntryScreen() {
    const { isLoaded, isSignedIn } = useAuth()
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