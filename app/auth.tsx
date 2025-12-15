import AuthButton from '@/components/auth-button'
import Github from '@/components/icons/github'
import Google from '@/components/icons/google'
import { useSSO } from '@clerk/clerk-expo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as AuthSession from 'expo-auth-session'
import { useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useCallback, useEffect } from 'react'
import { ImageBackground, Platform, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



// Preloads the browser for Android devices to reduce authentication load time
// See: https://docs.expo.dev/guides/authentication/#improving-user-experience
export const useWarmUpBrowser = () => {
    useEffect(() => {
        if (Platform.OS !== 'android') return
        void WebBrowser.warmUpAsync()
        return () => {
            // Cleanup: closes browser when component unmounts
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

// Handle any pending authentication sessions


WebBrowser.maybeCompleteAuthSession()


export default function AuthScreen() {
    useWarmUpBrowser()

    // Use the `useSSO()` hook to access the `startSSOFlow()` method
    const { startSSOFlow } = useSSO()

    const router = useRouter();

    const onSSOPress = useCallback(async (strategy: 'oauth_google' | 'oauth_github') => {
        try {
            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy: strategy,
                // For web, defaults to current path
                // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
                // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
                redirectUrl: AuthSession.makeRedirectUri({
                    scheme: "swiftlm",     // <= match your app.json
                    path: "/"
                }),
            })

            // If sign in was successful, set the active session
            if (createdSessionId) {
                setActive!({
                    session: createdSessionId,
                    // Check for session tasks and navigate to custom UI to help users resolve them
                    // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
                    navigate: async ({ session }) => {
                        // 🔹 Save user state locally for offline login
                        await AsyncStorage.setItem("is_logged_in", "true");
                        // 🔹 Optionally save user profile (NOT the token)
                        if (session?.user) {
                            await AsyncStorage.setItem(
                                "user_profile",
                                JSON.stringify({
                                    id: session.user.id,
                                    email: session.user.primaryEmailAddress?.emailAddress,
                                    name: session.user.fullName,
                                    image: session.user.imageUrl,
                                })
                            );
                        }
                        if (session?.currentTask) {
                            console.log(session?.currentTask)
                            // router.push('/sign-in/tasks')
                            return
                        }

                        router.push('/')
                    },
                })
            } else {
                // If there is no `createdSessionId`,
                // there are missing requirements, such as MFA
                // See https://clerk.com/docs/guides/development/custom-flows/authentication/oauth-connections#handle-missing-requirements
            }
        } catch (err) {
            // See https://clerk.com/docs/guides/development/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }, [])

    // <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>SwiftLM Authentication</Text>
    //     <Text style={{ fontSize: 14, textAlign: 'center', color: '#9BA1A6' }}>Choose how you want to authenticate</Text>
    //     <View style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: 32 }}>
    //         <Button mode='contained' icon="google" onPress={onPress}>Continue with Google</Button>
    //         <Button mode='elevated' icon="github">Continue with Github</Button>
    //     </View>
    // </SafeAreaView>

    return (

        <ImageBackground source={require('../assets/images/auth-background.png')} resizeMode='cover' style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: "DMSerifText_400Regular", fontSize: 32 }}>Authenticate with</Text>
                <Text style={{ fontFamily: "DMSerifText_400Regular", fontSize: 32 }}>SwiftLM</Text>

                <View style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8, paddingHorizontal: 20, position: 'absolute', bottom: 30 }}>
                    <AuthButton label='Continue with Google' onPress={() => onSSOPress('oauth_google')} icon={<Google />} />
                    <AuthButton label='Continue with Github' onPress={() => onSSOPress('oauth_github')} icon={<Github />} />
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}

