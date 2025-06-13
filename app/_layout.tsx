import '../tamagui-web.css'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { captureException, getGlobalScope, init, wrap } from '@sentry/react-native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import Provider from './Provider'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

const originalHandler = ErrorUtils.getGlobalHandler()

ErrorUtils.setGlobalHandler((error, isFatal) => {
  captureException(error)
  if (isFatal) {
    // 致命错误可考虑重启应用
  }
  originalHandler(error, isFatal)
})

const manifest = Updates.manifest
const metadata = 'metadata' in manifest ? manifest.metadata : undefined
const extra = 'extra' in manifest ? manifest.extra : undefined
const updateGroup =
  metadata && 'updateGroup' in metadata ? metadata.updateGroup : undefined

init({
  dsn: 'https://192c49c6fcc48678a86f8121b812520c@o4509489014308864.ingest.us.sentry.io/4509489028726784',
  sendDefaultPii: true,
})

const scope = getGlobalScope()

scope.setTag('expo-update-id', Updates.updateId)
scope.setTag('expo-is-embedded-update', Updates.isEmbeddedLaunch)

if (typeof updateGroup === 'string') {
  scope.setTag('expo-update-group-id', updateGroup)

  const owner = extra?.expoClient?.owner ?? '[account]'
  const slug = extra?.expoClient?.slug ?? '[project]'
  scope.setTag(
    'expo-update-debug-url',
    `https://expo.dev/accounts/${owner}/projects/${slug}/updates/${updateGroup}`
  )
} else if (Updates.isEmbeddedLaunch) {
  // This will be `true` if the update is the one embedded in the build, and not one downloaded from the updates server.
  scope.setTag('expo-update-debug-url', 'not applicable for embedded updates')
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default wrap(function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return (
    <Providers>
      <RootLayoutNav />
    </Providers>
  )
})

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="add-or-update-formula-milk" options={{ title: '配方奶' }} />
        <Stack.Screen name="add-or-update-poop" options={{ title: '臭臭' }} />
      </Stack>
    </ThemeProvider>
  )
}
