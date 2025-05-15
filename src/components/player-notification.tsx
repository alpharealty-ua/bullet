import { useState } from 'react'
import { TransitionGroup } from 'react-transition-group'

import { addId, cn } from '@/lib/utils'
import { useInterval } from '@/hooks/use-interval'
import { Actions } from '@/components/ui/actions'
import { AnimationInOut } from '@/components/ui/animation-in-out'

const PlayerNotification = () => {
  const [notifications, setNotifications] = useState(addId(Array(1).fill(null)))
  const [count, setCount] = useState(0)

  useInterval(
    () => {
      setNotifications((p) => [...p, { id: String(Date.now()) }])
      setCount((p) => p + 1)
    },
    count < 3 ? 2345 : null,
  )

  const handleCancelClick = (index: number) => {
    notifications.splice(index, 1)
    setNotifications([...notifications])
  }

  return (
    <TransitionGroup className='absolute top-full right-0 flex flex-col gap-0.5'>
      {notifications.map((el, i) => (
        <AnimationInOut
          key={el.id}
          in={true}
          className={cn(
            'flex items-center justify-end gap-2 rounded border border-black bg-white p-2 shadow',
            'slide-out-to-right slide-in-from-right',
          )}
        >
          <div className='max-w-60 overflow-hidden text-xs text-nowrap text-ellipsis'>
            Accept friendship from player{el.id.slice(-4)}
          </div>
          <Actions
            onConfirm={() => handleCancelClick(i)}
            onCancel={() => handleCancelClick(i)}
          />
        </AnimationInOut>
      ))}
    </TransitionGroup>
  )
}

export { PlayerNotification }
