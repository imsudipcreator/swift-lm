import Button from '@/components/button';
import InputBar from '@/components/input-bar';
import { useTheme } from '@/hooks';
import { useGenerationStore } from '@/store/generation-store';
import { useUser } from '@clerk/clerk-expo';
import { MenuTwoLineIcon, MoreVerticalIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import Slider from '@react-native-community/slider';
import React from 'react';
import { ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SettingsScreen({ navigation }: any) {
  const { theme } = useTheme();
  // const { user } = useUserStore(state => state);
  const { isConnected, isInternetReachable } = useNetInfo();
  const { user } = useUser();
  const { config, setName, setTemperature, setCustomPrompt } = useGenerationStore(state => state);


  function saveGenerationConfig() {
    AsyncStorage.setItem('generation_config', JSON.stringify(config));
    ToastAndroid.show('Configuration saved locally', ToastAndroid.SHORT);
    console.log('generation_config', JSON.stringify(config));
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, paddingHorizontal: 16 }}>
        <Header onDrawerPress={navigation.toggleDrawer} />
        {/** Profile */}
        {
          !isConnected || !isInternetReachable ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Offline</Text>
            </View>
          ) : (
            <View style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
              <View style={[styles.avatarConatiner, { backgroundColor: theme.onBackgroud }]}>
                <Text style={{ color: theme.text, fontWeight: 'semibold', fontSize: 34 }}>{user?.firstName?.charAt(0) ?? 'U'}{user?.lastName?.charAt(0) ?? 'A'}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'medium' }}>{user?.fullName ?? 'Unknown User'}</Text>
                <Text style={{ color: theme.text, fontSize: 14, fontWeight: 'medium' }}>{user?.emailAddresses[0].emailAddress}</Text>
              </View>
            </View>
          )
        }
        <View style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 24, paddingHorizontal: 8 }}>
          <InputBar label="Name" placeholder="e.g., Sudip Mahata" value={config.name} onChangeText={(value) => setName(value)} />
          <InputBar label="Custom Prompt" multiline placeholder="Describe your custom prompt" value={config.customPrompt} onChangeText={(value) => setCustomPrompt(value)} style={{ height: 100, textAlignVertical: 'top' }} />
          <View style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start', width: '100%' }}>
            <Text style={{ color: theme.text, fontWeight: 'medium', fontSize: 16, paddingLeft: 2 }}>{"Temperature" + " (" + config.temperature + ")"}</Text>
            <Slider
              style={{ width: '100%', height: 40, padding: 0 }}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={theme.text}
              maximumTrackTintColor={theme.secondary}
              value={config.temperature}
              onValueChange={(value) => setTemperature(value)}
              step={0.1}
            />
          </View>
          <Button onPress={saveGenerationConfig} style={{ backgroundColor: theme.text }}>
            <Text style={{ color: theme.background, fontSize: 14, fontWeight: 'medium' }}>Save Configuration</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
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
        <Text style={{ color: theme.text }}>{"Settings"}</Text>
      </TouchableOpacity>
      {/** Temporary Chat */}
      <TouchableOpacity activeOpacity={0.8} style={[styles.headerItemContainer, styles.headerItemRounded, { backgroundColor: theme.onBackgroud }]}>
        <HugeiconsIcon icon={MoreVerticalIcon} color={theme.text} />
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

  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    padding: 12,
    borderRadius: 8
  },
  avatarConatiner: {
    borderRadius: 999,
    width: 140,
    aspectRatio: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

