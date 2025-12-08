import { Models } from '@/constants/models'
import { downloadModel, removeModel } from '@/lib'
import { useModelStore } from '@/store/model-store'
import { Model } from '@/types/model-types'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useNetInfo } from '@react-native-community/netinfo'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { Directory, Paths } from 'expo-file-system'
import React, { useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ActivityIndicator, Text, useTheme } from 'react-native-paper'

export default function ModelsScreen() {
  const theme = useTheme()

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
    <ScrollView contentContainerStyle={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
      <Text>Downloaded Models</Text>
      {
        downloadedModels.map((model, index) => {
          return (
            <TouchableOpacity key={index} style={[{ backgroundColor: theme.colors.surface }, styles.modelContainer]}>
              <View style={[styles.infoContainer]}>
                <Text>{model.name}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <MaterialDesignIcons name='file-code' size={14} color={theme.colors.outline} />
                  <Text>{model.size} GB</Text>
                  <Text style={[{ backgroundColor: theme.colors.primaryContainer, }, styles.attributeChip]}>
                    {model.params}B params
                  </Text>
                </View>
              </View>
              <MaterialIcons onPress={() => removeModel(model.name)} name='delete' size={30} color={theme.colors.primary} />
            </TouchableOpacity>
          )
        })
      }
      <Text>Get Models</Text>
      {
        downloadableModels.map((model, index) => {
          return (
            <TouchableOpacity key={index} style={[{ backgroundColor: theme.colors.surface }, styles.modelContainer]}>
              <View style={[styles.infoContainer]}>
                <Text>{model.name}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <MaterialDesignIcons name='file-code' size={14} color={theme.colors.outline} />
                  <Text>{model.size} GB</Text>
                  <Text style={[{ backgroundColor: theme.colors.primaryContainer, }, styles.attributeChip]}>
                    {model.params}B params
                  </Text>
                </View>
              </View>
              {
                downloadingModel === model.name ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <MaterialIcons onPress={() => downloadModel(model.url, model.name)} name='download-for-offline' size={30} color={theme.colors.primary} />
                )
              }
            </TouchableOpacity>
          )
        })
      }
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  modelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    gap: 2,
    borderRadius: 8
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2
  },
  attributeChip: {
    paddingHorizontal: 5,
    borderRadius: 8,
    marginLeft: 8
  }
})