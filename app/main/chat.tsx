import AiInputBar from '@/components/ai-input-bar';
import { Models } from '@/constants/models';
import { useTheme } from '@/hooks';
import { useChatStore } from '@/store/chat-store';
import { useMessageStore } from '@/store/message-store';
import { useModelStore } from '@/store/model-store';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { AlertCircleIcon, Delete02Icon, Edit01Icon, MenuTwoLineIcon, MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width, height } = Dimensions.get('screen')

type MenuOption = {
    icon: any,
    label: string,
    onPress: () => void,
    type: 'default' | 'destructive'
}

export default function ChatScreen({ route, navigation }: any) {
    const { id } = route.params;
    const [query, setQuery] = useState('');
    const { theme } = useTheme();
    const [openedMenu, setOpenedMenu] = useState(false);
    const [openedRenamePortal, setOpenedRenamePortal] = useState(false);
    const [chatSlug, setChatSlug] = useState('');
    const { messages: allMessages, createMessage, loading } = useMessageStore(state => state)
    const { setSelectedModel, selectedModel } = useModelStore(state => state);
    const messages = allMessages.filter(message => message.chatId === id)
    const [openedThoughts, setOpenedThoughts] = useState<number | null>(null)
    const { chats } = useChatStore(state => state)
    const chat = chats.find((chat) => chat.id === id);
    const modelUsed = chat?.modelUsed;
    const bottomSheetRef = useRef<BottomSheet>(null);

    const menuOptions: MenuOption[] = [
        {
            icon: Edit01Icon,
            label: "Rename",
            onPress: () => setOpenedRenamePortal(true),
            type: 'default'
        },
        {
            icon: AlertCircleIcon,
            label: "Chat Info",
            onPress: () => {
                bottomSheetRef.current?.expand();
            },
            type: 'default'
        },
        {
            icon: Delete02Icon,
            label: "Delete",
            onPress: () => {
                Alert.alert(
                    'Delete Chat',
                    'Are you sure you want to delete this chat?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Delete',
                            onPress: () => {
                                navigation.navigate('index');
                                useChatStore.getState().removeChat(id);
                                console.log("Chat deleted with id`: ", id)

                            },
                            style: 'destructive',
                        },
                    ]
                )
            },
            type: 'destructive'
        },
    ]


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

    function handleTouchableWithoutFeedbackPress() {
        Keyboard.dismiss();
        if (openedMenu) setOpenedMenu(false)
        bottomSheetRef.current?.close();
    }

    useEffect(() => {
        if (modelUsed) {
            const model = Models.find((model) => model.name === modelUsed)
            if (!model) {
                console.log("Model not found")
                return
            }
            setSelectedModel(model)
            console.log("id: ", id)
            console.log("model used: ", modelUsed)
            console.log("selected model: ", selectedModel)
        }

        const chatSlugValue = chats.find((chat) => chat.id === id)?.slug
        if (chatSlugValue) setChatSlug(chatSlugValue)
        else console.log("Chat slug not found")
    }, [])

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);


    async function handlePress() {
        await createMessage("user", "result", query, id);
        return id
    }
    return (
        <TouchableWithoutFeedback onPress={handleTouchableWithoutFeedbackPress} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 16, backgroundColor: theme.background, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Header
                    onDrawerPress={navigation.toggleDrawer}
                    modelUsed={modelUsed ?? "Unknown Model"}
                    openedMenu={openedMenu}
                    setOpenedMenu={setOpenedMenu}
                    menuOptions={menuOptions}
                />
                {/** Rename Portal */}
                <View style={[styles.renamePortalBg, { display: openedRenamePortal ? 'flex' : 'none', zIndex: 5 }]}>
                    <View style={[styles.renamePortalContainer, { backgroundColor: theme.onBackgroud }]}>
                        <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'semibold' }}>Rename Chat</Text>
                        <TextInput value={chatSlug} onChangeText={setChatSlug} style={[styles.renamePortalInput, { backgroundColor: theme.onBackgroud, color: theme.text }]} />
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 5, width: '100%', }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => useChatStore.getState().renameChat(id, chatSlug)} style={[styles.renamePortalButton, { backgroundColor: theme.text }]}>
                                <Text style={{ color: theme.background }}>Rename</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOpenedRenamePortal(false)} activeOpacity={0.8} style={[styles.renamePortalButton, { backgroundColor: theme.secondary }]}>
                                <Text style={{ color: theme.text }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id + Math.random().toString()}
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
                <View style={{ width, backgroundColor: theme.background, height: 53 }} />
                <AiInputBar query={query} setQuery={setQuery} onPress={handlePress} />
                <BottomSheet
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    backgroundStyle={{ backgroundColor: theme.onBackgroud }}
                    handleIndicatorStyle={{ backgroundColor: theme.text }}
                    snapPoints={['25%', '50%']}
                    style={{ borderRadius: 40}}
                    enablePanDownToClose
                    index={-1}
                    
                >
                    <BottomSheetView style={[styles.contentContainer, { backgroundColor: theme.onBackgroud }]}>
                        <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'semibold' }}>{chat?.slug ?? "Unknown Chat"}</Text>
                        <Text style={{ color: theme.text, fontSize: 14 }}>{chat?.modelUsed ?? "Unknown Model"}</Text>
                    </BottomSheetView>
                </BottomSheet>
            </SafeAreaView>
        </TouchableWithoutFeedback>

    )
}

interface HeaderProps {
    onDrawerPress: () => void;
    modelUsed: string;
    openedMenu: boolean;
    setOpenedMenu: React.Dispatch<React.SetStateAction<boolean>>
    menuOptions: MenuOption[]
}

function Header({ onDrawerPress, modelUsed, openedMenu, setOpenedMenu, menuOptions }: HeaderProps) {
    const { theme } = useTheme();

    function toggleMenu() {
        setOpenedMenu(!openedMenu)
    }

    return (
        <View style={styles.headerConatiner}>
            {/** Drawer Toggle */}
            <TouchableOpacity activeOpacity={0.8} onPress={onDrawerPress} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
                <HugeiconsIcon icon={MenuTwoLineIcon} color={theme.text} />
            </TouchableOpacity>
            {/** Model Selector */}

            <TouchableOpacity activeOpacity={0.8} style={[styles.headerItemContainer, { flex: 1, backgroundColor: theme.onBackgroud, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }]}>
                <Text style={{ color: theme.text }}>{modelUsed}</Text>
            </TouchableOpacity>
            {/** Menu Bar*/}
            <TouchableOpacity onPress={toggleMenu} activeOpacity={0.8} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud, zIndex: 2 }]}>
                <HugeiconsIcon icon={MoreVerticalIcon} color={theme.text} />
            </TouchableOpacity>
            <View style={[styles.menuContainer, { backgroundColor: theme.onBackgroud, display: openedMenu ? 'flex' : 'none' }]}>
                {
                    menuOptions.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => {
                                option.onPress();
                                setOpenedMenu(false)
                            }}
                            style={[styles.menuItemContainer, { backgroundColor: option.type === 'destructive' ? '#d1423818' : theme.onBackgroud }]}>
                            <HugeiconsIcon icon={option.icon} color={option.type === 'destructive' ? '#eb4034' : theme.text} />
                            <Text style={{ color: option.type === 'destructive' ? '#eb4034' : theme.text }}>{option.label}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
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
    },
    menuContainer: {
        width: 170,
        minHeight: 130,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 66,
        right: 0,
        zIndex: 2,
        overflow: 'hidden'
    },
    menuItemContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 15
    },
    destructiveItem: {
        color: 'red'
    },
    renamePortalBg: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width,
        height,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
    },
    renamePortalContainer: {
        width: '80%',
        minHeight: 130,
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24
    },
    renamePortalInput: {
        width: '100%',
        paddingHorizontal: 14,
        borderColor: 'gray',
        borderWidth: 1.5,
        borderRadius: 999
    },
    renamePortalButton: {
        width: '100%',
        padding: 12,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentContainer: {
        flex: 1,
        padding: 36,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
    },
})