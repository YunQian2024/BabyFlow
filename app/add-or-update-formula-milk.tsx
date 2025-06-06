import { Box } from '../components/ui/box'
import { ButtonText } from '../components/ui/button'
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '../components/ui/form-control'
import { AlertCircleIcon } from '../components/ui/icon'
import { useDb } from '../hooks/useDb'
import { useFormulaMilkStore } from '../hooks/useFormulaMilkStore'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { formulaMilkTable } from '../db/schema'
import { Calendar } from '@tamagui/lucide-icons'

import { DatePicker } from '../components/DatePicker'
import { eq } from 'drizzle-orm'
import { Button, Form, H4, Spinner, XGroup, Input, YStack, Label } from 'tamagui'
import React from 'react'
export default function AddFormulaMilk() {
  const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')

  const router = useRouter()

  const db = useDb()
  const { form, updateForm, setListNeedReload } = useFormulaMilkStore()
  const milkIntakeText = form.milkIntake?.toString() || ''
  const durationMinutesText = form.durationMinutes?.toString() || ''

  const [isInvalid, setIsInvalid] = useState(false)
  const handleSubmit = async () => {
    setStatus('submitting')
    if (form.id) {
      await db.update(formulaMilkTable).set(form).where(eq(formulaMilkTable.id, form.id))
    } else {
      await db.insert(formulaMilkTable).values([form])
    }
    setStatus('submitted')
    setListNeedReload(true)
    router.back()
  }

  return (
    <Form gap="$3" onSubmit={handleSubmit} p="$4">
      <YStack>
        <Label width={90} htmlFor="startTime">
          开始时间
        </Label>
        <DatePicker
          id="startTime"
          initDate={form.startTime}
          placeholder="选择开始时间"
          onChange={(date) => updateForm('startTime', date)}
        />
      </YStack>

      <YStack>
        <Label width={90} htmlFor="endTime">
          结束时间
        </Label>
        <DatePicker
          id="endTime"
          initDate={form.endTime}
          placeholder="选择结束时间"
          onChange={(date) => updateForm('endTime', date)}
        />
      </YStack>

      <YStack>
        <Label width={90} htmlFor="milkIntake">
          进食量 (ml)
        </Label>
        <Input
          id="milkIntake"
          keyboardType="numeric"
          value={milkIntakeText}
          onChangeText={(text) => updateForm('milkIntake', text ? Number.parseInt(text) : 0)}
          placeholder="输入进食量 (ml)"
        />
      </YStack>

      <Form.Trigger asChild disabled={status !== 'off'}>
        <Button
          theme="accent"
          icon={status === 'submitting' ? () => <Spinner /> : undefined}
        >
          {form.id ? '修改记录' : '添加记录'}
        </Button>
      </Form.Trigger>
    </Form>
  )
}
