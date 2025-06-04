import { PressableCard } from "../../components/PressableCard";
import { Box } from "../../components/ui/box";
import { ButtonIcon, ButtonText } from "../../components/ui/button";
import { useDb } from "../../hooks/useDb";
import { useFormulaMilkStore } from "../../hooks/useFormulaMilkStore";
import { FlashList } from "@shopify/flash-list";
import dayjs from "dayjs";
import { eq, like } from "drizzle-orm";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useRouter } from "expo-router";
import { MilkIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListItem, ScrollView, Text, XStack, YStack } from "tamagui";
import {
  FormulaMilk,
  formulaMilkTable,
  Poop,
  poopTable,
} from "../../db/schema";
import migrations from "../../drizzle/migrations";

import { Heading } from "../../components/ui/heading";
import { Icon, TrashIcon } from "../../components/ui/icon";
import { Button, Card, H2, Image, Paragraph, AlertDialog, View } from "tamagui";
import { Milk } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PoopIcon from "components/icon/PoopIcon";
import { usePoopStore } from "hooks/usePoopStore";

export default function HomeScreen() {
  const router = useRouter();
  const db = useDb();
  const { success, error } = useMigrations(db, migrations);
  const {
    list: milkList,
    dailyTimes,
    dailyMilkIntake,
    listNeedReload,
    setList,
    setForm,
    setDailyTimes,
    setDailyMilkIntake,
    setListNeedReload,
  } = useFormulaMilkStore();

  const {
    list: poopList,
    poopTimes,
    listNeedReload: poopListNeedReload,
    setList: setPoopList,
    setForm: setPoopForm,
    setPoopTimes,
    setListNeedReload: setPoopListNeedReload,
  } = usePoopStore();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { top, bottom } = useSafeAreaInsets();

  const handleDelete = async () => {
    if (deleteId) {
      await db
        .delete(formulaMilkTable)
        .where(eq(formulaMilkTable.id, deleteId));
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
        .where(
          like(
            formulaMilkTable.endTime,
            dayjs(new Date()).format("YYYY-MM-DD") + "%"
          )
        );
      setList(formulaMilkList);
      setDailyTimes(formulaMilkList.length);
      setDailyMilkIntake(
        formulaMilkList.reduce((value, item) => item.milkIntake + value, 0)
      );
      setListNeedReload(false);
    })();
  }, [
    db,
    setList,
    setListNeedReload,
    listNeedReload,
    success,
    setDailyTimes,
    setDailyMilkIntake,
  ]);

  useEffect(() => {
    if (!success) return;

    if (!poopListNeedReload) return;

    (async () => {
      const poopList = await db
        .select()
        .from(poopTable)
        .where(
          like(
            poopTable.createTime,
            dayjs(new Date()).format("YYYY-MM-DD") + "%"
          )
        );
      setPoopList(poopList);
      setPoopTimes(poopList.length);
      setPoopListNeedReload(false);
    })();
  }, [
    db,
    setPoopList,
    setPoopListNeedReload,
    poopListNeedReload,
    success,
    setPoopTimes,
  ]);

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

  const list = [
    ...milkList.map((item) => {
      return { ...item, type: "FORMULA_MILK", createTime: item.endTime };
    }),
    ...poopList.map((item) => {
      return { ...item, type: "POOP" };
    }),
  ].sort((a, b) => a.createTime.localeCompare(b.createTime));

  return (
    <YStack bg="$background" gap="$2" p="$2" height="100%">
      <SafeAreaView>
        <YStack
          borderWidth={2}
          borderColor="$borderColor"
          rounded="$4"
          gap="$2"
          p="$2"
        >
          <Text>当日统计+宝宝头像</Text>
          <Text>吃奶次数: {dailyTimes}次</Text>
          <Text>总进食量: {dailyMilkIntake}ml</Text>
          <Text>臭臭次数: {poopTimes}</Text>
        </YStack>
      </SafeAreaView>
      <ScrollView flex={1}>
        <YStack gap="$2">
          {list.map((item) => {
            // 类型守卫：配方奶类型
            const isMilkType = (obj: any): obj is FormulaMilk =>
              obj.type === "FORMULA_MILK";

            // 类型守卫：大便类型
            const isPoopType = (obj: any): obj is Poop => obj.type === "POOP";

            return isMilkType(item) ? (
              // 配方奶类型
              <Card
                theme="accent"
                bordered
                height={60}
                key={item.id}
                pressStyle={{ scale: 0.95 }}
                display="flex"
                flexDirection="row"
                items="center"
                p="$4"
                onPress={() => {
                  setForm(item);
                  router.push("/add-or-update-formula-milk");
                }}
                onLongPress={() => {
                  setDeleteId(item.id);
                  setShowAlertDialog(true);
                }}
              >
                <Text flex={1}>
                  {item.startTime.substring(11, 16)} ~
                  {item.endTime.substring(11, 16)} ({item.durationMinutes}
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
                bg={item.color}
                bordered
                height={60}
                key={item.id}
                pressStyle={{ scale: 0.95 }}
                display="flex"
                flexDirection="row"
                items="center"
                p="$4"
                onPress={() => {
                  setPoopForm(item);
                  router.push("/add-or-update-poop");
                }}
              >
                <Text flex={1}>{item.createTime.substring(11, 16)}</Text>
                <Text fontWeight="bold" width="$6">
                  臭臭
                </Text>
                <Text width="$4">{item.shape}</Text>
              </Card>
            ) : null;
          })}
        </YStack>
      </ScrollView>
      <XStack justify="center" gap="$5">
        <Button
          theme="accent"
          self="center"
          icon={Milk}
          size="$6"
          onPress={() => {
            setForm({
              startTime: dayjs(new Date())
                .add(-11, "minute")
                .format("YYYY-MM-DD HH:mm"),
              endTime: dayjs(new Date())
                .add(-1, "minute")
                .format("YYYY-MM-DD HH:mm"),
              durationMinutes: 10,
              milkIntake: 180,
            } as FormulaMilk);
            router.push("/add-or-update-formula-milk");
          }}
        />
        <Button
          theme="accent"
          self="center"
          icon={PoopIcon}
          size="$6"
          onPress={() => {
            setPoopForm({
              createTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
              color: "#b08c3c",
              shape: "正常",
            } as Poop);
            router.push("/add-or-update-poop");
          }}
        />
      </XStack>
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            width="80%"
            bordered
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack gap="$4">
              <AlertDialog.Title size="$5">
                确认删除此条记录？
              </AlertDialog.Title>

              <XStack gap="$3" justify="flex-end">
                <AlertDialog.Cancel asChild>
                  <Button>取消</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button theme="accent" onPress={handleDelete}>
                    删除
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  );
}
