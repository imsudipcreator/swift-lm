import llamaService from '@/services/llama-service';
import { useMessageStore } from '@/store/message-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';


interface InputBarProps {
    query: string;
    setQuery: (query: string) => void;
    onPress?: () => void
}

export default function InputBar({ query, setQuery, onPress }: InputBarProps) {
    const translateY = useSharedValue(0);
    const theme = useTheme();
    const { setLoading } = useMessageStore(state => state)

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
            onPress?.();
            setLoading({ state: true, message: 'Warming up model...' })
            await llamaService.initialize()
            setLoading({ state: true, message: 'Generating response...' })
            await llamaService.generate([{ role: 'user', content: query }])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(null)
        }
    }



    return (
        <Animated.View
            style={[
                {
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    alignItems: 'center',
                    paddingBottom: Platform.OS === 'ios' ? 20 : 27,
                    backgroundColor: theme.colors.scrim
                },
                animatedStyle,
            ]}
        >
            <Searchbar
                value={query}
                onChangeText={setQuery}
                placeholder="Ask SwiftLM..."
                style={{ height: 50, width: '94%' }}
                icon="plus"
                onIconPress={() => console.log('Pressed')}
                clearIcon={() => <MaterialIcons name='send' size={24} style={{ color: query ? theme.colors.primary : theme.colors.onSurfaceDisabled }} />}
                onClearIconPress={handleSend}
            />
        </Animated.View>
    );
}
