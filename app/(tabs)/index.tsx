import DailyInfo from '@/components/DailyInfo'
import { type FormulaMilk, type Poop, formulaMilkTable, poopTable } from '@/db/schema'
import migrations from '@/drizzle/migrations'
import { useDb } from '@/hooks/useDb'
import { useFormulaMilkStore } from '@/hooks/useFormulaMilkStore'
import { Milk } from '@tamagui/lucide-icons'
import PoopIcon from 'components/icon/PoopIcon'
import dayjs from 'dayjs'
import { eq, like } from 'drizzle-orm'
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator'
import * as MediaLibrary from 'expo-media-library'
import { useRouter } from 'expo-router'
import { usePoopStore } from 'hooks/usePoopStore'
import { useEffect, useState } from 'react'
import {
  AlertDialog,
  Button,
  Card,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from 'tamagui'

export default function HomeScreen() {
  const router = useRouter()
  const db = useDb()
  const { success, error } = useMigrations(db, migrations)
  const [status, requestPermission] = MediaLibrary.usePermissions()
  const {
    list: formulaMilkList,
    dailyTimes,
    dailyMilkIntake,
    listNeedReload: formulaMilkListNeedReload,
    setList: setFormulaMilkList,
    setForm: setFormulaMilkForm,
    setDailyTimes,
    setDailyMilkIntake,
    setListNeedReload: setFormulaMilkListNeedReload,
  } = useFormulaMilkStore()

  const {
    list: poopList,
    poopTimes,
    listNeedReload: poopListNeedReload,
    setList: setPoopList,
    setForm: setPoopForm,
    setPoopTimes,
    setListNeedReload: setPoopListNeedReload,
  } = usePoopStore()

  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [deleteObj, setDeleteObj] = useState<FormulaMilk | Poop | null>(null)

  if (status === null) {
    requestPermission()
  }

  const isMilkType = (obj: any): obj is FormulaMilk => obj.type === 'FORMULA_MILK'
  const isPoopType = (obj: any): obj is Poop => obj.type === 'POOP'

  const handleDelete = async () => {
    if (deleteObj) {
      if (isMilkType(deleteObj)) {
        await db.delete(formulaMilkTable).where(eq(formulaMilkTable.id, deleteObj.id))
        setFormulaMilkListNeedReload(true)
      } else if (isPoopType(deleteObj)) {
        await db.delete(poopTable).where(eq(poopTable.id, deleteObj.id))
        setPoopListNeedReload(true)
      }
      setDeleteObj(null)
      setShowAlertDialog(false)
    }
  }

  useEffect(() => {
    if (!success) return
    if (!formulaMilkListNeedReload) return
    ;(async () => {
      const formulaMilkList = await db
        .select()
        .from(formulaMilkTable)
        .where(
          like(formulaMilkTable.endTime, dayjs(new Date()).format('YYYY-MM-DD') + '%')
        )
      setFormulaMilkList(formulaMilkList)
      setDailyTimes(formulaMilkList.length)
      setDailyMilkIntake(
        formulaMilkList.reduce((value, item) => item.milkIntake + value, 0)
      )
      setFormulaMilkListNeedReload(false)
    })()
  }, [
    db,
    formulaMilkListNeedReload,
    success,
    setFormulaMilkList,
    setFormulaMilkListNeedReload,
    setDailyTimes,
    setDailyMilkIntake,
  ])

  useEffect(() => {
    if (!success) return

    if (!poopListNeedReload) return
    ;(async () => {
      const poopList = await db
        .select()
        .from(poopTable)
        .where(like(poopTable.createTime, dayjs(new Date()).format('YYYY-MM-DD') + '%'))
      setPoopList(poopList)
      setPoopTimes(poopList.length)
      setPoopListNeedReload(false)
    })()
  }, [db, setPoopList, setPoopListNeedReload, poopListNeedReload, success, setPoopTimes])

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    )
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    )
  }

  const list = [
    ...formulaMilkList.map((item) => {
      return { ...item, type: 'FORMULA_MILK', createTime: item.endTime }
    }),
    ...poopList.map((item) => {
      return { ...item, type: 'POOP' }
    }),
  ].sort((a, b) => a.createTime.localeCompare(b.createTime))

  return (
    <YStack bg="$background" gap="$2" height="100%" p="$2">
      <DailyInfo />
      <ScrollView flex={1}>
        <YStack gap="$2">
          {list.map((item) => {
            return isMilkType(item) ? (
              // 配方奶类型
              <Card
                bordered
                display="flex"
                flexDirection="row"
                height={60}
                items="center"
                key={item.id}
                onLongPress={() => {
                  setDeleteObj(item)
                  setShowAlertDialog(true)
                }}
                onPress={() => {
                  setFormulaMilkForm(item)
                  router.push('/add-or-update-formula-milk')
                }}
                p="$4"
                pressStyle={{ scale: 0.95 }}
                theme="accent"
              >
                <Text flex={1}>
                  {item.startTime.substring(11, 16)} ~{item.endTime.substring(11, 16)} (
                  {item.durationMinutes}
                  分钟)
                </Text>
                <Text fontWeight="bold" width="$6">
                  配方奶
                </Text>
                <Text width="$4">{item.milkIntake}ml</Text>
              </Card>
            ) : isPoopType(item) ? (
              // 大便类型
              <Card
                bordered
                display="flex"
                flexDirection="row"
                height={60}
                items="center"
                key={item.id}
                onLongPress={() => {
                  setDeleteObj(item)
                  setShowAlertDialog(true)
                }}
                onPress={() => {
                  setPoopForm(item)
                  router.push('/add-or-update-poop')
                }}
                p="$4"
                pressStyle={{ scale: 0.95 }}
                style={{ backgroundColor: item.color }}
              >
                <Text flex={1}>{item.createTime.substring(11, 16)}</Text>
                <Text fontWeight="bold" width="$6">
                  臭臭
                </Text>
                <Text width="$4">{item.shape}</Text>
              </Card>
            ) : null
          })}
        </YStack>
      </ScrollView>
      <XStack gap="$5" justify="center">
        <Button
          icon={Milk}
          onPress={() => {
            setFormulaMilkForm({
              startTime: dayjs(new Date()).add(-11, 'minute').format('YYYY-MM-DD HH:mm'),
              endTime: dayjs(new Date()).add(-1, 'minute').format('YYYY-MM-DD HH:mm'),
              durationMinutes: 10,
              milkIntake: 180,
            } as FormulaMilk)
            router.push('/add-or-update-formula-milk')
          }}
          self="center"
          size="$6"
          theme="accent"
        />
        <Button
          icon={PoopIcon}
          onPress={() => {
            setPoopForm({
              createTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm'),
              color: '#b08c3c',
              shape: '正常',
            } as Poop)
            router.push('/add-or-update-poop')
          }}
          self="center"
          size="$6"
          theme="accent"
        />
      </XStack>
      <AlertDialog onOpenChange={setShowAlertDialog} open={showAlertDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            key="overlay"
            opacity={0.5}
          />
          <AlertDialog.Content
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            bordered
            elevate
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            key="content"
            opacity={1}
            scale={1}
            width="80%"
            x={0}
            y={0}
          >
            <YStack gap="$4">
              <AlertDialog.Title size="$5">确认删除此条记录？</AlertDialog.Title>

              <XStack gap="$3" justify="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button>取消</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button onPress={handleDelete} theme="accent">
                    删除
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  )
}
