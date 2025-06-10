import { Calendar } from '@tamagui/lucide-icons'
import dayjs from 'dayjs'
import { type FC, useState } from 'react'
import { Modal } from 'react-native'
import DateTimePicker, {
  type DateType,
  useDefaultClassNames,
} from 'react-native-ui-datepicker'
import { Button, Input, View, XGroup } from 'tamagui'

export const DatePicker: FC<{
  id: string
  initDate?: DateType
  placeholder?: string
  onChange: (date: string) => void
}> = ({ id, initDate, placeholder, onChange }) => {
  const defaultClassNames = useDefaultClassNames()
  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState<DateType>(initDate)

  return (
    <View>
      <XGroup>
        <XGroup.Item>
          <Button
            borderColor="$color5"
            borderRightWidth={0}
            borderWidth={1}
            disabled
            icon={Calendar}
          />
        </XGroup.Item>
        <XGroup.Item>
          <Input
            caretHidden={true}
            flex={1}
            id={id}
            onFocus={() => setShow(true)}
            placeholder={placeholder}
            showSoftInputOnFocus={false}
            value={selected?.toString()}
          />
        </XGroup.Item>
      </XGroup>
      {show && (
        <Modal
          animationType="slide"
          onRequestClose={() => setShow(false)}
          transparent={true}
          visible={show}
        >
          <View
            inset={0}
            onPress={() => setShow(false)}
            opacity={0}
            position="absolute"
          />
          {/* 固定在底部的日期选择器 */}
          <View b="$0" bg="$background" position="absolute" width="100%">
            <DateTimePicker
              classNames={{
                ...defaultClassNames,
                today: 'border-amber-500',
                selected: 'bg-amber-500 border-amber-500',
                selected_label: 'text-white',
                day: `${defaultClassNames.day} hover:bg-amber-100`,
                disabled: 'opacity-50',
              }}
              date={selected}
              initialView="time"
              locale={'zh'}
              mode="single"
              onChange={({ date }) => {
                setSelected(dayjs(date).format('YYYY-MM-DD HH:mm'))
                onChange(dayjs(date).format('YYYY-MM-DD HH:mm'))
              }}
              timePicker={true}
              timeZone={'Asia/Shanghai'}
            />
          </View>
        </Modal>
      )}
    </View>
  )
}
