import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { useDb } from '@/hooks/useDb';
import { useFormulaMilkStore } from '@/hooks/useFormulaMilkStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { formulaMilkTable } from '../db/schema';

import { Modal } from 'react-native';

import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

export default function AddFormulaMilk() {
  const router = useRouter();

  const db = useDb();
  const { form, updateForm, setListNeedReload } = useFormulaMilkStore();
  const milkIntakeText = form.milkIntake?.toString() || '';
  const durationMinutesText = form.durationMinutes?.toString() || '';
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>(new Date().getTime());

  const [isInvalid, setIsInvalid] = useState(false);
  const handleSubmit = async () => {
    await db.insert(formulaMilkTable).values([form]);
    setListNeedReload(true);
    router.back();
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <Box className="w-full">
      <FormControl size="lg" isInvalid={isInvalid}>
        <FormControlLabel>
          <FormControlLabelText>开始时间</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            placeholder="选择开始时间"
            value={form.startTime}
            onChangeText={text => updateForm('startTime', text)}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>开始时间不能为空！</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl size="lg" isInvalid={isInvalid}>
        <FormControlLabel>
          <FormControlLabelText>结束时间</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            placeholder="选择结束时间"
            value={form.endTime}
            onChangeText={text => updateForm('endTime', text)}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>结束时间不能为空！</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl size="lg" isInvalid={isInvalid}>
        <FormControlLabel>
          <FormControlLabelText>耗时 (分钟)</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            placeholder="输入耗时 (分钟)"
            value={durationMinutesText}
            onChangeText={text => updateForm('durationMinutes', parseInt(text))}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>耗时不能为空！</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl size="lg" isInvalid={isInvalid}>
        <FormControlLabel>
          <FormControlLabelText>进食量 (ml)</FormControlLabelText>
        </FormControlLabel>
        <Input className="my-1">
          <InputField
            placeholder="输入进食量 (ml)"
            value={milkIntakeText}
            onChangeText={text => updateForm('milkIntake', parseInt(text))}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>进食量不能为空！</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button className="mt-4 w-40 self-end" size="sm" onPress={handleSubmit}>
        <ButtonText>添加记录</ButtonText>
      </Button>

      <Button className="mt-4 w-40 self-end" size="sm" onPress={onAddSticker}>
        <ButtonText>时间选择弹框</ButtonText>
      </Button>
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <Box className="absolute bottom-0 h-[45%] w-full bg-slate-50">
          <DateTimePicker
            mode="single"
            date={selected}
            onChange={({ date }) => setSelected(date)}
            styles={defaultStyles}
          />
        </Box>
      </Modal>
    </Box>
  );
}
