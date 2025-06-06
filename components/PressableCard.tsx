import { Card } from '@/components/ui/card'
import { Pressable } from '@/components/ui/pressable'

import type { FC, ReactNode } from 'react'

export const PressableCard: FC<{
  className?: string
  children: ReactNode
  onPress: () => void
  onLongPress?: () => void
}> = ({ className, children, onPress, onLongPress }) => {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      {({ pressed }) => {
        return (
          <Card
            className={`m-1 overflow-hidden rounded-lg border border-gray-200 ${
              pressed ? 'bg-gray-200' : 'bg-gray-100'
            } ${className}`}
            style={{
              transform: [
                {
                  scale: pressed ? 0.98 : 1,
                },
              ],
            }}
          >
            {children}
          </Card>
        )
      }}
    </Pressable>
  )
}
