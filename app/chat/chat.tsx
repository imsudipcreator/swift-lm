import ChatHeader from '@/components/chat-header';
import InputBar from '@/components/input-bar';
import { parseMessageContent } from '@/lib';
import { useMessageStore } from '@/store/message-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import { Text, useTheme } from 'react-native-paper';


export default function ChatScreen({ route, navigation }: any) {
    const { id } = route.params;
    const [query, setQuery] = useState('');
    const theme = useTheme();
    const { messages: allMessages, createMessage, loading } = useMessageStore(state => state)
    const messages = allMessages.filter(message => message.chatId === id)
    const [openedThoughts, setOpenedThoughts] = useState<number | null>(null)

    // console.log(messages)
    console.log("id: ",id)
    console.log("navigation: ", navigation)

    function toggleThoughts(index: number) {
        if (openedThoughts === index) {
            setOpenedThoughts(null)
        } else {
            setOpenedThoughts(index)
        }
    }


    function handlePress() {
        createMessage("user", "result", query, id);
        return id
    }
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingBottom: 60 }}>
                <ChatHeader title={route.name ?? "Undefined"} onDrawerPress={navigation.toggleDrawer}/>
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
                            const { think, content } = parseMessageContent(message.content)
                            return (
                                <View key={index} style={[styles.assistantMessageContainer]}>
                                    <View style={[styles.thoughtsContainer]}>
                                        <TouchableOpacity onPress={() => toggleThoughts(index)} style={[styles.thoughtsButton]}>
                                            <Text style={{ color: theme.colors.primary }}>Thoughts</Text>
                                            <MaterialIcons name="chevron-right" style={{ color: theme.colors.primary, transform: [{ rotate: openedThoughts === index ? '90deg' : '0deg' }] }} size={17} />
                                        </TouchableOpacity>
                                        <Text variant='bodyLarge' style={{ textAlign: 'left', paddingLeft: 8, color: '#b8b8b8', height: openedThoughts === index ? 'auto' : 0 }}>{think}</Text>
                                    </View>
                                    <Markdown style={{ body: { color: theme.colors.onBackground, fontSize: 16, width: '100%' } }}>{content}</Markdown>
                                </View>
                            )
                        }
                    }}
                    style={{ flex: 1, height: '100%', paddingHorizontal: 12, paddingVertical: 8 }}
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
        flexDirection: 'column',
        gap: 8,
        // backgroundColor: 'gray',
        padding: 8,
        borderRadius: 8,
        marginBottom: 16
    },
    thoughtsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'flex-start',
        width: '100%'
    },
    thoughtsButton: {
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        alignItems: 'center'
    }
})