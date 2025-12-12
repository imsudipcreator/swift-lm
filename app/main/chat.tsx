import InputBar from '@/components/input-bar';
import { useTheme } from '@/hooks';
import { useMessageStore } from '@/store/message-store';
import { MenuTwoLineIcon, MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width} = Dimensions.get('screen')

export default function ChatScreen({ route, navigation }: any) {
    const { id } = route.params;
    const [query, setQuery] = useState('');
    const { theme } = useTheme();
    const { messages: allMessages, createMessage, loading } = useMessageStore(state => state)
    const messages = allMessages.filter(message => message.chatId === id)
    const [openedThoughts, setOpenedThoughts] = useState<number | null>(null)

    // console.log(messages)
    // console.log("id: ", id)
    // console.log("navigation: ", navigation)

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
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: theme.background, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Header onDrawerPress={navigation.toggleDrawer} />
                <FlatList
                    data={messages}                   
                    keyExtractor={(item) => item.id}
                    alwaysBounceVertical
                    renderItem={({ item: message, index }) => {
                        if (message.role === "user") {
                            return (
                                <View key={index} style={[styles.userMessageContainer, { backgroundColor: theme.onBackgroud }]}>
                                    <Text style={{ textAlign: 'left', color: theme.text }}>{message.content}</Text>
                                </View>
                            )
                        } else {
                            // const { think, content } = parseMessageContent(message.content)
                            return (
                                <View key={index} style={[styles.assistantMessageContainer]}>
                                    {/* {
                                        think && (
                                            <View style={[styles.thoughtsContainer]}>
                                                <TouchableOpacity onPress={() => toggleThoughts(index)} style={[styles.thoughtsButton]}>
                                                    <Text style={{ color: theme.colors.primary }}>Thoughts</Text>
                                                    <MaterialIcons name="chevron-right" style={{ color: theme.colors.primary, transform: [{ rotate: openedThoughts === index ? '90deg' : '0deg' }] }} size={17} />
                                                </TouchableOpacity>
                                                <Text variant='bodyLarge' style={{ textAlign: 'left', paddingLeft: 8, color: '#b8b8b8', height: openedThoughts === index ? 'auto' : 0 }}>{think}</Text>
                                            </View>
                                        )
                                    } */}
                                    <Markdown style={{ body: { color: theme.text, fontSize: 16, width: '100%' } }}>{message.content}</Markdown>
                                </View>
                            )
                        }
                    }}
                    style={{ flex: 1, height: '100%', paddingVertical: 8, width, paddingHorizontal: 16 }}
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
                <View style={{ width, backgroundColor: theme.background, height: 53}}/>
                <InputBar query={query} setQuery={setQuery} onPress={handlePress} />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

interface HeaderProps {
    onDrawerPress: () => void;
}
function Header({ onDrawerPress }: HeaderProps) {
    const { theme } = useTheme();
    return (
        <View style={styles.headerConatiner}>
            {/** Drawer Toggle */}
            <TouchableOpacity activeOpacity={0.8} onPress={onDrawerPress} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
                <HugeiconsIcon icon={MenuTwoLineIcon} color={theme.text} />
            </TouchableOpacity>
            {/** Model Selector */}

            <TouchableOpacity activeOpacity={0.8} style={[styles.headerItemContainer, { flex: 1, backgroundColor: theme.onBackgroud, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }]}>
                <Text style={{ color: theme.text }}>{"Models Store"}</Text>
            </TouchableOpacity>
            {/** Temporary Chat */}
            <TouchableOpacity activeOpacity={0.8} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
                <HugeiconsIcon icon={MoreVerticalIcon} color={theme.text} />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    // Header
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

    // Chat
    userMessageContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        maxWidth: '80%',
        alignSelf: 'flex-end',
        padding: 10,
        borderRadius: 14,
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