import { Models } from '@/constants/models'
import { useTheme } from '@/hooks'
import { downloadModel } from '@/lib'
import { useModelStore } from '@/store/model-store'
import { Model } from '@/types/model-types'
import { CloudDownloadIcon, Delete02Icon, MenuTwoLineIcon, MoreVerticalIcon, WifiError02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useNetInfo } from '@react-native-community/netinfo'
import React from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function ModelsScreen({ navigation }: any) {
  const { theme } = useTheme()

  const { isConnected, isInternetReachable } = useNetInfo();
  const { downloadingModel, downloadedModels } = useModelStore()
  // console.log(Models)

  // useEffect(() => {
  //   function sortModels(modelDir: Directory) {
  //     const contents = modelDir.list();
  //     for (const item of contents) {
  //       if (item instanceof Directory) {
  //         sortModels(item)
  //       } else {
  //         const model = Models.find((model) => model.name === item.name)
  //         if (model) {
  //           setDownloadedModels(prev => [...prev, model])
  //           setDownloadableModels(prev => prev.filter((model) => model.name !== item.name))
  //         }
  //       }
  //     }
  //   }

  //   sortModels(new Directory(Paths.document.uri + 'models/'))
  // }, [])

  async function handleDownloadModel(model: Model) {
    if (downloadingModel) {
      ToastAndroid.show("Please wait while the model is being downloaded", ToastAndroid.SHORT);
      return
    }
    await downloadModel(model)

  }


  async function handleDeleteModel(model: Model) {
    Alert.alert(
      'Delete model',
      'Are you sure you want to delete this model?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            // await useModelStore.getState().deleteModel(model)
          },
          style: 'destructive',
        },
      ]
    )
  }


  if (!isConnected || !isInternetReachable) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <HugeiconsIcon icon={WifiError02Icon} color={'red'} size={50} />
        <Text style={{ color: theme.text, fontSize: 20 }}>No internet connection</Text>
        <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: theme.onBackgroud, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 999, marginTop: 16 }}>
          <Text style={{ color: theme.text }}>Refresh</Text>
        </TouchableOpacity>
      </View>
    )
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, paddingHorizontal: 16 }}>
        <Header onDrawerPress={navigation.toggleDrawer} />
        {
          Models.map((model, index) => {
            const isDownloaded = downloadedModels.find((downloadedModel) => downloadedModel.name === model.name);
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
                {
                  downloadingModel?.name === model.name ? (
                    <TouchableOpacity activeOpacity={0.7} style={{ backgroundColor: theme.secondary, padding: 8, borderRadius: 999 }}>
                      {/* <HugeiconsIcon icon={Delete02Icon} color={theme.text} /> */}
                      <ActivityIndicator size="small" color={theme.text} />
                    </TouchableOpacity>
                  ) : (
                    <>
                      {
                        isDownloaded ? (
                          <TouchableOpacity onPress={() => handleDeleteModel(model)} activeOpacity={0.7} style={{ backgroundColor: '#e82e2e9f', padding: 8, borderRadius: 999 }}>
                            <HugeiconsIcon icon={Delete02Icon} color={theme.text} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => handleDownloadModel(model)} activeOpacity={0.7} style={{ backgroundColor: theme.secondary, padding: 8, borderRadius: 999 }}>
                            <HugeiconsIcon icon={CloudDownloadIcon} color={theme.text} />
                          </TouchableOpacity>
                        )
                      }
                    </>
                  )
                }
              </TouchableOpacity>
            )
          })
        }
      </ScrollView>
    </SafeAreaView >
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