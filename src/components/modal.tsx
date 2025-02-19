import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useModal } from '@ebay/nice-modal-react'
import mergeRefs from 'merge-refs'

import { cn } from '@/lib/utils'
import { images } from '@/lib/constants'
import { Button } from './ui/button'
import { Logo } from './logo'

type Props = {
  contentSlot: ReactNode
}

export const ModalPresenter = (props: Props) => {
  const { contentSlot } = props

  return <Modal>{contentSlot}</Modal>
}

export const Modal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
    hideHeader?: boolean
  }
>(({ children, hideHeader = false, className, ...props }, ref) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { remove } = useModal()
  const [isOpen, setIsOpen] = useState(true)

  const closeWithDelay = useCallback(() => {
    const modalDom = modalRef.current

    if (modalDom === null) {
      return
    }

    modalDom.addEventListener('animationend', remove, { once: true })

    setIsOpen(false)
  }, [remove])

  const handleClose = () => {
    closeWithDelay()
  }

  useEffect(() => {
    const closeModal = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeWithDelay()
      }
    }
    document.addEventListener('keydown', closeModal)

    return () => {
      document.removeEventListener('keydown', closeModal)
    }
  }, [closeWithDelay])

  return (
    <div
      ref={mergeRefs(ref, modalRef)}
      className={cn(
        'fill-mode-both custom-scroll absolute inset-0 z-50 flex flex-col gap-12 overflow-auto bg-cover bg-[right_center] px-3 py-12 duration-200',
        className,
        isOpen
          ? 'animate-in fade-in-0 zoom-in-95'
          : 'animate-out fade-out-0 zoom-out-95',
      )}
      style={{ backgroundImage: `url(${images.wrapper})` }}
      {...props}
    >
      {!hideHeader && (
        <div className='flex items-center justify-between'>
          <Logo to='/' size='lg' />
          <Button className='w-11' image='close' onClick={handleClose} />
        </div>
      )}
      {children}
    </div>
  )
})
