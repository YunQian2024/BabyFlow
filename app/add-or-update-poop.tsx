import { poopTable } from '@/db/schema'
import { useDb } from '@/hooks/useDb'
import { usePoopStore } from '@/hooks/usePoopStore'
import { Camera } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'

import { DatePicker } from '@/components/DatePicker'
import { eq } from 'drizzle-orm'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import React from 'react'
import {
  Button,
  Form,
  Image,
  Label,
  Spinner,
  Text,
  TextArea,
  ToggleGroup,
  View,
  XStack,
  YStack,
} from 'tamagui'

const babyAvatarPlaceholder = require('@/assets/images/baby-avatar-placeholder.png')

export default function AddPoop() {
  const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')

  const router = useRouter()

  const db = useDb()
  const { form, updateForm, setListNeedReload } = usePoopStore()

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    })

    if (!result.canceled) {
      const fileUri = FileSystem.documentDirectory + '/' + result.assets[0].fileName
      await FileSystem.copyAsync({
        from: result.assets[0].uri,
        to: fileUri,
      })
      updateForm('image', fileUri)
    }
  }

  const handleSubmit = async () => {
    setStatus('submitting')
    if (form.id) {
      await db.update(poopTable).set(form).where(eq(poopTable.id, form.id))
    } else {
      await db.insert(poopTable).values([form])
    }
    setStatus('submitted')
    setListNeedReload(true)
    router.back()
  }

  return (
    <Form gap="$3" onSubmit={handleSubmit} p="$4">
      <YStack>
        <Label htmlFor="createTime" width={90}>
          记录时间
        </Label>
        <DatePicker
          id="createTime"
          initDate={form.createTime}
          onChange={(date) => updateForm('createTime', date)}
          placeholder="选择记录时间"
        />
      </YStack>

      <YStack>
        <Label htmlFor="color" width={90}>
          颜色
        </Label>
        <XStack gap="$2">
          <View
            height="$3"
            rounded="$2"
            style={{ backgroundColor: form.color }}
            width="$3"
          />
          <ToggleGroup
            onValueChange={(value) => updateForm('color', value)}
            size="$6"
            type="single"
            value={form.color}
          >
            <ToggleGroup.Item bg="#b08c3c" value="#b08c3c"></ToggleGroup.Item>
            <ToggleGroup.Item bg="#a67b5b" value="#a67b5b"></ToggleGroup.Item>
            <ToggleGroup.Item bg="#8b5a2b" value="#8b5a2b"></ToggleGroup.Item>
            <ToggleGroup.Item bg="#e69c4a" value="#e69c4a"></ToggleGroup.Item>
            <ToggleGroup.Item bg="#b0b34f" value="#b0b34f"></ToggleGroup.Item>
            <ToggleGroup.Item bg="#556b2f" value="#556b2f"></ToggleGroup.Item>
            <ToggleGroup.Item bg="#1a1f16" value="#1a1f16"></ToggleGroup.Item>
            <ToggleGroup.Item bg="#e0d8c6" value="#e0d8c6"></ToggleGroup.Item>
          </ToggleGroup>
        </XStack>
      </YStack>

      <YStack>
        <Label htmlFor="shape" width={90}>
          形状
        </Label>
        <XStack gap="$2">
          <ToggleGroup
            justify="space-evenly"
            onValueChange={(value) => updateForm('shape', value)}
            type="single"
            value={form.shape}
            width="100%"
          >
            <ToggleGroup.Item
              bg={form.shape === '正常' ? '$accent1' : '$background'}
              color={form.shape === '正常' ? '$color1' : '$color'}
              value="正常"
            >
              <Text>正常</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              bg={form.shape === '稀稠' ? '$accent1' : '$background'}
              color={form.shape === '稀稠' ? '$color1' : '$color'}
              value="稀稠"
            >
              <Text>稀稠</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              bg={form.shape === '粘稠' ? '$accent1' : '$background'}
              color={form.shape === '粘稠' ? '$color1' : '$color'}
              value="粘稠"
            >
              <Text>粘稠</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              bg={form.shape === '较干' ? '$accent1' : '$background'}
              color={form.shape === '较干' ? '$color1' : '$color'}
              value="较干"
            >
              <Text>较干</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              bg={form.shape === '干样' ? '$accent1' : '$background'}
              color={form.shape === '干样' ? '$color1' : '$color'}
              value="干样"
            >
              <Text>干样</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              bg={form.shape === '水样' ? '$accent1' : '$background'}
              color={form.shape === '水样' ? '$color1' : '$color'}
              value="水样"
            >
              <Text>水样</Text>
            </ToggleGroup.Item>
          </ToggleGroup>
        </XStack>
      </YStack>

      <YStack>
        <Label htmlFor="remake" width={90}>
          照片
        </Label>
        {form.image ? (
          <Image height="$6" rounded="$4" source={{ uri: form.image }} width="$10" />
        ) : (
          <Button icon={Camera} onPress={pickImageAsync}>
            拍照
          </Button>
        )}
      </YStack>

      <YStack>
        <Label htmlFor="remake" width={90}>
          备注
        </Label>
        <TextArea
          id="remake"
          onChangeText={(text) => updateForm('remark', text)}
          placeholder="输入备注..."
          size="$4"
          value={form.remark || ''}
        />
      </YStack>

      <Form.Trigger asChild disabled={status !== 'off'}>
        <Button
          icon={status === 'submitting' ? () => <Spinner /> : undefined}
          theme="accent"
        >
          {form.id ? '修改记录' : '添加记录'}
        </Button>
      </Form.Trigger>
    </Form>
  )
}
