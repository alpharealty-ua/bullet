import { create, useModal } from '@ebay/nice-modal-react'
import { ModalPresenter } from '@/components/modal/modal'

const ModalWrapper = create(ModalPresenter)

export const useCustomModal = () => {
  return useModal(ModalWrapper)
}
