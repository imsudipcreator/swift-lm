import { useTheme } from '@/hooks';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface InputBarProps extends TextInputProps {
    label: string;
    placeholder: string;
}

export default function InputBar({ label = "Label", placeholder, style, ...props }: InputBarProps) {
    const { theme } = useTheme();
    return (
        <View style={styles.container}>
            <Text style={{ color: theme.text, fontWeight: 'medium', fontSize: 16, paddingLeft: 2 }}>{label}</Text>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={theme.secondary}
                style={[styles.inputContainer, { backgroundColor: theme.onBackgroud, color: theme.text }, style]} 
                {...props}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 8,
    },
    inputContainer: {
        width: '100%',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 60,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    }
})