import { useTheme } from '@/hooks'
import { ArrowDown01Icon, IncognitoIcon, MenuTwoLineIcon, Store01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'


interface HeaderProps {
    title: string;
    onDrawerPress: () => void;
}

export default function Header({}) {
    const { theme } = useTheme()
    return (
        <View style={styles.headerConatiner}>
            {/** Drawer Toggle */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.itemContainer, styles.roundedItem, { backgroundColor: theme.onBackgroud }]}>
                <HugeiconsIcon icon={MenuTwoLineIcon} color={theme.text} />
            </TouchableOpacity>
            {/** Model Selector */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.itemContainer, { flex: 1, backgroundColor: theme.onBackgroud, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }]}>
                <Text style={{ color: theme.text }}>Deepseek R1</Text>
                <HugeiconsIcon icon={ArrowDown01Icon} color={theme.text} size={22} />
            </TouchableOpacity>
            {/** Models Store */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.itemContainer, styles.roundedItem, { backgroundColor: theme.onBackgroud }]}>
                <HugeiconsIcon icon={Store01Icon} color={theme.text} />
            </TouchableOpacity>
            {/** Temporary Chat */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.itemContainer, styles.roundedItem, { backgroundColor: theme.onBackgroud }]}>
                <HugeiconsIcon icon={IncognitoIcon} color={theme.text} />
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
        height: 52,
        marginTop: 9
    },
    itemContainer: {
        borderRadius: 999,
        padding: 8
    },
    roundedItem: {
        aspectRatio: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})