import { Directory, Paths } from 'expo-file-system'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'

type ModelInfo = {
  name: string;
  size: number;
}

export default function SettingsScreen() {
  const theme = useTheme()
  const [downloadedModels, setDownloadedModels] = React.useState<ModelInfo[]>([])

  function bytesToGB(bytes: number){
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
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 16 }}>
      <View style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, backgroundColor: theme.colors.surface, padding: 8, borderRadius: 8 }}>
        <Text>Downloaded Model</Text>
        {
          downloadedModels?.map((model, index) => (
            <Text key={index}>{model.name} ({bytesToGB(model.size)} GB)</Text>
          ))
        }
      </View>
    </View>
  )
}