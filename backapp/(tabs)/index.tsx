import { PressableCard } from '@/components/PressableCard';
import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useDb } from '@/hooks/useDb';
import { useFormulaMilkStore } from '@/hooks/useFormulaMilkStore';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { eq, like } from 'drizzle-orm';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useRouter } from 'expo-router';
import { MilkIcon } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormulaMilk, formulaMilkTable } from '../../db/schema';
import migrations from '../../drizzle/migrations';

import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Heading } from '@/components/ui/heading';
import { Icon, TrashIcon } from '@/components/ui/icon';

export default function HomeScreen() {
  const router = useRouter();
  const db = useDb();
  const { success, error } = useMigrations(db, migrations);
  const {
    list,
    dailyTimes,
    dailyMilkIntake,
    listNeedReload,
    setList,
    setForm,
    setDailyTimes,
    setDailyMilkIntake,
    setListNeedReload,
  } = useFormulaMilkStore();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (deleteId) {
      await db.delete(formulaMilkTable).where(eq(formulaMilkTable.id, deleteId));
      setDeleteId(null);
      setListNeedReload(true);
      setShowAlertDialog(false);
    }
  };

  useEffect(() => {
    if (!success) return;

    if (!listNeedReload) return;

    (async () => {
      const formulaMilkList = await db
        .select()
        .from(formulaMilkTable)
        .where(like(formulaMilkTable.endTime, dayjs(new Date()).format('YYYY-MM-DD') + '%'));
      setList(formulaMilkList);
      setDailyTimes(formulaMilkList.length);
      setDailyMilkIntake(formulaMilkList.reduce((value, item) => item.milkIntake + value, 0));
      setListNeedReload(false);
    })();
  }, [db, setList, setListNeedReload, listNeedReload, success, setDailyTimes, setDailyMilkIntake]);
  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView>
      <Box className="flex h-full w-full flex-col gap-2">
        <Box className="h-32 w-full bg-green-200">
          <Text>当日统计+宝宝头像</Text>
          <Text>吃奶次数: {dailyTimes}次</Text>
          <Text>总进食量: {dailyMilkIntake}ml</Text>
        </Box>
        <Box className="flex-1 px-2">
          <FlashList
            data={list}
            estimatedItemSize={62}
            renderItem={({ item }) => (
              <PressableCard
                className="flex-row items-center"
                onPress={() => {
                  setForm(item);
                  router.push('/add-or-formula-milk');
                }}
                onLongPress={() => {
                  setDeleteId(item.id);
                  setShowAlertDialog(true);
                }}>
                <Text size="sm" className="flex-1">
                  {item.startTime.substring(11, 16)} ~ {item.endTime.substring(11, 16)} ({item.durationMinutes}分钟)
                </Text>
                <Text className="w-20 font-bold">配方奶</Text>
                <Text size="sm" className="w-10">
                  {item.milkIntake}ml
                </Text>
              </PressableCard>
            )}
          />
        </Box>
        <Box className="flex h-24 w-full items-center justify-center">
          <Button
            className="h-20 w-20 rounded-full bg-rose-300 active:!bg-red-400"
            onPress={() => {
              setForm({
                startTime: dayjs(new Date()).add(-11, 'minute').format('YYYY-MM-DD HH:mm'),
                endTime: dayjs(new Date()).add(-1, 'minute').format('YYYY-MM-DD HH:mm'),
                durationMinutes: 10,
                milkIntake: 180,
              } as FormulaMilk);
              router.push('/add-or-formula-milk');
            }}>
            <ButtonIcon as={MilkIcon} />
          </Button>
        </Box>
      </Box>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
        <AlertDialogBackdrop />
        <AlertDialogContent className="w-[80%] items-center gap-4">
          <Box className="h-[52px] w-[52px] items-center justify-center rounded-full bg-background-error">
            <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
          </Box>
          <AlertDialogHeader className="mb-2">
            <Heading size="md">确认删除记录?</Heading>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5">
            <Button size="sm" action="negative" onPress={handleDelete} className="px-[30px]">
              <ButtonText>删除</ButtonText>
            </Button>
            <Button variant="outline" action="secondary" onPress={handleClose} size="sm" className="px-[30px]">
              <ButtonText>取消</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
}
