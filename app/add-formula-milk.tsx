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
import { useFormulaMilkStore } from '@/hooks/useFormulaMilkStore';
import React from 'react';

export default function AddFormulaMilk() {
  const { form } = useFormulaMilkStore();
  const [displayValue, setDisplayValue] = React.useState(form.milkIntake?.toString() || '');

  const [isInvalid, setIsInvalid] = React.useState(false);
  const handleSubmit = () => {
    alert('提交');
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
            onChangeText={text => () => (form.startTime = text)}
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
            onChangeText={text => () => (form.endTime = text)}
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>结束时间不能为空！</FormControlErrorText>
        </FormControlError>
      </FormControl>

      <Button className="mt-4 w-40 self-end" size="sm" onPress={handleSubmit}>
        <ButtonText>添加记录</ButtonText>
      </Button>
    </Box>
  );
}
