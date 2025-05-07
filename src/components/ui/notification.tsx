import { cn } from '@/lib/utils'
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi'

interface NotificationProps {
  message?: string
  type: 'error' | 'success'
}

const Notification = ({ type, message }: NotificationProps) => {
  if (!message) return null

  const Icon =
    type === 'error' ? HiOutlineExclamationCircle : HiOutlineCheckCircle

  return (
    <div
      className={cn(
        'flex items-center gap-x-2 rounded-md p-3 text-sm',
        type === 'error'
          ? 'bg-red/15 text-red'
          : 'bg-emerald-500/15 text-emerald-500',
      )}
    >
      <Icon className='h-5 w-5' />
      <p>{message}</p>
    </div>
  )
}

export { Notification }
