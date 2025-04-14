import React from 'react'

import { useCustomModal } from '@/hooks/use-custom-modal'
import { AddMoneyModal } from '@/components/add-money-modal'

const useShowAddMoneyModal = () => {
  const modal = useCustomModal()

  const handleAddMoney = async () => {
    modal.show({
      contentSlot: React.createElement(AddMoneyModal),
    })
  }
  return handleAddMoney
}

export { useShowAddMoneyModal }
