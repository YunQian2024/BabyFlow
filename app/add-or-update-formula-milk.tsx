import { DatePicker } from '@/components/DatePicker'
import { formulaMilkTable } from '@/db/schema'
import { useDb } from '@/hooks/useDb'
import { useFormulaMilkStore } from '@/hooks/useFormulaMilkStore'
import { eq } from 'drizzle-orm'
import { useRouter } from 'expo-router'
import React from 'react'
import { Button, Form, Input, Label, Spinner, YStack } from 'tamagui'

export default function AddFormulaMilk() {
  const [status, setStatus] = React.useState<'off' | 'submitting' | 'submitted'>('off')

  const router = useRouter()

  const db = useDb()
  const { form, updateForm, setListNeedReload } = useFormulaMilkStore()
  const milkIntakeText = form.milkIntake?.toString() || ''

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
        <Label htmlFor="startTime" width={90}>
          开始时间
        </Label>
        <DatePicker
          id="startTime"
          initDate={form.startTime}
          onChange={(date) => updateForm('startTime', date)}
          placeholder="选择开始时间"
        />
      </YStack>

      <YStack>
        <Label htmlFor="endTime" width={90}>
          结束时间
        </Label>
        <DatePicker
          id="endTime"
          initDate={form.endTime}
          onChange={(date) => updateForm('endTime', date)}
          placeholder="选择结束时间"
        />
      </YStack>

      <YStack>
        <Label htmlFor="milkIntake" width={90}>
          进食量 (ml)
        </Label>
        <Input
          id="milkIntake"
          keyboardType="numeric"
          onChangeText={(text) =>
            updateForm('milkIntake', text ? Number.parseInt(text) : 0)
          }
          placeholder="输入进食量 (ml)"
          value={milkIntakeText}
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
