import { useModelStore } from '@/store/model-store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Directory, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { RadioButton, Text, useTheme } from 'react-native-paper';

type ModelInfo = {
  name: string;
  size: number;
}

export default function SettingsScreen() {
  const theme = useTheme()
  const [lang, setLang] = useState();
  const [downloadedModels, setDownloadedModels] = React.useState<ModelInfo[]>([])
  const { model, setModel } = useModelStore()
  const router = useRouter()

  function bytesToGB(bytes: number) {
    if (bytes < 0) {
      throw new Error("Input bytes cannot be negative.");
    }
    const gigabyte = 1024 * 1024 * 1024; // 1 GB = 1024^3 Bytes
    return (bytes / gigabyte).toFixed(3);
  }


  function listDirectory(directory: Directory, indent: number = 0) {
    // console.log(`${' '.repeat(indent)} + ${directory.name}`);
    const contents = directory.list();
    for (const item of contents) {
      if (item instanceof Directory) {
        listDirectory(item, indent + 2);
      } else {
        // console.log(`${' '.repeat(indent + 2)} - ${item.name} (${item.size} bytes)`);
        setDownloadedModels(prev => [...prev, { name: item.name, size: item.size }])
      }
    }
  }

  useEffect(() => {
    listDirectory(new Directory(Paths.document.uri + 'models'));
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 16, gap: 5 }}>
      <View style={[{ backgroundColor: theme.colors.surface, }, styles.buttonContainer]}>
        <Text variant='titleMedium'>Downloaded Models</Text>
        {
          model && (
            <RadioButton.Group onValueChange={value => setModel(value)} value={model}>
              {
                downloadedModels?.map((model, index) => (
                  <RadioButton.Item key={index} label={model.name} value={model.name} labelVariant='labelMedium'/>
                ))
              }
            </RadioButton.Group>

          )
        }
      </View>


      <TouchableOpacity onPress={() => router.push('/models')} style={[{ backgroundColor: theme.colors.surface, justifyContent: 'space-between', flexDirection: 'row', display: 'flex', width: '100%', padding: 12, borderRadius: 8 }]}>
        <Text variant='titleMedium'>Find Models</Text>
        <MaterialIcons name="chevron-right" size={24} style={{ color: theme.colors.primary }} />
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    padding: 12,
    borderRadius: 8
  },
})