import { useFormulaMilkStore } from '@/hooks/useFormulaMilkStore'
import { usePoopStore } from '@/hooks/usePoopStore'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, Text, XStack, YStack } from 'tamagui'

const babyAvatarPlaceholder = require('@/assets/images/baby-avatar-placeholder.png')

export default function DailyInfo() {
  const { dailyTimes, dailyMilkIntake } = useFormulaMilkStore()
  const { poopTimes } = usePoopStore()

  const [babyAvatar, setBabyAvatar] = useState<FileSystem.FileInfo | null>(null)
  const babyAvatarUri = FileSystem.documentDirectory + '/babyAvatar.jpeg'

  useEffect(() => {
    ;(async () => {
      if (!babyAvatar) {
        const babyAvatar = await FileSystem.getInfoAsync(babyAvatarUri)
        setBabyAvatar(babyAvatar)
      }
    })()
  }, [babyAvatar, setBabyAvatar])

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
    })

    if (!result.canceled) {
      await FileSystem.copyAsync({
        from: result.assets[0].uri,
        to: babyAvatarUri,
      })
      setBabyAvatar(null)
    }
  }

  return (
    <SafeAreaView>
      <XStack
        borderColor="$borderColor"
        borderWidth={2}
        gap="$2"
        items="center"
        p="$2"
        rounded="$4"
      >
        <Avatar circular onPress={pickImageAsync} size="$6">
          <Avatar.Image
            src={
              babyAvatar && babyAvatar.exists
                ? `${babyAvatar.uri}?t=${babyAvatar.modificationTime}`
                : babyAvatarPlaceholder
            }
          />
          <Avatar.Fallback borderColor="red" />
        </Avatar>
        <YStack>
          <Text>吃奶次数: {dailyTimes}次</Text>
          <Text>总进食量: {dailyMilkIntake}ml</Text>
          <Text>臭臭次数: {poopTimes}</Text>
        </YStack>
      </XStack>
    </SafeAreaView>
  )
}
