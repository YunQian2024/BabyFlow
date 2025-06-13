import { Button } from 'react-native'
import { Text, View } from 'tamagui'

export default function TabTwoScreen() {
  return (
    <View bg="$background" flex={1} items="center" justify="center">
      <Text fontSize={20}>Tab Two</Text>
      <Button
        onPress={() => {
          throw new Error('Hello, again, Sentry!')
        }}
        title="Press me"
      />
    </View>
  )
}
