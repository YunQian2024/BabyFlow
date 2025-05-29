import { Text } from '@/components/ui/text';

import { Box } from '@/components/ui/box';
import { Button, ButtonIcon } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { MilkIcon } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView>
      <Box className="flex h-full w-full flex-col gap-2">
        <Box className="h-32 w-full bg-green-200">
          <Text>当日统计+宝宝头像</Text>
        </Box>
        <Box className="flex-1 bg-primary-400"></Box>
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
