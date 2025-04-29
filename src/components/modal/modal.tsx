import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useModal } from '@ebay/nice-modal-react'
import mergeRefs from 'merge-refs'
import { FaArrowLeft } from 'react-icons/fa'

import { cn } from '@/lib/utils'
import { IMAGES } from '@/lib/constants'
import { ButtonWithAudio } from '@/components/ui/button-with-audio'
import { Logo } from '@/components/ui/logo'

interface Props extends ModalProps {
  contentSlot: ReactNode
}

export const ModalPresenter = (props: Props) => {
  const { contentSlot, ...modalProps } = props

  return <Modal {...modalProps}>{contentSlot}</Modal>
}

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hideHeader?: boolean
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ children, hideHeader = false, className, ...props }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const { remove } = useModal()
    const [isOpen, setIsOpen] = useState(true)

    const closeWithDelay = useCallback(() => {
      modalRef.current?.addEventListener('animationend', remove, { once: true })

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
          'fill-mode-both custom-scroll absolute inset-0 z-50 flex flex-col justify-start gap-12 overflow-auto bg-cover bg-[right_center] py-12 duration-200',
          className,
          isOpen
            ? 'animate-in fade-in-0 zoom-in-95'
            : 'animate-out fade-out-0 zoom-out-95',
        )}
        style={{ backgroundImage: `url(${IMAGES.wrapper})` }}
        {...props}
      >
        <header className='flex items-center justify-between gap-2 px-3'>
          <div className='flex items-center gap-4'>
            <button onClick={handleClose}>
              <FaArrowLeft className='text-red cursor-pointer text-3xl transition-all hover:text-black' />
            </button>
            <Logo as='button' size='lg' onClick={handleClose} />
          </div>
          <ButtonWithAudio
            as='button'
            className='w-11'
            image='close'
            onClick={handleClose}
          />
        </header>
        {children}
      </div>
    )
  },
)
