import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { WalletButtonAnimation } from './wallet-button-animation'

const Balance = ({
  value,
  hideWalletButton,
}: {
  value: number
  hideWalletButton?: boolean
}) => {
  const textRef = useRef<HTMLDivElement>(null)
  const prevValue = useRef(value)

  useEffect(() => {
    const prevVal = prevValue.current
    prevValue.current = value

    if (prevVal === value) {
      return
    }

    const domText = textRef.current

    if (domText === null) {
      return
    }

    domText.classList.add('animate-in')
    domText.classList.add('fade-in-0')
    const timeoutId = setTimeout(() => {
      domText.classList.remove('animate-in')
      domText.classList.remove('fade-in-0')
    }, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value])

  return (
    <div className='flex gap-1'>
      {!hideWalletButton && <WalletButtonAnimation />}
      <div className='flex flex-col'>
        <div className='text-center text-2xl leading-[1] tracking-tight text-[#006100] uppercase'>
          Balance
        </div>
        <div
          ref={textRef}
          className={cn(
            'fill-mode-both text-center text-3xl leading-[1] tracking-tight duration-500',
          )}
        >
          ${value}
        </div>
      </div>
    </div>
  )
}

export { Balance }
