import { useDb } from "../hooks/useDb";
import { usePoopStore } from "../hooks/usePoopStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { poopTable } from "../db/schema";

import { DatePicker } from "../components/DatePicker";
import { eq } from "drizzle-orm";
import {
  Button,
  Form,
  Spinner,
  Input,
  YStack,
  Label,
  XStack,
  View,
  ToggleGroup,
  Text,
  TextArea,
  useTheme,
} from "tamagui";
import React from "react";
export default function AddPoop() {
  const [status, setStatus] = React.useState<
    "off" | "submitting" | "submitted"
  >("off");

  const router = useRouter();

  const db = useDb();
  const { form, updateForm, setListNeedReload } = usePoopStore();
  const theme = useTheme();

  const handleSubmit = async () => {
    setStatus("submitting");
    if (form.id) {
      await db.update(poopTable).set(form).where(eq(poopTable.id, form.id));
    } else {
      await db.insert(poopTable).values([form]);
    }
    setStatus("submitted");
    setListNeedReload(true);
    router.back();
  };

  return (
    <Form gap="$3" onSubmit={handleSubmit} p="$4">
      <YStack>
        <Label width={90} htmlFor="createTime">
          记录时间
        </Label>
        <DatePicker
          id="createTime"
          initDate={form.createTime}
          placeholder="选择记录时间"
          onChange={(date) => updateForm("createTime", date)}
        />
      </YStack>

      <YStack>
        <Label width={90} htmlFor="color">
          颜色
        </Label>
        <XStack gap="$2">
          <View
            style={{ backgroundColor: form.color }}
            rounded="$2"
            width="$3"
            height="$3"
          />
          <ToggleGroup
            type="single"
            size="$6"
            value={form.color}
            onValueChange={(value) => updateForm("color", value)}
          >
            <ToggleGroup.Item value="#b08c3c" bg="#b08c3c"></ToggleGroup.Item>
            <ToggleGroup.Item value="#a67b5b" bg="#a67b5b"></ToggleGroup.Item>
            <ToggleGroup.Item value="#8b5a2b" bg="#8b5a2b"></ToggleGroup.Item>
            <ToggleGroup.Item value="#e69c4a" bg="#e69c4a"></ToggleGroup.Item>
            <ToggleGroup.Item value="#b0b34f" bg="#b0b34f"></ToggleGroup.Item>
            <ToggleGroup.Item value="#556b2f" bg="#556b2f"></ToggleGroup.Item>
            <ToggleGroup.Item value="#1a1f16" bg="#1a1f16"></ToggleGroup.Item>
            <ToggleGroup.Item value="#e0d8c6" bg="#e0d8c6"></ToggleGroup.Item>
          </ToggleGroup>
        </XStack>
      </YStack>

      <YStack>
        <Label width={90} htmlFor="shape">
          形状
        </Label>
        <XStack gap="$2">
          <ToggleGroup
            type="single"
            width="100%"
            justify="space-evenly"
            value={form.shape}
            onValueChange={(value) => updateForm("shape", value)}
          >
            <ToggleGroup.Item
              value="正常"
              color={form.shape === "正常" ? "$color1" : "$color"}
              bg={form.shape === "正常" ? "$accent1" : "$background"}
            >
              <Text>正常</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="稀稠"
              color={form.shape === "稀稠" ? "$color1" : "$color"}
              bg={form.shape === "稀稠" ? "$accent1" : "$background"}
            >
              <Text>稀稠</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="粘稠"
              color={form.shape === "粘稠" ? "$color1" : "$color"}
              bg={form.shape === "粘稠" ? "$accent1" : "$background"}
            >
              <Text>粘稠</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="较干"
              color={form.shape === "较干" ? "$color1" : "$color"}
              bg={form.shape === "较干" ? "$accent1" : "$background"}
            >
              <Text>较干</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="干样"
              color={form.shape === "干样" ? "$color1" : "$color"}
              bg={form.shape === "干样" ? "$accent1" : "$background"}
            >
              <Text>干样</Text>
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="水样"
              color={form.shape === "水样" ? "$color1" : "$color"}
              bg={form.shape === "水样" ? "$accent1" : "$background"}
            >
              <Text>水样</Text>
            </ToggleGroup.Item>
          </ToggleGroup>
        </XStack>
      </YStack>

      <YStack>
        <Label width={90} htmlFor="remake">
          备注
        </Label>
        <TextArea
          id="remake"
          size="$4"
          value={form.remark || ""}
          onChangeText={(text) => updateForm("remark", text)}
          placeholder="输入备注..."
        />
      </YStack>

      <Form.Trigger asChild disabled={status !== "off"}>
        <Button
          theme="accent"
          icon={status === "submitting" ? () => <Spinner /> : undefined}
        >
          {form.id ? "修改记录" : "添加记录"}
        </Button>
      </Form.Trigger>
    </Form>
  );
}
