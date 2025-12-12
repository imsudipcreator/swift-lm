import InputBar from '@/components/input-bar';
import { Models } from '@/constants/models';
import { useTheme } from '@/hooks';
import { useChatStore } from '@/store/chat-store';
import { useMessageStore } from '@/store/message-store';
import { useModelStore } from '@/store/model-store';
import { ArrowDown01Icon, ArrowUp01Icon, IncognitoIcon, MenuTwoLineIcon, Store01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useState } from 'react';
import { ImageBackground, Keyboard, StyleSheet, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';

export default function HomeScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const { createChat } = useChatStore(state => state);
  const { createMessage } = useMessageStore(state => state);
  const { model } = useModelStore(state => state);
  const { theme } = useTheme();


  function handleCreateNewChat() {
    if (!query || !model){
      console.log('object')
      ToastAndroid.show('Please enter a query and select a model', ToastAndroid.SHORT);
      return null;
    }

    const { id, slug } = createChat(model);
    setTimeout(() => {
      navigation.jumpTo(slug, { id });
    }, 100);
    createMessage("user", "result", query, id);
    return id
  }

  console.log(navigation)

  return (
    <ImageBackground source={require('../../assets/images/main-gradient.png')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
          <Header onDrawerPress={navigation.toggleDrawer} onModelStorePress={() => navigation.navigate('models')} />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold', color: theme.text }}>What are we doing today?</Text>
          </View>
          <InputBar query={query} setQuery={setQuery} onPress={handleCreateNewChat} />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}



interface HeaderProps {
  onDrawerPress: () => void;
  onModelStorePress: () => void;
}
function Header({ onDrawerPress, onModelStorePress }: HeaderProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.headerConatiner}>
      {/** Drawer Toggle */}
      <TouchableOpacity activeOpacity={0.8} onPress={onDrawerPress} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
        <HugeiconsIcon icon={MenuTwoLineIcon} color={theme.text} />
      </TouchableOpacity>
      {/** Model Selector */}
      <SelectDropdown
        data={Models}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <TouchableOpacity activeOpacity={0.8} style={[styles.headerItemContainer, { flex: 1, backgroundColor: theme.onBackgroud, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }]}>
              <Text style={{ color: theme.text }}>{selectedItem?.name ?? "Deepseek R1"}</Text>
              <HugeiconsIcon icon={isOpened ? ArrowUp01Icon : ArrowDown01Icon} color={theme.text} size={22} />
            </TouchableOpacity>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: theme.secondary }) }}>
              <Text style={[styles.dropdownItemTxtStyle, { color: theme.text }]}>{item?.name ?? "Unknown"}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={{ ...styles.dropdownMenuStyle, ...{ backgroundColor: theme.onBackgroud } }}
      />
      {/** Models Store */}
      <TouchableOpacity onPress={onModelStorePress} activeOpacity={0.8} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
        <HugeiconsIcon icon={Store01Icon} color={theme.text} />
      </TouchableOpacity>
      {/** Temporary Chat */}
      <TouchableOpacity activeOpacity={0.8} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
        <HugeiconsIcon icon={IncognitoIcon} color={theme.text} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
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
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'medium',
    color: '#151E26',
  },
  dropdownMenuStyle: {
    borderRadius: 22,
  }
})