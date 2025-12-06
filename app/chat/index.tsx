import InputBar from '@/components/input-bar';
import { useChatStore } from '@/store/chat-store';
import { useMessageStore } from '@/store/message-store';
import { useState } from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const { createChat } = useChatStore(state => state);
  const { createMessage } = useMessageStore(state => state);


  function handleCreateNewChat() {
    if (!query) return;

    const { id, slug } = createChat();
    setTimeout(() => {
      navigation.jumpTo(slug, { id });
    }, 100);
    createMessage("user", "result", query, id);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant='titleLarge' style={{ textAlign: 'center' }}>What are we doing today?</Text>
        </View>
        {/* <Searchbar value={query} onChangeText={setQuery} placeholder='Ask SwiftLM...' style={{ height: 50, width: '94%' }} icon={"plus"} /> */}
        <InputBar query={query} setQuery={setQuery} onPress={handleCreateNewChat} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}