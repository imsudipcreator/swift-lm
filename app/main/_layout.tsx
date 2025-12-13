import { Models } from '@/constants/models';
import { db } from '@/db/db';
import { chats as chatsTable } from '@/db/schema';
import { useTheme } from '@/hooks';
import { useChatStore } from '@/store/chat-store';
import { useModelStore } from '@/store/model-store';
import { PencilEdit02Icon, Settings01Icon, Store01Icon, UserCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Directory, Paths } from 'expo-file-system';
import * as React from 'react';
import HomeScreen from '.';
import ChatScreen from './chat';
import ModelsScreen from './models';
import ProfileScreen from './profile';
import SettingsScreen from './settings';


const Drawer = createDrawerNavigator();


export default function ChatLayout() {
  const { theme } = useTheme()
  const { chats, setChats } = useChatStore(state => state)
  const { setSelectedModel, setDownloadedModels, downloadedModels, selectedModel } = useModelStore(state => state)


  React.useEffect(() => {
    async function loadModel() {
      const model_name = await AsyncStorage.getItem('model');
      console.log('model', model_name);
      const model = Models.find((model) => model.name === model_name)
      if (model) {
        setSelectedModel(model);
      } else if (downloadedModels.length > 0) {
        setSelectedModel(downloadedModels[0]);
      }
      console.log("selectedModel Global", selectedModel);
    };

    async function getModels(modelDir: Directory) {
      const models = modelDir.list();

      for (const item of models) {
        if (item instanceof Directory) {
          getModels(item);
        } else {
          const model = Models.find((model) => model.name === item.name)
          if (model) {
            setDownloadedModels([model]);
          }
        }
      }
    }

    async function getChats() {
      const chats = await db.select().from(chatsTable).execute();
      console.log('chats', chats);
      setChats(chats)
    }

    getModels(new Directory(Paths.document.uri + 'models/'))
    loadModel();
    getChats();
  }, []);


  return (
    <Drawer.Navigator
      initialRouteName="index"
      screenOptions={{
        drawerContentContainerStyle: {
          flex: 1,
          backgroundColor: theme.background,
        },
        drawerActiveTintColor: theme.text,
        drawerInactiveTintColor: theme.text,
        drawerItemStyle: {
          borderRadius: 8,
          width: '100%'
        },
        drawerStyle: {
          borderRadius: 0,
        },
        drawerType: "slide",
        swipeEdgeWidth: 160
      }}
    >
      <Drawer.Screen
        name="index"
        component={HomeScreen}
        options={{
          title: "New chat",
          headerShown: false,
          drawerIcon: () => <HugeiconsIcon icon={PencilEdit02Icon} color={theme.text} />,

        }}
      />
      <Drawer.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "My profile",
          headerShown: false,
          drawerIcon: () => <HugeiconsIcon icon={UserCircle02Icon} color={theme.text} />,
        }}
      />
      <Drawer.Screen
        name="models"
        component={ModelsScreen}
        options={{
          title: "Models store",
          headerShown: false,
          drawerIcon: () => <HugeiconsIcon icon={Store01Icon} color={theme.text} />,
        }}
      />
      <Drawer.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerShown: false,
          drawerIcon: () => <HugeiconsIcon icon={Settings01Icon} color={theme.text} />,
          drawerItemStyle: { marginBottom: 22 }
        }}
      />
      {
        chats.map((chat) => (
          <Drawer.Screen
            key={chat.id}
            name={chat.slug}
            component={ChatScreen}
            initialParams={{ id: chat.id }}
            options={{
              headerShown: false
            }}
          />
        ))
      }
    </Drawer.Navigator>
  );
}