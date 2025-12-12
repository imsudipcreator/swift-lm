import Button from '@/components/button'
import { useRouter } from 'expo-router'
import React from 'react'
import { ImageBackground, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <ImageBackground source={require('../assets/images/onboarding.png')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Text style={{ fontFamily: "Pacifico_400Regular", fontSize: 36 }}>Swiftlm</Text>
        <View style={{ width: '100%', display: 'flex', flexDirection: 'column', paddingHorizontal: 20, position: 'absolute', bottom: 30 }}>
          <Button onPress={() => router.push("/auth")}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'medium' }}>Get started</Text>
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}