import { Models } from '@/constants/models'
import { downloadModel } from '@/lib'
import { Model } from '@/types/model-types'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { useNetInfo } from '@react-native-community/netinfo'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'
import { Directory, Paths } from 'expo-file-system'
import React, { useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Text, useTheme } from 'react-native-paper'

export default function ModelsScreen() {
  const theme = useTheme()
  const [downloadableModels, setDownloadableModels] = React.useState<Model[]>([])

  const { isConnected, isInternetReachable } = useNetInfo();


  useEffect(() => {
    Models.map((model) => {
      const contents = new Directory(Paths.document.uri + 'models').list();
      for (const item of contents) {
        if (item.name === model.name) return
        setDownloadableModels(prev => [...prev, model])
      }
    })
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
      {
        downloadableModels.map((model, index) => {
          return (
            <TouchableOpacity key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 16, gap: 2, backgroundColor: theme.colors.surface, borderRadius: 8 }}>
              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                <Text>{model.name}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <MaterialDesignIcons name='file-code' size={14} color={theme.colors.outline} />
                  <Text>{model.size} GB</Text>
                  <Text style={{ paddingHorizontal: 5, borderRadius: 8, backgroundColor: theme.colors.primaryContainer, marginLeft: 8 }}>
                    {model.params}B params
                  </Text>
                </View>
              </View>
              <MaterialIcons onPress={() => downloadModel(model.url, model.name)} name='download-for-offline' size={30} color={theme.colors.primary} />
            </TouchableOpacity>
          )
        })
      }
    </ScrollView>
  )
}