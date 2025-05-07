import { useImperativeHandle } from 'react'

import { UpdateShowMethods, useUpdateShow } from '@/hooks/use-update-show'
import { cn } from '@/lib/utils'

export interface ResultHandle extends UpdateShowMethods<ReulstState> {}

interface ReulstState {
  show: boolean
  value: string
  activeRef: boolean
}
interface ResultProps {
  title: string
  value?: string
  valueSuffix?: string
  valuePreffix?: string
  open?: boolean
  resultHandle?: React.ForwardedRef<ResultHandle>
}

const Result = ({ title, value, open, resultHandle }: ResultProps) => {
  const { state, timeout, ...methods } = useUpdateShow<ReulstState>({
    show: false,
    value: '',
    activeRef: false,
  })

  useImperativeHandle(resultHandle, () => ({
    ...methods,
  }))

  const { open: open1, value: value1 } = state.activeRef
    ? { open: state.show, value: state.value }
    : { open, value }

  return (
    <div
      className={cn(
        'flex origin-top flex-col items-center gap-1 opacity-0',
        'fill-mode-both',
        open1 &&
          'animate-in fade-in slide-in-from-top-6 opacity-100 duration-500',
        !open1 && 'animate-out fade-out zoom-out-50 duration-200',
      )}
    >
      <div className='text-xl leading-[1] lg:text-2xl'>{title}</div>
      <div className='text-red max-w-75 text-2xl lg:text-4xl'>{value1}</div>
    </div>
  )
}

export { Result }
