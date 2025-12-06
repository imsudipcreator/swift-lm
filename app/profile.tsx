import { useUser } from '@clerk/clerk-expo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { View } from 'react-native';
import { Avatar, Icon, Text, useTheme } from 'react-native-paper';


export default function ProfileScreen() {
    const { user } = useUser();
    const theme = useTheme();
    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        )
    }

    console.log(user.imageUrl)
    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 24, gap: 3 }}>
            {
                user.imageUrl ? (
                    <Avatar.Image key={''} source={{ uri: user.imageUrl }} size={120} />
                ) : (
                    <Avatar.Text key={''} label={"SM"} size={24} />
                )
            }
            <Text variant='titleLarge' style={{ marginTop: 5 }}>{user.fullName}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <Icon source={'email'} size={14} color={'gray'} />
                <Text style={{ color: 'gray' }}>{user.emailAddresses[0].emailAddress}</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <MaterialIcons name='event' color={'gray'} size={14} />
                <Text style={{ color: 'gray' }}>{user.lastSignInAt?.toDateString()}</Text>
            </View>
        </View>
    )
}