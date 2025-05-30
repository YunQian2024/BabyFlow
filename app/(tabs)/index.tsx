import { Card } from '@/components/ui/card';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useDb } from '@/hooks/useDb';
import { useFormulaMilkStore } from '@/hooks/useFormulaMilkStore';
import { FlashList } from '@shopify/flash-list';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useRouter } from 'expo-router';
import { MilkIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formulaMilkTable } from '../../db/schema';
import migrations from '../../drizzle/migrations';
export default function HomeScreen() {
  const router = useRouter();
  const db = useDb();
  const { success, error } = useMigrations(db, migrations);
  const { list, listNeedReload, setList, setListNeedReload } = useFormulaMilkStore();
  useEffect(() => {
    if (!success) return;
    (async () => {
      const formulaMilkList = await db.select().from(formulaMilkTable);
      setList(formulaMilkList);
      setListNeedReload(false);
    })();
  }, [db, setList, setListNeedReload, success]);
  useEffect(() => {
    if (!listNeedReload) return;
    (async () => {
      const formulaMilkList = await db.select().from(formulaMilkTable);
      setList(formulaMilkList);
      setListNeedReload(false);
    })();
  }, [db, setList, setListNeedReload, listNeedReload]);
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
        </Box>
        <Box className="flex-1">
          <FlashList
            data={list}
            renderItem={({ item }) => (
              <Card size={'lg'} variant={'outline'} className="mb-2 flex-row gap-2">
                <Text size="sm" className="flex-1">
                  {item.startTime} ~ {item.endTime} ({item.durationMinutes}分钟)
                </Text>
                <Text className="w-20">配方奶</Text>
                <Text size="sm" className="w-10">
                  {item.milkIntake}ml
                </Text>
              </Card>
            )}
          />
        </Box>
        <Box className="flex h-24 w-full items-center justify-center">
          <Button
            className="h-20 w-20 rounded-full bg-rose-300 active:!bg-red-400"
            onPress={() => router.push('/add-formula-milk')}>
            <ButtonIcon as={MilkIcon} />
          </Button>
        </Box>
      </Box>
    </SafeAreaView>
  );
}
