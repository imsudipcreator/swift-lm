import InputBar from '@/components/input-bar';
import { useMessageStore } from '@/store/message-store';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text, useTheme } from 'react-native-paper';


export default function ChatScreen({ route }: { route: any }) {
    const { id } = route.params;
    const [query, setQuery] = useState('');
    const theme = useTheme();
    const { messages: allMessages, createMessage, loading } = useMessageStore(state => state)
    const messages = allMessages.filter(message => message.chatId === id)

    // console.log(messages)


    function handlePress() {
        createMessage("user", "result", query, id)
    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingBottom: 20 }}>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: message, index }) => {
                        if (message.role === "user") {
                            return (
                                <View key={index} style={[styles.userMessageContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                                    <Text variant='bodyLarge' style={{ textAlign: 'left', color: theme.colors.onPrimaryContainer }}>{message.content}</Text>
                                </View>
                            )
                        } else {
                            return (
                                <View key={index} style={[styles.assistantMessageContainer]}>
                                    <Text variant='bodyLarge' style={{ textAlign: 'left' }}>{message.content}</Text>
                                </View>
                            )
                        }
                    }}
                    style={{ flex: 1, height: '100%', paddingHorizontal: 12 }}
                    ListFooterComponent={() => (
                        <View style={{ width: "100%", height: 100 }}>
                            {
                                loading?.state && (
                                    <Text style={{}}>{loading.message}</Text>
                                )
                            }
                        </View>
                    )}

                />
                <InputBar query={query} setQuery={setQuery} onPress={handlePress} />
            </View>
        </TouchableWithoutFeedback>
    )
}



const styles = StyleSheet.create({
    userMessageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        maxWidth: '80%',
        alignSelf: 'flex-end',
        padding: 8,
        borderRadius: 8,
        marginBottom: 3
    },
    assistantMessageContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        // backgroundColor: 'gray',
        padding: 8,
        borderRadius: 8,
        marginBottom: 16
    }
})