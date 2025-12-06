import { useChatStore } from '@/store/chat-store';
import { useAuth } from '@clerk/clerk-expo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import HomeScreen from '.';
import ProfileScreen from '../profile';
import ChatScreen from './chat';


const Drawer = createDrawerNavigator();

export default function ChatLayout() {
  const theme = useTheme()
  const router = useRouter()
  const { chats } = useChatStore(state => state)
  const { signOut } = useAuth();
  return (
    <Drawer.Navigator
      initialRouteName="new-chat"
      screenOptions={{
        drawerActiveTintColor: theme.colors.primary,
        drawerItemStyle: {
          borderRadius: 8
        },
        drawerStyle: {
          borderRadius: 0,
        },
        drawerType: "slide",
        swipeEdgeWidth: 160
      }}
    >
      <Drawer.Screen
        name="new-chat"
        component={HomeScreen}
        options={{
          title: "New Chat",
          drawerIcon: () => <MaterialIcons name="add" size={24} style={{ color: theme.colors.primary }} />,
          headerRight: () => (
            <IconButton
              icon={() => <MaterialIcons name="settings" size={24} style={{ color: theme.colors.primary }} />}
              onPress={() => router.push('/settings')}
            />
          ),
          headerBackgroundContainerStyle: {
            backgroundColor: theme.colors.elevation.level4,
          }
        }}
      />
      <Drawer.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          title: "My Profile",
          drawerIcon: () => <MaterialIcons name="person" size={24} style={{ color: theme.colors.primary }} />,
          headerRight: () => (
            <IconButton
              icon={() => <MaterialIcons name="power-settings-new" size={24} style={{ color: theme.colors.error }} />}
              onPress={() => {
                Alert.alert(
                  'Sign out',
                  'Are you sure you want to sign out?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                      onPress: () => null,
                    },
                    {
                      text: 'Sign out',
                      onPress: () => {
                        signOut()
                      },
                      style: 'destructive',
                    },
                  ]
                )
              }}
            />
          ),
          headerBackgroundContainerStyle: {
            backgroundColor: theme.colors.elevation.level4,
          }
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
              headerRight: () => <MaterialIcons onPress={() => router.push('/settings')} name="settings" size={24} style={{ paddingRight: 12, color: theme.colors.primary }} />,
              headerBackgroundContainerStyle: {
                backgroundColor: theme.colors.elevation.level4,
              }
            }}
          />
        ))
      }
    </Drawer.Navigator>
  );
}