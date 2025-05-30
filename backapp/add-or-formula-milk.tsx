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

import { DatePicker } from '@/components/DatePicker';
import { eq } from 'drizzle-orm';

export default function AddFormulaMilk() {
  const router = useRouter();

  const db = useDb();
  const { form, updateForm, setListNeedReload } = useFormulaMilkStore();
  const milkIntakeText = form.milkIntake?.toString() || '';
  const durationMinutesText = form.durationMinutes?.toString() || '';

  const [isInvalid, setIsInvalid] = useState(false);
  const handleSubmit = async () => {
    if (form.id) {
      await db.update(formulaMilkTable).set(form).where(eq(formulaMilkTable.id, form.id));
    } else {
      await db.insert(formulaMilkTable).values([form]);
    }
    setListNeedReload(true);
    router.back();
  };

  return (
    <Box className="w-full p-4">
      <FormControl size="lg" isInvalid={isInvalid}>
        <FormControlLabel>
          <FormControlLabelText>开始时间</FormControlLabelText>
        </FormControlLabel>
        <DatePicker
          initDate={form.startTime}
          placeholder="选择开始时间"
          onChange={date => updateForm('startTime', date)}
        />
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>开始时间不能为空！</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl size="lg" isInvalid={isInvalid}>
        <FormControlLabel>
          <FormControlLabelText>结束时间</FormControlLabelText>
        </FormControlLabel>
        <DatePicker initDate={form.endTime} placeholder="选择结束时间" onChange={date => updateForm('endTime', date)} />
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

      <Button className="mt-4 w-32 self-end" size="sm" onPress={handleSubmit}>
        <ButtonText>{form.id ? '修改记录' : '添加记录'}</ButtonText>
      </Button>
    </Box>
  );
}
