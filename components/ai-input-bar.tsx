import { db } from '@/db/db';
import { messages as messageTable } from '@/db/schema';
import { useTheme } from '@/hooks';
import llamaService from '@/services/llama-service';
import { useMessageStore } from '@/store/message-store';
import { useModelStore } from '@/store/model-store';
import { MessageType } from '@/types/message-types';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, Keyboard, Platform, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { v4 as uuidv4 } from 'uuid';


interface AiInputBarProps {
    query: string;
    setQuery: (query: string) => void;
    onPress?: () => Promise<string | null>;
}

export default function AiInputBar({ query, setQuery, onPress }: AiInputBarProps) {
    const translateY = useSharedValue(0);
    const { theme } = useTheme();
    const { setLoading, mountMessage, updateLatestMessage } = useMessageStore(state => state)
    const { selectedModel } = useModelStore(state => state);
    const router = useRouter();

    useEffect(() => {
        const showSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                const height = e.endCoordinates.height;
                translateY.value = withTiming(-height, { duration: 250 });
            }
        );

        const hideSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                translateY.value = withTiming(0, { duration: 250 });
            }
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));



    async function handleSend() {
        if (!query) return
        try {
            if (!selectedModel) {
                setLoading(null)
                ToastAndroid.show('No model selected', ToastAndroid.SHORT);
                Alert.alert(
                    'Please select a model',
                    'You need to select a model to use this feature. If you don\'t have a model, you can download one from the settings.',
                    [
                        {
                            text: 'OK',
                            onPress: () => null,
                            style: 'default'
                        },
                        {
                            text: 'Model Store',
                            onPress: () => router.push('/main/models'),
                            style: 'destructive'
                        }
                    ]
                )
                return
            }
            const id = await onPress?.();
            if (!id) {
                console.log("Message ID is null");
                return
            }
            setQuery('');
            Keyboard.dismiss();
            setLoading({ state: true, message: 'Warming up model...' })
            await llamaService.initialize(selectedModel.name)
            setLoading({ state: true, message: 'Generating response...' })
            // const response = await llamaService.generate([{ role: 'user', content: query }])

            // format message history
            const messages_history = useMessageStore
                .getState()
                .messages
                .map(m => ({
                    role: m.role,
                    content: m.content,
                }));
            console.log("messages history: ", messages_history);
            // createMessage("assistant", "result", "", id)

            const uuid = uuidv4();
            const now = new Date();


            // create ai message
            const aiMessage: MessageType = {
                id: uuid,
                createdAt: now,
                updatedAt: now,
                role: "assistant",
                type: "result",
                content: "",
                chatId: id
            }

            // mounting the message to the store
            mountMessage(aiMessage)
            const response = await llamaService.completion(messages_history.slice(-6), (data) => {
                const chunk = data.content ?? ""; // streaming token buffer
                // console.log(chunk);

                updateLatestMessage(chunk)
            });

            // console.log(response);

            // insert messages to db
            await db.insert(messageTable).values({
                id: uuid,
                createdAt: now,
                updatedAt: now,
                role: "assistant",
                type: "result",
                content: response,
                chatId: id
            })
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(null)
        }
    }


    useEffect(() => {
        console.log("Model:", selectedModel)
    }, [])


    return (
        <Animated.View
            style={[
                {
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    alignItems: 'center',
                    paddingBottom: Platform.OS === 'ios' ? 20 : 27,
                },
                animatedStyle,
            ]}
        >
            {/* <Searchbar
                value={query}
                onChangeText={setQuery}
                placeholder="Ask SwiftLM..."
                style={{ height: 55, width: '94%' }}
                icon="plus"
                onIconPress={() => console.log('Pressed')}
                clearIcon={() => <MaterialIcons name='send' size={24} style={{ color: query ? theme.colors.primary : theme.colors.onSurfaceDisabled }} />}
                onClearIconPress={handleSend}
            /> */}

            <View style={[styles.inputBarContainer, { backgroundColor: theme.onBackgroud }]}>
                <TextInput value={query} onChangeText={setQuery} placeholder='Ask something here...' placeholderTextColor={'gray'} style={[styles.inputBar, { color: theme.text, }]} />
                <TouchableOpacity disabled={!query} onPress={handleSend} activeOpacity={0.8} style={[styles.sendButtonContainer]}>
                    <HugeiconsIcon icon={ArrowRight01Icon} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    inputBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderRadius: 999,
        padding: 6
    },
    inputBar: {
        flex: 1,
        height: 50,
        borderRadius: 999,
        paddingHorizontal: 18
    },
    sendButtonContainer: {
        borderRadius: 999,
        padding: 8,
        backgroundColor: '#DADADA',
        height: '100%',
        aspectRatio: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
