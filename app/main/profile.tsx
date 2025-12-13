import { useTheme } from '@/hooks';
import { useUser } from '@clerk/clerk-expo';
import { Calendar02Icon, Mail01Icon, MenuTwoLineIcon, MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ProfileScreen({ navigation }: any) {
    const { user } = useUser();
    const { isConnected, isInternetReachable } = useNetInfo();
    const { theme } = useTheme()

    if (!isConnected || !isInternetReachable) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Offline</Text>
            </View>
        )
    }
    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        )
    }

    console.log(user.imageUrl)
    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: theme.background }}>
            <Header title={user.firstName ? user.firstName + '\'s Profile' : "My Profile"} onDrawerPress={navigation.toggleDrawer} />
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingVertical: 24, gap: 3 }}>
                <View style={[styles.avatarConatiner]}>
                    <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                </View>
                <Text style={{ marginTop: 5, color: theme.text, fontSize: 18, fontWeight: 'medium' }}>{user.fullName}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                    <HugeiconsIcon icon={Mail01Icon} color={'gray'} size={14} />
                    <Text style={{ color: 'gray' }}>{user.emailAddresses[0].emailAddress}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                    <HugeiconsIcon icon={Calendar02Icon} color={'gray'} size={14} />
                    <Text style={{ color: 'gray' }}>{user.lastSignInAt?.toDateString()}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

interface HeaderProps {
    title: string;
    onDrawerPress: () => void;
}
function Header({ onDrawerPress, title }: HeaderProps) {
    const { theme } = useTheme();
    return (
        <View style={styles.headerConatiner}>
            {/** Drawer Toggle */}
            <TouchableOpacity activeOpacity={0.8} onPress={onDrawerPress} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
                <HugeiconsIcon icon={MenuTwoLineIcon} color={theme.text} />
            </TouchableOpacity>
            {/** Model Selector */}

            <TouchableOpacity activeOpacity={0.8} style={[styles.headerItemContainer, { flex: 1, backgroundColor: theme.onBackgroud, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }]}>
                <Text style={{ color: theme.text }}>{title}</Text>
            </TouchableOpacity>
            {/** Temporary Chat */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
                <HugeiconsIcon icon={MoreVerticalIcon} color={theme.text} />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    headerConatiner: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        height: 60,
        paddingVertical: 4
    },
    headerItemContainer: {
        borderRadius: 999,
        padding: 8
    },
    headerItemRounded: {
        aspectRatio: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modelContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 16,
        gap: 2,
        borderRadius: 16
    },
    infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2
    },
    attributeContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
    },
    avatarConatiner: {
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
        height: 120
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 999
    }
})