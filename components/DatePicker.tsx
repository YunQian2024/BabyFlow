import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react-native";
import { FC, useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
import DateTimePicker, {
  DateType,
  useDefaultClassNames,
} from "react-native-ui-datepicker";
import {
  Button,
  Form,
  H4,
  Spinner,
  XGroup,
  Input,
  YStack,
  Label,
  View,
} from "tamagui";
import { Calendar } from "@tamagui/lucide-icons";

export const DatePicker: FC<{
  id: string;
  initDate?: DateType;
  placeholder?: string;
  onChange: (date: string) => void;
}> = ({ id, initDate, placeholder, onChange }) => {
  const defaultClassNames = useDefaultClassNames();
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState<DateType>(initDate);

  return (
    <View>
      <XGroup>
        <XGroup.Item>
          <Button
            icon={Calendar}
            disabled
            borderWidth={1}
            borderRightWidth={0}
            borderColor="$color5"
          />
        </XGroup.Item>
        <XGroup.Item>
          <Input
            id={id}
            flex={1}
            value={selected?.toString()}
            showSoftInputOnFocus={false}
            caretHidden={true}
            onFocus={() => setShow(true)}
            placeholder={placeholder}
          />
        </XGroup.Item>
      </XGroup>
      {show && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={show}
          onRequestClose={() => setShow(false)}
        >
          <View
            position="absolute"
            inset={0}
            opacity={0}
            onPress={() => setShow(false)}
          />
          {/* 固定在底部的日期选择器 */}
          <View position="absolute" width="100%" b="$0" bg="$background">
            <DateTimePicker
              mode="single"
              date={selected}
              timePicker={true}
              initialView="time"
              onChange={({ date }) => {
                setSelected(dayjs(date).format("YYYY-MM-DD HH:mm"));
                onChange(dayjs(date).format("YYYY-MM-DD HH:mm"));
              }}
              locale={"zh"}
              timeZone={"Asia/Shanghai"}
              classNames={{
                ...defaultClassNames,
                today: "border-amber-500",
                selected: "bg-amber-500 border-amber-500",
                selected_label: "text-white",
                day: `${defaultClassNames.day} hover:bg-amber-100`,
                disabled: "opacity-50",
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};
