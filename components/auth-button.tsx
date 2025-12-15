import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';


interface AuthButtonProps {
    onPress: () => void;
    icon: React.ReactNode;
    label: string;
}

export default function AuthButton({ onPress, icon, label }: AuthButtonProps) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
            {icon}
            <Text style={{ color: 'black', fontWeight: 'medium', fontSize: 16 }}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 99,
        padding: 16
    }
})