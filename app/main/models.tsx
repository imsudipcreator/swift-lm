import { Models } from '@/constants/models'
import { useTheme } from '@/hooks'
import { useModelStore } from '@/store/model-store'
import { Model } from '@/types/model-types'
import { CloudDownloadIcon, MenuTwoLineIcon, MoreVerticalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useNetInfo } from '@react-native-community/netinfo'
import { Directory, Paths } from 'expo-file-system'
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function ModelsScreen({ navigation }: any) {
  const { theme } = useTheme()

  const { isConnected, isInternetReachable } = useNetInfo();
  const { downloadingModel } = useModelStore()
  const [downloadableModels, setDownloadableModels] = React.useState<Model[]>(Models)
  const [downloadedModels, setDownloadedModels] = React.useState<Model[]>([])
  // console.log(Models)

  useEffect(() => {
    function sortModels(modelDir: Directory) {
      const contents = modelDir.list();
      for (const item of contents) {
        if (item instanceof Directory) {
          sortModels(item)
        } else {
          const model = Models.find((model) => model.name === item.name)
          if (model) {
            setDownloadedModels(prev => [...prev, model])
            setDownloadableModels(prev => prev.filter((model) => model.name !== item.name))
          }
        }
      }
    }

    sortModels(new Directory(Paths.document.uri + 'models/'))
  }, [])


  if (!isConnected || !isInternetReachable) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Offline</Text>
      </View>
    )
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingHorizontal: 16 }}>
        <Header onDrawerPress={navigation.toggleDrawer} />
        {
          Models.map((model, index) => {
            return (
              <TouchableOpacity activeOpacity={0.8} key={index} style={[{ backgroundColor: theme.onBackgroud }, styles.modelContainer]}>
                <View style={[styles.infoContainer]}>
                  <Text style={{ color: theme.text, fontWeight: 'semibold', fontSize: 16 }}>{model.name}</Text>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {/* <MaterialDesignIcons name='file-code' size={14} color={theme.colors.outline} /> */}
                    {
                      model.attributes.map((attribute, index) => (
                        <View key={index} style={[styles.attributeContainer]}>
                          <HugeiconsIcon icon={attribute.icon} color={theme.text} size={15} />
                          <Text style={{ color: theme.text, fontSize: 14 }}>{attribute.value}</Text>
                        </View>
                      ))
                    }
                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} style={{ backgroundColor: theme.secondary, padding: 8, borderRadius: 999 }}>
                  <HugeiconsIcon icon={CloudDownloadIcon} color={theme.text} />
                </TouchableOpacity>
              </TouchableOpacity>
            )
          })
        }
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
  }
})