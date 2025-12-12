import React from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface ButtonProps extends TouchableOpacityProps {
    children: React.ReactNode
}

export default function Button({ children, ...props }: ButtonProps) {
    return (
        <TouchableOpacity activeOpacity={0.8} {...props} style={[styles.container, props.style]}>
            {children}
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#454545',
        borderRadius: 99,
        padding: 16,
    }
})